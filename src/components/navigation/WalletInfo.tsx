import styles from "./Navigation.module.css";
import Blockies from "react-blockies";
import { LogOut } from "lucide-react";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import useWalletStore from "../../store/useWalletStore";
import useWeb3Store from "../../store/useWeb3Store";

/**
 * Displays connected wallet information (address + identicon)
 * and provides a disconnect button
 */
export const WalletInfo: React.FC = () => {
    const { clearWalletAndDisconnect } = useWalletStore();
    const { signerAddress } = useWeb3Store();
    const windowWidth = useWindowWidth();

    return (
        <div className={styles.walletInfoContainer}>
            <div className={styles.walletInfo}>
                <Blockies className={styles.blockies} seed={signerAddress || ''} size={7} scale={3} />
                <span className={styles.address}>
                    {`0x${signerAddress.substring(signerAddress.length - 4)}`}
                </span>
            </div>
            <LogOut
                onClick={clearWalletAndDisconnect}
                size={windowWidth > 900 ? 30 : 25}
            />
        </div>
    );
};
