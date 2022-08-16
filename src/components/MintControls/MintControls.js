import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import STYLE from './MintControls.module.scss';
import APP_STYLE from '../App.module.scss';
import { mintToken } from '../../contract-gateway';
import { getProof, isAllowlisted } from '../../merkle-tree';

const MintControls = ({
  account,
  presale,
  maxMintAmount,
  price,
  onSuccess,
  onError,
}) => {
  const [mintAmount, setMintAmount] = useState(1);
  const [merkleProof, setMerkleProof] = useState([]);
  const [allowlisted, setAllowlisted] = useState(false);

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
    mintToken(mintAmount, merkleProof, price)
      .then(() => onSuccess('Mint transaction sent successfully.'))
      .catch((e) => {
        onError(`Unable to mint: ${e.message}`, e.message);
      });
  };

  useEffect(() => {
    if (presale) {
      const proof = getProof(account);
      setMerkleProof(proof);
      setAllowlisted(isAllowlisted(account));
    }
  }, [account, presale]);

  return !presale || allowlisted ? (
    <>
      <div>
        <div className={STYLE.mintAmount}>
          <div className={STYLE.mintAmountButton} onClick={decreaseMintAmount}>
            <img
              src="button-minus.png"
              height="48"
              width="48"
              data-testid="decrease-mint-button"
            />
          </div>
          <div
            className={STYLE.mintAmountNumber}
            data-testid="mint-amount-number"
          >
            {mintAmount}
          </div>
          <div className={STYLE.mintAmountButton} onClick={increaseMintAmount}>
            <img
              src="button-plus.png"
              height="48"
              width="48"
              data-testid="increase-mint-button"
            />
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
  ) : (
    <div className={STYLE.notAllowlistedWarning}>
      <i className={`${STYLE.warnIcon} material-icons`}>info_outline</i> Your address is not in the presale whitelist.<br/> Public mint will be available soon.
    </div>
  );
};

MintControls.propTypes = {
  account: PropTypes.string.isRequired,
  presale: PropTypes.bool.isRequired,
  maxMintAmount: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default MintControls;
