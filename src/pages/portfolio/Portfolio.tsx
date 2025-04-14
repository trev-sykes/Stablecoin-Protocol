
import styles from "./Portfolio.module.css";
import useWeb3Store from "../../store/useWeb3Store";
import { Hero } from "../../components/hero/Hero";
import { SignInNotification } from "../../components/signInNotification/SignInNotification";
import { UserCard } from "../../components/userCard/UserCard";

/**
 * Portfolio Component
 *
 * Displays the user's protocol-related portfolio:
 * - sBTC collateral
 * - Collateral USD value
 * - BTCd minted
 * - Debt percentage
 */
export const Portfolio: React.FC = () => {
    const { transactionSigner, userState } = useWeb3Store();
    return (
        <div className={styles.container}>

            <Hero>
                <h1 className="title">Portfolio</h1>
                {!transactionSigner && !userState && <SignInNotification />}
            </Hero>
            {userState &&
                <UserCard

                    user={userState}
                />
            }
        </div>
    );
};