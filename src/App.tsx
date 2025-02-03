import { useState } from 'react';
import Navigation from "./components/navigation/Navigation";
import './App.css';
import { useSignIn } from './hooks/web3/useSignIn';
import { useRenderMouseStalker } from "./hooks/display/useMouseStalker";
import { useProtocolRead } from './hooks/protocol/useProtocolRead';
import { ProtocolStats } from './components/protocolStats/ProtocolStats';
import { useForm } from './hooks/useForm';
import { UserStats } from './components/userStats/UserStats';
import { DepositForm } from './components/depositForm/DepositForm';
import { MintForm } from './components/mintForm/MintForm';
import { useProtocolWrite } from './hooks/protocol/useProtocolWrite';
import { useTransaction } from './hooks/useTransaction';
import { useAlert } from './hooks/useAlert';
import { CustomAlert } from './utils/customAlert/CustomAlert';
import { ArrowDown } from 'lucide-react';
import Home from './components/home/Home';
import SignInNotice from './components/signInNotice/SignInNotice';
import { useWindowWidth } from './hooks/windowWIdth/useWindowWIth';

function App() {
  // Track screen width using the custom hook
  const windowWidth = useWindowWidth();

  useRenderMouseStalker();
  const { isSignInLoadingState, refreshOrConnectUserData, chainId, ...userState } = useSignIn();
  const { refreshProtocolState, isLoadingProtocolState, ...protocolState } = useProtocolRead();
  const { formInputs, handleInputChange } = useForm({ deposit: '', mint: '' });
  const { handleDeposit, handleWithdraw, handleMinting, handleBurning } = useProtocolWrite();
  const { handleTransaction } = useTransaction();
  const { alertStatus, showAlert } = useAlert();
  const [active, setActive] = useState('home');
  // Must keep the functions in app to update state properly. Or use useContext 
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
  }; 333

  const mint = async () => {
    const amount = formInputs.mint;
    if (!amount || parseFloat(amount) < 1) {
      showAlert('error', 'Please enter a valid amount (minimum 1 sBTC)');
      return;
    }
    await handleTransaction(handleMinting, amount, 'mint', showAlert, refreshProtocolState, refreshOrConnectUserData);
  };

  const burn = async () => {
    const amount = formInputs.burn;
    if (!amount || parseFloat(amount) < 1) {
      showAlert('error', 'Please enter a valid amount (minimum 1 sBTC)');
      return;
    }
    await handleTransaction(handleBurning, amount, 'burn', showAlert, refreshProtocolState, refreshOrConnectUserData);
  };

  return (
    <>
      {windowWidth > 200 ? (
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
              signer={userState.signer}
              active={active}
              setActive={setActive}
              chainId={chainId}
            />
          </div>
          <div className="dashboard">
            {active === 'home' && <Home />}

            {active === 'portfolio' && (
              !isSignInLoadingState ? (
                <UserStats
                  {...userState}
                />
              ) : (
                <div className="signInContainer">
                  <SignInNotice />
                  <ArrowDown className='arrow' />
                </div>
              )
            )}

            {active === 'protocol' && (
              !isLoadingProtocolState && (
                <div className="protocolGridContainer">
                  <ProtocolStats
                    bitcoinPrice={protocolState.bitcoinPrice}
                    sBtcDeposits={protocolState.sBtcDeposits}
                    liquidity={protocolState.liquidity}
                    debt={protocolState.debt}
                    protocolHealthFactor={protocolState.protocolHealthFactor}
                    isLoadingProtocolState={isLoadingProtocolState}
                  />
                </div>
              )
            )}

            {active === 'collateral' && (
              <DepositForm
                deposit={deposit}
                withdraw={withdraw}
                formInputs={formInputs}
                handleInputChange={handleInputChange}
                userDeposits={userState.userDeposits}
              />
            )}

            {active === 'borrowing' && (
              <MintForm
                bitcoinPrice={protocolState.bitcoinPrice}
                mint={mint}
                burn={burn}
                formInputs={formInputs}
                handleInputChange={handleInputChange}
                balance={userState.userMintedDollars}
                maxMintableAmount={userState.userMaxMintableAmount}
              />
            )}
          </div>
        </div>
      ) : (
        <div className='errorContainer'>
          <h1>This site is Desktop only</h1>
        </div>
      )}
    </>
  );
}

export default App;
