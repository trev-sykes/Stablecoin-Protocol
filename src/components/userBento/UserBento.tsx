import { useState, useEffect, useCallback, useMemo, JSX } from "react";
import { motion } from "framer-motion";
import styles from "./UserBento.module.css";
import { formatter } from "../../utils/handleFormat";
import { Banknote, PieChart, Bitcoin, CircleDollarSign } from "lucide-react";
import { ethers } from "ethers";

interface Stats {
    title: string;
    icon: JSX.Element;
    content: string;
}
interface SlidingCardProps {
    userState: any;
}

export const UserBento: React.FC<SlidingCardProps> = ({ userState }) => {
    const [stats, setStats] = useState<any>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [direction, setDirection] = useState<number>(0);
    const [autoSlide] = useState(true);
    const [progressKey, setProgressKey] = useState(0);
    const SLIDE_DURATION = 4500;

    const changeSlide = useCallback((newIndex: number, newDirection: number) => {
        setSelectedIndex(newIndex);
        setDirection(newDirection);
        setProgressKey(prev => prev + 1);
    }, []);

    const handleClick = useCallback((newIndex: number) => {
        if (newIndex !== selectedIndex) {
            const newDirection = newIndex > selectedIndex ? 1 : -1;
            changeSlide(newIndex, newDirection);
        }
    }, [selectedIndex, changeSlide]);
    useEffect(() => {
        if (!userState) return;
        const deposit = userState && ethers.formatUnits(userState.collateralDeposited);
        const depositValue = userState && formatter.formatDollarsMintedToUSD(userState.collateralValueInUsd);
        const debtShare = userState && formatter.toPercentageFromFixedPoint(userState.userDebtShare);
        setStats([
            { title: "Collateral Deposited", icon: <Bitcoin />, content: `${parseFloat(deposit).toFixed(2)} wBTC` },
            { title: "Collateral Value", icon: <Banknote />, content: `$${depositValue}` },
            { title: "Total Dollars Minted", icon: <CircleDollarSign />, content: `${formatter.formatDollarsMintedToUSD(userState.totalBitcoinDollarsMinted)} BTCd` },
            { title: "Debt Share", icon: <PieChart />, content: `${debtShare} %` }
        ])
    }, [userState]);
    useEffect(() => {
        if (!autoSlide || !stats) return;

        const interval = setInterval(() => {
            const nextIndex = (selectedIndex + 1) % stats.length;
            changeSlide(nextIndex, 1);
        }, SLIDE_DURATION);

        return () => clearInterval(interval);
    }, [selectedIndex, autoSlide, stats, changeSlide]);
    const slideVariants = useMemo(
        () => ({
            enter: (direction: number) => ({
                x: direction > 0 ? 250 : -250,
                opacity: 0,
                scale: 0.95,
                position: "absolute"
            }),
            center: { x: 0, opacity: 1, scale: 1, position: "relative" },
            exit: (direction: number) => ({
                x: direction > 0 ? -250 : 250,
                opacity: 0,
                scale: 1.05,
                position: "absolute"
            })
        }),
        []
    );
    return (
        <div className={styles.card}>
            {userState && stats && (
                <>
                    <StatCard
                        stat={stats[selectedIndex]}
                        slideVariants={slideVariants}
                        direction={direction}
                    />
                    <div key={progressKey} className={styles.progressBar} />
                    <StatIndicator
                        stats={stats}
                        selectedIndex={selectedIndex}
                        handleClick={handleClick}
                    />
                </>
            )}
        </div>
    );
}

const StatCard = ({ stat, slideVariants, direction }: {
    stat: Stats;
    slideVariants: any;
    direction: number;
}) => {
    return (
        <div
            className={styles.cardContent}
        >
            <motion.div
                key={stat.title}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", duration: 0.5 }}
                className={styles.cardItem}
            >
                <div className={styles.header}>
                    <div className={styles.icon}>{stat.icon}</div>
                    <p className={styles.title}>{stat.title}</p>
                </div>
                <h1 className={`${styles.content} ${styles.gradientText}`}>{stat.content}</h1>
            </motion.div>
        </div >
    );
};

const StatIndicator = ({
    stats,
    selectedIndex,
    handleClick
}: {
    stats: Stats[];
    selectedIndex: number;
    handleClick: (index: number) => void
}) => {
    return (
        <div className={styles.indicatorContainer}>
            {stats.map((_, index) => (
                <div
                    key={index}
                    onClick={() => handleClick(index)}
                    className={`${styles.indicator} ${selectedIndex === index ? styles.activeIndicator : ''}`}
                />
            ))}
        </div>
    );
};
