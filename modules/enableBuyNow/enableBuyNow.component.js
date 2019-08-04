import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Button from '@academysports/fusion-components/dist/Button';
import EnableBuyNowModal from './EnableBuyNowModal/EnableBuyNowModal';
import { NODE_TO_MOUNT, DATA_COMP_ID, LABEL_ENABLE_BUY_NOW } from './constants';
import { printBreadCrumb } from '../../utils/breadCrumb';
import StorageManager from '../../utils/StorageManager';
class EnableBuyNow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false
    };

    this.onClick = this.onClick.bind(this);
    this.onEnterFireOnClick = this.onEnterFireOnClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onClickEnableBuyNowLogGA = this.onClickEnableBuyNowLogGA.bind(this);
  }

  /**
   * @description analytics data layer push on click of "Enable Buy Now"
   */
  onClickEnableBuyNowLogGA() {
    const { gtmDataLayer, productItem } = this.props;
    const { breadCrumb = [] } = productItem;
    const removeAcademyLabel = {
      removeAcademyLabel: true
    };
    gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: `pdp|${LABEL_ENABLE_BUY_NOW}`.toLowerCase(),
      eventLabel: `${printBreadCrumb([...breadCrumb, productItem.name], removeAcademyLabel)}`.toLowerCase()
    });
  }

  /**
   * @description handles action for "Enable Buy Now" button click
   * @returns {undefined}
   */
  onClick() {
    // Prevent user if the user has to create password
    const passwordExpired = StorageManager.getCookie('PASSWORD_EXPIRED_FLAG');
    if (passwordExpired) {
      window.location.href = '/shop/createpassword';
    } else {
      this.openModal();
      this.onClickEnableBuyNowLogGA();
    }
  }

  /**
   * @description creates function to be executed on keypress 'enter'.
   * @param  {function} onClick function to be executed on keypress 'enter'
   * @return {function} function wrapping 'onClick' in keypress 'enter' conditional.
   */
  onEnterFireOnClick(onClick) {
    return e => {
      if (onClick && e.nativeEvent.keyCode === 13) {
        onClick();
      }
    };
  }

  /**
   * @description opens the "Enable Buy Now" modal
   * @returns {undefined}
   */
  openModal() {
    this.setState({ isModalOpen: true });
  }

  /**
   * @description closes the "Enable Buy Now" modal
   * @returns {undefined}
   */
  closeModal() {
    const { onRequestClose = () => undefined } = this.props;
    this.setState({ isModalOpen: false });
    onRequestClose();
  }

  renderModal() {
    const { profile, handleBuyNowResponseError, createAddToCartRequestObject, productItem, gtmDataLayer } = this.props;
    const { isModalOpen } = this.state;
    return (
      this.state.isModalOpen && (
        <EnableBuyNowModal
          profile={profile}
          open={isModalOpen}
          onRequestClose={this.closeModal}
          handleBuyNowResponseError={handleBuyNowResponseError}
          createAddToCartRequestObject={createAddToCartRequestObject}
          productItem={productItem}
          gtmDataLayer={gtmDataLayer}
        />
      )
    );
  }

  render() {
    const { auid, disabled, className } = this.props;
    return (
      <React.Fragment>
        <Button
          auid={auid}
          tabIndex="0"
          className={className}
          btntype="secondary"
          onClick={this.onClick}
          onKeyPress={this.onEnterFireOnClick(this.onClick)}
          disabled={disabled}
        >
          {`${LABEL_ENABLE_BUY_NOW}`}
        </Button>
        {this.renderModal()}
      </React.Fragment>
    );
  }
}

EnableBuyNow.propTypes = {
  auid: PropTypes.string.isRequired,
  profile: PropTypes.object,
  onRequestClose: PropTypes.func,
  handleBuyNowResponseError: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  createAddToCartRequestObject: PropTypes.func.isRequired,
  gtmDataLayer: PropTypes.array,
  productItem: PropTypes.object
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<EnableBuyNow {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default EnableBuyNow;
