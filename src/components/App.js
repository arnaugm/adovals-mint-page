import { useState, useEffect } from 'react';

import STYLES from './App.module.scss';
import TokensInfo from './TokensInfo';
import MintControls from './MintControls';
import OwnerControls from './OwnerControls';
import ErrorMessage from './ErrorMessage';
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

const App = () => {
  const [connectionReady, setConnectionReady] = useState(false);
  const [contractData, setContractData] = useState();
  const [account, setAccount] = useState(
    window.ethereum ? window.ethereum.selectedAddress : null,
  );
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

  useEffect(() => {
    const refreshData = async () => {
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
    };
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
            account={window.ethereum.selectedAddress}
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
                setError(e.message);
              }
            }}
          >
            Connect wallet
          </button>
        </div>
      )}

      {connectionReady && <OwnerControls />}
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default App;
