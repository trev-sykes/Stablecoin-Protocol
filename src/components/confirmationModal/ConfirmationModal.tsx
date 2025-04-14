import React from 'react';
import styles from './ConfirmationModal.module.css';
import useFormStore from '../../store/useFormStore';

interface ConfirmationModalProps {
    wbtcAmount: number;
    btcPriceUSD: number;
    mintFeePercent: number;
    gasEstimateUSD: number;
    collateralRatio: number;
    liquidationThreshold: number;
    userAddress: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    wbtcAmount,
    btcPriceUSD,
    mintFeePercent,
    gasEstimateUSD,
    collateralRatio,
    liquidationThreshold,
    userAddress,
    onConfirm,
    onCancel,
}) => {


    const { formInputs } = useFormStore();
    const totalUSD = formInputs["mint"] * btcPriceUSD;
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Confirm BTCd Mint</h2>

                <div className={styles.section}>
                    <h3>Input</h3>
                    <p><strong>wBTC:</strong> {wbtcAmount.toFixed(4)}</p>
                    <p><strong>USD Value:</strong> ${totalUSD.toLocaleString()}</p>
                </div>

                <div className={styles.section}>
                    <h3>Output</h3>
                    <p><strong>BTCd to Receive:</strong>{formInputs['mint']}</p>
                    <p><strong>Exchange Rate:</strong> 1 wBTC = 1 BTCd</p>
                </div>

                <div className={styles.section}>
                    <h3>Fees & Collateralization</h3>
                    <p><strong>Mint Fee:</strong> {mintFeePercent}%</p>
                    <p><strong>Collateral Ratio:</strong> {collateralRatio}%</p>
                    <p><strong>Liquidation Threshold:</strong> {liquidationThreshold}%</p>
                </div>

                <div className={styles.section}>
                    <h3>Transaction</h3>
                    <p><strong>Estimated Gas Fee:</strong> ${gasEstimateUSD}</p>
                    <p><strong>Network:</strong> Ethereum</p>
                    <p><strong>Your Address:</strong> {userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
                </div>

                <div className={styles.warning}>
                    ⚠️ Minting BTCd locks your wBTC as collateral. Risk of liquidation if BTC drops.
                </div>

                <div className={styles.actions}>
                    <button onClick={onCancel} className={styles.cancelButton}>Cancel</button>
                    <button onClick={onConfirm} className={styles.confirmButton}>Confirm Mint</button>
                </div>
            </div>
        </div>
    );
};

