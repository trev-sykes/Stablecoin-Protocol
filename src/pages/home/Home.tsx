import React from 'react';
import BitcoinDollarSymbol from '../../components/bitcoinDollarSymbol/BitcoinDollarSymbol';
import { HeroCard } from '../../components/heroCard/HeroCard';
import { Card } from '../../components/card/Card';
import styles from './Home.module.css';
import { heroCardInfo } from './heroCardInfo';
import { homeCardInfo } from './homeCardInfo';
import { Hero } from '../../components/hero/Hero';
/**
 * Home page of the Bitcoin Dollar Protocol app.
 * Displays the hero section with protocol info and a grid of core features.
 */
export const Home: React.FC = () => {
    return (
        <div className={styles.container}>
            <Hero>
                <div className={styles.logoSymbol}>
                    <h1 className="title">Bitcoin Dollar Protocol</h1>
                    <span className={styles.symbolContainer}><BitcoinDollarSymbol width={50} /></span>
                </div>
                <p className={styles.subtitle}>
                    A decentralized stablecoin backed by Bitcoin collateral
                </p>
                <div className={styles.stats}>
                    {heroCardInfo.map((stat, index) => (
                        <HeroCard key={index} value={stat.value} label={stat.label} />
                    ))}
                </div>
            </Hero>
            <section>
                <h2 className={styles.featuresTitle}>Core Features</h2>
                <div className="gridContainer">
                    <div className="grid">
                        {homeCardInfo.map((feature, index) => (
                            <Card key={index}>
                                <div className={styles.icon}>{feature.icon}</div>
                                <h3 className={styles.title}>{feature.title}</h3>
                                <p className={styles.description}>{feature.description}</p>
                            </Card>
                        ))}

                    </div>
                </div>
            </section>
        </div>
    );
};

