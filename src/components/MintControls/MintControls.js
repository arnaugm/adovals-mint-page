import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import './MintControls.css';
import { mintToken } from '../../contract-gateway';
import { getProof } from '../../merkle-tree';

const MintControls = ({ account, presale, maxMintAmount, price }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const [merkleProof, setMerkleProof] = useState([]);

  const decreaseMintAmount = () => {
    if (mintAmount > 1) {
      setMintAmount(mintAmount - 1);
    }
  };

  const increaseMintAmount = () => {
    if (mintAmount < maxMintAmount) {
      setMintAmount(mintAmount + 1);
    }
  };

  const mint = async () => {
    await mintToken(mintAmount, merkleProof, price);
  };

  useEffect(() => {
    if (presale) {
      const proof = getProof(account);
      setMerkleProof(proof);
    }
  }, [account, presale]);

  return (
    <>
      <div>
        <div>
          <button onClick={decreaseMintAmount}>-</button>
          <span>{mintAmount}</span>
          <button onClick={increaseMintAmount}>+</button>
        </div>
        <div>
          <button onClick={mint}>mint</button>
        </div>
      </div>
      <div>You can mint a max of {maxMintAmount} Adovals</div>
    </>
  );
};

MintControls.propTypes = {
  account: PropTypes.string.isRequired,
  presale: PropTypes.bool.isRequired,
  maxMintAmount: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
};

export default MintControls;
