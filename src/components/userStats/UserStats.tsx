import { displays } from "../../utils/Format/Format";
import { math } from "../../utils/Math/Math";
import { DataCard } from "../dataCard/DataCard";
import styles from './UserStats.module.css';
import TestnetNotice from "../testnetNotice/TestnetNotice";

interface UserStatsProps {
    userDeposits: any;
    userDepositValue: any;
    userMintedDollars: any;
    userDebtSharePercentage: any;
    userHealthFactor: any;
    isSignInLoadingState?: boolean;
    signer?: any;
}

export const UserStats: React.FC<UserStatsProps> = ({
    userDeposits,
    userDepositValue,
    userMintedDollars,
    userDebtSharePercentage,
    userHealthFactor,
    isSignInLoadingState,
}) => {
    if (isSignInLoadingState) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Portfolio Overview</h2>
                <p>Monitor your positions and protocol interaction</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.mainStats}>
                    <DataCard
                        title="Total Deposits"
                        data={displays.toFormattedCurrency(userDeposits)}
                        currencyCode="sBTC"
                        trend={2.5}
                    />
                    <DataCard
                        title="Deposit Value"
                        data={displays.toFormattedLiquidity(userDepositValue || 0n)}
                        currencyCode="USD"
                        currencySymbol="$"
                        trend={1.8}
                    />
                </div>

                <div className={styles.secondaryStats}>
                    <DataCard
                        title="Minted BTCd"
                        data={displays.toFormattedData('Debt', userMintedDollars)}
                        currencyCode="BTCd"
                    />
                    <DataCard
                        title="Protocol Debt Share"
                        data={math.toPercentageFromFixedPoint(userDebtSharePercentage || 0n)}
                        currencyCode="%"
                    />
                    <DataCard
                        title="Position Health"
                        data={userHealthFactor}
                        hasLinearBar={true}
                    />
                </div>
                <TestnetNotice />
            </div>
        </div>
    );
};