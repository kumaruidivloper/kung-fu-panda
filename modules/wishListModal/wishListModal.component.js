import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';


class WishListModal extends React.PureComponent {
  render() {
    const { cms } = this.props;
    return (
      <div className="wishListModal">
        <h3>{cms && cms.title ? cms.title : 'wishListModal'}</h3>
      </div>
    );
  }
}

WishListModal.propTypes = {
  cms: PropTypes.object.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <WishListModal {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />,
      el
    );
  });
}

export default WishListModal;
