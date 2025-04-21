import styles from "./TrustBar.module.css";
import { trustItems } from "./TrustItems";
export const TrustBar: React.FC = () => {

    return (
        <section className={styles.trustBar}>
            <div className={styles.trustLogosContainer}>
                <div className={styles.trustLogos}>
                    {trustItems.map((item, index) => (
                        <div key={index} className={styles.trustItem}>
                            <div className={styles.trustIcon}>{item.icon}</div>
                            <span className={styles.trustText}>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}