import { useState, useEffect } from 'react';

export function useAlert() {
    const [alertStatus, setAlertStatus] = useState({
        type: null,
        message: '',
        isVisible: false
    });

    useEffect(() => {
        if (alertStatus.isVisible) {
            const timer = setTimeout(() => {
                setAlertStatus(prev => ({ ...prev, isVisible: false }))
            }, 15000);
            return () => clearTimeout(timer);
        }
    }, [alertStatus.isVisible]);

    const showAlert = (type: any, message: any) => {
        setAlertStatus({
            type,
            message,
            isVisible: true
        });
    };

    return { alertStatus, showAlert };
}
