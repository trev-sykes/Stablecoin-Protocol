import { useEffect, useState } from "react";
import { House, Bitcoin, User, Plus, Flame, LogIn } from "lucide-react";
import { useAlert } from '../../hooks/useAlert';;
import { CustomAlert } from '../../utils/customAlert/CustomAlert';
import { Tooltip } from "../tooltip/Tooltip";
import styles from "./Navigation.module.css";
import bitcoinDollarEngineAddress from "../../contracts/bitcoinDollar/bitcoinDollarAddress";
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
        if (!connectionStatus.hasWalletConnection && newState != 'protocol' && newState != 'home' || !connectionStatus.hasInternetConnection)
            return;
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
                <a
                    className={styles.link}
                    href={`${`https://sepolia.etherscan.io/token/${bitcoinDollarEngineAddress}`}`}
                    target='_blank'
                >
                    {width > 900 && <BitcoinDollarSymbol width={50} />}
                    {width < 900 && <BitcoinDollarSymbol width={30} />}
                </a>
            </div>
            <div className={styles.menu}>
                <Tooltip context={"Home"} >
                    <House
                        onClick={() => updateActive('home')}
                        className={`${styles.menuItem}  ${active == 'home' ? styles.active : ''} ${styles.connected}`}
                    />
                </Tooltip>
                <Tooltip context={"User Account"} >
                    <User
                        aria-disabled={!connectionStatus.hasWalletConnection}
                        onClick={() => updateActive("portfolio")}
                        className={`${styles.menuItem} ${!connectionStatus.hasWalletConnection
                            ? styles.noConnection
                            : styles.connected
                            } ${active === "portfolio" ? styles.active : ""}`}
                    />
                </Tooltip>
                <Tooltip context={"Protocol Information"} >
                    <Bitcoin
                        onClick={() => updateActive("protocol")}
                        className={`${styles.menuItem} ${!connectionStatus.hasInternetConnection
                            ? styles.noConnection
                            : styles.connected
                            } ${active === "protocol" ? styles.active : ""}`}
                    />
                </Tooltip>
                <Tooltip context={"Collateral & Deposits"}>
                    <Plus
                        onClick={() => updateActive("collateral")}
                        className={`${styles.menuItem} ${!connectionStatus.hasWalletConnection
                            ? styles.noConnection
                            : styles.connected
                            } ${active === "collateral" ? styles.active : ""}`}
                    />
                </Tooltip>
                <Tooltip context={"Minting & Burning"}>
                    <Flame
                        onClick={() => updateActive("borrowing")}
                        className={`${styles.menuItem} ${!connectionStatus.hasWalletConnection
                            ? styles.noConnection
                            : styles.connected
                            } ${active === "borrowing" ? styles.active : ""}`}
                    />
                </Tooltip>
            </div>
            <div className={styles.connectContainer}>
                {connectionStatus.hasWalletConnection && (
                    <Tooltip context={`0x...${signer && signer.address && signer.address.toString().slice(signer.address.length - 5, signer.address.length)}`}>
                        <a href={`https://sepolia.etherscan.io/address/${signer ? signer.address : null}`}
                            target="_blank"
                            rel="noopener noreferrer">0x
                        </a>
                    </Tooltip>
                )}
                {!connectionStatus.hasWalletConnection && (
                    <Tooltip context={'Log In'}>
                        <LogIn
                            onClick={handleClick}
                        />
                    </Tooltip>
                )}
            </div>
        </div >
    );
};

export default Navigation;
