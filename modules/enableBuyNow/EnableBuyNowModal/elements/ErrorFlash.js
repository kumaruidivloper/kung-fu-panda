import React from 'react';
import PropTypes from 'prop-types';
import { cx, css } from 'react-emotion';

const wrapper = css`
  border-radius: 4px;
  background-color: rgba(224, 0, 0, 0.03);
  border: solid 1px #e30300;
`;

const text = css`
  color: #cc0000;
`;

const ErrorFlash = ({ message, className }) =>
  !!message && (
    <div className={cx(wrapper, className)}>
      <div className={cx(text, 'my-1 mx-2 o-copy__14reg')}>{message}</div>
    </div>
  );

ErrorFlash.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string
};

ErrorFlash.defaultProps = {
  className: ''
};

export default ErrorFlash;
