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
}
/**
 * Chart component for displaying historical price data
 */
export const PriceChart: React.FC<PriceChartProps> = ({
    historicalData,
    height = 500,
    customOptions = {}
}) => {
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
        <div className={styles.container}>
            <div className={styles.chartHeader}>
                <span className={styles.chartTitle}>
                    <span className={styles.offChain}>off-chain </span>
                    Bitcoin Price
                    <span className={styles.offChainDays}> (30 days)</span>
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

        </div>
    );
};