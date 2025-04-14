import React from 'react';
import styles from '../confirmMint/MintConfirmationModal.module.css'; // Reuse same styles
import { handleError } from '../../../utils/handleError';
import useWeb3Store from '../../../store/useWeb3Store';
import { ethers } from 'ethers';
import useFormStore from '../../../store/useFormStore';
import { handleValidateTransactionParams } from '../../../utils/handleValidateTransactionParams';
import useAlertStore from '../../../store/useAlertStore';
import { useProtocol } from '../../../hooks/useProtocol';

interface DepositConfirmationModalProps {
    onCancel: any;
}

const DepositConfirmationModal: React.FC<DepositConfirmationModalProps> = ({
    onCancel,
}) => {
    const { userState, contractState, fetchState } = useWeb3Store();
    const { formInputs, resetFormField } = useFormStore();
    const { showAlert } = useAlertStore();
    const { handleDeposit } = useProtocol();

    /**
    * Deposits wBTC as collateral
    */
    const deposit = async () => {
        const amount = handleValidateTransactionParams('deposit', formInputs["deposit"]);
        if (!amount || amount === '0' || amount == 0) return;
        try {
            showAlert("Deposit Started!", "started");
            const tx = await handleDeposit(amount);
            onCancel('');
            resetFormField('deposit');
            showAlert("Deposit Pending", "pending");
            await tx.wait();
            showAlert("Deposit Complete", "success");
            await fetchState();
        } catch (err: any) {
            handleError('Deposit', err, showAlert);
            onCancel('');
            resetFormField('deposit');
            throw new Error(err.message);
        }
    };
    const depositAmount = Number(formInputs["deposit"]); // wBTC amount being deposited
    return (
        <div className={styles.modalOverlay}>
            {userState && contractState && (
                <div className={styles.modalContent}>
                    <h2>Confirm Deposit</h2>

                    <div className={styles.section}>
                        <h3>Input</h3>
                        <p><strong>wBTC to Deposit:</strong> {depositAmount}</p>
                        <p><strong>USD Value:</strong> {contractState && new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                        }).format(Number(ethers.formatUnits(contractState.oraclePriceInUsd, 8)))}</p>
                    </div>

                    <div className={styles.section}>
                        <h3>Impact</h3>
                        <p><strong>New Collateral Balance:</strong> {(parseFloat(ethers.formatUnits(userState.collateralDeposited)) + depositAmount)} wBTC</p>
                        <p><strong>Collateralization Ratio:</strong> {parseFloat(ethers.formatUnits(userState.collateralizationRatio)).toFixed(2)}</p>
                    </div>

                    <div className={styles.warning}>
                        ⚠️ Depositing increases your collateral, reducing liquidation risk.
                    </div>

                    <div className={styles.actions}>
                        <button onClick={() => onCancel(false)} className={styles.cancelButton}>Cancel</button>
                        <button onClick={deposit} className={styles.confirmButton}>Confirm Deposit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DepositConfirmationModal;
