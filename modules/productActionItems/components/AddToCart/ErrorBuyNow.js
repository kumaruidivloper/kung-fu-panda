import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled, { cx, css } from 'react-emotion';

const wrapper = css`
  position: relative;
  border-radius: 4px;
  background-color: rgba(224, 0, 0, 0.03);
  border: solid 1px #e30300;
`;

const text = css`
  color: #cc0000;
`;

const CloseButton = styled('button')`
  position: absolute;
  right: 6px;
  top: 14px;
  height: 22px;
  width: 22px;
  padding: 0;
  border: 0;
  border-color: transparent;
  background-color: transparent;
  color: #585858;
  line-height: 0;
  cursor: pointer;
`;

const CloseIcon = styled('span')`
  font-size: 0.75rem;
  ${text};
`;

class ErrorBuyNow extends PureComponent {
  renderCloseButton() {
    const { onRequestClose } = this.props;
    return (
      !!onRequestClose && (
        <CloseButton onClick={onRequestClose}>
          <CloseIcon className={cx('academyicon', 'icon-close')} aria-hidden="true" />
        </CloseButton>
      )
    );
  }

  render() {
    const { message } = this.props;
    return (
      !!message && (
        <div className={cx(wrapper, 'my-2')}>
          {this.renderCloseButton()}
          <div className={cx(text, 'my-1 mx-2 o-copy__14reg')}>{message}</div>
        </div>
      )
    );
  }
}

ErrorBuyNow.propTypes = {
  message: PropTypes.string,
  onRequestClose: PropTypes.func
};

export default ErrorBuyNow;
