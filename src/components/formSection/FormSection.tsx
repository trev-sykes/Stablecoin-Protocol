import useFormStore from "../../store/useFormStore";
import useWeb3Store from "../../store/useWeb3Store";
import styles from "./FormSection.module.css";
import { useState } from "react";
import MintConfirmationModal from "../confirmationModals/confirmMint/MintConfirmationModal";
import BurnConfirmationModal from "../confirmationModals/confirmBurn/BurnConfirmationModal";
import DepositConfirmationModal from "../confirmationModals/confrimDeposit/DepositConfirmationModal";
import WithdrawConfirmationModal from "../confirmationModals/confirmWithdraw/WIthdrawConfirmationModal";

interface FormSectionProps {
    activeSection: string;
    inputType: 'number' | 'string';
    handleClick?: React.MouseEventHandler;
    details: number | string | null;
    placeholder?: string;
    range?: { min: number, max: number | null };
}
export const FormSection: React.FC<FormSectionProps> = ({ activeSection, inputType, details, range, placeholder, }) => {
    const {
        transactionSigner,
        userState
    } = useWeb3Store();
    const {
        formInputs,
        handleInputChange } = useFormStore();
    const [activeModal, setActiveModal] = useState('');

    return (
        <div className={`${styles.container} ${activeSection === 'deposit' ? 'active' : ''}`}>
            <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor={activeSection}>Enter Amount</label>
                <input
                    disabled={!transactionSigner}
                    id={activeSection}
                    type={inputType}
                    value={formInputs[activeSection] || ''}
                    onChange={handleInputChange(activeSection)}
                    min={range ? range.min : 0}
                    max={range && range.max ? range.max : Number.MAX_SAFE_INTEGER}
                    placeholder={placeholder && activeSection == 'withdraw' ? `${placeholder.toString().split('.')[0]} available` : placeholder ? `${placeholder.toString().split('.')[0]}` : ''}
                    className={styles.input}
                />
            </div>
            {transactionSigner && userState && (
                <p className={styles.details}>
                    {activeSection == 'deposit' || activeSection == 'withdraw'
                        ? 'Balance'
                        : activeSection == 'mint'
                            ? 'Mintable'
                            : 'Balance'
                    } {details != null && details.toString().split('.')[0]} {activeSection == 'deposit' || activeSection == 'withdraw' ? 'sBTC' : 'BTCd'}
                </p>
            )}
            <button
                type="button"
                onClick={() => setActiveModal(activeSection)}
                disabled={
                    !formInputs[activeSection] ||
                    (range && range.max && parseFloat(formInputs[activeSection]) > range.max) ||
                    !transactionSigner
                }
                className={styles.button}
            >
                {activeSection}
            </button>
            {activeModal == 'mint' && (
                <MintConfirmationModal
                    onCancel={setActiveModal}
                />
            )}
            {activeModal == 'burn' && (
                <BurnConfirmationModal
                    onCancel={setActiveModal}
                />
            )}
            {activeModal == 'deposit' && (
                <DepositConfirmationModal
                    onCancel={setActiveModal}
                />
            )}
            {activeModal == 'withdraw' && (
                <WithdrawConfirmationModal
                    onCancel={setActiveModal}
                />
            )}
        </div >
    )
}
