import { ethers } from "ethers";
import styles from "./Portfolio.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import { formatter } from "../../utils/handleFormat";
import { Card } from "../../components/card/Card";
import { Hero } from "../../components/hero/Hero";

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
    return (
        <div className={styles.container}>
            <Hero>
                <h1 className="title">Portfolio</h1>
                {!transactionSigner && !userState && <h3>Connect Wallet</h3>}
            </Hero>
            <div className="gridContainer">
                <div className="grid">
                    <Card
                        title={userState && 'sBTC Deposits'}
                        description={
                            userState &&
                            ethers.formatUnits(userState.userInformation.collateralDeposited)
                        }
                    />
                    <Card
                        title={userState && 'Deposit Value in USD'}
                        description={
                            userState &&
                            new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                maximumFractionDigits: 0,
                            }).format(Number(ethers.formatUnits(userState.userInformation.collateralValueInUsd)))
                        }
                    />
                    <Card
                        title={userState && 'Bitcoin Dollars Minted'}
                        description={
                            userState &&
                            ethers.formatUnits(userState?.userInformation.totalBitcoinDollarsMinted)
                        }
                    />
                    <Card
                        title={userState && 'Debt Percentage'}
                        description={
                            userState &&
                            formatter.toPercentageFromFixedPoint(userState?.userDebtShare || 0n) + '%'
                        }
                    />
                </div>
            </div>
        </div>
    );
};