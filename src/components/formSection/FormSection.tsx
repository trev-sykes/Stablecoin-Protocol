import useFormStore from "../../store/useFormStore";
import useWeb3Store from "../../store/useWeb3Store";
import styles from "./FormSection.module.css"
interface FormSectionProps {
    activeSection: string;
    inputType: 'number' | 'string';
    handleClick: React.MouseEventHandler;
    details: number | string | null;
    placeholder?: string;
    range?: { min: number, max: number | null };
}
export const FormSection: React.FC<FormSectionProps> = ({ activeSection, inputType, handleClick, details, range, placeholder, }) => {
    const {
        transactionSigner,
        userState
    } = useWeb3Store();
    const {
        formInputs,
        handleInputChange } = useFormStore();
    return (
        <div className={`${styles.container} ${activeSection === 'deposit' ? 'active' : ''}`}>
            <div className={styles.inputGroup}>
                <label htmlFor={activeSection}>Enter Amount</label>
                <input
                    disabled={!transactionSigner}
                    id={activeSection}
                    type={inputType}
                    value={formInputs[activeSection]}
                    onChange={handleInputChange(activeSection)}
                    min={range ? range.min : 1}
                    max={range && range.max ? range.max : Number.MAX_SAFE_INTEGER}
                    placeholder={placeholder ? placeholder : ''}
                    className={styles.input}
                />
            </div>
            {transactionSigner && userState && (
                <p className={styles.details}>
                    {activeSection == 'deposit' || activeSection == 'withdraw'
                        ? 'Balance'
                        : activeSection == 'mint'
                            ? 'Mintable'
                            : 'Burnable'
                    } {details}
                </p>
            )}
            <button
                type="button"
                onClick={handleClick}
                disabled={
                    !formInputs[activeSection] ||
                    (range && range.max && parseFloat(formInputs[activeSection]) > range.max) ||
                    !transactionSigner
                }
                className={styles.button}
            >
                {activeSection}
            </button>
        </div >
    )
}
