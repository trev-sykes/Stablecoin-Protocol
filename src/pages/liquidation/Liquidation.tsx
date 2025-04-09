import { useEffect, useState } from "react";
import { Hero } from "../../components/hero/Hero";
import styles from "./Liquidation.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import { useProtocol } from "../../hooks/useProtocol";
import Blockies from "react-blockies";

/**
 * Liquidation Component
 *
 * Displays the list of users who can and cannot be liquidated based on the protocol's rules.
 * - Liquidatable users are those who are eligible for liquidation.
 * - Non-liquidatable users are those who are not eligible for liquidation.
 */
export const Liquidation: React.FC = () => {
    const { readContract, users, fetchUsersFromEvents } = useWeb3Store();
    const { handleCanLiquidate } = useProtocol();
    const [liquidatableUsers, setLiquidatableUsers] = useState<string[]>([]);
    const [nonLiquidatableUsers, setNonLiquidatableUsers] = useState<string[]>([]);

    /**
     * Effect to fetch and check which users can be liquidated.
     * It runs when the `readContract` or `users` change.
     * If there are users, it checks whether each user can be liquidated and
     * updates the `liquidatableUsers` and `nonLiquidatableUsers` states accordingly.
     */
    useEffect(() => {
        if (!readContract) return; // If contract is not available, exit early
        if (!users) {
            fetchUsersFromEvents(); // Fetch users from events if they are not already available
        }
        if (!users) return; // If users are still not fetched, exit early

        const checkLiquidation = async () => {
            try {
                const results = await Promise.all(
                    users.map(async (user) => {
                        const canLiquidate = await handleCanLiquidate(user); // Check if user can be liquidated
                        return { user, canLiquidate };
                    })
                );

                // Separate liquidatable and non-liquidatable users
                const liquidatable = results.filter(({ canLiquidate }) => canLiquidate).map(({ user }) => user);
                const nonLiquidatable = results.filter(({ canLiquidate }) => !canLiquidate).map(({ user }) => user);

                // Update state with the results
                setLiquidatableUsers(liquidatable);
                setNonLiquidatableUsers(nonLiquidatable);

            } catch (err) {
                console.error("Error during bulk liquidation check", err); // Log any errors that occur during the liquidation check
            }
        };

        checkLiquidation(); // Run the liquidation check
    }, [readContract, users]);

    return (
        <div className={styles.container}>
            <Hero>
                <h1 className="title">Liquidation</h1>
            </Hero>
            <div className={styles.userList}>
                {/* Liquidatable Users Section */}
                <div className={styles.liquidatableSection}>
                    <h2 className={styles.sectionTitle}>Liquidatable Users</h2>
                    {liquidatableUsers.length === 0 ? (
                        <p>No liquidatable users at the moment.</p> // Show message if no liquidatable users
                    ) : (
                        liquidatableUsers.map((user, index) => (
                            <div key={index} className={styles.userItem}>
                                {/* Display user's avatar and truncated address */}
                                <Blockies
                                    seed={user}
                                    size={10}
                                    scale={5}
                                    className={styles.blockieAvatar}
                                />
                                <span>0x{user.slice(user.length - 4)}</span>
                                {/* <span><button>Liquidate</button></span> */}
                            </div>
                        ))
                    )}
                </div>

                {/* Non-Liquidatable Users Section */}
                <div className={styles.nonLiquidatableSection}>
                    <h2 className={styles.sectionTitle}>Non-Liquidatable Users</h2>
                    {nonLiquidatableUsers.length === 0 ? (
                        <p>No non-liquidatable users at the moment.</p> // Show message if no non-liquidatable users
                    ) : (
                        nonLiquidatableUsers.map((user, index) => (
                            <div key={index} className={styles.userItem}>
                                {/* Display user's avatar and truncated address */}
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
