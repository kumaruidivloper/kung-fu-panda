import React from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import PopoverStateless from '@academysports/fusion-components/dist/PopoverStateless';
import PopoverModal from '../PopoverModal/popoverModal';
import * as emo from './popover.emotion';

class Popover extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.uid = Math.floor(Math.random() * 1e16);
    this.wrapperId = `wish-list-popover-wrapper-${this.uid}`;

    this.toggleOpen = this.toggleOpen.bind(this);
    this.close = this.close.bind(this);
  }

  onEnterFireOnClick(onClick) {
    return e => {
      if (e.keyCode === 13) {
        onClick();
      }
    };
  }

  toggleOpen() {
    this.setState({ open: !this.state.open });
  }

  close() {
    this.setState({ open: false });
  }

  isDefined(val) {
    return val !== undefined && val !== null;
  }

  render() {
    const {
      direction,
      children,
      modalContent,
      onToggleClick = this.toggleOpen,
      onClose = this.close,
      handleEntered,
      handleExited,
      toggleRef
    } = this.props; // eslint-disable-line object-curly-newline
    const open = this.isDefined(this.props.open) ? this.props.open : this.state.open;
    const closeOnWindowBodyClick = () => {
      onClose();
    };
    return (
      <PopoverStateless.Wrapper id={this.wrapperId} className={emo.popoverStatelessWrapper}>
        <button
          className={cx(emo.contentWrapper, 'ada-div wishListPopoverChildren')}
          onClick={onToggleClick}
          id="wishlistBtn"
          type="button"
          data-auid="PDP_WishListPopOverChildren"
          onKeyPress={this.onEnterFireOnClick(onToggleClick)}
          ref={toggleRef}
        >
          {children}
        </button>
        <PopoverStateless.Modal
          direction={direction}
          open={open}
          role="dialog"
          lineHeightFix={1.5}
          onWindowBodyClick={closeOnWindowBodyClick}
          ignoreWindowBodyClickId={this.wrapperId}
        >
          <PopoverModal onClickClose={onClose} data-auid="PDP_CloseWishListPopOverModal" handleEntered={handleEntered} handleExited={handleExited}>
            {modalContent}
          </PopoverModal>
        </PopoverStateless.Modal>
      </PopoverStateless.Wrapper>
    );
  }
}

const directionString = PropTypes.oneOf(['left', 'right', 'top', 'bottom']);
const directionObject = PropTypes.shape({ mobile: directionString, desktop: directionString });

Popover.propTypes = {
  direction: PropTypes.oneOfType([directionString, directionObject]),
  children: PropTypes.any.isRequired,
  modalContent: PropTypes.node.isRequired,
  onToggleClick: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  handleEntered: PropTypes.func,
  handleExited: PropTypes.func,
  toggleRef: PropTypes.any
};

export default Popover;
