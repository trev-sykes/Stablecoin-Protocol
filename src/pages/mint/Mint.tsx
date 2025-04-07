import React from "react";
import styles from "./Mint.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import useAlertStore from "../../store/useAlertStore";
import { useProtocol } from "../../hooks/useProtocol";
import { handleError } from "../../utils/handleError";
import { handleValidateTransactionParams } from "../../utils/handleValidateTransactionParams";
import { ethers } from "ethers";
import { Hero } from "../../components/hero/Hero";
import { SignInNotification } from "../../components/signInNotification/SignInNotification";
import { FormSection } from "../../components/formSection/FormSection";

/**
 * Form for minting and burning Bitcoin Dollars
 */
export const Mint: React.FC = () => {
    const {
        transactionSigner,
        userState
    } = useWeb3Store();

    const { showAlert } = useAlertStore();

    const { handleMint, handleBurn } = useProtocol();

    const [activeSection, setActiveSection] = React.useState<'mint' | 'burn'>('mint');

    /**
     * Mints BTCd using available collateral
     */
    const mint = async () => {
        const amount = handleValidateTransactionParams('mint', userState?.userMaxMintableAmount);
        if (!amount || amount === '0' || amount == 0) return;
        try {
            showAlert("Mint Started!", "started");
            const tx = await handleMint(amount);
            showAlert("Mint Pending", "pending");
            await tx.wait();
            showAlert("Mint Complete", "success");
        } catch (err: any) {
            handleError('Mint', err, showAlert);
            throw new Error(err.message);
        }
    };

    /**
     * Burns BTCd to reduce debt
     */
    const burn = async () => {
        const amount = handleValidateTransactionParams('burn', userState?.userInformation.totalBitcoinDollarsMinted);
        if (!amount || amount === '0' || amount == 0) return;
        try {
            showAlert("Burn Started!", "started");
            const tx = await handleBurn(amount);
            showAlert("Burn Pending", "pending");
            await tx.wait();
            showAlert("Burn Complete", "success");
        } catch (err: any) {
            handleError('Burn', err, showAlert);
            throw new Error(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <Hero>
                <h1 className="title">Mint</h1>
            </Hero>
            <div className="formCard">
                {!transactionSigner && <SignInNotification />}
                <div className="sliderContainer">
                    <button
                        className={`${"sliderButton"} ${activeSection === 'mint' ? "active" : ''}`}
                        onClick={() => setActiveSection('mint')}
                    >
                        Mint
                    </button>
                    <button
                        className={`${"sliderButton"} ${activeSection === 'burn' ? "active" : ''}`}
                        onClick={() => setActiveSection('burn')}
                    >
                        Burn
                    </button>
                </div>
                {activeSection === 'mint' && (
                    <FormSection
                        activeSection='mint'
                        inputType='number'
                        handleClick={mint}
                        details={userState && ethers.formatUnits(userState.userMaxMintableAmount.toString()).split('.')[0]}
                        placeholder='Enter amount'
                        range={{ min: 1, max: userState && parseFloat(ethers.formatUnits(userState.userMaxMintableAmount)) }}
                    />
                )}
                {activeSection == 'burn' && (
                    <FormSection
                        activeSection='burn'
                        inputType='number'
                        handleClick={burn}
                        details={userState && ethers.formatUnits(userState.userInformation.totalBitcoinDollarsMinted.toString()).split('.')[0]}
                        placeholder=''
                        range={{ min: 1, max: (userState && parseFloat(ethers.formatUnits(userState.userInformation.totalBitcoinDollarsMinted))) }}
                    />
                )}
            </div>
        </div>
    );
};
