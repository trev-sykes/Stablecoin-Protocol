import styles from "./TestnetNotice.module.css";
const TestnetNotice = () => {
    return (

        <section className={styles.notice}>
            <div className={styles.noticeContent}>
                <h3>⚠️ Testnet Notice</h3>
                <p>This version is deployed on Sepolia testnet and uses synthetic BTC for demonstration. No real value is at risk.</p>
            </div>
        </section>
    )
}
export default TestnetNotice;