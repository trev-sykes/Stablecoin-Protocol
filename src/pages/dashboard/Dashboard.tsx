import { useTransaction } from '../../hooks/useTransaction';
import { useProtocolRead } from '../../hooks/protocol/useProtocolRead';
import { useProtocolWrite } from '../../hooks/protocol/useProtocolWrite';
import { useSignIn } from '../../hooks/web3/useSignIn';
import { useForm } from '../../hooks/useForm';
import { useAlert } from '../../hooks/useAlert';
import { ProtocolStats } from '../../components/protocolStats/ProtocolStats';
import { UserStats } from '../../components/userStats/UserStats';
import { DepositForm } from '../../components/depositForm/DepositForm';
import { CustomAlert } from '../../utils/customAlert/CustomAlert';
import { MintForm } from '../../components/mintForm/MintForm';
import styles from './Dashboard.module.css';

interface DashboardProps {
    userDeposits: any; userDepositValue: any; userMintedDollars: any; userHealthFactor: any; userDebtSharePercentage: any; isSignInLoadingState: any; refreshOrConnectUserData?: any; signer: any;
}
const Dashboard: React.FC<DashboardProps> = ({ userDeposits, userDepositValue, userMintedDollars, userHealthFactor, userDebtSharePercentage, isSignInLoadingState, refreshOrConnectUserData, signer }) => {
    const { handleDeposit, handleMinting } = useProtocolWrite();
    const { handleTransaction } = useTransaction();
    const { formInputs, handleInputChange } = useForm({ deposit: '', mint: '' });


    const deposit = async () => {
        const amount = formInputs.deposit;
        if (!amount || parseFloat(amount) < 1) {
            showAlert('error', 'Please enter a valid amount (minimum 1 sBTC)');
            return;
        }
        await handleTransaction(handleDeposit, amount, 'deposit', showAlert, refreshProtocolState, refreshOrConnectUserData);
    };


    if (isLoadingProtocolState) {
        return <div className={styles.loading}>Loading protocol information...</div>;
    }

    return (
        <div className={styles.container}>
            {/* Custom Alert Component */}

            {/* Protocol Info */}
            {!isLoadingProtocolState && (
                <div className={styles.protocolGridContainer}>
                    <ProtocolStats
                        bitcoinPrice={bitcoinPrice}
                        sBtcDeposits={sBtcDeposits}
                        liquidity={liquidity}
                        debt={debt}
                        protocolHealthFactor={protocolHealthFactor}
                        isLoadingProtocolState={isLoadingProtocolState}
                    />
                </div>

            )}

            <section className={styles.formSection}>
                {/* Deposit form */}
                <DepositForm bitcoinPrice={bitcoinPrice} deposit={deposit} formInputs={formInputs} handleInputChange={handleInputChange} />

                {/* Mint form */}
                <MintForm bitcoinPrice={bitcoinPrice} mint={mint} formInputs={formInputs} handleInputChange={handleInputChange} />
            </section>
        </div >

    );
};

export default Dashboard;
