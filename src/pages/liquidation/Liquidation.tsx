import { useEffect, useState } from "react";
import { Hero } from "../../components/hero/Hero";
import styles from "./Liquidation.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import { useProtocol } from "../../hooks/useProtocol";
import Blockies from "react-blockies"; // Import react-blockies

export const Liquidation: React.FC = () => {
    const { users } = useWeb3Store();
    const [liquidatableUsers, setLiquidatableUsers] = useState<string[]>([]);
    const [nonLiquidatableUsers, setNonLiquidatableUsers] = useState<string[]>([]);
    const { handleCanLiquidate } = useProtocol();

    useEffect(() => {
        if (!users) return;

        const checkLiquidation = async () => {
            try {
                const results = await Promise.all(
                    users.map(async (user) => {
                        const canLiquidate = await handleCanLiquidate(user);
                        return { user, canLiquidate };
                    })
                );

                const liquidatable = results.filter(({ canLiquidate }) => canLiquidate).map(({ user }) => user);
                const nonLiquidatable = results.filter(({ canLiquidate }) => !canLiquidate).map(({ user }) => user);

                setLiquidatableUsers(liquidatable);
                setNonLiquidatableUsers(nonLiquidatable);

            } catch (err) {
                console.error("Error during bulk liquidation check", err);
            }
        };

        checkLiquidation();
    }, []);

    return (
        <div className={styles.container}>
            <Hero>
                <h1 className="title">Liquidation</h1>
            </Hero>
            <div className={styles.userList}>
                {/* Liquidatable Users */}
                <div className={styles.liquidatableSection}>
                    <h2 className={styles.sectionTitle}>Liquidatable Users</h2>
                    {liquidatableUsers.length === 0 ? (
                        <p>No liquidatable users at the moment.</p>
                    ) : (
                        liquidatableUsers.map((user, index) => (
                            <div key={index} className={styles.userItem}>
                                <Blockies
                                    seed={user}
                                    size={10}
                                    scale={5}
                                    className={styles.blockieAvatar}
                                />
                                <span>0x{user.slice(user.length - 4)}</span>
                            </div>
                        ))
                    )}
                </div>

                {/* Non-Liquidatable Users */}
                <div className={styles.nonLiquidatableSection}>
                    <h2 className={styles.sectionTitle}>Non-Liquidatable Users</h2>
                    {nonLiquidatableUsers.length === 0 ? (
                        <p>No non-liquidatable users at the moment.</p>
                    ) : (
                        nonLiquidatableUsers.map((user, index) => (
                            <div key={index} className={styles.userItem}>
                                <Blockies
                                    seed={user}
                                    size={10}
                                    scale={5}
                                    className={styles.blockieAvatar}
                                />
                                <span>0x{user.slice(user.length - 4)}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
