import { create } from "zustand";
import { ethers, EventLog, Log } from "ethers";
import bitcoinDollarEngineABI from "../contracts/bitcoinDollarEngine/bitcoinDollarEngineABI";
import bitcoinDollarEngineAddress from "../contracts/bitcoinDollarEngine/bitcoinDollarEngineAddress";
import useWalletStore from "./useWalletStore";

/**
 * User-specific information about their position in the protocol
 */
type UserInformation = {
    syntheticBitcoinOwned: bigint;
    collateralDeposited: bigint;
    collateralValueInUsd: bigint;
    totalBitcoinDollarsMinted: bigint;
    collateralizationRatio: bigint;
    healthFactor: bigint;
};

/**
 * Combined user state information
 */
interface UserState {
    userInformation: UserInformation;
    userDebtShare: bigint;
    userMaxMintableAmount: bigint;
}

/**
 * Global contract state information
 */
interface ContractState {
    oraclePriceInUsd: bigint;
    totalWrappedBitcoinCollateralDeposited: bigint;
    totalBitcoinDollarsMinted: bigint;
    protocolCollateralizationRatio: bigint;
}

/**
 * Complete state for web3 interactions
 */
interface Web3State {
    jsonRpcProvider: ethers.JsonRpcProvider | null;
    transactionSigner: ethers.JsonRpcSigner | null;
    signerAddress: string;
    readContract: ethers.Contract | null;
    writeContract: ethers.Contract | null;
    contractState: ContractState | null;
    userState: UserState | null;
    users: string[] | null;
    /** Initializes the read-only provider and fetches contract state */
    initializeProvider: () => Promise<void>;
    /** Connects user wallet and initializes transaction signer */
    initializeSigner: () => Promise<void>;
    fetchUsersFromEvents: Function;
    /** Disconnects from the blockchain */
    disconnect: () => void;
}

const rpcUrl = import.meta.env.VITE_INFURA_RPC_URL;

/**
 * Store for managing web3 connection and contract interactions
 */
const useWeb3Store = create<Web3State>((set) => ({
    jsonRpcProvider: null,
    transactionSigner: null,
    signerAddress: "",
    readContract: null,
    writeContract: null,
    contractState: null,
    userState: null,
    users: null,
    initializeProvider: async () => {


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
            const contractStateRaw = await readContract.getCurrentState();

            const contractState: ContractState = {
                oraclePriceInUsd: contractStateRaw[0],
                totalWrappedBitcoinCollateralDeposited: contractStateRaw[1],
                totalBitcoinDollarsMinted: contractStateRaw[2],
                protocolCollateralizationRatio: contractStateRaw[3],
            };

            set({ contractState });
        } catch (err) {
            console.error("Error fetching contract state:", err);
        }

        set({ readContract, jsonRpcProvider });

    },
    initializeSigner: async () => {
        try {
            const { activeWallet, availableWallets } = useWalletStore.getState();

            if (!activeWallet) throw new Error("No wallet selected");

            const selectedWallet = availableWallets.find(
                (w) => w.info.name === activeWallet
            );
            if (!selectedWallet?.provider)
                throw new Error(`Provider not available for ${activeWallet}`);

            const ethersProvider = new ethers.BrowserProvider(
                selectedWallet.provider
            );

            const network = await ethersProvider.getNetwork();
            const targetChainId = 11155111; // Sepolia

            if (Number(network.chainId) !== targetChainId) {
                try {
                    await selectedWallet.provider.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
                    });

                    console.log("Switched to Sepolia");
                    await new Promise((res) => setTimeout(res, 1000));
                } catch (switchError: any) {
                    if (switchError.code === 4902) {
                        await selectedWallet.provider.request({
                            method: "wallet_addEthereumChain",
                            params: [
                                {
                                    chainId: `0x${targetChainId.toString(16)}`,
                                    chainName: "Sepolia Test Network",
                                    nativeCurrency: {
                                        name: "Sepolia ETH",
                                        symbol: "ETH",
                                        decimals: 18,
                                    },
                                    rpcUrls: [rpcUrl],
                                    blockExplorerUrls: ["https://sepolia.etherscan.io"],
                                },
                            ],
                        });

                        console.log("Added Sepolia network");
                    } else {
                        throw new Error("Failed to switch network: " + switchError.message);
                    }
                }
            }

            const accounts: string[] = await ethersProvider.send("eth_requestAccounts", []);
            if (!accounts.length) throw new Error("No accounts found");

            const transactionSigner = await ethersProvider.getSigner();
            const signerAddress = await transactionSigner.getAddress();

            const writeContract = new ethers.Contract(
                bitcoinDollarEngineAddress,
                bitcoinDollarEngineABI,
                transactionSigner
            );

            const code = await ethersProvider.getCode(bitcoinDollarEngineAddress);
            if (code === "0x") {
                throw new Error("No contract found at address");
            }

            set({ transactionSigner, signerAddress, writeContract });

            const [
                userInformationResponse,
                userDebtShareResponse,
                userMaxMintableAmountResponse,
            ]: [bigint[], bigint, bigint] = await Promise.all([
                writeContract.getUserInformation(signerAddress),
                writeContract.getUserDebtShare(signerAddress),
                writeContract.getMaxMintableAmount(signerAddress),
            ]);

            const userInfo: UserInformation = {
                syntheticBitcoinOwned: userInformationResponse[0],
                collateralDeposited: userInformationResponse[1],
                collateralValueInUsd: userInformationResponse[2],
                totalBitcoinDollarsMinted: userInformationResponse[3],
                collateralizationRatio: userInformationResponse[4],
                healthFactor: userInformationResponse[5],
            };

            set((state) => ({
                userState: {
                    ...state.userState,
                    userInformation: userInfo,
                    userDebtShare: userDebtShareResponse,
                    userMaxMintableAmount: userMaxMintableAmountResponse,
                },
            }));
            console.log("🔵 Connected");
        } catch (error: any) {
            console.error("Signer initialization failed:", error.message);
            set({ transactionSigner: null, signerAddress: "", writeContract: null });
            throw error;
        }
    },
    fetchUsersFromEvents: async () => {
        const { readContract } = useWeb3Store.getState();

        if (!readContract) {
            console.error("❌ readContract is not initialized");
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
            set({ users: uniqueUsers });
            return uniqueUsers;
        } catch (error) {
            console.error("❌ Error fetching users from events:", error);
            return [];
        }
    },
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
