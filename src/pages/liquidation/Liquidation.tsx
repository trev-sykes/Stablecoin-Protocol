import { useEffect, useState } from "react";
import { Hero } from "../../components/hero/Hero";
import styles from "./Liquidation.module.css";
import useWeb3Store, { UserState } from "../../store/useWeb3Store";
import { useProtocol } from "../../hooks/useProtocol";
import Blockies from "react-blockies";
import useAlertStore from "../../store/useAlertStore";
import { UserCard } from "../../components/userCard/UserCard";
import { Eye, Droplet } from "lucide-react";
import { LiquidationForm } from "../../components/liquidationForm/LiquidationForm";

/**
 * Liquidation Component
 *
 * Displays the list of users who can and cannot be liquidated based on the protocol's rules.
 * - Liquidatable users are those who are eligible for liquidation.
 * - Non-liquidatable users are those who are not eligible for liquidation.
 */
export const Liquidation: React.FC = () => {
    const [liquidationPage, setLiquidationPage] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedUserState, setSelectedUserState] = useState<UserState | undefined>(undefined);
    const { showAlert } = useAlertStore();
    const {
        loading,
        readContract,
        transactionSigner,
        users,
        fetchUsersFromEvents,
        fetchLiquidatableUsers
    } = useWeb3Store();
    const {
        handleLiquidate,
        handleGetUserInformation
    } = useProtocol();

    useEffect(() => {
        if (!readContract) {
            console.log("Contract not initialized");
            return;
        };
        if (users && users.all && users.all != null) {
            console.log("Users are already grabbed");
            return;
        }
        fetchUsersFromEvents();
    }, [readContract]);

    useEffect(() => {
        if (selectedUser) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [selectedUser]);
    useEffect(() => {
        if (!readContract) {
            console.log("Contract not initialized");
            return;
        };
        if (users && users.nonLiquidatable && users.nonLiquidatable != null) {
            console.log("Liquidatable users are already grabbed");
            return;
        }
        const timeout = setTimeout(() => {
            fetchLiquidatableUsers();
        }, 2000);
        console.log("Gabbed liquidation users");
        return () => clearTimeout(timeout);
    }, [readContract]);

    const liquidate = async (user: string) => {
        if (!transactionSigner || !users?.liquidatable) {
            showAlert('Please Sign In', 'failure');
            return;
        }
        for (let i = 0; i < users.liquidatable.length; i++) {
            if (transactionSigner.address == users.liquidatable[i]) {
                showAlert('You Face Liquidation Yourself Or Insufficient Funds To Cover Liquidation',
                    'failure');
                return;
            }
        }
        try {
            showAlert('Liquidation Started', 'started');
            const tx = await handleLiquidate(user);
            showAlert('Liquidation Pending', 'pending');
            await tx.wait();
            showAlert('Liquidation Complete!', 'success');
        } catch (err: any) {
            showAlert('Error Liquidating', 'error');
            throw new Error(err.message);
        }
    }

    const userInformation = async (user: string) => {
        try {
            const userInfo = await handleGetUserInformation(user);
            setSelectedUser(user); // set the selected user's address
            setSelectedUserState(userInfo); // and their data
        } catch (err: any) {
            showAlert('Error Grabbing User', 'error');
        }
    };

    const handleLiquidationForm = () => {
        setLiquidationPage(prev => !prev);
    }
    return (
        <div className={styles.container}>
            <Hero>
                <h1 className="title">Liquidation</h1>
            </Hero>

            <div>
                <button
                    onClick={handleLiquidationForm}
                >View All Liquidations</button>
            </div>
            {!loading.fetchPastLiquidations ? (
                <div className={styles.userList}>
                    {/* Liquidatable Users Section */}
                    <div className={styles.liquidatableSection}>
                        <h2 className={styles.sectionTitle}>Liquidatable Users</h2>
                        {users && users.liquidatable && users.liquidatable.length === 0 && (
                            <p>No liquidatable users at the moment.</p> // Show message if no liquidatable users
                        )}{users && users.liquidatable && users.liquidatable?.length > 0 && (
                            users.liquidatable.map((user, index) => (
                                <div key={index} className={styles.userItem}>
                                    {/* Display user's avatar and truncated address */}
                                    <div className={styles.userAddressContainer}>
                                        <Blockies
                                            seed={user}
                                            size={15}
                                            scale={2}
                                            className={styles.blockieAvatar}
                                        />
                                        <span>0x{user.slice(user.length - 4)}</span>
                                    </div>
                                    <span>
                                        <Droplet
                                            onClick={async () => await liquidate(user)}
                                            className="icon"
                                        />
                                    </span>

                                </div>
                            ))
                        )}
                    </div>

                    {/* Non-Liquidatable Users Section */}
                    <div className={styles.nonLiquidatableSection}>
                        <h2 className={styles.sectionTitle}>Non-Liquidatable Users</h2>
                        {users && users.nonLiquidatable && users.nonLiquidatable.length === 0 && (
                            <p>No non-liquidatable users at the moment.</p> // Show message if no non-liquidatable users
                        )} {users && users.nonLiquidatable && users.nonLiquidatable.length > 0 && (
                            users.nonLiquidatable.map((user, index) => (
                                <div key={index} className={styles.userItem}>
                                    {/* Display user's avatar and truncated address */}
                                    <div className={styles.userAddressContainer}>
                                        <Blockies
                                            seed={user}
                                            size={15}
                                            scale={2}
                                            className={styles.blockieAvatar}
                                        />
                                        <span className={styles.userAddress}>0x{user.slice(user.length - 4)}</span>
                                    </div>
                                    <div>
                                        <Eye
                                            className="icon"
                                            onClick={async () => {
                                                await userInformation(user);
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>) : (
                <>
                </>
            )}
            {
                selectedUser && selectedUserState && (
                    <div className={styles.userModalOverlay}>
                        <div className={styles.userModalContent}>
                            <UserCard
                                user={selectedUserState}
                                userAddress={selectedUser}
                                onclose={() => {
                                    setSelectedUser(null);
                                    setSelectedUserState(undefined);
                                }}
                            />
                        </div>
                    </div>
                )
            }
            {
                liquidationPage && (
                    <div className={styles.userModalOverlay}>
                        <div className={styles.userModalContent}>
                            <LiquidationForm
                                onClose={handleLiquidationForm}
                            />
                        </div>
                    </div>
                )
            }
        </div >
    );
};
