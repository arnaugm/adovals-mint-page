import PropTypes from 'prop-types';

import STYLES from './ErrorMessage.module.css';

const ErrorMessage = ({ message }) => (
  <div>
    <h2>Error</h2>
    <div className={STYLES.message}>{message}</div>
  </div>
);

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
