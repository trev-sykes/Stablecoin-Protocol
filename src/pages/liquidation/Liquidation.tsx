import { useEffect, useState } from "react";
import styles from "./Liquidation.module.css";
import useWeb3Store, { UserState } from "../../store/useWeb3Store";
import { useProtocol } from "../../hooks/useProtocol";
import Blockies from "react-blockies";
import useAlertStore from "../../store/useAlertStore";
import { Eye, Droplet } from "lucide-react";
import { LiquidationForm } from "../../components/liquidationForm/LiquidationForm";
import { child, itemVariants, slideInLeft, slideInTopDelay } from "../../animationVariants/SlideVariants";
import { listVariants } from "../../animationVariants/listVariants";
import { User } from "../../components/user/User";
import { AnimatePresence, motion } from "framer-motion";
import { HorizontalNavigation } from "../../components/liquidationHorizontalNavigation/HorizontalNavigaition";


export const Liquidation: React.FC = () => {
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedUserState, setSelectedUserState] = useState<UserState | undefined>(undefined);
    const [activeSection, setActiveSection] = useState('');
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
        }, 150);
        return () => clearTimeout(timeout);
    }, [readContract, users]);

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
    };
    const handleActiveSection = (sectionName: string) => {
        if (activeSection == 'user' && selectedUser && selectedUserState) {
            setSelectedUser(null);
            setSelectedUserState(undefined);
            setActiveSection(sectionName);
            console.log("User Erased");
            console.log("Section Changed");
        } else {
            setActiveSection(sectionName);
            console.log("Section Changed");
        }

    }
    const userInformation = async (user: string) => {
        try {
            const userInfo = await handleGetUserInformation(user);
            setActiveSection('user');
            setSelectedUser(user);
            setSelectedUserState(userInfo);
        } catch (err: any) {
            showAlert('Error Grabbing User', 'error');
        }
    };

    return (
        <AnimatePresence mode="wait">
            <HorizontalNavigation
                activeSection={activeSection}
                handleSectionSelect={handleActiveSection}
            />

            <motion.div
                className={`${styles.container}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                {activeSection === '' && (
                    <div className={styles.heroContent}>
                        <div className={styles.heroContentLeftContainer}>
                            <motion.h1
                                variants={slideInLeft}
                                initial="hidden"
                                animate="visible"
                                className={styles.heroTitle}
                            >
                                <motion.span variants={child}>Get Paid To</motion.span><br />
                                <motion.span variants={child}>Liquidate</motion.span>
                            </motion.h1>

                            <motion.p
                                variants={slideInTopDelay}
                                initial="hidden"
                                animate="visible"
                                className={styles.heroDescription}
                            >
                                <motion.span variants={child}>Liquidate bad positions for a 10% bonus!</motion.span><br />
                                <motion.span variants={child}>You can liquidate up to 50% of a user's position if their health factor falls below the min threshold.</motion.span><br />
                                <motion.span variants={child}>Make sure to have sufficient collateral when you liquidate!</motion.span>
                            </motion.p>

                            <div className={styles.heroActions}>
                                {/* Action Buttons or Additional Content */}
                            </div>
                        </div>

                        {/* <motion.div
                        className={styles.heroContentRightContainer}
                        variants={slideInTop}
                        initial="hidden"
                        animate="visible"
                    >
                        <Droplet />
                    </motion.div> */}
                    </div>
                )}
                {selectedUser && selectedUserState && activeSection == 'user' && (
                    <div className={styles.userCardWrapper}>
                        <User
                            userState={selectedUserState}
                            userAddress={selectedUser}
                            onClose={handleActiveSection}
                        />
                    </div>
                )}


                <AnimatePresence mode="wait">

                    {!selectedUser && !selectedUserState && (
                        loading.fetchPastLiquidations ? (
                            <motion.div
                                key="loading"
                                className={styles.loadingContainer}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <p>Loading users...</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`user-lists-${activeSection}`}
                                className={styles.userList}
                                variants={listVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >

                                {activeSection === 'liquidatable' && (
                                    <motion.div
                                        key="liquidatable-users"
                                        className={styles.liquidatableSection}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h2 className={styles.sectionTitle}>Liquidatable Users</h2>
                                        {!users || !users.liquidatable || users?.liquidatable?.length === 0 ? (
                                            <p>No liquidatable users at the moment.</p>
                                        ) : (
                                            users.liquidatable.map((user, index) => (
                                                <motion.div
                                                    key={index}
                                                    className={styles.userItem}
                                                    variants={itemVariants}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={async () => await liquidate(user)}
                                                >
                                                    <div className={styles.userAddressContainer}>
                                                        <Blockies seed={user} size={15} scale={2} className={styles.blockieAvatar} />
                                                        <span>0x{user.slice(user.length - 4)}</span>
                                                    </div>
                                                    <span>
                                                        <Droplet
                                                            className="icon"
                                                        />
                                                    </span>
                                                </motion.div>
                                            ))
                                        )}
                                    </motion.div>
                                )}

                                {activeSection === 'non-liquidatable' && (
                                    <motion.div
                                        key="non-liquidatable-users"
                                        className={styles.nonLiquidatableSection}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <h2 className={styles.sectionTitle}>Non-Liquidatable Users</h2>
                                        {!users || !users.nonLiquidatable || users?.nonLiquidatable?.length === 0 ? (
                                            <p>No non-liquidatable users at the moment.</p>
                                        ) : (
                                            users.nonLiquidatable.map((user, index) => (
                                                <motion.div
                                                    key={index}
                                                    className={styles.userItem}
                                                    variants={itemVariants}
                                                    whileHover={{ scale: 1.01 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={async () => {
                                                        await userInformation(user)
                                                    }}
                                                >
                                                    <div className={styles.userAddressContainer}>
                                                        <Blockies seed={user} size={15} scale={2} className={styles.blockieAvatar} />
                                                        <span className={styles.userAddress}>0x{user.slice(user.length - 4)}</span>
                                                    </div>
                                                    <div>
                                                        <Eye
                                                            className="icon"
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </motion.div>
                                )}
                                {activeSection == 'past-liquidations' && (
                                    <motion.div
                                        key="liquidation-form"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <LiquidationForm />
                                    </motion.div>
                                )}
                            </motion.div>
                        )
                    )}
                </AnimatePresence>
            </motion.div >
        </AnimatePresence >
    );
};
