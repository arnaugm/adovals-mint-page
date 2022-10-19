import { useState, useEffect } from 'react';

import STYLES from './App.module.scss';
import TokensInfo from './TokensInfo';
import MintControls from './MintControls';
import PromptMessage from './PromptMessage';
import {
  blockchainConnect,
  getMintedTokens,
  getTotalTokens,
  getTokenPrice,
  getTokenPresalePrice,
  getMaxMintAmount,
  getPresaleMaxMintAmount,
  getInPresale,
} from '../contract-gateway';
import { presaleDate, publicMintDate } from '../config';
import { parseError } from '../error-parser';

const addMaterialIconsLink = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
  document.head.appendChild(link);
};

addMaterialIconsLink();

const App = () => {
  const [connectionReady, setConnectionReady] = useState(false);
  const [contractData, setContractData] = useState();
  const [account, setAccount] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [connectButtonEnabled, setConnectButtonEnabled] = useState(true);

  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        setContractData(null);
        setConnectionReady(false);
        setAccount(null);
      } else {
        setAccount(accounts[0]);
      }
    });
  }

  const connectionSuccess = (selectedAccount) => {
    setAccount(selectedAccount);
    setConnectionReady(true);
  };

  const closeErrorMessage = () => {
    setError(null);
  };

  const closeSuccessMessage = () => {
    setMessage(null);
  };

  const displayErrorMessage = (displayMessage, consoleMessage) => {
    setError(displayMessage);
    console.error(consoleMessage);
  };

  const refreshData = async () => {
    try {
      const mintedTokens = await getMintedTokens();
      const totalTokens = await getTotalTokens();
      const tokenPrice = await getTokenPrice();
      const tokenPresalePrice = await getTokenPresalePrice();
      const maxMintAmount = await getMaxMintAmount();
      const presaleMaxMintAmount = await getPresaleMaxMintAmount();
      const inPresale = await getInPresale();

      setContractData({
        mintedTokens,
        totalTokens,
        tokenPrice,
        tokenPresalePrice,
        maxMintAmount,
        presaleMaxMintAmount,
        inPresale,
      });
    } catch (e) {
      displayErrorMessage(
        `Error communicating with the contract: ${parseError(e)}`,
        e,
      );
    }
  };

  const displaySuccessMessage = (displayMessage) => {
    setMessage(displayMessage);
  };

  useEffect(() => {
    if (connectionReady) {
      refreshData();
    }
  }, [connectionReady]);

  return (
    <div className={STYLES.App}>
      <h1 className={STYLES.title}>Mint your Adovals!</h1>
      <div className={STYLES.dates}>
        <p>Presale: {presaleDate}</p>
        <p>Public mint: {publicMintDate}</p>
      </div>
      {window.ethereum && (
        <p className={STYLES.walletAddress}>Wallet address: {account}</p>
      )}
      <img
        srcSet="https://adovals.com/wp-content/uploads/2022/10/adoval-240w.gif 240w,
                https://adovals.com/wp-content/uploads/2022/10/adoval-480w.gif 480w"
        sizes="(max-width: 580px) 240px,
               480px"
        src="https://adovals.com/wp-content/uploads/2022/10/adoval-480w.gif"
        className={STYLES.adovalImg}
        alt="Adovals"
      />
      {contractData ? (
        <>
          <TokensInfo
            minted={contractData.mintedTokens}
            total={contractData.totalTokens}
            price={
              contractData.inPresale
                ? contractData.tokenPresalePrice
                : contractData.tokenPrice
            }
          />
          <MintControls
            account={account}
            presale={contractData.inPresale}
            maxMintAmount={
              contractData.inPresale
                ? contractData.presaleMaxMintAmount
                : contractData.maxMintAmount
            }
            price={
              contractData.inPresale
                ? contractData.tokenPresalePrice
                : contractData.tokenPrice
            }
            onSuccess={displaySuccessMessage}
            onError={displayErrorMessage}
          />
        </>
      ) : (
        <div>
          <button
            className={STYLES.actionButton}
            disabled={!connectButtonEnabled}
            onClick={async () => {
              try {
                setConnectButtonEnabled(false);
                await blockchainConnect(connectionSuccess);
                setConnectButtonEnabled(true);
              } catch (e) {
                displayErrorMessage(e.message, e.message);
                setConnectButtonEnabled(true);
              }
            }}
          >
            Connect wallet
          </button>
        </div>
      )}

      {message && (
        <PromptMessage
          type="success"
          message={message}
          onClick={closeSuccessMessage}
        />
      )}
      {error && (
        <PromptMessage
          type="error"
          message={error}
          onClick={closeErrorMessage}
        />
      )}
    </div>
  );
};

export default App;
