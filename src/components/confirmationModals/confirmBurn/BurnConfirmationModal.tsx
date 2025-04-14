import React from 'react';
import styles from '../confirmMint/MintConfirmationModal.module.css'; // reusing same styles
import { handleError } from '../../../utils/handleError';
import useWeb3Store from '../../../store/useWeb3Store';
import { ethers } from 'ethers';
import useFormStore from '../../../store/useFormStore';
import useAlertStore from '../../../store/useAlertStore';
import { handleValidateTransactionParams } from '../../../utils/handleValidateTransactionParams';
import { useProtocol } from '../../../hooks/useProtocol';

interface BurnConfirmationModalProps {
    onCancel: any;
}

const BurnConfirmationModal: React.FC<BurnConfirmationModalProps> = ({
    onCancel,
}) => {
    const { userState, contractState, fetchState } = useWeb3Store();
    const { formInputs, resetFormField } = useFormStore();
    const { showAlert } = useAlertStore();
    const { handleBurn } = useProtocol();

    /**
         * Burns BTCd to reduce debt
         */
    const burn = async () => {
        const amount = handleValidateTransactionParams('burn', userState?.totalBitcoinDollarsMinted);
        if (!amount || amount === '0' || amount == 0) return;
        try {
            showAlert("Burn Started!", "started");
            const tx = await handleBurn(amount);
            onCancel('');
            resetFormField('burn');
            showAlert("Burn Pending", "pending");
            await tx.wait();
            showAlert("Burn Complete", "success");
            await fetchState();
        } catch (err: any) {
            handleError('Burn', err, showAlert);
            resetFormField('burn');
            onCancel('');
            throw new Error(err.message);
        }
    };

    const btcPrice: any = contractState && (parseFloat(ethers.formatUnits(contractState.oraclePriceInUsd, 8)));
    const burnAmount = Number(formInputs["burn"]);
    const wbtcReleased = (burnAmount / btcPrice) * 1.5;
    const usdReleased = burnAmount * 1.5;

    return (
        <div className={styles.modalOverlay}>
            {userState && contractState &&
                (
                    <div className={styles.modalContent}>
                        <h2>Confirm BTCd Burn</h2>

                        <div className={styles.section}>
                            <h3>Input</h3>
                            <p><strong>BTCd to Burn:</strong> {burnAmount}</p>
                        </div>

                        <div className={styles.section}>
                            <h3>Output</h3>
                            <p><strong>wBTC to Receive:</strong> {wbtcReleased.toFixed(6)}</p>
                            <p><strong>USD Value of Released Collateral:</strong> ${usdReleased.toFixed(2)}</p>
                        </div>

                        <div className={styles.section}>
                            <h3>Fees & Collateralization</h3>
                            <p><strong>Burn Fee:</strong> 0%</p>
                            <p><strong>Remaining Collateral Ratio:</strong> {parseFloat(ethers.formatUnits(userState.collateralizationRatio)).toFixed(2)}</p>
                            <p><strong>Liquidation Threshold:</strong> 1</p>
                        </div>

                        <div className={styles.warning}>
                            ⚠️ Burning BTCd will release wBTC. Ensure your collateralization remains healthy.
                        </div>

                        <div className={styles.actions}>
                            <button onClick={() => onCancel(false)} className={styles.cancelButton}>Cancel</button>
                            <button onClick={burn} className={styles.confirmButton}>Confirm Burn</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default BurnConfirmationModal;
