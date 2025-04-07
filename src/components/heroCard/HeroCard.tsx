import styles from "./HeroCard.module.css";

interface CardProps {
    value: string; // The main value to display (e.g., "12 BTC")
    label: string; // A short label describing the value (e.g., "Collateral")
}

/**
 * HeroCard component for displaying a key value and its label.
 */
export const HeroCard: React.FC<CardProps> = ({ value, label }) => (
    <div className={styles.statItem}>
        <h3>{value}</h3>
        <p>{label}</p>
    </div>
);
