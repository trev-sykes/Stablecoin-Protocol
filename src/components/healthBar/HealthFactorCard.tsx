import { ethers } from 'ethers';
import styles from './HealthFactorCard.module.css';

interface HealthFactorBarProps {
    healthFactor: any
}
const HealthFactorBar: React.FC<HealthFactorBarProps> = ({ healthFactor }) => {
    // Convert from BigNumber or string to number if needed
    const healthValue = ethers.formatUnits(healthFactor);
    const fixedHealthValue: any = parseFloat(healthValue).toFixed(2);

    // Constants
    const LIQUIDATION_THRESHOLD = 1.0;
    const MAX_HEALTH = 2;

    // Calculate how close to liquidation (1.0 is liquidation threshold)
    // When health factor is 1.0, we're at 0% health (liquidation)
    // The percentage should show how far we are from liquidation
    const calculateHealthPercentage = () => {
        if (fixedHealthValue <= LIQUIDATION_THRESHOLD) {
            return 0; // Already at or below liquidation threshold
        }

        // Calculate as percentage beyond liquidation threshold
        // For example: 1.03 health is only 3% away from liquidation
        const inversePercentage = ((fixedHealthValue - LIQUIDATION_THRESHOLD) / fixedHealthValue) * 100;
        return Math.min(inversePercentage * 3, 100); // Scale for better visibility
    };

    const healthPercentage = calculateHealthPercentage();

    // Determine status based on health factor
    const getStatus = () => {
        if (fixedHealthValue < 1.0) return 'liquidation';
        if (fixedHealthValue < 1.2) return 'danger';
        if (fixedHealthValue < 1.5) return 'warning';
        return 'healthy';
    };

    const status = getStatus();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 >Health Factor</h3>
                <span className={`${styles.value}`}>
                    {fixedHealthValue < MAX_HEALTH && fixedHealthValue}
                </span>
            </div>

            <div className={styles.barContainer}>
                <div className={styles.bar}>
                    {/* Health bar fill */}
                    <div
                        className={`${styles.fill} ${styles[status]}`}
                        style={{ width: `${healthPercentage}%` }}
                    />

                    {/* Liquidation threshold (1.0) marker - always at 0% */}
                    <div className={styles.marker} title="Liquidation Threshold (1.0)" />
                </div>
            </div>

            {/* Legend */}
            <div className={styles.legend}>
                <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.liquidation}`}></span> Liquidation
                </span>
                <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.danger}`}></span> Danger
                </span>
                <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.warning}`}></span> Warning
                </span>
                <span className={styles.legendItem}>
                    <span className={`${styles.dot} ${styles.healthy}`}></span> Healthy
                </span>
            </div>

            <div className={styles.statusText}>
                {fixedHealthValue < 1.1 ? (
                    <span className={styles.dangerText}>
                        Warning: {((1.0 / fixedHealthValue) * 100).toFixed(0)}% to liquidation
                    </span>
                ) : (
                    <>
                        {fixedHealthValue < MAX_HEALTH && (
                            <span>
                                Health: {((fixedHealthValue - 1.0) * 100).toFixed(0)}% above liquidation threshold
                            </span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default HealthFactorBar;