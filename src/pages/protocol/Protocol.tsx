import { useEffect } from "react";
import styles from "./Protocol.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import useCoinGeckoStore from "../../store/useCoinGeckoStore";
import { ethers } from "ethers";
import { PriceChart } from "../../components/priceChart/PriceChart";
import { Hero } from "../../components/hero/Hero";
import { Card } from "../../components/card/Card";

/**
 * Protocol Component
 *
 * Displays protocol-wide statistics and price chart:
 * - Total BTC collateral deposited
 * - Total BTCd minted
 * - BTC/USD price chart
 */
export const Protocol: React.FC = () => {
    const { contractState, initializeProvider } = useWeb3Store();
    const { prices, isLoading, fetchPrices } = useCoinGeckoStore();
    /**
     * Initializes read-only provider for protocol state
     */
    useEffect(() => {
        if (contractState) return;
        initializeProvider();
    }, [initializeProvider]);
    /**
      * Fetches BTC price history data from CoinGecko
      */
    useEffect(() => {
        if (!prices) {
            fetchPrices();
        }
    }, [fetchPrices])

    return (
        <div className={styles.container}>
            <Hero>
                <h1 className="title">Protocol</h1>
            </Hero>
            <div className="gridContainer">
                <div className={styles.priceCard}>
                    {!isLoading && (
                        <PriceChart
                            title={"BTTC/USD"}
                            historicalData={prices}
                            height={300}
                            customOptions={prices}
                        />
                    )}
                </div >
                <div className="grid">
                    <Card
                        title={'Collateral Deposits'}
                        description={contractState &&
                            ethers.formatUnits(contractState.totalWrappedBitcoinCollateralDeposited.toString())
                        }
                    />
                    <Card
                        title={'Bitcoin Dollars Minted'}
                        description={contractState &&
                            ethers.formatUnits(contractState.totalBitcoinDollarsMinted.toString()).toString().slice(0, 6)
                        }
                    />
                </div>
            </div>
        </div >
    );
};