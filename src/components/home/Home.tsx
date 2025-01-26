import { Bitcoin, DollarSign, Shield, Activity, GitFork, Gift } from 'lucide-react';
import styles from './Home.module.css';
import TestnetNotice from '../testnetNotice/TestnetNotice';

const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.title}>Bitcoin Dollar Protocol</h1>
                <p className={styles.subtitle}>
                    A decentralized stablecoin backed by Bitcoin collateral
                </p>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <h3>150%</h3>
                        <p>Min Collateral</p>
                    </div>
                    <div className={styles.statItem}>
                        <h3>1:1</h3>
                        <p>USD Peg</p>
                    </div>
                    <div className={styles.statItem}>
                        <h3>10%</h3>
                        <p>Liquidation Bonus</p>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <h2>Core Features</h2>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <Bitcoin className={styles.icon} />
                        <h3>BTC Collateral</h3>
                        <p>Deposit Bitcoin as collateral to mint stable USD tokens</p>
                    </div>
                    <div className={styles.featureCard}>
                        <DollarSign className={styles.icon} />
                        <h3>Dollar Stability</h3>
                        <p>Maintain 1:1 USD peg through overcollateralization</p>
                    </div>
                    <div className={styles.featureCard}>
                        <Shield className={styles.icon} />
                        <h3>Secure Design</h3>
                        <p>Built with battle-tested security features and guards</p>
                    </div>
                    <div className={styles.featureCard}>
                        <Activity className={styles.icon} />
                        <h3>Real-time Monitoring</h3>
                        <p>Track position health and market conditions</p>
                    </div>
                    <div className={styles.featureCard}>
                        <GitFork className={styles.icon} />
                        <h3>Liquidation Protection</h3>
                        <p>Maintain 150% collateral ratio to avoid liquidation</p>
                    </div>
                    <div className={styles.featureCard}>
                        <Gift className={styles.icon} />
                        <h3>Rewards</h3>
                        <p>Earn rewards for maintaining healthy positions</p>
                    </div>
                </div>
            </section>

            <TestnetNotice />
        </div>
    );
};

export default Home;