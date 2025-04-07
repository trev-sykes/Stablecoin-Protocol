import { useState } from "react";
import ConditionalLink from "../conditionalLink/ConditionalLink";
import { House, Bitcoin, User, Plus, Flame, LogIn, Droplet } from "lucide-react";
import useWalletStore from "../../store/useWalletStore";
import useWeb3Store from "../../store/useWeb3Store";
import useInternetConnectionStore from "../../store/useInternetConnectionStore";
import WalletSelector from "../walletSelector/WalletSelector";
import { bitcoinDollar } from "../../contracts/bitcoinDollar/index";
import BitcoinDollarSymbol from "../bitcoinDollarSymbol/BitcoinDollarSymbol";
import styles from "./Navigation.module.css";
import { WalletInfo } from "./WalletInfo";
import { useWindowWidth } from "../../hooks/useWindowWidth";

/**
 * Navigation bar for app routing and wallet connection
 */
export const Navigation: React.FC = () => {
    const { transactionSigner } = useWeb3Store();
    const { detectWallets, setWalletAndSigner } = useWalletStore();
    const { isOnline } = useInternetConnectionStore();
    const windowWidth = useWindowWidth();
    const [isWalletSelectorOpen, setIsWalletSelectorOpen] = useState<boolean>(false);
    // Handle wallet selection
    const handleWalletSelect = async (walletName: string) => {
        try {
            await detectWallets();
            setWalletAndSigner(walletName);
            setIsWalletSelectorOpen(false);
        } catch (error: any) {
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <a
                    href={`${`https://sepolia.etherscan.io/token/${bitcoinDollar.address}`}`}
                    target='_blank'
                >
                    {windowWidth > 900 ? <BitcoinDollarSymbol width={40} /> : <BitcoinDollarSymbol width={30} />}
                </a>
            </div>
            <div className={styles.menu}>
                <ConditionalLink
                    to={"/"}
                    children={
                        <House className={`${styles.menuItem}`} />
                    }
                    disabled={!isOnline}
                />
                <ConditionalLink
                    to={"/portfolio"}
                    children={
                        <User className={styles.menuItem} />
                    }
                    disabled={!isOnline}
                />
                <ConditionalLink
                    to={"/protocol"}
                    children={
                        <Bitcoin className={`${styles.menuItem}`} />
                    }
                    disabled={!isOnline}
                />
                <ConditionalLink
                    to={"/collateral"}
                    children={
                        <Plus className={`${styles.menuItem}`} />
                    }
                    disabled={!isOnline}
                />
                <ConditionalLink
                    to={"/borrowing"}
                    children={
                        <Flame className={`${styles.menuItem}`} />
                    }
                    disabled={!isOnline}
                />
                <ConditionalLink
                    to={"/liquidations"}
                    children={
                        <Droplet className={`${styles.menuItem}`} />
                    }
                    disabled={!isOnline}
                />
            </div>
            <div className={styles.connectContainer}>
                {!transactionSigner ? (
                    <div className={`${styles.connectButton} ${!isOnline ? "disabled" : ""}`} onClick={() => setIsWalletSelectorOpen(true)}>
                        <LogIn size={windowWidth > 900 ? 30 : 25} />
                    </div>
                ) : (
                    <WalletInfo
                    />
                )}
                <WalletSelector
                    isOpen={isWalletSelectorOpen}
                    onClose={() => setIsWalletSelectorOpen(false)}
                    onSelectWallet={handleWalletSelect}
                />
            </div>
        </div>
    );
};