import styles from "./PopupCalculate.module.css";

interface PopupCalculateProps {
    bitcoinPrice: any;
    amount: any;
}

export const PopupCalculate: React.FC<PopupCalculateProps> = ({ bitcoinPrice, amount }) => {
    // Utility function to calculate the total price
    const calculatePrice = (price: any, amount: any) => {
        let numberPrice = typeof price === 'string' ? parseFloat(price.replace(/,/g, '')) : price;
        let numberAmount = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;

        if (numberAmount < 1) {
            numberAmount = 1;  // Ensure a minimum of 1 for the amount
        }
        return numberPrice * numberAmount;
    };

    return (
        <div className={styles.container}>
            <h1>
                Cost: ${calculatePrice(bitcoinPrice, amount).toLocaleString()}
            </h1>
        </div>
    );
};
