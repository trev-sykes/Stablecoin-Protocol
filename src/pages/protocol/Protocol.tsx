import styles from "./Protocol.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import useCoinGeckoStore from "../../store/useCoinGeckoStore";
import { ethers } from "ethers";
import { PriceChart } from "../../components/priceChart/PriceChart";
import { Flame, Bitcoin, Cross, DollarSign } from "lucide-react";
import { Card } from "../../components/card/Card";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
/**
 * Protocol Component
 *
 * Displays protocol-wide statistics and price chart:
 * - Total BTC collateral deposited
 * - Total BTCd minted
 * - BTC/USD price chart
 */
export const Protocol: React.FC = () => {
    const { contractState, users } = useWeb3Store();
    const { isLoading, prices } = useCoinGeckoStore();
    const [numberOfDays, setNumberOfDays] = useState('30');
    const [lastNumberOfDays, setLastNumberOfDays] = useState('30');

    /**
     * Effect to fetch BTC price history data from CoinGecko.
     * It will fetch the price data if the `prices` are not already available.
     */
    return (
        <AnimatePresence mode="wait">
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}

            >
                <div className={styles.gridContainer}>
                    <div className={styles.priceCard}>
                        {!isLoading && (
                            <PriceChart
                                historicalData={prices}
                                height={300}
                                customOptions={prices}
                                numberOfDays={numberOfDays}
                                setNumberOfDays={setNumberOfDays}
                                lastNumberOfDays={lastNumberOfDays}
                                setLastNumberOfDays={setLastNumberOfDays}
                            />
                        )}
                    </div>
                    <div className={styles.cardGrid}>
                        <Card>
                            <p><Bitcoin /></p>
                            <h3>Total sBTC Deposits</h3>
                            <p>
                                {contractState &&
                                    ethers.formatUnits(contractState.totalWrappedBitcoinCollateralDeposited.toString()).split('.')[0]
                                }
                            </p>
                        </Card>
                        <Card>
                            <p><Flame /></p>
                            <h3>Total BTCd Minted</h3>
                            <p>
                                {contractState &&
                                    ethers.formatUnits(contractState.totalBitcoinDollarsMinted.toString()).split('.')[0]
                                }
                            </p>
                        </Card>
                        {contractState && (
                            <Card>
                                <p><Cross /></p>
                                <h3>Protocol Health</h3>
                                <p style={{ color: contractState.healthStatus.color }}>{contractState.healthStatus.status}</p>
                            </Card>
                        )}
                        {users && users.all && (
                            <Card>
                                <p aria-hidden={true}>👥</p>
                                <h3>Total Users</h3>
                                <p>{users.all.length}</p>
                            </Card>
                        )}
                        {contractState && (
                            <Card>
                                <p aria-hidden={true}><DollarSign /></p>
                                <h3>Total Value Locked</h3>
                                <p>{contractState.totalValueLockedUsd}</p>
                            </Card>
                        )}
                    </div>
                </div>
            </motion.div >
        </AnimatePresence>
    );
};
