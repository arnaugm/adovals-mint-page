import PropTypes from 'prop-types';

import './TokensInfo.css';

const TokensInfo = ({ minted, total, price, presalePrice }) => (
  <>
    <div>
      <div>
        {minted} / {total}
      </div>
      <div>ADOVALS MINTED</div>
    </div>
    <div>{price} ETH (presale: {presalePrice} ETH)</div>
  </>
);

TokensInfo.propTypes = {
  minted: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
  presalePrice: PropTypes.string.isRequired,
};

export default TokensInfo;
