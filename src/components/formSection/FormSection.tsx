import useFormStore from "../../store/useFormStore";
import useWeb3Store from "../../store/useWeb3Store";
import styles from "./FormSection.module.css";
import { useState } from "react";
import MintConfirmationModal from "../confirmationModals/confirmMint/MintConfirmationModal";
import BurnConfirmationModal from "../confirmationModals/confirmBurn/BurnConfirmationModal";
import DepositConfirmationModal from "../confirmationModals/confrimDeposit/DepositConfirmationModal";
import WithdrawConfirmationModal from "../confirmationModals/confirmWithdraw/WIthdrawConfirmationModal";
import { formatter } from "../../utils/handleFormat";
import wbtc from "../../../public/wbtc.png"
import btcd from "../../../public/logo.png";

import { ethers } from "ethers";

interface FormSectionProps {
    activeSection: string;
    inputType: 'number' | 'string';
    handleClick?: React.MouseEventHandler;
    details: number | string | null;
    placeholder?: string;
    range?: { min: number, max: number | null };
}

export const FormSection: React.FC<FormSectionProps> = ({
    activeSection,
    inputType,
    details,
    range,
    placeholder,
}) => {
    const { transactionSigner, userState, contractState } = useWeb3Store();
    const { formInputs, handleInputChange } = useFormStore();
    const [activeModal, setActiveModal] = useState('');

    const amount = formInputs[activeSection] || '';
    const formatUSD = (value: any) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2
        }).format(value);
    };

    return (
        <div className={`${styles.container} ${activeSection === 'deposit' ? 'active' : ''}`}>
            <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor={activeSection}>Enter Amount</label>

                {activeSection === 'deposit' ? (
                    <div className={styles.inputWrapper}>
                        <span className={styles.icon}><img src={wbtc} alt="logo" width={40} /><span className={styles.iconText}>sBTC</span></span>
                        <input
                            disabled={!transactionSigner}
                            id={activeSection}
                            type={inputType}
                            value={amount}
                            onChange={handleInputChange(activeSection)}
                            min={range?.min || 0}
                            max={range?.max || Number.MAX_SAFE_INTEGER}
                            placeholder={placeholder ? placeholder.toString().split('.')[0] : ''}
                            className={styles.inputWithIcon}
                        />
                        {amount && (
                            <div className={styles.usdValue}>
                                ≈ {contractState && formatUSD(parseFloat(ethers.formatUnits(contractState.oraclePriceInUsd, 8)) * amount)} USD
                            </div>
                        )}
                    </div>
                ) : activeSection == 'withdraw' ? (
                    <div className={styles.inputWrapper}>
                        <span className={styles.icon}><img src={wbtc} alt="logo" width={40} /><span className={styles.iconText}>sBTC</span></span>
                        <input
                            disabled={!transactionSigner}
                            id={activeSection}
                            type={inputType}
                            value={amount}
                            onChange={handleInputChange(activeSection)}
                            min={range?.min || 0}
                            max={range?.max || Number.MAX_SAFE_INTEGER}
                            placeholder={
                                placeholder && activeSection === 'withdraw'
                                    ? `${placeholder.toString().split('.')[0]} available`
                                    : placeholder?.toString().split('.')[0]
                            }
                            className={styles.inputWithIcon}
                        />
                        {amount && (
                            <div className={styles.usdValue}>
                                ≈ {contractState && formatUSD(parseFloat(ethers.formatUnits(contractState.oraclePriceInUsd, 8)) * amount)} USD
                            </div>
                        )}
                    </div>
                ) : activeSection === 'mint' ? (
                    <div className={styles.inputWrapper}>
                        <span className={styles.icon}><img src={btcd} alt="logo" width={40} /><span className={styles.iconText}>BTCd</span></span>
                        <input
                            disabled={!transactionSigner}
                            id={activeSection}
                            type={inputType}
                            value={amount}
                            onChange={handleInputChange(activeSection)}
                            min={range?.min || 0}
                            max={range?.max || Number.MAX_SAFE_INTEGER}
                            placeholder={
                                placeholder && placeholder.toString().split('.')[0]
                            }
                            className={styles.inputWithIcon}
                        />
                        {amount && (
                            <div className={styles.usdValue}>
                                ≈ {contractState && formatUSD(1 * amount)} USD
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.inputWrapper}>
                        <span className={styles.icon}><img src={btcd} alt="logo" width={40} /><span className={styles.iconText}>BTCd</span></span>
                        <input
                            disabled={!transactionSigner}
                            id={activeSection}
                            type={inputType}
                            value={amount}
                            onChange={handleInputChange(activeSection)}
                            min={range?.min || 0}
                            max={range?.max || Number.MAX_SAFE_INTEGER}
                            placeholder={
                                placeholder && placeholder?.toString().split('.')[0]
                            }
                            className={styles.inputWithIcon}
                        />
                        {amount && (
                            <div className={styles.usdValue}>
                                ≈ {contractState && formatUSD(1 * amount)} USD
                            </div>
                        )}
                    </div>
                )}
            </div>

            {transactionSigner && userState && (
                <p className={styles.details}>
                    {activeSection === 'deposit' || activeSection === 'withdraw'
                        ? 'Balance'
                        : activeSection === 'mint'
                            ? 'Mintable'
                            : 'Balance'} {details?.toString().split('.')[0]} {activeSection === 'deposit' || activeSection === 'withdraw' ? 'sBTC' : 'BTCd'}
                </p>
            )}

            <button
                type="button"
                onClick={() => setActiveModal(activeSection)}
                disabled={
                    !amount ||
                    (range?.max && parseFloat(amount) > range.max) ||
                    !transactionSigner
                }
                className={styles.button}
            >
                {activeSection}
            </button>

            {activeModal === 'mint' && <MintConfirmationModal onCancel={setActiveModal} />}
            {activeModal === 'burn' && <BurnConfirmationModal onCancel={setActiveModal} />}
            {activeModal === 'deposit' && <DepositConfirmationModal onCancel={setActiveModal} />}
            {activeModal === 'withdraw' && <WithdrawConfirmationModal onCancel={setActiveModal} />}
        </div>
    );
};
