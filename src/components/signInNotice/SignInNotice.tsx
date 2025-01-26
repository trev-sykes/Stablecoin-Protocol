import { WalletCards, Lock, ArrowRight } from 'lucide-react';
import styles from './SignInNotice.module.css';

const SignInNotice: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <WalletCards className={styles.icon} />
                </div>

                <h2 className={styles.title}>Connect Your Wallet</h2>

                <p className={styles.description}>
                    Sign in with your Web3 wallet to access the Bitcoin Dollar Protocol
                </p>

                <div className={styles.features}>
                    <div className={styles.featureItem}>
                        <Lock size={20} />
                        <span>Manage your collateral</span>
                    </div>
                    <div className={styles.featureItem}>
                        <Lock size={20} />
                        <span>Mint Bitcoin Dollars</span>
                    </div>
                    <div className={styles.featureItem}>
                        <Lock size={20} />
                        <span>Track your positions</span>
                    </div>
                </div>
                <p className={styles.supportedWallets}>
                    Supported wallets: MetaMask
                </p>
            </div>
        </div>
    );
};
export default SignInNotice;