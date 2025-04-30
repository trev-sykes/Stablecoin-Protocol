import { useEffect, useState } from "react";
import Blockies from "react-blockies"
import useWeb3Store from "../../store/useWeb3Store";
import styles from "./LiquidationForm.module.css";
import { AnimatePresence, motion } from "framer-motion";

interface LiquidationPopupProps {
    isOpen: boolean;
    liquidationData: any;
}


const LiquidationPopup: React.FC<LiquidationPopupProps> = ({
    isOpen,
    liquidationData,
}) => {
    if (!isOpen || !liquidationData) return null;
    return (
        <AnimatePresence mode="wait">
            <motion.div
                className={styles.liquidationPopupContainer}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >

                <div className={styles.receiptContainer}>
                    <h2 className={styles.receiptTitle}>Liquidation Event Receipt</h2>

                    <div className={styles.receiptSection}>
                    </div>

                    <div className={styles.receiptSection}>
                        <div className={styles.receiptRow}>
                            <span className={styles.receiptLabel}>User Address:</span>
                            <span className={styles.receiptValue}>
                                {`0x...${liquidationData.user.slice(-5)}`}
                            </span>
                        </div>
                        <div className={styles.receiptRow}>
                            <span className={styles.receiptLabel}>Liquidator Address:</span>
                            <span className={styles.receiptValue}>
                                {`0x...${liquidationData.liquidator.slice(-5)}`}
                            </span>
                        </div>
                    </div>

                    <div className={styles.receiptSection}>
                        <div className={styles.receiptRow}>
                            <span className={styles.receiptLabel}>Debt Repaid:</span>
                            <span className={styles.receiptValue}>
                                {(parseFloat(liquidationData.debtRepaid) / 1e18).toFixed(2)} BTCd
                            </span>
                        </div>
                        <div className={styles.receiptRow}>
                            <span className={styles.receiptLabel}>Collateral Seized:</span>
                            <span className={styles.receiptValue}>
                                {(parseFloat(liquidationData.collateralSeized) / 1e18).toFixed(4)} WBTC
                            </span>
                        </div>
                        <div className={styles.receiptRow}>
                            <span className={styles.receiptLabel}>Bonus:</span>
                            <span className={styles.receiptValue}>
                                {(parseFloat(liquidationData.liquidationBonus) / 1e18).toFixed(2)} Bitcoin Dollars
                            </span>
                        </div>
                    </div>

                    <div className={styles.receiptFooter}>
                        <p className={styles.footerNote}>Thank you{` 0x..${liquidationData && liquidationData.liquidator.slice(liquidationData.liquidator.length - 3, liquidationData.liquidator.length)}`} for keeping the protocol safe!</p>
                    </div>
                </div>

            </motion.div >
        </AnimatePresence>
    );
};

export const LiquidationForm: React.FC = () => {
    const { fetchPastLiquidations, pastLiquidations } = useWeb3Store();
    const [selected, setSelected] = useState<any | null>(null);

    useEffect(() => {
        fetchPastLiquidations();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.leftContainer}>
                <h1 className={styles.heading}>Liquidations</h1>

                {pastLiquidations && (
                    <div className={styles.list}>
                        {pastLiquidations.map((liq: any, index: number) => (
                            <div
                                key={index}
                                className={styles.item}
                                onClick={() =>
                                    setSelected({
                                        user: liq.args[0],
                                        liquidator: liq.args[1],
                                        debtRepaid: liq.args[2],
                                        collateralSeized: liq.args[3],
                                        liquidationBonus: liq.args[4],
                                    })
                                }
                            >
                                <p className={styles.itemText}>
                                    <span>
                                        <Blockies
                                            seed={liq.args[0]}
                                            size={5}
                                            className={styles.blockies}
                                        />
                                    </span> {`0x...${liq.args[0].slice(liq.args[0].length - 5, liq.args[0].length)}`}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <AnimatePresence mode="wait">
                {selected && (
                    <motion.div
                        key={selected.user + selected.debtRepaid} // use a unique key
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <LiquidationPopup
                            isOpen={true}
                            liquidationData={selected}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
