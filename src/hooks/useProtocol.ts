import { ethers, JsonRpcSigner } from "ethers";
import { engine } from "../contracts/bitcoinDollarEngine/index";
import { bitcoinDollar } from "../contracts/bitcoinDollar/index";
import { syntheticBitcoin } from "../contracts/syntheticBitcoin/index";
import { ContractDetails } from "../contracts/contractInterface";
import { handleError } from "../utils/handleError";

/**
 * Custom hook for handling protocol write operations (deposit, mint, withdraw, burn).
 * @returns Functions for interacting with the protocol: `handleDeposit`, `handleMint`, `handleWithdraw`, `handleBurn`.
 */
export function useProtocol() {

    /**
     * Approves ERC20 token for the Engine contract to spend.
     * @param signer - Blockchain signer.
     * @param token - Token contract details.
     * @param amount - Amount to approve.
     * @param showAlert - Function to show user alerts.
     * @returns A boolean indicating approval success.
     */
    const handleApproveERC20ForEngine = async (signer: JsonRpcSigner | null, token: ContractDetails, amount: string, showAlert: Function) => {
        try {
            const contract: ethers.Contract = new ethers.Contract(token.address, token.abi, signer);
            const approvalAmount: BigInt = ethers.parseUnits(amount, 'ether');
            const currentAllowance: BigInt = await contract.allowance(signer, engine.address);

            if (currentAllowance < approvalAmount) {
                await contract.approve(engine.address, ethers.MaxUint256 - 2n);
            }
            return true;
        } catch (err: any) {
            handleError('Approval', err, showAlert);
            throw new Error(err.message);
        }
    };

    /**
     * Deposits collateral into the contract to back BitcoinDollar.
     * @param signer - Blockchain signer.
     * @param contract - Contract to deposit into.
     * @param amount - Amount of collateral to deposit.
     * @param showAlert - Function to show user alerts.
     * @returns A transaction promise for the deposit.
     */
    const handleDeposit = async (signer: JsonRpcSigner | null, contract: ethers.Contract | null, amount: string, showAlert: Function) => {
        if (contract) {
            try {
                await handleApproveERC20ForEngine(signer, syntheticBitcoin, amount, showAlert);
                const txAmount: BigInt = ethers.parseUnits(amount, 'ether');
                showAlert("Deposit Pending", "pending");
                return await contract.depositCollateral(txAmount);
            } catch (err: any) {
                handleError('Deposit', err, showAlert);
                throw new Error(err.message);
            }
        }
    };

    /**
     * Mints BitcoinDollar tokens using deposited collateral.
     * @param signer - Blockchain signer.
     * @param contract - Contract to mint BitcoinDollar from.
     * @param amount - Amount of collateral to use for minting.
     * @param showAlert - Function to show user alerts.
     * @returns A transaction promise for minting.
     */
    const handleMint = async (signer: JsonRpcSigner | null, contract: ethers.Contract | null, amount: string, showAlert: Function) => {
        if (contract) {
            try {
                await handleApproveERC20ForEngine(signer, bitcoinDollar, amount, showAlert);
                const txAmount: BigInt = ethers.parseUnits(amount, 'ether');
                showAlert("Mint Pending", "pending");
                return await contract.mintBitcoinDollar(txAmount);
            } catch (err: any) {
                handleError('Mint', err, showAlert);
                throw new Error(err.message);
            }
        }
    };

    /**
     * Withdraws collateral from the contract.
     * @param contract - Contract to withdraw from.
     * @param amount - Amount of collateral to withdraw.
     * @param showAlert - Function to show user alerts.
     * @returns A transaction promise for the withdrawal.
     */
    const handleWithdraw = async (contract: ethers.Contract | null, amount: string, showAlert: Function) => {
        if (contract) {
            try {
                const txAmount: BigInt = ethers.parseUnits(amount, 'ether');
                showAlert("Withdraw Pending", "pending");
                return await contract.redeemCollateral(txAmount);
            } catch (err: any) {
                handleError('Withdraw', err, showAlert);
                throw new Error(err.message);
            }
        }
    };

    /**
     * Burns BitcoinDollar tokens to reduce supply.
     * @param signer - Blockchain signer.
     * @param contract - Contract to burn BitcoinDollar from.
     * @param amount - Amount of BitcoinDollar to burn.
     * @param showAlert - Function to show user alerts.
     * @returns A transaction promise for burning.
     */
    const handleBurn = async (signer: JsonRpcSigner, contract: ethers.Contract | null, amount: string, showAlert: Function) => {
        if (contract) {
            try {
                await handleApproveERC20ForEngine(signer, bitcoinDollar, amount, showAlert);
                const txAmount: BigInt = ethers.parseUnits(amount, 'ether');
                showAlert("Burn Pending", "pending");
                return await contract.burnBitcoinDollar(txAmount);
            } catch (err: any) {
                handleError('Burn', err, showAlert);
                throw new Error(err.message);
            }
        }
    };

    return { handleDeposit, handleMint, handleWithdraw, handleBurn };
}
