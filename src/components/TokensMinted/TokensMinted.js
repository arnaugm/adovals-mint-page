import PropTypes from 'prop-types';

import STYLES from './TokensMinted.module.scss';

const TokensMinted = ({ minted, total }) => (
  <>
    <div className={STYLES.mintedTokens}>
      {minted} / {total}
    </div>
    <div className={STYLES.mintedTokensText}>Adovals minted</div>
  </>
);

TokensMinted.propTypes = {
  minted: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default TokensMinted;
