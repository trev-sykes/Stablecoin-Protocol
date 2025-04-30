/**
 * Price chart component for displaying historical price data
 */
import React from 'react';
import styles from "./PriceChart.module.css";
import { formatter } from '../../utils/handleFormat';
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from "chart.js";
import { AnimatePresence, motion } from 'framer-motion';
import useCoinGeckoStore from '../../store/useCoinGeckoStore';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);
/**
 * Data structure for price data points
 */
interface PriceDataPoint {
    timestamp: number;
    price: number;
}
/**
 * Props for the PriceChart component
 */
interface PriceChartProps {
    historicalData: PriceDataPoint[] | null;
    height?: number;
    customOptions?: any;
    numberOfDays: string;
    setNumberOfDays: React.Dispatch<React.SetStateAction<string>>;
    lastNumberOfDays: string;
    setLastNumberOfDays: any;
}
/**
 * Chart component for displaying historical price data
 */
export const PriceChart: React.FC<PriceChartProps> = ({
    historicalData,
    height = 500,
    customOptions = {},
    numberOfDays,
    setNumberOfDays,
    lastNumberOfDays,
    setLastNumberOfDays
}) => {
    const { fetchPrices } = useCoinGeckoStore();
    const defaultChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (context: any) => {
                        const value = context.parsed.y;
                        return `$${new Intl.NumberFormat('en-US').format(value)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                grid: {
                    display: false
                },
                ticks: {
                    callback: (value: any) => `$${value}`
                }
            }
        }
    };
    /**
     * Processes and formats the chart data from historical price points
     */
    const chartData = React.useMemo(() => {
        if (!historicalData?.length) return null;

        const validData = historicalData.filter(point =>
            point && typeof point.timestamp === 'number' &&
            !isNaN(point.timestamp) && typeof point.price === 'number'
        );

        return {
            labels: validData.map(point => formatter.toFormattedDate(point.timestamp)),
            datasets: [{
                data: validData.map(point => point.price),
                borderColor: "#4BC0C0",
                backgroundColor: "rgba(160, 230, 255, 0.2)",
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
            }]
        };
    }, [historicalData]);

    if (!chartData) return null;


    return (
        <AnimatePresence mode="wait">
            <motion.div
                className={styles.container}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                <div className={styles.chartHeader}>

                    <span className={styles.chartTitle}>
                        <span className={styles.offChain}>off-chain </span>
                        Bitcoin Price {lastNumberOfDays && <span>{lastNumberOfDays} days</span>}
                        <input
                            onChange={(e) => setNumberOfDays(e.target.value)}
                            value={numberOfDays}
                            type='number'
                            className={styles.offChainDays}

                        />

                        <span onClick={async () => {
                            const days = Number(numberOfDays);
                            if (isNaN(days) || days <= 0) {
                                console.warn('Please enter a valid number of days');
                                return;
                            }
                            try {
                                await fetchPrices(days);
                                setLastNumberOfDays(days);
                            } catch (error) {
                                console.error('Failed to fetch prices:', error);
                            }
                        }}>
                            update
                        </span>
                    </span>
                    <span className={styles.currentPrice}>
                        ${historicalData?.[historicalData.length - 1]?.price.toLocaleString().split('.')[0]}
                    </span>
                </div>
                <Line
                    data={chartData}
                    options={{ ...defaultChartOptions, ...customOptions }}
                    height={height}
                />
            </motion.div>
        </AnimatePresence >
    );
};