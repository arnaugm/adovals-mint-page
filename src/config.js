const {
  REACT_APP_ETHERSCAN_API_KEY: ETHERSCAN_API_KEY,
  REACT_APP_ALCHEMY_API_KEY: ALCHEMY_API_KEY,
} = process.env;

const contractAddress = '0xd72E1859dEAc8eFDb6E7C62e96E424FC4ad57e65';
const presaleDate = 'October 22nd';
const publicMintDate = 'October 24th';

export {
  contractAddress,
  presaleDate,
  publicMintDate,
  ETHERSCAN_API_KEY,
  ALCHEMY_API_KEY,
};
