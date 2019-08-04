import React from 'react';
import PropTypes from 'prop-types';
import { cx, css } from 'react-emotion';

const hr = css`
  border: 0;
  background-color: #ccc;
  height: 1px;
`;

const Hr = props => <hr className={cx(hr, props.className)} />;

Hr.propTypes = {
  className: PropTypes.string
};

Hr.defaultProps = {
  className: ''
};

export default Hr;
