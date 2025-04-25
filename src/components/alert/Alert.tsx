import { AnimatePresence, motion } from "framer-motion";
import useAlertStore from "../../store/useAlertStore";
import styles from "./Alert.module.css";
import { X, Loader2, CheckCircle, XCircle, HelpCircle } from "lucide-react";

/**
 * Displays an animated alert message based on the alert store state.
 */
export const Alert: React.FC = () => {
    const typeClasses: Record<string, string> = {
        started: styles.started,
        success: styles.success,
        pending: styles.pending,
        failure: styles.failure,
        error: styles.error,
        warning: styles.warning,
        unknown: styles.unknown,
    };

    const { message, type, isVisible, hideAlert } = useAlertStore();

    const renderIcon = () => {
        const baseClass = styles.iconAnimation;
        switch (type) {
            case "started":
                return <Loader2 className={`${baseClass} ${styles.spinner}`} />;
            case "success":
                return <CheckCircle className={`${baseClass} ${styles.pulse}`} />;
            case "failure":
            case "error":
                return <XCircle className={`${baseClass} ${styles.shake}`} />;
            case "warning":
                return <XCircle className={`${baseClass} ${styles.swing}`} />;
            case "pending":
                return <Loader2 className={`${baseClass} ${styles.spinner}`} />;
            case "unknown":
                return <HelpCircle className={`${baseClass} ${styles.bounce}`} />;
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className={styles.container}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className={styles.overlayBackground} />
                    <div className={styles.alertContent}>
                        <X className={styles.minimize} onClick={hideAlert} />
                        <div
                            className={`${styles.messageType} ${type && typeClasses[type] ? typeClasses[type] : styles.unknown}`}
                        >
                            {renderIcon()}
                            {type}
                        </div>
                        <div className={styles.messageContent}>{message}</div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
