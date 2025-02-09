import styles from './Tooltip.module.css';
import { useState } from 'react';

interface TooltipProps {
    children: any;
    context: any;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, context }) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const handleOnMouseEnter = () => {
        setIsVisible(true);
    };
    const handleOnMouseLeave = () => setIsVisible(false);

    return (
        <div
            className={styles.tooltipContainer}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
        >
            {children}
            <div
                className={`${styles.context} ${isVisible ? styles.visible : ''}`}>
                {context}
            </div>
        </div>
    );
}
