import PropTypes from 'prop-types';

import TokensMinted from '../TokensMinted';

import STYLES from './TokensInfo.module.scss';

const TokensInfo = ({ minted, total, price }) => (
  <div>
    <TokensMinted total={total} minted={minted} />
    <div className={STYLES.tokenPrice}>
      {price} ETH
      <p className={STYLES.gasDisclaimer}>
        (Gas cost not included in the price)
      </p>
    </div>
  </div>
);

TokensInfo.propTypes = {
  minted: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
};

export default TokensInfo;
