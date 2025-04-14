import React from "react";
import styles from "./Collateral.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import useAlertStore from "../../store/useAlertStore";
import { useProtocol } from "../../hooks/useProtocol";
import { handleError } from "../../utils/handleError";
import { ethers } from "ethers";
import { Hero } from "../../components/hero/Hero";
import { SignInNotification } from "../../components/signInNotification/SignInNotification";
import { FormSection } from "../../components/formSection/FormSection";
import { handleValidateTransactionParams } from "../../utils/handleValidateTransactionParams";

/**
 * Collateral form component for depositing and withdrawing collateral.
 */
export const Collateral: React.FC = () => {
    /**
     * Get Web3 store values for blockchain interactions.
     */
    const {
        transactionSigner,
        userState,
        fetchState
    } = useWeb3Store();

    /**
     * Alert store for showing messages to the user.
     */
    const { showAlert } = useAlertStore();

    /**
     * Functions for handling collateral actions (deposit/withdraw).
     */
    const { handleDeposit, handleWithdraw } = useProtocol();

    /**
     * Active section (deposit or withdraw).
     */
    const [activeSection, setActiveSection] = React.useState<'deposit' | 'withdraw'>('deposit');

    /**
     * Handles collateral deposit action.
     */
    const deposit = async () => {
        const amount = handleValidateTransactionParams('deposit');
        if (!amount || amount == '0' || amount == 0) return;
        try {
            showAlert("Deposit Started!", "started");
            const tx = await handleDeposit(amount);
            showAlert("Deposit Pending", "pending");
            await tx.wait();
            showAlert("Deposit Complete", "success");
            await fetchState();
        } catch (err) {
            handleError('Deposit', err, showAlert);
        }
    };

    /**
     * Handles collateral withdrawal action.
     */
    const withdraw = async () => {
        const amount = handleValidateTransactionParams('withdraw');
        if (!amount || amount == '0' || amount == 0) return;
        try {
            showAlert("Withdraw Started!", "started");
            const tx = await handleWithdraw(amount);
            showAlert("Withdraw Pending", "pending");
            await tx.wait();
            showAlert("Withdraw Complete", "success");
            await fetchState();
        } catch (err) {
            handleError('Withdraw', err, showAlert);
        }
    };

    return (
        <div className={styles.container}>
            <Hero>
                <h1 className="title">Collateral</h1>
                {!transactionSigner && <SignInNotification />}
            </Hero>
            <div className="formCard">
                <div className="sliderContainer">
                    <button
                        aria-disabled={!transactionSigner}
                        className={`${"sliderButton"} ${activeSection === 'deposit' && "active"}`}
                        onClick={() => setActiveSection('deposit')}
                    >
                        Deposit
                    </button>
                    <button
                        aria-disabled={!transactionSigner}
                        className={`${"sliderButton"} ${activeSection === 'withdraw' && "active"}`}
                        onClick={() => setActiveSection('withdraw')}
                    >
                        Withdraw
                    </button>
                </div>
                {activeSection === 'deposit' && (
                    <FormSection
                        activeSection='deposit'
                        inputType='number'
                        handleClick={deposit}
                        details={userState && ethers.formatUnits(userState.collateralDeposited.toString().split('.')[0])}
                        placeholder='Enter amount'
                        range={{ min: 1, max: 2 }}
                    />
                )}
                {activeSection === 'withdraw' && (
                    <FormSection
                        activeSection='withdraw'
                        inputType='number'
                        handleClick={withdraw}
                        details={userState && ethers.formatUnits(userState.collateralDeposited.toString())}
                        placeholder={`${userState && parseFloat(ethers.formatUnits(userState.collateralDeposited.toString()))}`}
                        range={{ min: 0.000001, max: (userState && parseFloat(ethers.formatUnits(userState.collateralDeposited))) }}
                    />
                )}
            </div>
        </div>
    );
};
