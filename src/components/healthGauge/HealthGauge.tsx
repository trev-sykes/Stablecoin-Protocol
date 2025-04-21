import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import styles from './HealthGauge.module.css';

interface HealthFactorGaugeProps {
    healthFactor: any;
}
interface HealthGaugeToastProps {
    handleMouse: any;
}
const HealthGaugeToast: React.FC<HealthGaugeToastProps> = ({ handleMouse }) => {
    return (
        <div
            className={styles.toastContainer}
            onMouseEnter={() => handleMouse(true)}
            onMouseLeave={() => handleMouse(false)}
        >
            <div className={styles.toastContent}>
                <p>The health factor is a number that shows how safe your assets are in the protocol. It's calculated by comparing the value of what you've deposited to what you've borrowed.</p><br />

                <p>A higher health factor means your deposited assets are worth more (or you've borrowed less), lowering the chance of liquidating your assets.</p><br />

                <p>Keep in mind that these calculations follow the protocol's rules, which might change over time.</p>

            </div >

        </div >
    )
}

const HealthGauge: React.FC<HealthFactorGaugeProps> = ({ healthFactor }) => {
    const healthValue: any = ethers.formatUnits(healthFactor);
    const fixedHealthValue: any = parseFloat(healthValue).toFixed(2);
    const numericHealthValue: any = parseFloat(fixedHealthValue);

    const [isToastActive, setIsToastActive] = useState<boolean>(false);
    const [isPulsing, setIsPulsing] = useState<boolean>(false);

    const LIQUIDATION_THRESHOLD: any = 1.0;
    const WARNING_THRESHOLD: any = 2;
    const CAUTION_THRESHOLD: any = 2.5;
    const HEALTHY_THRESHOLD: any = 3.5;
    const MAX_THRESHOLD: any = 4.0;

    useEffect(() => {
        if (numericHealthValue < WARNING_THRESHOLD) {
            setIsPulsing(true);
        } else {
            setIsPulsing(false);
        }
    }, [numericHealthValue]);

    const calculateAngle = () => {
        if (numericHealthValue <= LIQUIDATION_THRESHOLD) return -90;
        if (numericHealthValue >= MAX_THRESHOLD) return 90;

        const percentage = (numericHealthValue - LIQUIDATION_THRESHOLD) / (MAX_THRESHOLD - LIQUIDATION_THRESHOLD);
        return -90 + (percentage * 180);
    };

    const needleAngle = calculateAngle();

    const getStatusClass = () => {
        if (numericHealthValue < WARNING_THRESHOLD) return styles.liquidated;
        if (numericHealthValue < CAUTION_THRESHOLD) return styles.warning;
        if (numericHealthValue < HEALTHY_THRESHOLD) return styles.danger;
        if (numericHealthValue >= MAX_THRESHOLD) return styles.healthy;
        return styles.healthy;
    };

    const polarToCartesian = (centerX: any, centerY: any, radius: any, angleInDegrees: any) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + radius * Math.cos(angleInRadians),
            y: centerY + radius * Math.sin(angleInRadians)
        };
    };

    const describeArc = (x: any, y: any, radius: any, startAngle: any, endAngle: any) => {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
    };

    const getLabelPosition = (value: any) => {
        const angle = ((value - LIQUIDATION_THRESHOLD) / (MAX_THRESHOLD - LIQUIDATION_THRESHOLD)) * 180 - 90;
        return polarToCartesian(150, 150, 140, angle); // slightly outside arc
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Health Factor</h3>
                <div
                    className={styles.infoIcon}
                    onMouseEnter={() => setIsToastActive(true)}
                    onMouseLeave={() => setIsToastActive(false)}
                >
                    ⓘ
                    {
                        isToastActive && (
                            <HealthGaugeToast
                                handleMouse={setIsToastActive}
                            />
                        )
                    }
                </div>
            </div>

            <div className={styles.gaugeContainer}>
                <svg viewBox="0 0 300 180" className={styles.gaugeSVG}>
                    {/* Background arc */}
                    <path
                        d="M30,150 A120,120 0 0,1 270,150"
                        fill="none"
                        stroke="#3A3A46"
                        strokeWidth="20"
                        strokeLinecap="round"
                    />

                    {/* Color Segments */}
                    <path d={describeArc(150, 150, 120, -90, -30)} stroke="#FF4B55" strokeWidth="4" fill="none" />
                    <path d={describeArc(150, 150, 120, -30, 0)} stroke="#FFAA33" strokeWidth="4" fill="none" />
                    <path d={describeArc(150, 150, 120, 0, 60)} stroke="#FFD700" strokeWidth="4" fill="none" />
                    <path d={describeArc(150, 150, 120, 60, 90)} stroke="#4EDE8A" strokeWidth="4" fill="none" />

                    {/* Dynamic Labels */}
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(value => {
                        const pos = getLabelPosition(value);
                        return (
                            <text key={value} x={pos.x} y={pos.y} fontSize="12" textAnchor="middle" fill="#888899">
                                {value}
                            </text>
                        );
                    })}

                    {/* Needle */}
                    <g transform={`rotate(${needleAngle}, 150, 150)`} className={isPulsing ? styles.pulsingNeedle : ''}>
                        <rect x="149" y="90" width="2" height="60" fill="#FFFFFF" rx="1" />
                    </g>
                </svg>

                {/* Center Value */}
                <div className={styles.healthValueContainer}>
                    <span className={`${styles.healthValue} ${getStatusClass()}`}>
                        {fixedHealthValue > MAX_THRESHOLD ? MAX_THRESHOLD.toFixed(1) : fixedHealthValue}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HealthGauge;
