import { useState } from "react";
import styles from "./Position.module.css";
import { HorizontalNavigation } from "../../components/poisitonHorizontalNavigation/HorizontalNavigation"
import { FormSection } from "../../components/formSection/FormSection";
import { handleValidateTransactionParams } from "../../utils/handleValidateTransactionParams";
import useAlertStore from "../../store/useAlertStore";
import { useProtocol } from "../../hooks/useProtocol";
import useWeb3Store from "../../store/useWeb3Store";
import { handleError } from "../../utils/handleError";
import { ethers } from "ethers";
import { AnimatePresence, motion } from "framer-motion";

export const Position = () => {
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

    const [activeSection, setActiveSection] = useState<string>('deposit');
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
        <>
            <HorizontalNavigation
                activeSection={activeSection}
                handleSectionSelect={setActiveSection}
            />

            <AnimatePresence mode="wait">
                {userState && transactionSigner ? (
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className={styles.title}>
                            {activeSection[0].toUpperCase() + activeSection.slice(1)}
                        </h1>
                        <div className={styles.container}>
                            <div className={"formCard"}>
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
                                {activeSection === 'mint' && (
                                    <FormSection
                                        activeSection='mint'
                                        inputType='number'
                                        details={userState && ethers.formatUnits(userState.userMaxMintableAmount.toString()).split('.')[0]}
                                        placeholder='Enter amount'
                                        range={{ min: 1, max: userState && parseFloat(ethers.formatUnits(userState.userMaxMintableAmount)) }}
                                    />
                                )}
                                {activeSection === 'burn' && (
                                    <FormSection
                                        activeSection='burn'
                                        inputType='number'
                                        details={userState && ethers.formatUnits(userState.totalBitcoinDollarsMinted.toString()).split('.')[0]}
                                        placeholder='Enter amount'
                                        range={{ min: 1, max: (userState && parseFloat(ethers.formatUnits(userState.totalBitcoinDollarsMinted))) }}
                                    />
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        <h1 className={styles.title}>Please Sign In</h1>
                        <motion.div
                            key="signedOut"
                            className={styles.container}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className={"formCard"}>
                                <div className={styles.skeletonBox} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence >
        </>
    );
}