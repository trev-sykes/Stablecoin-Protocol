import { ethers } from "ethers";
import useWeb3Store from "../../store/useWeb3Store";
import Blockies from "react-blockies";
import styles from "./PositionBar.module.css";
import { useState } from "react";
interface PositionBarProps {
    user: any;
    userAddress: any;
}
interface PositionBarToastProps {
    handleMouseEvent: any;
}
const PositionBarToast: React.FC<PositionBarToastProps> = () => {
    return (
        <div className={styles.toastContainer}>
            <div className={styles.toastContent}>
                <p>
                    Amount of your assets supplied to the protocol.
                </p>
            </div>
        </div>
    )
}
export const PositionBar: React.FC<PositionBarProps> = ({ user, userAddress }) => {
    const { signerAddress } = useWeb3Store();
    if (!user) return null;
    const [isToastActive, setIsToastActive] = useState<boolean>(false);
    // Calculate values
    const collateralValue = parseFloat(ethers.formatUnits(user.collateralValueInUsd));
    const borrowValue = parseFloat(ethers.formatUnits(user.totalBitcoinDollarsMinted));


    // Format values for display
    const formatUSD = (value: any) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2
        }).format(value);
    };

    // Set max value for bars (100K)
    const MAX_BAR_VALUE = collateralValue < 10000000 ? 1000000 : 100000;

    // Calculate bar width as percentage of max possible value
    const collateralPercentage = Math.min((collateralValue / MAX_BAR_VALUE) * 100, 100);
    const borrowPercentage = Math.min((borrowValue / MAX_BAR_VALUE) * 100, 100);
    return (
        <div className={styles.healthCard}>
            <div className={styles.header}>
                {userAddress != signerAddress && (
                    <>
                        <h3>
                            <a
                                className={styles.userAddressContainer}
                                href={`https://sepolia.etherscan.io/address/${userAddress}`}
                                target='_blank'
                                rel="noopener noreferrer"
                            >
                                <Blockies
                                    seed={userAddress}
                                    size={6}
                                    className={styles.blockies}
                                /> <span className={styles.spanAddress}>0x{userAddress.slice(userAddress.length - 4, userAddress.length)}</span></a> Position</h3>
                        {/* <div className={`${styles.healthStatus} ${getStatusClass()}`}>
                    <span>{getHealthStatus()}</span>
                    <span className={styles.ratio}>{healthPercentage.toFixed(0)}%</span>
                </div> */}
                    </>
                )}
                {userAddress == signerAddress && (
                    <>
                        <h3> Your Position</h3>
                    </>
                )}
                <div
                    className={styles.infoIcon}
                    onMouseEnter={() => setIsToastActive(true)}
                    onMouseLeave={() => setIsToastActive(false)}
                >
                    ⓘ
                    {
                        isToastActive && (
                            <PositionBarToast
                                handleMouseEvent={setIsToastActive}
                            />
                        )
                    }
                </div>
            </div>

            <div className={styles.healthBars}>
                <div className={styles.barRow}>
                    <div className={styles.barLabel}>
                        <span>Collateral Deposited</span>
                        <span className={styles.value}>{formatUSD(collateralValue)}</span>
                    </div>
                    <div className={styles.barContainer}>
                        <div className={styles.bar}>
                            <div
                                className={styles.collateralFill}
                                style={{ width: `${collateralPercentage}%` }}
                            />
                        </div>
                        <div className={styles.maxValue}>{formatUSD(MAX_BAR_VALUE)}</div>
                    </div>
                </div>

                <div className={styles.barRow}>
                    <div className={styles.barLabel}>
                        <span>Borrow</span>
                        <span className={styles.value}>{formatUSD(borrowValue)}</span>
                    </div>
                    <div className={styles.barContainer}>
                        <div className={styles.bar}>
                            <div
                                className={styles.borrowFill}
                                style={{ width: `${borrowPercentage}%` }}
                            />
                        </div>
                        <div className={styles.maxValue}>{formatUSD(MAX_BAR_VALUE)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};