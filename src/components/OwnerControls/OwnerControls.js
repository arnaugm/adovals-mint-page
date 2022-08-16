import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import {
  getEnabled,
  enableContract,
  disableContract,
} from '../../contract-gateway';

const OwnerControls = ({ onError }) => {
  const [enabled, setEnabled] = useState();

  const enable = async () => {
    try {
      await enableContract();
      setEnabled(true);
    } catch (e) {
      onError(e.reason, e.message);
    }
  };

  const disable = async () => {
    try {
      await disableContract();
      setEnabled(false);
    } catch (e) {
      onError(e.reason, e.message);
    }
  };

  useEffect(() => {
    const isEnabled = async () => {
      const en = await getEnabled();
      setEnabled(en);
    };
    isEnabled();
  }, []);

  return (
    <div>
      <h2>
        The contract is enabled:{' '}
        {enabled ? <strong>true</strong> : <strong>false</strong>}
      </h2>
      <button onClick={enable}>enable contract</button>
      <button onClick={disable}>disable contract</button>
    </div>
  );
};

OwnerControls.propTypes = {
  onError: PropTypes.func.isRequired,
};

export default OwnerControls;
