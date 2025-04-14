import { create } from "zustand";
import { ethers, EventLog, Log } from "ethers";
import bitcoinDollarEngineABI from "../contracts/bitcoinDollarEngine/bitcoinDollarEngineABI";
import bitcoinDollarEngineAddress from "../contracts/bitcoinDollarEngine/bitcoinDollarEngineAddress";
import useWalletStore from "./useWalletStore";
import { formatter } from "../utils/handleFormat";
import { handleHealthFactorCalculation } from "../utils/handleHealthFactorCalculation";
import { engine } from "../contracts/bitcoinDollarEngine";

type Users = {
    all: string[] | null;
    liquidatable: string[] | null;
    nonLiquidatable: string[] | null;
}
type HealthStatus = {
    status: string;
    color: string;
};
/**
 * Users specific information regarding their positions in the protocol
 */
export interface UserState {
    syntheticBitcoinOwned: bigint;
    collateralDeposited: bigint;
    collateralValueInUsd: bigint;
    totalBitcoinDollarsMinted: bigint;
    collateralizationRatio: bigint;
    healthFactor: bigint;
    healthStatus: HealthStatus;
    userDebtShare: bigint;
    userMaxMintableAmount: bigint;
};

/**
 * Global contract state information
 */
interface ContractState {
    oraclePriceInUsd: bigint;
    totalWrappedBitcoinCollateralDeposited: bigint;
    totalBitcoinDollarsMinted: bigint;
    totalValueLockedUsd: string;
    protocolCollateralizationRatio: bigint;
    healthFactor: bigint;
    healthStatus: HealthStatus;
}


/**
 * Complete state for web3 interactions
 */
interface Web3State {
    loading: {
        initializeProvider: boolean;
        initializeSigner: boolean;
        fetchState: boolean;
        fetchUsersFromEvents: boolean;
        fetchLiquidatableUsers: boolean;
        fetchPastLiquidations: boolean;
    };
    jsonRpcProvider: ethers.JsonRpcProvider | null;
    transactionSigner: ethers.JsonRpcSigner | null;
    signerAddress: string;
    readContract: ethers.Contract | null;
    writeContract: ethers.Contract | null;
    contractState: ContractState | null;
    userState: UserState | null;
    users: Users | null;
    pastLiquidations: any;
    setUsers: Function;
    /** Helper to update the loading state for a given function */
    setLoading: Function;
    /** Initializes the read-only provider and fetches contract state */
    initializeProvider: () => Promise<void>;
    /** Connects user wallet and initializes transaction signer */
    initializeSigner: () => Promise<void>;
    /** Fetches users based on their deposit and mint events  */
    fetchUsersFromEvents: Function;
    /** Fetches the contract and user state */
    fetchState: () => Promise<void>;
    /** Fetches the liquidatable users */
    fetchLiquidatableUsers: () => Promise<void>
    /** Fetches past liquidation from events */
    fetchPastLiquidations: () => Promise<void>;
    /** Disconnects from the blockchain */
    disconnect: () => void;
}

const rpcUrl = import.meta.env.VITE_INFURA_RPC_URL;

/**
 * Store for managing web3 connection and contract interactions
 */
const useWeb3Store = create<Web3State>((set) => ({
    loading: {
        initializeProvider: false,
        initializeSigner: false,
        fetchState: false,
        fetchUsersFromEvents: false,
        fetchLiquidatableUsers: false,
        fetchPastLiquidations: false
    },
    jsonRpcProvider: null,
    transactionSigner: null,
    signerAddress: "",
    readContract: null,
    writeContract: null,
    contractState: null,
    userState: null,
    users: {
        all: null,
        liquidatable: null,
        nonLiquidatable: null
    },
    pastLiquidations: null,
    setLoading: (key: keyof Web3State["loading"], value: boolean) =>
        set((state) => ({
            loading: {
                ...state.loading,
                [key]: value,
            },
        })),
    setUsers: (key: keyof Users, value: string[]) =>
        set((state) => ({
            users: {
                ...(state.users ?? { all: null, liquidatable: null, nonLiquidatable: null }),
                [key]: value
            },
        })),

    // Initialize the read-only provider
    initializeProvider: async () => {
        const { setLoading } = useWeb3Store.getState();
        setLoading('initializeProvider', true);
        const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrl, {
            name: "sepolia",
            chainId: 11155111,
        });

        const readContract = new ethers.Contract(
            bitcoinDollarEngineAddress,
            bitcoinDollarEngineABI,
            jsonRpcProvider
        );

        try {
            const [contractStateRaw, healthFactor] = await Promise.all([
                readContract.getCurrentState(),
                readContract.getHealthFactor(engine.address)
            ])
            const healthStatus = handleHealthFactorCalculation(healthFactor);
            // Calculate and format tvl
            const totalValueLockedUsd = formatter.formatTVLToUSD(contractStateRaw[0], contractStateRaw[1]);

            const contractState: ContractState = {
                oraclePriceInUsd: contractStateRaw[0],
                totalWrappedBitcoinCollateralDeposited: contractStateRaw[1],
                totalBitcoinDollarsMinted: contractStateRaw[2],
                totalValueLockedUsd: totalValueLockedUsd,
                protocolCollateralizationRatio: contractStateRaw[3],
                healthFactor: healthFactor,
                healthStatus: healthStatus
            };
            set({ contractState });
            setLoading('initializeProvider', false);
        } catch (err) {
            console.error("Error fetching contract state:", err);
            setLoading('initializeProvider', false)
        }

        set({ readContract, jsonRpcProvider });
    },

    // Initialize the signer and fetch both contract and user state
    initializeSigner: async () => {
        const { setLoading } = useWeb3Store.getState();
        setLoading('initializeSigner', true);
        try {
            const { activeWallet, availableWallets } = useWalletStore.getState();
            if (!activeWallet) {
                setLoading('initializeSigner', false);
                throw new Error("No wallet selected");
            };

            const selectedWallet = availableWallets.find(
                (w) => w.info.name === activeWallet
            );
            if (!selectedWallet?.provider) {
                setLoading('initializeSigner', false);
                throw new Error(`Provider not available for ${activeWallet}`);
            }

            const ethersProvider = new ethers.BrowserProvider(
                selectedWallet.provider
            );

            const network = await ethersProvider.getNetwork();
            const targetChainId = 11155111; // Sepolia

            if (Number(network.chainId) !== targetChainId) {
                await selectedWallet.provider.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: `0x${targetChainId.toString(16)}` }],
                });
                console.log("Switched to Sepolia");
            }

            const accounts: string[] = await ethersProvider.send("eth_requestAccounts", []);
            if (!accounts.length) {
                setLoading('initializeSigner', false);
                throw new Error("No accounts found");
            }

            const transactionSigner = await ethersProvider.getSigner();
            const signerAddress = await transactionSigner.getAddress();

            const writeContract = new ethers.Contract(
                bitcoinDollarEngineAddress,
                bitcoinDollarEngineABI,
                transactionSigner
            );

            const code = await ethersProvider.getCode(bitcoinDollarEngineAddress);
            if (code === "0x") {
                setLoading('initializeSigner', false);
                throw new Error("No contract found at address");
            }

            set({ transactionSigner, signerAddress, writeContract });

            // Fetch both contract and user state after signer initialization
            await useWeb3Store.getState().fetchState();

            console.log("🔵 Connected and state fetched");
            setLoading('initializeSigner', false);
        } catch (error: any) {
            console.error("Signer initialization failed:", error.message);
            set({ transactionSigner: null, signerAddress: "", writeContract: null });
            setLoading('initializeSigner', false);
            throw error;
        }
    },

    // Fetch contract and user state
    fetchState: async () => {
        const { readContract, writeContract, signerAddress, setLoading } = useWeb3Store.getState();
        setLoading('fetchState', true);

        if (!readContract || !writeContract) {
            console.error("❌ Contract not initialized");
            setLoading('fetchState', false);
            return;
        }

        try {
            // Fetch contract state (oracle price, total collateral, total minted Bitcoin Dollars, etc.)
            const [contractStateRaw, healthFactor] = await Promise.all([
                readContract.getCurrentState(),
                readContract.getHealthFactor(engine.address)
            ])
            const healthStatusForContract = handleHealthFactorCalculation(healthFactor);

            // Calcualte and format tvl
            const totalValueLockedUsd = formatter.formatTVLToUSD(contractStateRaw[0], contractStateRaw[1]);

            const contractState: ContractState = {
                oraclePriceInUsd: contractStateRaw[0],
                totalWrappedBitcoinCollateralDeposited: contractStateRaw[1],
                totalBitcoinDollarsMinted: contractStateRaw[2],
                totalValueLockedUsd: totalValueLockedUsd,
                protocolCollateralizationRatio: contractStateRaw[3],
                healthFactor: healthFactor,
                healthStatus: healthStatusForContract
            };

            set({ contractState });

            // Fetch user-specific state (user information, debt share, max mintable amount)
            const [
                userInformationResponse,
                userDebtShareResponse,
                userMaxMintableAmountResponse,
            ]: [bigint[], bigint, bigint] = await Promise.all([
                writeContract.getUserInformation(signerAddress),
                writeContract.getUserDebtShare(signerAddress),
                writeContract.getMaxMintableAmount(signerAddress),
            ]);
            const healthStatusForUser = handleHealthFactorCalculation(userInformationResponse[5]);

            const userState: UserState = {
                syntheticBitcoinOwned: userInformationResponse[0],
                collateralDeposited: userInformationResponse[1],
                collateralValueInUsd: userInformationResponse[2],
                totalBitcoinDollarsMinted: userInformationResponse[3],
                collateralizationRatio: userInformationResponse[4],
                healthFactor: userInformationResponse[5],
                healthStatus: healthStatusForUser,
                userDebtShare: userDebtShareResponse,
                userMaxMintableAmount: userMaxMintableAmountResponse
            };

            set({ userState: userState });

            console.log("✅ State successfully fetched!");
            setLoading('fetchState', false);
        } catch (err) {
            console.error("❌ Failed to fetch state:", err);
            setLoading('fetchState', false);
        }
    },
    // Fetch users from events
    fetchUsersFromEvents: async () => {
        const { readContract, setUsers, setLoading } = useWeb3Store.getState();
        setLoading('fetchUsersFromEvents', true);

        if (!readContract) {
            console.error("❌ readContract is not initialized");
            setLoading('fetchUsersFromEvents', false);
            return [];
        }
        try {
            const filterDeposit = readContract.filters.CollateralDeposited();
            const filterMint = readContract.filters.BitcoinDollarMinted();
            const depositLogs: (Log | EventLog)[] = await readContract.queryFilter(filterDeposit, 0, "latest");
            const mintLogs: (Log | EventLog)[] = await readContract.queryFilter(filterMint, 0, "latest");
            const allUsers = [
                ...depositLogs.map((log: any) => log.args.user),
                ...mintLogs.map((log: any) => log.args.user),
            ];
            const uniqueUsers = [...new Set(allUsers.map((addr) => addr.toLowerCase()))];

            console.log("✅ Fetched and deduplicated users:", uniqueUsers);
            setUsers('all', uniqueUsers);
            setLoading('fetchUsersFromEvents', false);
            return uniqueUsers;
        } catch (error) {
            console.error("❌ Error fetching users from events:", error);
            setLoading('fetchUsersFromEvents', false);
            return [];
        }
    },
    fetchLiquidatableUsers: async () => {
        const { readContract, users, setUsers, setLoading } = useWeb3Store.getState();
        setLoading('fetchLiquidatableUsers', true);
        if (!readContract) {
            console.log("Contract Not Initialized");
            setLoading('fetchLiquidatableUsers', false);
            return
        };
        if (users == null || users.all == null) {
            setLoading('fetchLiquidatableUsers', false);
            return;
        }
        try {
            const results = await Promise.all(
                users.all.map(async (user: any) => {
                    const canLiquidate = await readContract.canLiquidate(user); // Check if user can be liquidated
                    return { user, canLiquidate };
                })
            );
            const liquidatable = results.filter(({ canLiquidate }) => canLiquidate).map(({ user }) => user);
            const nonLiquidatable = results.filter(({ canLiquidate }) => !canLiquidate).map(({ user }) => user);
            setUsers('liquidatable', liquidatable);
            setUsers('nonLiquidatable', nonLiquidatable);
            setLoading('fetchLiquidatableUsers', false);
        } catch (error: any) {
            console.error("❌ Error fetching liquidateable users from events:", error);
            setLoading('fetchLiquidatableUsers', false);
        }
    },
    fetchPastLiquidations: async () => {
        const { readContract, setLoading } = useWeb3Store.getState();
        setLoading('fetchPastLiqudiations', true);
        if (!readContract) {
            setLoading('fetchPastLiqudiations', false);
            return;
        };
        try {
            const filterLiquidated = readContract.filters.Liquidated();
            const pastLiquidations = await readContract.queryFilter(filterLiquidated, 0, "latest");
            set({ pastLiquidations })
            setLoading('fetchPastLiqudiations', false);
        } catch (err: any) {
            console.error(err.message);
            setLoading('fetchPastLiqudiations', false);
        }
    },
    // Disconnect from blockchain
    disconnect: () => {
        set({
            jsonRpcProvider: null,
            transactionSigner: null,
            signerAddress: "",
        });
        console.log("🛑 Disconnected");
    },
}));

export default useWeb3Store;
