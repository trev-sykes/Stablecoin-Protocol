// ProtocolStats.tsx
import { displays } from "../../utils/Format/Format";
import { DataCard } from "../dataCard/DataCard";
import { useEffect, useState } from "react";
import { fetchBitcoinHistoricalData } from "../../utils/api/coinGecko";
import styles from "./ProtocolStats.module.css";
import TestnetNotice from "../testnetNotice/TestnetNotice";

interface ProtocolStatsProps {
    bitcoinPrice: any;
    sBtcDeposits: {
        value: any;
        formattedValue: any;
    } | null;
    liquidity: {
        value: any;
        formattedValue: any;
    } | null;
    debt: {
        value: any;
        formattedValue: any;
    } | null;
    protocolHealthFactor: any;
    isLoadingProtocolState?: boolean;
}

export const ProtocolStats: React.FC<ProtocolStatsProps> = ({
    bitcoinPrice,
    sBtcDeposits,
    liquidity,
    debt,
    protocolHealthFactor,
    isLoadingProtocolState,
}) => {
    const [bitcoinPrices, setBitcoinPrices] = useState<Array<{ timestamp: number; price: number }>>([]);

    useEffect(() => {
        fetchBitcoinHistoricalData(30).then(setBitcoinPrices);
    }, []);

    if (isLoadingProtocolState) {
        return <div className={styles.loading}>Loading protocol stats...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                <div className={`${styles.gridItem} ${styles.fullWidth}`}>
                    <DataCard
                        currencySymbol="$"
                        title="Mint/Collateral Rate"
                        data={displays.toFormattedBitcoinPrice(bitcoinPrice)}
                        currencyCode="USD"
                        hasLinearBar={false}
                        chartType="line"
                        historicalData={bitcoinPrices}
                    />
                </div>

                <div className={styles.gridItem}>
                    <DataCard
                        title="Deposits"
                        data={displays.toFormattedData('Deposits', sBtcDeposits)}
                        currencyCode="BTC"
                        hasLinearBar={false}
                    />
                </div>

                <div className={styles.gridItem}>
                    <DataCard
                        currencySymbol="$"
                        title="Liquidity"
                        data={displays.toFormattedData('Liquidity', liquidity)}
                        currencyCode="USD"
                        hasLinearBar={false}
                    />
                </div>

                <div className={styles.gridItem}>
                    <DataCard
                        title="Debt"
                        data={displays.toFormattedData('Debt', debt)}
                        currencyCode="BTCd"
                        hasLinearBar={false}
                    />
                </div>

                <div className={styles.gridItem}>
                    <DataCard
                        title="Protocol Health"
                        data={protocolHealthFactor}
                        hasLinearBar={true}
                    />
                </div>
            </div>
            <TestnetNotice />
        </div>
    );
};