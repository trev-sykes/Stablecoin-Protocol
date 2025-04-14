import React from 'react';
import styles from './MintConfirmationModal.module.css';
import { handleError } from '../../../utils/handleError';
import useWeb3Store from '../../../store/useWeb3Store';
import { ethers } from 'ethers';
import useFormStore from '../../../store/useFormStore';
import { handleValidateTransactionParams } from '../../../utils/handleValidateTransactionParams';
import useAlertStore from '../../../store/useAlertStore';
import { useProtocol } from '../../../hooks/useProtocol';

interface MintConfirmationModalProps {
    onCancel: any;
}

const MintConfirmationModal: React.FC<MintConfirmationModalProps> = ({
    onCancel,
}) => {
    const { userState, contractState, fetchState } = useWeb3Store();
    const {
        formInputs, resetFormField } = useFormStore();
    const { showAlert, } = useAlertStore();
    const { handleMint } = useProtocol();;
    /**
* Mints BTCd using available collateral
*/
    const mint = async () => {
        const amount = handleValidateTransactionParams('mint', userState?.userMaxMintableAmount);
        if (!amount || amount === '0' || amount == 0) return;
        try {
            showAlert("Mint Started!", "started");
            const tx = await handleMint(amount);
            onCancel('');
            resetFormField('mint');
            showAlert("Mint Pending", "pending");
            await tx.wait();
            showAlert("Mint Complete", "success");
            await fetchState();
        } catch (err: any) {
            handleError('Mint', err, showAlert);
            onCancel('');
            resetFormField('mint');
            throw new Error(err.message);
        }
    };
    const btcPrice: any = contractState && (parseFloat(ethers.formatUnits(contractState.oraclePriceInUsd, 8))); // e.g., 65000
    console.log("BTC Price", btcPrice);
    const mintAmount = Number(formInputs["mint"]); // how much BTCd the user wants
    const wbtcRequired = (mintAmount / btcPrice) * 1.5;
    const usdRequired = mintAmount * 1.5;
    return (
        <div className={styles.modalOverlay}>
            {userState && contractState &&
                (
                    <div className={styles.modalContent}>
                        <h2>Confirm BTCd Mint</h2>

                        <div className={styles.section}>
                            <h3>Input</h3>
                            <p><strong>wBTC to lock:</strong> {wbtcRequired.toFixed(6)}</p>
                            <p><strong>USD Value of Collateral:</strong> ${usdRequired.toFixed(2)}</p>
                        </div>

                        <div className={styles.section}>
                            <h3>Output</h3>
                            <p><strong>BTCd to Receive:</strong> {formInputs["mint"]}</p>
                            <p><strong>Exchange Rate:</strong> 1 USD = 1 BTCd</p>
                        </div>

                        <div className={styles.section}>
                            <h3>Fees & Collateralization</h3>
                            <p><strong>Mint Fee:</strong> 0%</p>
                            <p><strong>Collateral Ratio:</strong> {parseFloat(ethers.formatUnits(userState.collateralizationRatio)).toFixed(2)}</p>
                            <p><strong>Liquidation Threshold:</strong> 1</p>
                        </div>

                        <div className={styles.warning}>
                            ⚠️ Minting BTCd locks your wBTC as collateral. Risk of liquidation if BTC drops.
                        </div>

                        <div className={styles.actions}>
                            <button onClick={() => onCancel(false)} className={styles.cancelButton}>Cancel</button>
                            <button onClick={mint} className={styles.confirmButton}>Confirm Mint</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default MintConfirmationModal;