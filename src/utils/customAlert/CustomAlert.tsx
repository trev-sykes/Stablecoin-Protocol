
import styles from './CustomAlert.module.css';

interface CustomAlertProps {
    type: any;
    message: any;
    onClose: any;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ type, message, onClose }) => {

    return (
        <div className={`${styles.container} ${type == 'success' ? styles.success : type == 'error' ? styles.error : type == 'pending' ? styles.pending : type == null ? styles.none : styles.unknown}`} >
            <span>{message}</span>
            <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
    );
};