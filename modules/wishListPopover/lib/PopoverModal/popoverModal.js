import React from 'react';
import PropTypes from 'prop-types';
import * as emo from './popoverModal.emotion';
import AnimationWrapper from '../../../../apps/productDetailsGeneric/animationWrapper';
import { WISHLIST_ID, WISHLIST_CLOSE } from '../../constants';

const PopoverModal = props => {
  const { children, onClickClose, handleEntered, handleExited } = props;
  return (
    <AnimationWrapper handleEntered={handleEntered} handleExited={handleExited}>
      <div className={emo.Wrapper} id={WISHLIST_ID}>
        <emo.Close className="academyicon icon-close" onClick={onClickClose} data-auid="PDP_close_wishList" aria-label="Close" id={WISHLIST_CLOSE} />
        {children}
      </div>
    </AnimationWrapper>
  );
};

PopoverModal.propTypes = {
  children: PropTypes.node,
  onClickClose: PropTypes.func,
  handleEntered: PropTypes.func,
  handleExited: PropTypes.func
};

export default PopoverModal;
