import React from 'react';
import styles from "./PriceChart.module.css";
import { displays } from '../../utils/Format/Format';
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
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface PriceDataPoint {
    timestamp: number;
    price: number;
}

interface PriceChartProps {
    title: string;
    historicalData?: PriceDataPoint[];
    height?: number;
    customOptions?: any;
}

export const PriceChart: React.FC<PriceChartProps> = ({
    title,
    historicalData,
    height = 300,
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
                    display: false,
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    callback: (value: any) => `$${value}`
                }
            }
        }
    };

    const chartData = React.useMemo(() => {
        if (!historicalData?.length) return null;

        const validData = historicalData.filter(point =>
            point && typeof point.timestamp === 'number' &&
            !isNaN(point.timestamp) && typeof point.price === 'number'
        );

        return {
            labels: validData.map(point => displays.toFormattedDate(point.timestamp)),
            datasets: [{
                label: title,
                data: validData.map(point => point.price),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.1)",
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2
            }]
        };
    }, [historicalData, title]);

    if (!chartData) return null;

    return (
        <>
            <div className={styles.container}>
                <Line
                    data={chartData}
                    options={{ ...defaultChartOptions, ...customOptions }}
                    height={height}
                />
            </ div>
        </>
    );
};