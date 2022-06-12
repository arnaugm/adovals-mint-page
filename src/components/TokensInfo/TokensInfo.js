import PropTypes from 'prop-types';

import STYLES from './TokensInfo.module.scss';

const TokensInfo = ({ minted, total, price }) => (
  <div>
    <div className={STYLES.mintedTokens}>
      {minted} / {total}
    </div>
    <div className={STYLES.mintedTokensText}>Adovals minted</div>
    <div className={STYLES.tokenPrice}>{price} ETH</div>
  </div>
);

TokensInfo.propTypes = {
  minted: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
};

export default TokensInfo;
