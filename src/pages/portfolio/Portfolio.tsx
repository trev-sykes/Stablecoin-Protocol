import { ethers } from "ethers";
import styles from "./Portfolio.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import { formatter } from "../../utils/handleFormat";
import { Card } from "../../components/card/Card";
import { Hero } from "../../components/hero/Hero";
import { SignInNotification } from "../../components/signInNotification/SignInNotification";
import { handleHealthFactorCalculation, HealthStatus } from "../../utils/handleHealthFactorCalculation";
import { useEffect, useState } from "react";

/**
 * Portfolio Component
 *
 * Displays the user's protocol-related portfolio:
 * - sBTC collateral
 * - Collateral USD value
 * - BTCd minted
 * - Debt percentage
 */
export const Portfolio: React.FC = () => {
    const { transactionSigner, userState } = useWeb3Store();
    const [health, setHealth] = useState<HealthStatus | null>(null);
    useEffect(() => {
        if (!userState) return;
        const healthStatus = handleHealthFactorCalculation(userState.userInformation.healthFactor);
        setHealth(healthStatus);
    }, [userState]);
    return (
        <div className={styles.container}>
            <Hero>
                <h1 className="title">Portfolio</h1>
                {!transactionSigner && !userState && <SignInNotification />}
            </Hero>
            <div className="gridContainer">
                <div className="grid">
                    <Card>
                        <h3>sBTC Deposited</h3>
                        <p>
                            {
                                userState &&
                                ethers.formatUnits(userState.userInformation.collateralDeposited).split('.')[0]
                            }
                        </p>
                    </Card>
                    <Card>
                        <h3>Collateral Value (USD)</h3>
                        <p>
                            {
                                userState &&
                                new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    maximumFractionDigits: 0,
                                }).format(Number(ethers.formatUnits(userState.userInformation.collateralValueInUsd)))
                            }
                        </p>
                    </Card>
                    <Card>
                        <h3>Total BTCd Minted</h3>
                        <p>
                            {
                                userState &&
                                ethers.formatUnits(userState?.userInformation.totalBitcoinDollarsMinted).split('.')[0]
                            }
                        </p>
                    </Card>
                    <Card>
                        <h3>Debt Share %</h3>
                        <p>
                            {
                                userState &&
                                formatter.toPercentageFromFixedPoint(userState?.userDebtShare || 0n) + '%'
                            }
                        </p>
                    </Card>
                    <Card>
                        <p aria-hidden='true'>✚</p>
                        <h3>Health Status</h3>
                        {userState && health && (
                            <p style={{ color: health.color }}>{health.status}</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};