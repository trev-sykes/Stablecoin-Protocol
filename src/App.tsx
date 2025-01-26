import Navigation from "./components/navigation/Navigation";
import './App.css';
import { useSignIn } from './hooks/web3/useSignIn';
import { useRenderMouseStalker } from "./hooks/display/useMouseStalker";
import { useProtocolRead } from './hooks/protocol/useProtocolRead';
import { ProtocolStats } from './components/protocolStats/ProtocolStats';
import { useState } from 'react';
import { UserStats } from './components/userStats/UserStats';
import { DepositForm } from './components/depositForm/DepositForm';
import { useForm } from './hooks/useForm';
import { MintForm } from './components/mintForm/MintForm';
import { useProtocolWrite } from './hooks/protocol/useProtocolWrite';
import { useTransaction } from './hooks/useTransaction';
import { useAlert } from './hooks/useAlert';
import { CustomAlert } from './utils/customAlert/CustomAlert';
import { ArrowDown } from 'lucide-react';
import Home from './components/home/Home';
import SignInNotice from './components/signInNotice/SignInNotice';

function App() {
  useRenderMouseStalker();
  const { userDeposits, userDepositValue, userMintedDollars, userHealthFactor, userDebtSharePercentage, isSignInLoadingState, refreshOrConnectUserData, userMaxMintableAmount, chainId, signer } = useSignIn();
  const { bitcoinPrice, sBtcDeposits, liquidity, debt, protocolHealthFactor, isLoadingProtocolState, refreshProtocolState } = useProtocolRead();
  const { formInputs, handleInputChange } = useForm({ deposit: '', mint: '' });
  const { handleDeposit, handleWithdraw, handleMinting } = useProtocolWrite();
  const { handleTransaction } = useTransaction();
  const { alertStatus, showAlert } = useAlert();
  const [active, setActive] = useState('home');
  const deposit = async () => {
    const amount = formInputs.deposit;
    if (!amount || parseFloat(amount) < 1) {
      showAlert('error', 'Please enter a valid amount (minimum 1 sBTC)');
      return;
    }
    await handleTransaction(handleDeposit, amount, 'deposit', showAlert, refreshProtocolState, refreshOrConnectUserData);
  };
  const withdraw = async () => {
    const amount = formInputs.withdraw;
    if (!amount || parseFloat(amount) < 1) {
      showAlert('error', 'Please enter a valid amount (minimum 1 sBTC');
      return;
    }
    await handleTransaction(handleWithdraw, amount, 'withdraw', showAlert, refreshProtocolState, refreshOrConnectUserData);
  }
  const mint = async () => {
    const amount = formInputs.mint;
    if (!amount || parseFloat(amount) < 1) {
      showAlert('error', 'Please enter a valid amount (minimum 1 sBTC)');
      return;
    }
    await handleTransaction(handleMinting, amount, 'mint', showAlert, refreshProtocolState, refreshOrConnectUserData);
  };
  const burn = async () => { }


  return (
    <div className="container">
      {alertStatus.isVisible && (
        <CustomAlert
          type={alertStatus.type}
          message={alertStatus.message}
          onClose={() => showAlert(null, '')}
        />
      )}
      <div className="navigation">
        <Navigation
          refreshOrConnectUserData={refreshOrConnectUserData}
          signer={signer}
          active={active}
          setActive={setActive}
          chainId={chainId}
        />
      </div>
      <div className="dashboard">
        {active == 'home' ? (
          <>
            <Home />
            {/* <Home /> */}
          </>
        ) :
          active == 'portfolio' ? (
            <>
              {/* User Info */}
              {!isSignInLoadingState ? (
                <UserStats {...{ userDeposits, userDepositValue, userMintedDollars, userDebtSharePercentage, userHealthFactor, signer }} />
              ) : (
                <div className="signInContainer">
                  <SignInNotice />
                  <ArrowDown className='arrow' />
                </div>
              )}
            </>
          ) : active == 'protocol' ? (
            <>
              {!isLoadingProtocolState && (
                <div className="protocolGridContainer">
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
            </>
          ) : active == 'collateral' ? (
            <>
              <DepositForm
                deposit={deposit}
                withdraw={withdraw}
                formInputs={formInputs}
                handleInputChange={handleInputChange}
                userDeposits={userDeposits}
              />
            </>
          ) : active == 'borrowing' ? (
            <>
              <MintForm
                bitcoinPrice={bitcoinPrice}
                mint={mint}
                burn={burn}
                formInputs={formInputs}
                handleInputChange={handleInputChange}
                balance={userMintedDollars}
                maxMintableAmount={userMaxMintableAmount}
              />
            </>
          ) : (
            <>
            </>
          )}
      </div>
    </div>
  );
}

export default App;
