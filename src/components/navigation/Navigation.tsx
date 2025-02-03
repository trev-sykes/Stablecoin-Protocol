import { useEffect, useState } from "react";
import { House, Bitcoin, User, Plus, Flame } from "lucide-react";
import { useAlert } from '../../hooks/useAlert';;
import { CustomAlert } from '../../utils/customAlert/CustomAlert';
import styles from "./Navigation.module.css";
import img from "../../assets/satoshi.png";
import BitcoinDollarSymbol from "../bitcoinDollarSymbol/BitcoinDollarSymbol";

interface NavigationProps {
    refreshOrConnectUserData: any;
    signer?: any;
    active: any;
    setActive: any;
    chainId: any;
}

const Navigation: React.FC<NavigationProps> = ({
    refreshOrConnectUserData,
    signer,
    active,
    setActive
}) => {
    const [width, setWidth] = useState<number>(window.innerWidth);
    const { alertStatus, showAlert } = useAlert();
    const [connectionStatus, setConnectionStatus] = useState({
        hasInternetConnection: false,
        hasWalletConnection: false,
    });

    useEffect(() => {
        const handleWidth = () => {
            setWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleWidth);

        return () => {
            window.removeEventListener('resize', handleWidth);
        }

    }, [width])
    const checkInternet = () => {
        return navigator.onLine;
    };

    const handleClick = async () => {
        const success = await refreshOrConnectUserData();

        if (success) {
            setConnectionStatus((prev) => ({
                ...prev,
                hasWalletConnection: true,
            }));
        } else {
            showAlert("error", "No wallet found or sign-in was canceled. Try downloading MetaMask.");
        }

        console.log("Connection Status:", connectionStatus);  // Check state update
    };



    const updateActive = (newState: string) => {
        if (newState !== active) {
            setActive(newState);
        }
    };

    useEffect(() => {
        const response = checkInternet();
        if (!response) {
            setConnectionStatus((prev) => ({
                ...prev,
                hasInternetConnection: false,
            }));
            return;
        }
        setConnectionStatus((prev) => ({
            ...prev,
            hasInternetConnection: true,
        }));
    }, []);

    return (
        <div className={styles.container}>
            {alertStatus.isVisible && (
                <CustomAlert
                    type={alertStatus.type}
                    message={alertStatus.message}
                    onClose={() => showAlert(null, '')}
                />
            )}
            <div className={styles.titleContainer}>
                <div className={styles.titleSymbolContainer}>
                    <h2 className={styles.titleItem}>BitcoinDollar</h2>
                    <BitcoinDollarSymbol width={40} />
                </div>
            </div>
            {width > 600 ?
                (<div className={styles.menu}>
                    <button
                        onClick={() => updateActive("home")}
                        className={`${styles.menuItem} ${active === "home" ? styles.active : ""
                            } ${styles.connected}`}
                    >
                        Home
                    </button>
                    <button
                        disabled={!connectionStatus.hasWalletConnection}
                        onClick={() => updateActive("portfolio")}
                        className={`${styles.menuItem} ${!connectionStatus.hasWalletConnection
                            ? styles.noConnection
                            : styles.connected
                            } ${active === "portfolio" ? styles.active : ""}`}
                    >
                        Portfolio Summary
                    </button>
                    <button
                        disabled={!connectionStatus.hasInternetConnection}
                        onClick={() => updateActive("protocol")}
                        className={`${styles.menuItem} ${!connectionStatus.hasInternetConnection
                            ? styles.noConnection
                            : styles.connected
                            } ${active === "protocol" ? styles.active : ""}`}
                    >
                        Protocol Summary
                    </button>
                    <button
                        disabled={!connectionStatus.hasWalletConnection}
                        onClick={() => updateActive("collateral")}
                        className={`${styles.menuItem} ${!connectionStatus.hasWalletConnection
                            ? styles.noConnection
                            : styles.connected
                            } ${active === "collateral" ? styles.active : ""}`}
                    >
                        Collateral Management
                    </button>
                    <button
                        disabled={!connectionStatus.hasWalletConnection}
                        onClick={() => updateActive("borrowing")}
                        className={`${styles.menuItem} ${!connectionStatus.hasWalletConnection
                            ? styles.noConnection
                            : styles.connected
                            } ${active === "borrowing" ? styles.active : ""}`}
                    >
                        Borrowing Management
                    </button>
                </div>)
                : (
                    <div className={styles.menu}>
                        <House
                            onClick={() => updateActive('home')}
                            className={`${styles.menuItem} ${active == 'home' ? styles.active : ''} ${styles.connected}`}
                        />
                        <User
                            aria-disabled={!connectionStatus.hasWalletConnection}
                            onClick={() => updateActive("portfolio")}
                            className={`${styles.menuItem} ${!connectionStatus.hasWalletConnection
                                ? styles.noConnection
                                : styles.connected
                                } ${active === "portfolio" ? styles.active : ""}`}
                        />
                        <Bitcoin
                            aria-disabled={!connectionStatus.hasInternetConnection}
                            onClick={() => updateActive("protocol")}
                            className={`${styles.menuItem} ${!connectionStatus.hasInternetConnection
                                ? styles.noConnection
                                : styles.connected
                                } ${active === "protocol" ? styles.active : ""}`}
                        />
                        <Plus
                            aira-disabled={!connectionStatus.hasWalletConnection}
                            onClick={() => updateActive("collateral")}
                            className={`${styles.menuItem} ${!connectionStatus.hasWalletConnection
                                ? styles.noConnection
                                : styles.connected
                                } ${active === "collateral" ? styles.active : ""}`}
                        />
                        <Flame
                            aria-disabled={!connectionStatus.hasWalletConnection}
                            onClick={() => updateActive("borrowing")}
                            className={`${styles.menuItem} ${!connectionStatus.hasWalletConnection
                                ? styles.noConnection
                                : styles.connected
                                } ${active === "borrowing" ? styles.active : ""}`}
                        />

                    </div>
                )}
            <div className={styles.connectContainer}>
                {width > 600 ?
                    (
                        <>
                            {connectionStatus.hasWalletConnection ? (
                                < div className={styles.signInContainer}>
                                    <div className={styles.imgContainer}>
                                        <img className={styles.img} src={img} alt="profile" />
                                    </div>
                                    <h5 className={styles.signInAddress} >
                                        <a
                                            href={`https://sepolia.etherscan.io/address/${signer ? signer.address : null}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            0x...{signer.address ? signer.address.slice(signer.address.length - 5) : null}
                                        </a>
                                    </h5>

                                </div>
                            ) : (
                                <div>
                                    <button
                                        className={styles.signInButton}
                                        onClick={handleClick}
                                    >
                                        Sign In
                                    </button>
                                </div>
                            )}
                        </>
                    )
                    :
                    (
                        <>
                            {connectionStatus.hasWalletConnection ? (
                                < div className={styles.signInContainer}>
                                    <div className={styles.imgContainer}>
                                        <a href={`https://sepolia.etherscan.io/address/${signer ? signer.address : null}`}
                                            target="_blank"
                                            rel="noopener noreferrer"><img className={styles.img} src={img} alt="profile" /></a>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <button
                                        className={styles.signInButton}
                                        onClick={handleClick}
                                    >
                                        Sign In
                                    </button>
                                </div>
                            )}
                        </>
                    )
                }
            </div>
        </div >
    );
};

export default Navigation;
