import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import ProtocolBento from '../../components/protocolBento/ProtocolBento';
import {
    child,
    containerVariants,
    itemVariants,
    sectionFadeIn,
    slideInLeft,
    slideInRight,
    slideInRightDelay,
    slideInTop,
    slideInTopDelay
} from "../../animationVariants/SlideVariants";
import { Vault } from '../../components/svg/Vault';
import { liquidationInfo } from './liquidationInfo';
/**
 * Home page of the Bitcoin Dollar Protocol app.
 * Displays the hero section with protocol info and a grid of core features.
 */
const cardColors = [
    'linear-gradient(135deg, #f1f5f9, #dce6f5)',
    'linear-gradient(135deg, #dce6f5, #f1f5f9)',
    'linear-gradient(135deg, #f1f5f9, #dce6f5)',
];

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const handleClick = (path: string) => {
        navigate(`/${path}`);
    }

    return (
        <div className={styles.container}>
            <section className={`${styles.section} ${styles.hero}`}>
                <div className={styles.heroContent}>
                    <div className={styles.heroContentLeftContainer}>
                        <motion.h1
                            variants={slideInLeft}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.span variants={child}>Experience DeFi.<br /></motion.span>
                            <motion.span variants={child}>Borrow with<br /></motion.span>
                            <motion.span variants={child}>Bitcoin.</motion.span>
                        </motion.h1>
                        <motion.p
                            variants={slideInTopDelay}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.span variants={child}>Practice DeFi borrowing and liquidation with BTC-backed assets.<br /></motion.span>
                            <motion.span variants={child}>BTCd is your sandbox stablecoin to try real mechanics.<br /></motion.span>
                            <motion.span variants={child}> No real assets. No risk. Pure simulation.</motion.span>
                        </motion.p>
                    </div>
                    <motion.div
                        className={styles.heroContentRightContainer}
                        variants={slideInTop}
                        initial='hidden'
                        animate='visible'
                    >
                        <ProtocolBento />
                    </motion.div>
                </div>
            </section>
            <section className={`${styles.section} ${styles.depositSection}`}>
                <div
                    className={styles.depositHeader}
                >
                    <motion.h2
                        className={styles.depositTitle}
                        variants={sectionFadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.2, once: true }}
                    >
                        Explore Real DeFi Flows
                    </motion.h2>
                </div>
                <div
                    className={styles.depositGrid}
                >
                    <div className={styles.depositLeft}>
                        <Vault />
                    </div>
                    <motion.div
                        className={`${styles.depositRight}`}
                        variants={sectionFadeIn}
                        initial={"hidden"}
                        whileInView={"visible"}
                        viewport={{ amount: 0.2, once: true }}
                    >
                        <motion.h3
                            variants={slideInRight}
                            initial={"hidden"}
                            whileInView={"visible"}
                            viewport={{ once: true }}
                        >
                            Deposit wBTC,
                            Test DeFi mechanics.
                        </motion.h3>
                        <motion.p
                            variants={slideInRightDelay}
                            initial={"hidden"}
                            whileInView={"visible"}
                            viewport={{ once: true }}
                        >

                            Try depositing wBTC into a decentralized vault.
                            Mint BTCd, experiment with leverage, and experience
                            liquidation flows — all in a safe, sandbox environment.
                        </motion.p>
                        <motion.button
                            onClick={() => handleClick('collateral')}
                        >Try It Now
                        </motion.button>
                    </motion.div>
                </div>
            </section >
            <section className={`${styles.section} ${styles.liquidationSection}`}>
                <div className={styles.liquidationLeft}>
                    <motion.h2>
                        Master Liquidations.<br />
                        Get Rewarded.
                    </motion.h2>
                    <motion.p>
                        Practice monitoring vault health and liquidating overleveraged<br />
                        positions for simulated bonuses. Real strategies, no real losses.
                    </motion.p>
                    <div className={styles.liquidationButtonContainer}>
                        <motion.button
                            onClick={() => handleClick('liquidation')}
                        >Find Liquidations
                        </motion.button>
                    </div>
                </div>
                <motion.div
                    className={styles.liquidationRight}
                    variants={containerVariants}
                    initial={"hidden"}
                    whileInView={"visible"}
                    viewport={{ amount: 0.6, once: true }}
                >
                    {liquidationInfo.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={styles.liquidationItem}
                            variants={itemVariants}
                            style={{ background: cardColors[index % cardColors.length] }}
                        >
                            <div
                                className={styles.liquidationContent}
                            >
                                <div>
                                    <h3 className={styles.liquidationTitle}>{feature.title}</h3>
                                    <p className={styles.liquidationDescription}>{feature.description}</p>
                                </div>
                                <div className={styles.liquidationIcon}>{feature.icon}</div>

                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section >
        </div >
    );
};


{/* <motion.div
                    className={styles.featuresList}
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    {homeCardInfo.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={styles.featureItem}
                            variants={fadeInUp}
                        >
                            <div className={styles.featureIcon}>{feature.icon}</div>
                            <div className={styles.featureContent}>
                                <h3 className={styles.featureTitle}>{feature.title}</h3>
                                <p className={styles.featureDescription}>{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div> */}