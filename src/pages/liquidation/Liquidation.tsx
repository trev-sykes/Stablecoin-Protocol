import { useEffect, useState } from "react";
import styles from "./Liquidation.module.css";
import useWeb3Store, { UserState } from "../../store/useWeb3Store";
import { useProtocol } from "../../hooks/useProtocol";
import Blockies from "react-blockies";
import useAlertStore from "../../store/useAlertStore";
import { Eye, Droplet } from "lucide-react";
import { LiquidationForm } from "../../components/liquidationForm/LiquidationForm";
import { Link } from "react-router-dom";
import { User } from "../../components/user/User";
import { AnimatePresence, motion } from "framer-motion";

const listVariants = {
    animate: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

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
        if (!readContract || users?.all) return;
        fetchUsersFromEvents();
    }, [readContract]);

    useEffect(() => {
        document.body.style.overflow = selectedUser ? "hidden" : "auto";
        return () => { document.body.style.overflow = "auto"; };
    }, [selectedUser]);

    useEffect(() => {
        if (!readContract || users?.nonLiquidatable) return;
        const timeout = setTimeout(() => {
            fetchLiquidatableUsers();
        }, 2000);
        return () => clearTimeout(timeout);
    }, [readContract]);

    const liquidate = async (user: string) => {
        if (!transactionSigner || !users?.liquidatable) {
            showAlert('Please Sign In', 'failure');
            return;
        }
        if (users.liquidatable.includes(transactionSigner.address)) {
            showAlert('You Face Liquidation Yourself Or Insufficient Funds To Cover Liquidation', 'failure');
            return;
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
            setSelectedUser(user);
            setSelectedUserState(userInfo);
        } catch (err: any) {
            showAlert('Error Grabbing User', 'error');
        }
    };

    const handleLiquidationForm = () => {
        setLiquidationPage(prev => !prev);
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className={`${styles.container} ${selectedUser ? styles.userCardActive : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                {selectedUser && selectedUserState && (
                    <div className={styles.userCardWrapper}>
                        <User
                            userState={selectedUserState}
                            userAddress={selectedUser}
                            onClose={() => {
                                setSelectedUser(null);
                                setSelectedUserState(undefined);
                            }}
                        />
                    </div>
                )}

                <div>
                    <Link to={'/liquidation/'} />
                </div>

                {!loading.fetchPastLiquidations && !liquidationPage && !selectedUser && !selectedUserState && (
                    <>
                        <motion.div
                            className={styles.userList}
                            variants={listVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <AnimatePresence>
                                {users?.liquidatable && (
                                    <motion.div
                                        key="liquidatable-users"
                                        className={styles.liquidatableSection}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h2 className={styles.sectionTitle}>Liquidatable Users</h2>
                                        {users.liquidatable.length === 0 ? (
                                            <p>No liquidatable users at the moment.</p>
                                        ) : (
                                            users.liquidatable.map((user, index) => (
                                                <motion.div key={index} className={styles.userItem} variants={itemVariants}>
                                                    <div className={styles.userAddressContainer}>
                                                        <Blockies seed={user} size={15} scale={2} className={styles.blockieAvatar} />
                                                        <span>0x{user.slice(user.length - 4)}</span>
                                                    </div>
                                                    <span>
                                                        <Droplet
                                                            onClick={async () => await liquidate(user)}
                                                            className="icon"
                                                        />
                                                    </span>
                                                </motion.div>
                                            ))
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {users?.nonLiquidatable && (
                                    <motion.div
                                        key="non-liquidatable-users"
                                        className={styles.nonLiquidatableSection}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h2 className={styles.sectionTitle}>Non-Liquidatable Users</h2>
                                        {users.nonLiquidatable.length === 0 ? (
                                            <p>No non-liquidatable users at the moment.</p>
                                        ) : (
                                            users.nonLiquidatable.map((user, index) => (
                                                <motion.div key={index} className={styles.userItem} variants={itemVariants}>
                                                    <div className={styles.userAddressContainer}>
                                                        <Blockies seed={user} size={15} scale={2} className={styles.blockieAvatar} />
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
                                                </motion.div>
                                            ))
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <button
                                className={styles.liquidationButton}
                                onClick={handleLiquidationForm}
                            >
                                View All Liquidations
                            </button>
                        </motion.div>
                    </>
                )}

                <AnimatePresence>
                    {liquidationPage && (
                        <motion.div
                            key="liquidation-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <LiquidationForm onClose={handleLiquidationForm} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
};
