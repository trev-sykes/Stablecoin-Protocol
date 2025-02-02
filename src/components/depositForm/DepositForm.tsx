import React from "react";
import styles from "./DepositForm.module.css";
import TestnetNotice from "../testnetNotice/TestnetNotice";
interface DepositFormProps {
    deposit: Function;
    withdraw: Function;
    formInputs: any | null;
    handleInputChange: Function;
    userDeposits: any | null;
}
export const DepositForm: React.FC<DepositFormProps> = ({ deposit, withdraw, formInputs, handleInputChange, userDeposits }) => {
    const [activeSection, setActiveSection] = React.useState<'deposit' | 'withdraw'>('deposit');
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Deposit and Withdraw Collateral</h2>
            <div className={styles.card}>
                <div className={styles.sliderContainer}>
                    <button
                        className={
                            `${styles.sliderButton} 
                            ${activeSection == 'deposit'
                                ? styles.active
                                : ''}`}
                        onClick={() => setActiveSection('deposit')}
                    >
                        Deposit
                    </button>
                    <button
                        className={
                            `${styles.sliderButton} 
                            ${activeSection == 'withdraw'
                                ? styles.active
                                : ''}`}
                        onClick={() => setActiveSection('withdraw')}
                    >
                        Withdraw
                    </button>
                </div>
                {activeSection == 'deposit' && (
                    <div className={`${styles.depositSection} ${activeSection == 'deposit' ? styles.active : ''}`}>
                        <div>
                            <h3 className={styles.subTitle}>Deposit </h3>
                            <div className={styles.inputGroup}>
                                <label htmlFor="depoistAmount">Amount to deposit</label>
                                <input
                                    id='depositAmount'
                                    type="number"
                                    value={formInputs.deposit}
                                    onChange={handleInputChange('deposit')}
                                    min={1}
                                    max={3}
                                    placeholder="Enter a Deposit Amount"
                                    className={styles.input}
                                />
                            </div>
                            <div className={styles.costContainer}>
                                <p className={styles.cost}>Min Deposit:{1}</p>
                                <p className={styles.cost}>Max deposit:{3}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => deposit()}
                            disabled={!formInputs.deposit || parseFloat(formInputs) < 1 || formInputs.deposit > 3}
                            className={styles.button}
                        >
                            Deposit
                        </button>
                    </div>
                )}
                {activeSection == 'withdraw' && (
                    <div className={`${styles.withdrawSection} ${activeSection == 'withdraw' ? styles.active : ''}`}>
                        <div>
                            <h3 className={styles.subTitle}>Withdraw </h3>
                            <div className={styles.inputGroup}>
                                <label htmlFor="withdraw">Amount To Withdraw</label>
                                <input
                                    type="number"
                                    id="withdraw"
                                    min={1}
                                    max={userDeposits}
                                    value={formInputs.withdraw}
                                    onChange={handleInputChange('withdraw')}
                                    placeholder="Enter an amount to withdraw"
                                    className={styles.input}
                                />
                            </div>
                            <p className={styles.cost}>Balance: {userDeposits ? (userDeposits / 1000000000000000000n).toString() : 'log-in'} sBTC</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => withdraw()}
                            disabled={!formInputs.withdraw || parseFloat(formInputs) < 1 || parseFloat(formInputs.withdraw) < 1 || parseFloat(formInputs.withdraw) > (userDeposits / 1000000000000000000n)}
                            className={styles.button}
                        >Withdraw</button>
                    </div>
                )}
            </div>
            <TestnetNotice />
        </div >
    )
}