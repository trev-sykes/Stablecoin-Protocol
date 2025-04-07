import React from "react";
import styles from "./Mint.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import useAlertStore from "../../store/useAlertStore";
import { useProtocol } from "../../hooks/useProtocol";
import useFormStore from "../../store/useFormStore";
import { handleError } from "../../utils/handleError";
import { handleCheckWeb3Connection } from "../../utils/handleCheckWeb3Connection";
import { handleInputParams } from "../../utils/handleInputParams";
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
        signerAddress,
        writeContract,
        userState
    } = useWeb3Store();

    const { showAlert } = useAlertStore();

    const { handleMint, handleBurn } = useProtocol();

    const { formInputs } = useFormStore();

    const [activeSection, setActiveSection] = React.useState<'mint' | 'burn'>('mint');

    /**
     * Mints BTCd using available collateral
     */
    const mint = async () => {
        if (!transactionSigner) return;
        if (!handleCheckWeb3Connection(writeContract, signerAddress, showAlert)) return;

        const amount = formInputs.mint;
        if (!handleInputParams('mint', amount, showAlert, userState?.userMaxMintableAmount)) return;

        try {
            showAlert("Mint Started!", "started");
            const tx = await handleMint(transactionSigner, writeContract, amount, showAlert);
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
        if (!transactionSigner) return;

        const burnAmount = formInputs.burn;
        if (!handleCheckWeb3Connection(writeContract, signerAddress, showAlert)) return;

        try {
            showAlert("Burn Started!", "started");
            const tx = await handleBurn(transactionSigner, writeContract, burnAmount, showAlert);
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
                        className={`${styles.sliderButton} ${activeSection === 'mint' ? styles.active : ''}`}
                        onClick={() => setActiveSection('mint')}
                    >
                        Mint
                    </button>
                    <button
                        className={`${styles.sliderButton} ${activeSection === 'burn' ? styles.active : ''}`}
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
