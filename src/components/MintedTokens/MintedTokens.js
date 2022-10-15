import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { contractAddress } from '../../config';
import Adovals from '../../artifacts/contracts/Adovals.sol/Adovals.json';

const provider = ethers.getDefaultProvider('http://127.0.0.1:8545');
const contract = new ethers.Contract(contractAddress, Adovals.abi, provider);

const MintedTokens = () => {
  const [mintedTokens, setMintedTokens] = useState(0);
  const [totalTokens, setTotalTokens] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const totalSupply = await contract.totalSupply();
      setMintedTokens(totalSupply.toNumber());

      const maxSupply = await contract.maxSupply();
      setTotalTokens(maxSupply.toNumber());
    };
    fetchData();
  }, []);

  return (
    <div>
      <div>
        {mintedTokens} / {totalTokens}
      </div>
      <div>Adovals minted</div>
    </div>
  );
};

export default MintedTokens;
