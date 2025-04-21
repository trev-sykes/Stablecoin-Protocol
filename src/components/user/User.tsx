import { AnimatePresence, motion } from "framer-motion";
import styles from "./User.module.css";
import { PositionBar } from "../positionBar/PositionBar";
import { UserBento } from "../userBento/UserBento";
import HealthGauge from "../healthGauge/HealthGauge";
import { X } from "lucide-react";

interface UserProps {
    userState: any;
    userAddress: any;
    onClose?: any;
}
export const User: React.FC<UserProps> = ({ userState, userAddress, onClose }) => {
    return (
        <div className={styles.container}>
            {onClose && (
                <X className={`icon ${styles.x}`} onClick={onClose} />
            )}
            <AnimatePresence mode="wait">
                {userState ? (
                    <motion.div
                        key="dashboard"
                        className={styles.dashboard}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.topSection}>
                            <div className={styles.barWrapper}>
                                <PositionBar
                                    user={userState}
                                    userAddress={userAddress}
                                />
                            </div>
                            <div className={styles.gaugeWrapper}>
                                <HealthGauge healthFactor={userState.healthFactor} />
                            </div>
                        </div>
                        <div className={styles.bentoWrapper}>
                            <UserBento userState={userState} />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="skeleton"
                        className={styles.dashboard}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1>Please Sign In</h1>
                        <div className={styles.topSection}>
                            <div className={styles.barWrapper}>
                                <div className={styles.skeletonBox}></div>
                            </div>
                            <div className={styles.gaugeWrapper}>
                                <div className={styles.skeletonBox}></div>
                            </div>
                        </div>
                        <motion.div className={styles.bentoWrapper}>
                            <div className={styles.skeletonBox}></div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

    )
}