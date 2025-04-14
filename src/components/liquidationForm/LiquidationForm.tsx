// LiquidationForm.tsx

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import useWeb3Store from "../../store/useWeb3Store";
import styles from "./LiquidationForm.module.css";

interface LiquidationPopupProps {
    onClose: () => void;
    isOpen: boolean;
    liquidationData: any;
}

interface LiquidationFormProps {
    onClose: any;
}

const LiquidationPopup: React.FC<LiquidationPopupProps> = ({
    onClose,
    isOpen,
    liquidationData,
}) => {
    if (!isOpen || !liquidationData) return null;

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeButton}>
                    <X size={20} />
                </button>
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
                        {parseFloat(liquidationData.debtRepaid) / 1e18} BTC$
                    </p>
                    <p>
                        <strong>Collateral Seized:</strong>{" "}
                        {parseFloat(liquidationData.collateralSeized) / 1e8} WBTC
                    </p>
                    <p>
                        <strong>Bonus:</strong>{" "}
                        {parseFloat(liquidationData.liquidationBonus) / 1e18} BTC$
                    </p>
                </div>
            </div>
        </div>
    );
};

export const LiquidationForm: React.FC<LiquidationFormProps> = ({ onClose }) => {
    const { fetchPastLiquidations, pastLiquidations } = useWeb3Store();
    const [selected, setSelected] = useState<any | null>(null);

    useEffect(() => {
        fetchPastLiquidations();
    }, []);

    return (
        <div className={styles.container}>
            <X onClick={onClose} className={styles.headerClose} />
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
                                #{index + 1} — {liq.args[0]}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            <LiquidationPopup
                isOpen={!!selected}
                onClose={() => setSelected(null)}
                liquidationData={selected}
            />
        </div>
    );
};
