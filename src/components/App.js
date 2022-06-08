import { useState, useEffect } from 'react';

import './App.css';
import TokensInfo from './TokensInfo';
import MintControls from './MintControls';
import OwnerControls from './OwnerControls';
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
    <div className="App">
      <h1>Mint your Adovals</h1>
      <h2>Presale date: XX/XX/XXXX / Mint date: XX/XX/XXXX</h2>
      {connectionReady && <p>Wallet address: {account}</p>}
      <img width={200} height={200} />
      {contractData ? (
        <>
          <TokensInfo
            minted={contractData.mintedTokens}
            total={contractData.totalTokens}
            price={contractData.tokenPrice}
            presalePrice={contractData.tokenPresalePrice}
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
        <button onClick={() => blockchainConnect(setConnectionReady)}>
          connect
        </button>
      )}

      {connectionReady && <OwnerControls />}
    </div>
  );
};

export default App;
