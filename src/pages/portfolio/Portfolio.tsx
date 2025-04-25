
import useWeb3Store from "../../store/useWeb3Store";
import { User } from "../../components/user/User";


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
    const { userState, signerAddress, transactionSigner } = useWeb3Store();
    return (
        <User
            userState={userState && userState}
            userAddress={signerAddress}
            transactionSigner={transactionSigner}
        />
    );
};