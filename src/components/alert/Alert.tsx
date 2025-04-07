import useAlertStore from "../../store/useAlertStore";
import styles from './Alert.module.css';
import { X } from "lucide-react";

/**
 * Displays an alert message based on the state from the alert store.
 */
export const Alert: React.FC = () => {
    /**
     * Maps alert types to corresponding CSS classes.
     */
    const typeClasses: any = {
        success: styles.success,
        pending: styles.pending,
        failure: styles.failure,
        unknown: styles.unknown
    };

    /**
     * Extracts the alert's message, type, visibility, and the function to hide the alert from the store.
     */
    const { message, type, isVisible, hideAlert } = useAlertStore();

    return (
        <>
            {isVisible && (
                <div className={styles.container}>
                    <div className={styles.overlayBackground} />
                    <div className={styles.alertContent}>
                        <X className={styles.minimize} onClick={hideAlert} />
                        <div className={`${styles.messageType} ${type && typeClasses[type] || styles.unknown}`}>{type}</div>
                        <div className={styles.messageContent}>{message}</div>
                    </div>
                </div>
            )}
        </>
    );
};
