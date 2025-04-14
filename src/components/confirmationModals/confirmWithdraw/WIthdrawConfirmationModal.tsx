import React from 'react';
import styles from '../confirmMint/MintConfirmationModal.module.css';
import { handleError } from '../../../utils/handleError';
import useWeb3Store from '../../../store/useWeb3Store';
import { ethers } from 'ethers';
import useFormStore from '../../../store/useFormStore';
import { handleValidateTransactionParams } from '../../../utils/handleValidateTransactionParams';
import useAlertStore from '../../../store/useAlertStore';
import { useProtocol } from '../../../hooks/useProtocol';

interface WithdrawConfirmationModalProps {
    onCancel: any;
}

const WithdrawConfirmationModal: React.FC<WithdrawConfirmationModalProps> = ({
    onCancel,
}) => {
    const { userState, contractState, fetchState } = useWeb3Store();
    const { formInputs, resetFormField } = useFormStore();
    const { showAlert } = useAlertStore();
    const { handleWithdraw } = useProtocol();

    const withdraw = async () => {
        const amount = handleValidateTransactionParams('withdraw', formInputs["withdraw"]);

        console.log("amoutnnn", amount);
        if (!amount || amount === '0' || amount == 0) return;
        try {
            showAlert("Withdraw Started!", "started");
            const tx = await handleWithdraw(amount);
            onCancel('');
            resetFormField('withdraw');
            showAlert("Withdraw Pending", "pending");
            await tx.wait();
            showAlert("Withdraw Complete", "success");
            await fetchState();
        } catch (err: any) {
            handleError('Withdraw', err, showAlert);
            onCancel('');
            resetFormField('withdraw');
            throw new Error(err.message);
        }
    };

    const btcPrice: any = contractState && parseFloat(ethers.formatUnits(contractState.oraclePriceInUsd, 8));
    const withdrawAmount: any = Number(formInputs["withdraw"]);
    const usdValue: any = withdrawAmount * btcPrice;

    const collateralBalance: any = userState && parseFloat(ethers.formatUnits(userState.collateralDeposited || 0));
    const borrowed: any = parseFloat(ethers.formatUnits(userState?.totalBitcoinDollarsMinted || 0));
    const collateralizationRatio: any = userState && parseFloat(ethers.formatUnits(userState.collateralizationRatio || 0));

    const newCollateralBalance: any = collateralBalance - withdrawAmount;
    const newCollateralUsd: any = newCollateralBalance * btcPrice;
    const newRatio: any = borrowed > 0 ? newCollateralUsd / borrowed : Infinity;

    const isBelowThreshold: any = newRatio < 1;

    // Optional: estimate max withdrawable based on threshold
    const maxSafeWithdrawUsd: any = (collateralBalance * btcPrice) - (borrowed * 1.0);
    const maxSafeWithdrawWbtc: any = maxSafeWithdrawUsd / btcPrice;

    return (
        <div className={styles.modalOverlay}>
            {userState && contractState && (
                <div className={styles.modalContent}>
                    <h2>Confirm Withdrawal</h2>

                    <div className={styles.section}>
                        <h3>Input</h3>
                        <p><strong>wBTC to Withdraw:</strong> {withdrawAmount}</p>
                        <p><strong>USD Value:</strong> ${usdValue.toFixed(2)}</p>
                        {isBelowThreshold && (
                            <p style={{ color: 'red', marginTop: '0.5rem' }}>
                                ⚠️ Exceeds safe withdrawal limit. Estimated ratio will fall below 1.
                            </p>
                        )}
                    </div>

                    <div className={styles.section}>
                        <h3>Current Status</h3>
                        <p><strong>Collateral:</strong> {collateralBalance.toFixed(6)} wBTC</p>
                        <p><strong>Debt (BTCd):</strong> {borrowed.toFixed(4)}</p>
                        <p><strong>Current Ratio:</strong> {collateralizationRatio.toFixed(2)}</p>
                    </div>

                    <div className={styles.section}>
                        <h3>Post-Withdraw Estimate</h3>
                        <p><strong>Collateral Left:</strong> {newCollateralBalance.toFixed(6)} wBTC</p>
                        <p><strong>Est. New Ratio:</strong> {newRatio.toFixed(2)}</p>
                    </div>

                    <div className={styles.section}>
                        <h3>Guidance</h3>
                        <p><strong>Max Safe Withdraw:</strong> {maxSafeWithdrawWbtc > 0 ? maxSafeWithdrawWbtc.toFixed(6) : '0'} wBTC</p>
                        <p><small>This keeps your ratio ≥ 1.00</small></p>
                    </div>

                    <div className={styles.warning}>
                        ⚠️ Withdrawing too much may lead to liquidation if BTC price drops.
                    </div>

                    <div className={styles.actions}>
                        <button onClick={() => onCancel(false)} className={styles.cancelButton}>Cancel</button>
                        <button
                            onClick={withdraw}
                            className={styles.confirmButton}
                            disabled={isBelowThreshold}
                        >
                            Confirm Withdraw
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WithdrawConfirmationModal;
