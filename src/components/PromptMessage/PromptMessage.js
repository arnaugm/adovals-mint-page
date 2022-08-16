import PropTypes from 'prop-types';

import STYLES from './PromptMessage.module.css';

const PromptMessage = ({ type, message, onClick }) => {
  const classNames = [STYLES.PromptMessage];
  const typeClassName =
    type === 'success' ? 'PromptMessageSuccess' : 'PromptMessageError';
  classNames.push(STYLES[typeClassName]);

  return (
    <div className={classNames.join(' ')} onClick={onClick}>
      <div className={STYLES.message}>{message}</div>
      <button className={`${STYLES.closeButton} material-icons`}>close</button>
    </div>
  );
};

PromptMessage.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PromptMessage;
