import { BarLoader } from "react-spinners";
import styles from "./card.module.css"
//
interface CardProps {
    /** Optional icon to display in the card. */
    icon?: React.ReactNode;
    /** Optional title of the card. */
    title?: string | null;
    /** The description content of the card (string or number). */
    description: string | number | null;
}

/**
 * Displays a card with an optional icon, title, and a description.
 * If no description is provided, a loading spinner is shown.
 */
export const Card: React.FC<CardProps> = ({ icon, title, description }) => (
    <div className={styles.featureCard}>
        {icon && (
            <div className={styles.icon}>{icon}</div>  // Render icon if provided
        )}
        {title && (
            <h3>{title}</h3>  // Render title if provided
        )}
        {description
            ? (
                <p>{description}</p>  // Render description or number {/* Show loader if no description */}
            )
            : (
                <div className={styles.loaderContainer}> {/* Show loader if no description */}
                    <BarLoader />
                </div>
            )
        }
    </div>
);
