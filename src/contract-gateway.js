import { ethers } from 'ethers';

import Adovals from './artifacts/contracts/Adovals.sol/Adovals.json';

import { contractAddress } from './config';

let contract;

const isMetaMaskInstalled = () => {
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

const blockchainConnect = async (setConnectionReady) => {
  if (isMetaMaskInstalled()) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();

    contract = new ethers.Contract(contractAddress, Adovals.abi, signer);

    setConnectionReady(true);
  } else {
    throw Error('Please install MetaMask to interact with this page');
  }
};

const getMintedTokens = async () => {
  const totalSupply = await contract.totalSupply();
  return totalSupply.toNumber();
};

const getTotalTokens = async () => {
  const maxSupply = await contract.maxSupply();
  return maxSupply.toNumber();
};

const getTokenPrice = async () => {
  const cost = await contract.cost();
  return ethers.utils.formatEther(cost);
};

const getTokenPresalePrice = async () => {
  const presaleCost = await contract.presaleCost();
  return ethers.utils.formatEther(presaleCost);
};

const getMaxMintAmount = async () => {
  const saleMaxMintAmount = await contract.saleMaxMintAmount();
  return saleMaxMintAmount.toNumber();
};

const getPresaleMaxMintAmount = async () => {
  const presaleMaxMintAmount = await contract.presaleMaxMintAmount();
  return presaleMaxMintAmount.toNumber();
};

const getInPresale = async () => contract.inPresale();

const getEnabled = async () => contract.enabled();

const enableContract = async () => contract.enable(true);

const disableContract = async () => contract.enable(false);

const mintToken = async (amount, merkleProof, price) => {
  const value = ethers.utils.parseEther(price);
  return contract.mint(amount, merkleProof, {
    value: value.mul(amount),
  });
};

export {
  blockchainConnect,
  getMintedTokens,
  getTotalTokens,
  getTokenPrice,
  getTokenPresalePrice,
  getMaxMintAmount,
  getPresaleMaxMintAmount,
  getInPresale,
  getEnabled,
  enableContract,
  disableContract,
  mintToken,
};
