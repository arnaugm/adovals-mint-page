import { useState, useEffect } from 'react';

import STYLES from './App.module.scss';
import TokensInfo from './TokensInfo';
import MintControls from './MintControls';
import OwnerControls from './OwnerControls';
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
  const [account, setAccount] = useState(
    window.ethereum ? window.ethereum.selectedAddress : null,
  );
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
      displayErrorMessage('Error communicating with the contract', e.message);
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
      <div className={STYLES.dates}>Data de Presale i Mint</div>
      {window.ethereum && (
        <p className={STYLES.walletAddress}>Wallet address: {account}</p>
      )}
      <img
        src="adoval.png"
        width={574}
        height={574}
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
            onClick={async () => {
              try {
                await blockchainConnect(setConnectionReady);
              } catch (e) {
                displayErrorMessage(e.message, e.message);
              }
            }}
          >
            Connect wallet
          </button>
        </div>
      )}

      {connectionReady && <OwnerControls onError={displayErrorMessage} />}
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
