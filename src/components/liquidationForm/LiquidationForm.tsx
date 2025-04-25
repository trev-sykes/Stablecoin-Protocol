import { useEffect, useState } from "react";
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
                <h2 className={styles.title}>💥 Liquidation Event</h2>

                <div className={styles.details}>
                    <p>
                        <strong>Liquidated User:</strong> {liquidationData.user}
                    </p>

                    <p>
                        <strong>Liquidator:</strong> {liquidationData.liquidator}
                    </p>
                    <p>
                        <strong>Debt Repaid:</strong>{" "}
                        {(parseFloat(liquidationData.debtRepaid) / 1e18).toFixed(2)} Bitcoin Dollars
                    </p>
                    <p>
                        <strong>Collateral Seized:</strong>{" "}
                        {(parseFloat(liquidationData.collateralSeized) / 1e18).toFixed(4)} WBTC
                    </p>
                    <p>
                        <strong>Bonus:</strong>{" "}
                        {(parseFloat(liquidationData.liquidationBonus) / 1e18).toFixed(2)} Bitcoin Dollars
                    </p>
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
                                    {index + 1}  {liq.args[0]}
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
