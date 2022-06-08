import { useEffect, useState } from 'react';

import {
  getEnabled,
  enableContract,
  disableContract,
} from '../../contract-gateway';

const OwnerControls = () => {
  const [, setState] = useState();
  const [enabled, setEnabled] = useState();

  const enable = async () => {
    try {
      await enableContract();
      setEnabled(true);
    } catch (err) {
      setState(() => {
        throw new Error(err.reason);
      });
    }
  };

  const disable = async () => {
    try {
      await disableContract();
      setEnabled(false);
    } catch (err) {
      setState(() => {
        throw new Error(err.reason);
      });
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

export default OwnerControls;
