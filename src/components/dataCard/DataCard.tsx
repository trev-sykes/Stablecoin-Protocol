import React from 'react';
import { LinearProgress } from "@mui/material";
import { PriceChart } from '../priceChart/PriceChart';
import styles from './DataCard.module.css';

interface PriceDataPoint {
    timestamp: number;
    price: number;
}

interface DataCardProps {
    title: string;
    data?: any;
    currencyCode?: string;
    currencySymbol?: string;
    hasLinearBar?: boolean;
    chartType?: "line" | "progress";
    historicalData?: PriceDataPoint[];
    chartOptions?: any;
    trend?: number;
}

export const DataCard: React.FC<DataCardProps> = ({
    title,
    data,
    currencyCode,
    currencySymbol,
    hasLinearBar,
    chartType,
    historicalData,
    chartOptions,
    trend
}) => {
    const isChartView = title === "Mint/Collateral Rate";

    // Helper function to safely convert BigInt to number
    const safeNumberConversion = (value: any): number => {
        if (typeof value === 'bigint') {
            // Convert BigInt to number safely
            return Number(value.toLocaleString().split('.')[0]);
        }
        return Number(value);
    };

    // Safely convert data for progress bar
    const progressValue = data !== undefined ? safeNumberConversion(data) : 0;

    return (
        <div className={`${styles.card} ${isChartView ? styles.chartCard : ''}`}>
            <div className={styles.cardHeader}>
                <div className={styles.titleSection}>
                    <h3 className={styles.title}>{title}</h3>
                    {trend !== undefined && (
                        <span className={`${styles.trend} ${trend >= 0 ? styles.positive : styles.negative}`}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </span>
                    )}
                </div>
                {isChartView && (
                    <div className={styles.rate}>
                        {currencySymbol}{data?.toLocaleString()} {currencyCode}
                        <span className={styles.perUnit}>/sBTC</span>
                    </div>
                )}
            </div>

            <div className={styles.cardContent}>
                {chartType === "line" ? (
                    <div className={styles.chartWrapper}>
                        <div className={styles.chartHeader}>
                            <span className={styles.chartTitle}>
                                <span className={styles.offChain}>off-chain</span>
                                Bitcoin Price
                            </span>
                            <span className={styles.currentPrice}>
                                ${historicalData?.[historicalData.length - 1]?.price.toLocaleString().split('.')[0]}
                            </span>
                        </div>
                        <PriceChart
                            title={title}
                            historicalData={historicalData}
                            height={300}
                            customOptions={chartOptions}
                        />
                    </div>
                ) : title == 'Protocol Health' ? (
                    <div className={`${styles.dataDisplay} ${title === 'Protocol Health' ? styles.hidden : ''}`}>
                        <span className={styles.value}>
                            {currencySymbol}{data?.toLocaleString()} {currencyCode}
                        </span>
                    </div>
                ) :
                    title == 'Total Deposits' ? (
                        <div className={`${styles.dataDisplay} : ''}`}>
                            <span className={styles.value}>
                                {currencySymbol}{(BigInt(data) / 1000000000000000000n).toString()} {currencyCode}
                            </span>
                        </div>
                    ) :
                        (
                            <div className={`${styles.dataDisplay} `}>
                                <span className={styles.value}>
                                    {title == 'Position Health' && (
                                        <>
                                            <p>{data > 100 ? 'Healthy' : data > 50 ? 'Okay' : data > 25 ? 'Needs Work' : 'Bad'}</p>
                                        </>
                                    )}
                                    {title != 'Position Health' && title != 'Debt' && title != 'Minted BTCd' && (
                                        <>
                                            {currencySymbol}{data?.toLocaleString()} {currencyCode}
                                        </>
                                    )}
                                    {title == 'Debt' && (
                                        <>
                                            ${parseFloat(data?.toLocaleString().split('.')[0]).toLocaleString()} {currencyCode}
                                        </>
                                    )}
                                    {title == 'Minted BTCd' && (
                                        <>
                                            ${parseFloat(data?.toLocaleString().split('.')[0]).toLocaleString()} {currencyCode}
                                        </>
                                    )}

                                </span>
                            </div>
                        )
                }

                {hasLinearBar && data !== undefined && (
                    <div className={styles.progressWrapper}>
                        <LinearProgress
                            className={styles.progressBar}
                            variant="determinate"
                            value={Math.min(progressValue, 100)}
                            color="primary"
                        />
                    </div>
                )}
            </div>
        </div >
    );
};