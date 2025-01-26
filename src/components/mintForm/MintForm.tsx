import React from "react";
import styles from "./MintForm.module.css";
import TestnetNotice from "../testnetNotice/TestnetNotice";

interface MintFormProps {
    bitcoinPrice: any;
    mint: Function;
    burn: Function;
    formInputs: any;
    handleInputChange: Function;
    balance: any;
    maxMintableAmount: any;
}

export const MintForm: React.FC<MintFormProps> = ({ bitcoinPrice, mint, burn, formInputs, handleInputChange, balance, maxMintableAmount }) => {
    const burnAmount = formInputs.burn ? ((BigInt(formInputs.burn) * (bitcoinPrice / 100000000n)).toLocaleString()) : 0;

    // State for active section (mint or burn)
    const [activeSection, setActiveSection] = React.useState<'mint' | 'burn'>('mint');

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Mint and Burn Bitcoin Dollar</h2>
            <div className={styles.card}>

                {/* Balance Display */}
                <div className={styles.balanceContainer}>
                    <p className={styles.balance}>Your Balance: ${(balance / 1000000000000000000n).toLocaleString()} BTCd</p>
                </div>

                {/* Slider Toggle for Mint/Burn */}
                <div className={styles.sliderContainer}>
                    <button
                        className={`${styles.sliderButton} ${activeSection === 'mint' ? styles.active : ''}`}
                        onClick={() => setActiveSection('mint')}>
                        Mint
                    </button>
                    <button
                        className={`${styles.sliderButton} ${activeSection === 'burn' ? styles.active : ''}`}
                        onClick={() => setActiveSection('burn')}>
                        Burn
                    </button>
                </div>

                {/* Mint Section */}
                {activeSection === 'mint' && (
                    <div className={styles.mintSection}>
                        <h3 className={styles.subTitle}>Mint Bitcoin Dollar</h3>
                        <div className={styles.inputGroup}>
                            <label htmlFor="mintAmount" className={styles.label}>Amount to Mint</label>
                            <input
                                type="number"
                                id="mintAmount"
                                value={formInputs.mint}
                                onChange={handleInputChange('mint')}
                                min="1"
                                max={balance}
                                placeholder="Enter collateral amount"
                                className={styles.input}
                            />
                        </div>
                        <p className={styles.cost}>Available To Mint: {maxMintableAmount ? `${(parseFloat(maxMintableAmount) / 1000000000000000000).toLocaleString().split('.')[0]} BTCd ` : 'please sign in'}</p>
                        <button
                            type="button"
                            onClick={() => mint()}
                            disabled={!formInputs.mint || parseFloat(formInputs) < 1 || formInputs.mint > parseFloat(maxMintableAmount) / 1000000000000000000}
                            className={styles.button}>
                            Mint Now
                        </button>
                    </div>
                )}

                {/* Burn Section */}
                {activeSection === 'burn' && (
                    <div className={`${styles.burnSection} ${activeSection === 'burn' ? styles.active : ''}`}>
                        <h3 className={styles.subTitle}>Burn Bitcoin Dollar</h3>
                        <div className={styles.inputGroup}>
                            <label htmlFor="burnAmount" className={styles.label}>Amount to Burn</label>
                            <input
                                type="number"
                                id="burnAmount"
                                value={formInputs.burn}
                                onChange={handleInputChange('burn')}
                                min="1"
                                max={balance}
                                placeholder="Enter amount to burn"
                                className={styles.input}
                            />
                        </div>
                        <p className={styles.receive}>You will receive: ${burnAmount} BTC</p>
                        <button
                            type="button"
                            onClick={() => burn()}
                            disabled={!formInputs.burn || parseFloat(formInputs.burn) < 1}
                            className={styles.button}>
                            Burn Now
                        </button>
                    </div>
                )}

            </div>
            <TestnetNotice />
        </div>
    );
};
