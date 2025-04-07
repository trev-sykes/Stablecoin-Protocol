import React from "react";
import styles from "./Collateral.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import useAlertStore from "../../store/useAlertStore";
import { useProtocol } from "../../hooks/useProtocol";
import { handleCheckWeb3Connection } from "../../utils/handleCheckWeb3Connection";
import { handleInputParams } from "../../utils/handleInputParams";
import { handleError } from "../../utils/handleError";
import { ethers } from "ethers";
import { Hero } from "../../components/hero/Hero";
import { SignInNotification } from "../../components/signInNotification/SignInNotification";
import { FormSection } from "../../components/formSection/FormSection";
import useFormStore from "../../store/useFormStore";

/**
 * Collateral form component for depositing and withdrawing collateral.
 */
export const Collateral: React.FC = () => {
    /**
     * Get Web3 store values for blockchain interactions.
     */
    const {
        transactionSigner,
        signerAddress,
        writeContract,
        userState
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
     * Form hook to manage deposit and withdrawal input values.
     */
    const { formInputs } = useFormStore();

    /**
     * Active section (deposit or withdraw).
     */
    const [activeSection, setActiveSection] = React.useState<'deposit' | 'withdraw'>('deposit');

    /**
     * Handles collateral deposit action.
     */
    const deposit = async () => {
        if (!handleCheckWeb3Connection(writeContract, signerAddress, showAlert)) return;
        const amount = formInputs.deposit;
        if (!handleInputParams('deposit', amount, showAlert)) return;
        try {
            showAlert("Deposit Started!", "started");
            const tx = await handleDeposit(transactionSigner, writeContract, amount, showAlert);
            await tx.wait();
            showAlert("Deposit Complete", "success");
        } catch (err) {
            handleError('Deposit', err, showAlert);
        }
    };

    /**
     * Handles collateral withdrawal action.
     */
    const withdraw = async () => {
        if (!handleCheckWeb3Connection(writeContract, signerAddress, showAlert)) return;
        const amount = formInputs.withdraw;
        if (!handleInputParams('withdraw', amount, showAlert)) return;
        try {
            showAlert("Withdraw Started!", "started");
            const tx = await handleWithdraw(writeContract, amount, showAlert);
            await tx.wait();
            showAlert("Withdraw Complete", "success");
        } catch (err) {
            handleError('Withdraw', err, showAlert);
        }
    };

    return (
        <div className={styles.container}>
            <Hero>
                <h1 className="title">Collateral</h1>
            </Hero>
            <div className="formCard">
                {!transactionSigner && <SignInNotification />}
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
                        details={userState && ethers.formatUnits(userState.userInformation.collateralDeposited.toString())}
                        placeholder='3 max'
                        range={{ min: 1, max: 2 }}
                    />
                )}
                {activeSection === 'withdraw' && (
                    <FormSection
                        activeSection='withdraw'
                        inputType='number'
                        handleClick={withdraw}
                        details={userState && ethers.formatUnits(userState.userInformation.collateralDeposited.toString())}
                        placeholder={`${userState && parseFloat(ethers.formatUnits(userState.userInformation.collateralDeposited))} available`}
                        range={{ min: 1, max: (userState && parseFloat(ethers.formatUnits(userState.userInformation.collateralDeposited))) }}
                    />
                )}
            </div>
        </div>
    );
};
