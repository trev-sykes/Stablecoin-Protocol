// Home.tsx
import React from 'react';
import { Bitcoin, DollarSign, Shield, Activity, GitFork } from 'lucide-react';
import styles from './Home.module.css';
import BitcoinDollarSymbol from '../bitcoinDollarSymbol/BitcoinDollarSymbol';
import TestnetNotice from '../testnetNotice/TestnetNotice';

interface StatItemProps {
    value: string;
    label: string;
}

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
    <div className={styles.statItem}>
        <h3>{value}</h3>
        <p>{label}</p>
    </div>
);

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className={styles.featureCard}>
        <div className={styles.icon}>{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

const Home: React.FC = () => {
    const stats = [
        { value: "150%", label: "Min Collateral" },
        { value: "1:1", label: "USD Peg" },
        { value: "10%", label: "Liquidation Bonus" }
    ];

    const features = [
        {
            icon: <Bitcoin />,
            title: "BTC Collateral",
            description: "Deposit wrapped Bitcoin as collateral to mint stable USD tokens"
        },
        {
            icon: <DollarSign />,
            title: "Dollar Stability",
            description: "Maintain 1:1 USD peg through overcollateralization"
        },
        {
            icon: <Shield />,
            title: "Secure Design",
            description: "Built with battle-tested security features and guards"
        },
        {
            icon: <Activity />,
            title: "Real-time Monitoring",
            description: "Track position health and market conditions"
        },
        {
            icon: <GitFork />,
            title: "Liquidation Protection",
            description: "Maintain 150% collateral ratio to avoid liquidation"
        }
    ];

    return (
        <div className={styles.container}>
            <section className={styles.hero}>
                <div className={styles.logoSymbol}>
                    <h1 className={styles.title}>Bitcoin Dollar Protocol</h1>
                    <span className={styles.symbolContainer}><BitcoinDollarSymbol width={50} /></span>
                </div>
                <p className={styles.subtitle}>
                    A decentralized stablecoin backed by Bitcoin collateral
                </p>
                <div className={styles.stats}>
                    {stats.map((stat, index) => (
                        <StatItem key={index} value={stat.value} label={stat.label} />
                    ))}
                </div>
            </section>

            <section className={styles.features}>
                <h2>Core Features</h2>
                <div className={styles.featureGrid}>
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </section>
            <TestnetNotice />
        </div>
    );
};

export default Home;