import { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useInternetConnectionStore from './store/useInternetConnectionStore';
import { Navigation } from "./components/navigation/Navigation";
import { Home } from './pages/home/Home';
import { Portfolio } from './pages/portfolio/Portfolio';
import { Protocol } from './pages/protocol/Protocol';
import { Collateral } from './pages/collateral/Collateral';
import { Mint } from './pages/mint/Mint';
import { Liquidation } from './pages/liquidation/Liquidation';
import { useWindowWidth } from './hooks/useWindowWidth';
import { Alert } from './components/alert/Alert';
import { CircleLoader } from 'react-spinners';
import TestnetNotice from './components/testnetNotice/TestnetNotice';
import useWeb3Store from './store/useWeb3Store';

/**
 * The main App component that handles routing, internet connection status,
 * and responsive layout based on the window width.
 * 
 * Uses hooks to determine the user's internet connection and the window width 
 * for responsive design.
 * 
 * @returns JSX.Element The main App component JSX with routes, alerts, and dashboard content.
 */
function App() {

  const windowWidth = useWindowWidth();
  const {
    isOnline,
    checkInternetConnection
  } = useInternetConnectionStore();

  const {
    readContract,
    initializeProvider,
    jsonRpcProvider,
    fetchUsersFromEvents
  } = useWeb3Store();
  /**
 * useEffect hook to check internet connection status on mount and 
 * whenever the connection status changes.
 * 
 * Logs the user's current connection status to the console.
 */
  useEffect(() => {
    checkInternetConnection();
    console.log(`You Are ${isOnline ? 'Online' : 'Offline'}`)
  }, [isOnline]);
  useEffect(() => {
    if (!jsonRpcProvider) {
      initializeProvider();
      console.log("Provider initialized");
    }
  }, [])
  useEffect(() => {
    if (readContract) {
      fetchUsersFromEvents();
    }
  }, [initializeProvider, readContract]);

  return (
    <Router>
      {/* 
       * Conditionally renders the application based on the window width.
       * If the window width is greater than 900px, it renders the desktop layout.
       * If not, it shows an error message that the site is desktop-only.
       */}
      {windowWidth > 900 ? (
        <div className="container">
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
                <Route path="/collateral" element={<Collateral />} />
                <Route path="/borrowing" element={<Mint />} />
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
        </div>
      )}
    </Router>
  );
}

export default App;