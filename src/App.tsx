import { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useInternetConnectionStore from './store/useInternetConnectionStore';
import { Navigation } from "./components/navigation/Navigation";
import { Home } from './pages/home/Home';
import { Portfolio } from './pages/portfolio/Portfolio';
import { Protocol } from './pages/protocol/Protocol';
import { Liquidation } from './pages/liquidation/Liquidation';
import { useWindowWidth } from './hooks/useWindowWidth';
import { Alert } from './components/alert/Alert';
import { CircleLoader, PacmanLoader } from 'react-spinners';
import TestnetNotice from './components/testnetNotice/TestnetNotice';
import useWeb3Store from './store/useWeb3Store';
import { useProtocol } from './hooks/useProtocol';
import useAlertStore from './store/useAlertStore';
import useCoinGeckoStore from './store/useCoinGeckoStore';
import ScrollToTop from './components/scrollToTop/ScrollToTop';
import { Position } from './pages/position/Position';

/**
 * The main App component that handles routing, internet connection status,
 * and responsive layout based on the window width.
 * 
 * Uses hooks to determine the user's internet connection and the window width 
 * for responsive design.
 * 
 */
function App() {

  const {
    isOnline,
    checkInternetConnection
  } = useInternetConnectionStore();

  const {
    transactionSigner,
    initializeProvider,
    jsonRpcProvider,
    readContract,
    fetchUsersFromEvents
  } = useWeb3Store();

  const { prices, fetchPrices } = useCoinGeckoStore();
  const { showAlert } = useAlertStore();

  const { handleCanLiquidate } = useProtocol();
  const windowWidth = useWindowWidth();

  /**
  * Check internet connection
  */
  useEffect(() => {
    checkInternetConnection();
    console.log(`You Are ${isOnline ? 'Online' : 'Offline'}`)
  }, [isOnline]);

  /**
   * Initialize provider
   */
  useEffect(() => {
    if (readContract) return;
    const handleInit = async () => {
      if (!jsonRpcProvider) {
        await initializeProvider();
        console.log("Provider initialized");
      }
    }
    handleInit();
  }, []);


  /**
   * Alert user if they risk liqudiation 
   */
  useEffect(() => {
    if (!transactionSigner) return;
    const checkLiquidationStatus = async () => {
      try {
        const canLiquidate = await handleCanLiquidate(transactionSigner.address); // Check if user can be liquidated
        if (canLiquidate) {
          showAlert('‼️ Health Below Threshold! You Risk Liquidation! ‼️', 'warning');
        }
      } catch (err: any) {
        console.error(err.message);
      }
    }
    checkLiquidationStatus();
  }, [transactionSigner]);

  /**
   * Fetch prices wBTC/USD from coingecko
   */
  useEffect(() => {
    if (!prices) {
      fetchPrices();
    }
  }, [fetchPrices, prices]);

  useEffect(() => {
    if (!readContract) return;
    fetchUsersFromEvents();
  }, [readContract]);
  return (
    <Router>
      {/* 
       * Conditionally renders the application based on the window width.
       * If the window width is greater than 900px, it renders the desktop layout.
       * If not, it shows an error message that the site is desktop-only.
       */}
      {windowWidth > 900 ? (
        <div className="container">
          <ScrollToTop />
          <Alert />
          <div className="navigation">
            <Navigation />
          </div>
          <div className="dashboard">
            {isOnline ? (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/protocol" element={<Protocol />} />
                <Route path="/position" element={<Position />} />
                <Route path="/liquidation" element={<Liquidation />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            ) : (
              <div className='errorContainer'>
                <h1>No Internet Connection</h1>
                <CircleLoader />
              </div>
            )
            }
            <TestnetNotice />
          </div>
        </div>
      ) : (
        <div className='errorContainer'>
          <h1>This site is Desktop only</h1>
          <PacmanLoader />
        </div>
      )}
    </Router>
  );
}

export default App;