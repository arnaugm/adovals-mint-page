import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import STYLE from './MintControls.module.scss';
import APP_STYLE from '../App.module.scss';
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
        <div className={STYLE.mintAmount}>
          <div className={STYLE.mintAmountButton} onClick={decreaseMintAmount}>
            <img src="button-minus.png" height="48" width="48" />
          </div>
          <div className={STYLE.mintAmountNumber}>{mintAmount}</div>
          <div className={STYLE.mintAmountButton} onClick={increaseMintAmount}>
            <img src="button-plus.png" height="48" width="48" />
          </div>
        </div>
        <div>
          <button onClick={mint} className={APP_STYLE.actionButton}>
            Mint
          </button>
        </div>
      </div>
      <div className={STYLE.disclaimer}>
        You can mint a max of {maxMintAmount} Adovals
      </div>
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
