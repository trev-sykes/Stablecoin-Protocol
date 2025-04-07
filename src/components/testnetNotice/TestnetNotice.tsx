import styles from "./TestnetNotice.module.css";

/**
 * TestnetNotice Component
 *
 * Displays a warning to users that the app is running on a testnet
 * and does not involve real assets.
 */
const TestnetNotice: React.FC = () => {
    return (
        <div className={styles.container}>
            <section className={styles.notice}>
                <div className={styles.noticeContent}>
                    <h3>⚠️ Testnet Notice</h3>
                    <p>
                        This version is deployed on the Sepolia testnet and uses synthetic BTC for
                        demonstration purposes. No real value is at risk.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default TestnetNotice;
