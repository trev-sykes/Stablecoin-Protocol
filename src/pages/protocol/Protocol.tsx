import { useEffect, useState } from "react";
import styles from "./Protocol.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import useCoinGeckoStore from "../../store/useCoinGeckoStore";
import { ethers } from "ethers";
import { PriceChart } from "../../components/priceChart/PriceChart";
import { Hero } from "../../components/hero/Hero";
import { Card } from "../../components/card/Card";
import { useProtocol } from "../../hooks/useProtocol";
import { handleHealthFactorCalculation } from "../../utils/handleHealthFactorCalculation";
import { engine } from "../../contracts/bitcoinDollarEngine/index";

type HealthStatus = {
    status: string;
    color: string;
};

/**
 * Protocol Component
 *
 * Displays protocol-wide statistics and price chart:
 * - Total BTC collateral deposited
 * - Total BTCd minted
 * - BTC/USD price chart
 */
export const Protocol: React.FC = () => {
    const { contractState, users, readContract } = useWeb3Store();
    const { prices, isLoading, fetchPrices } = useCoinGeckoStore();
    const { handleGetHealthFactor } = useProtocol();
    const [health, setHealth] = useState<HealthStatus | null>(null);

    /**
     * Effect to fetch BTC price history data from CoinGecko.
     * It will fetch the price data if the `prices` are not already available.
     */
    useEffect(() => {
        if (!prices) {
            fetchPrices(); // Fetch the BTC/USD price data from CoinGecko
        }
    }, [fetchPrices, prices]);

    /**
     * Effect to fetch and calculate the protocol's health factor.
     * This effect is triggered when `readContract` changes.
     * It fetches the health factor for the protocol and updates the `health` state.
     */
    useEffect(() => {
        const fetchHealth = async () => {
            if (!readContract) return; // If the contract is not available, exit early

            // Fetch the health factor from the contract
            const healthFactor = await handleGetHealthFactor(engine.address);

            // Calculate the health status using the health factor
            const healthStatus = handleHealthFactorCalculation(healthFactor);
            // Update the `health` state with the calculated status
            setHealth(healthStatus);
        };

        fetchHealth(); // Invoke the async function to fetch and process the health
    }, []);

    return (
        <div className={styles.container}>
            <Hero>
                <h1 className="title">Protocol</h1>
            </Hero>
            <div className={styles.gridContainer}>
                <div className={styles.priceCard}>
                    {!isLoading && (
                        <PriceChart
                            historicalData={prices}
                            height={300}
                            customOptions={prices}
                        />
                    )}
                </div>
                <div className={styles.cardGrid}>
                    <Card>
                        <p>₿</p>
                        <h3>Total sBTC Deposits</h3>
                        <p>
                            {contractState &&
                                ethers.formatUnits(contractState.totalWrappedBitcoinCollateralDeposited.toString()).split('.')[0]
                            }
                        </p>
                    </Card>
                    <Card>
                        <p>💲</p>
                        <h3>Total BTCd Minted</h3>
                        <p>
                            {contractState &&
                                ethers.formatUnits(contractState.totalBitcoinDollarsMinted.toString()).split('.')[0]
                            }
                        </p>
                    </Card>
                    {health && (
                        <Card>
                            <p>✚</p>
                            <h3>Protocol Health</h3>
                            <p style={{ color: health.color }}>{health.status}</p>
                        </Card>
                    )}
                    {users && (
                        <Card>
                            <p>👥</p>
                            <h3>Total Users</h3>
                            <p>{users.length}</p>
                        </Card>
                    )}
                </div>
            </div>
        </div >
    );
};
