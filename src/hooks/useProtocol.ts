import { ethers } from "ethers";
import { engine } from "../contracts/bitcoinDollarEngine/index";
import { bitcoinDollar } from "../contracts/bitcoinDollar/index";
import { syntheticBitcoin } from "../contracts/syntheticBitcoin/index";
import { ContractDetails } from "../contracts/contractInterface";
import { handleError } from "../utils/handleError";
import useAlertStore from "../store/useAlertStore";
import useWeb3Store from "../store/useWeb3Store";

/**
 * Custom hook for handling protocol write operations (deposit, mint, withdraw, burn).
 * @returns Functions for interacting with the protocol: `handleDeposit`, `handleMint`, `handleWithdraw`, `handleBurn`.
 */
export function useProtocol() {
    const { showAlert } = useAlertStore.getState();
    const { transactionSigner, writeContract, readContract } = useWeb3Store.getState();
    /**
     * Approves ERC20 token for the Engine contract to spend.
     * @param signer - Blockchain signer.
     * @param token - Token contract details.
     * @param amount - Amount to approve.
     * @param showAlert - Function to show user alerts.
     * @returns A boolean indicating approval success.
     */
    const handleApproveERC20ForEngine = async (token: ContractDetails, amount: string) => {
        try {
            const contract: ethers.Contract = new ethers.Contract(token.address, token.abi, transactionSigner);
            const approvalAmount: BigInt = ethers.parseUnits(amount, 'ether');
            const currentAllowance: BigInt = await contract.allowance(transactionSigner, engine.address);

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
     * @param amount - Amount of collateral to deposit.
     * @returns A transaction promise for the deposit.
     */
    const handleDeposit = async (amount: string) => {
        if (!writeContract) {
            return;
        }
        try {
            await handleApproveERC20ForEngine(syntheticBitcoin, amount);
            const txAmount: BigInt = ethers.parseUnits(amount, 'ether');
            return await writeContract.depositCollateral(txAmount);
        } catch (err: any) {
            handleError('Deposit', err, showAlert);
            throw new Error(err.message);
        }

    };

    /**
     * Mints BitcoinDollar tokens using deposited collateral.
     * @param amount - Amount of collateral to use for minting.
     * @returns A transaction promise for minting.
     */
    const handleMint = async (amount: string) => {
        if (!writeContract) {
            return;
        }
        try {
            await handleApproveERC20ForEngine(bitcoinDollar, amount);
            const txAmount: BigInt = ethers.parseUnits(amount, 'ether');
            return await writeContract.mintBitcoinDollar(txAmount);
        } catch (err: any) {
            handleError('Mint', err, showAlert);
            throw new Error(err.message);
        }

    };

    /**
     * Withdraws collateral from the contract.
     * @param amount - Amount of collateral to withdraw.
     * @returns A transaction promise for the withdrawal.
     */
    const handleWithdraw = async (amount: string) => {
        if (!writeContract) {
            return
        }
        try {
            const txAmount: BigInt = ethers.parseUnits(amount, 'ether');
            return await writeContract.redeemCollateral(txAmount);
        } catch (err: any) {
            handleError('Withdraw', err, showAlert);
            throw new Error(err.message);
        }

    };

    /**
     * Burns BitcoinDollar tokens for a user to reduce supply.
     * @param amount - Amount of BitcoinDollar to burn.
     * @returns A transaction promise for burning.
     */
    const handleBurn = async (amount: string) => {
        if (!writeContract) {
            return;
        }
        try {
            await handleApproveERC20ForEngine(bitcoinDollar, amount);
            const txAmount: BigInt = ethers.parseUnits(amount, 'ether');
            return await writeContract.burnBitcoinDollar(txAmount);
        } catch (err: any) {
            handleError('Burn', err, showAlert);
            throw new Error(err.message);
        }
    };

    /**
     * Checks a users health factor to see if their position can be liquidated.
     * @param user The user who we are checking.
     * @returns A transaction promise for checking liquidation status.
     */
    const handleLiquidate = async (user: string) => {
        if (!writeContract) {
            return;
        }
        try {
            return await writeContract.liquidate(user);
        } catch (err: any) {
            handleError('Liquidate', err, showAlert);
            throw new Error(err.message);
        }
    }
    /**
     * Liquidates a user whos health factor drops below the threshold.
     * @param user The user who is being liquidated.
     * @returns A transaction promise for liquidation.
     */
    const handleCanLiquidate = async (user: string) => {
        if (!readContract) {
            return;
        };
        try {
            return await readContract.canLiquidate(user);
        } catch (err: any) {
            handleError('CanLiquidate', err, showAlert);
            throw new Error(err.message);
        }
    }

    /**
     * Gets the user's current health factor.
     * @param user The user address to check.
     * @returns The user's health factor.
     */
    const handleGetHealthFactor = async (user: string) => {
        if (!readContract) {
            return;
        }
        try {
            return await readContract.getHealthFactor(user);
        } catch (err: any) {
            handleError('GetHealthFactor', err, showAlert);
            throw new Error(err.message);
        }
    }

    /**
     * Simulates the user's health factor after collateral change.
     * @param user The user address to check.
     * @param newCollateralAmount The new amount of collateral to simulate.
     * @returns The simulated health factor after the collateral change.
     */
    const handleGetSimulatedHealthFactor = async (user: string, newCollateralAmount: string) => {
        if (!readContract) {
            return;
        }
        try {
            const collateralAmount: BigInt = ethers.parseUnits(newCollateralAmount, 'ether');
            return await readContract.getHealthFactorAfterCollateralChange(user, collateralAmount);
        } catch (err: any) {
            handleError('SimulateHealthFactor', err, showAlert);
            throw new Error(err.message);
        }
    }
    const handleGetLiquidationParams = async () => {
        if (!readContract) return;
        try {
            return await readContract.getLiquidationParams();
        } catch (err: any) {
            handleError('getLiquidationParams', err, showAlert);
            throw new Error(err.message);
        }
    }


    return {
        handleDeposit,
        handleMint,
        handleWithdraw,
        handleBurn,
        handleLiquidate,
        handleCanLiquidate,
        handleGetHealthFactor,
        handleGetSimulatedHealthFactor,
        handleGetLiquidationParams
    };
}
