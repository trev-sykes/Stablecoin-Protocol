import React from "react";
import styles from "./Borrow.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import { ethers } from "ethers";
import { FormSection } from "../../components/formSection/FormSection";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Form for minting and burning Bitcoin Dollars
 */
export const Borrow: React.FC = () => {
    const {
        userState,
    } = useWeb3Store();
    const [activeSection, setActiveSection] = React.useState<'mint' | 'burn'>('mint');
    return (
        <AnimatePresence mode="wait">
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                <div className="formCard">
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
                            details={userState && ethers.formatUnits(userState.userMaxMintableAmount.toString()).split('.')[0]}
                            placeholder='Enter amount'
                            range={{ min: 1, max: userState && parseFloat(ethers.formatUnits(userState.userMaxMintableAmount)) }}
                        />
                    )}
                    {activeSection == 'burn' && (
                        <FormSection
                            activeSection='burn'
                            inputType='number'
                            details={userState && ethers.formatUnits(userState.totalBitcoinDollarsMinted.toString()).split('.')[0]}
                            placeholder='Enter amount'
                            range={{ min: 1, max: (userState && parseFloat(ethers.formatUnits(userState.totalBitcoinDollarsMinted))) }}
                        />
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
