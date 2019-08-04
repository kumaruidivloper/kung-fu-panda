import { onlineStoreId } from '@academysports/aso-env';
import Button from '@academysports/fusion-components/dist/Button';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';

import { SELECTED_INSTORE_PICKUP } from '../../apps/cart/cart.constants';
import { padDigits } from '../../utils/helpers';
import { doInventory } from './action';
import { DATA_COMP_ID, NODE_TO_MOUNT } from './constants';
import { checkoutBtn } from './styles';

class CartOption extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      size: 'M'
    };
    this.updateButtonSize = this.updateButtonSize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateButtonSize);
    this.updateButtonSize();
  }

  /**
   * Method will trigger on click of checkout CTA
   * Construct required json object for Inventory check. Need to segregate items by shipping type.
   * If api returns any item as Limited or out of stock, then need to retrigger the Cart API.
   */
  onClickCheckout() {
    const { findAStore, orderItems, bundleProductInfo, orderId, fnDoInventory, cms, analyticsContent } = this.props;
    const { getMystoreDetails = {} } = findAStore || {};
    let { storeId = onlineStoreId } = getMystoreDetails;
    if (storeId) {
      storeId = padDigits(parseInt(storeId, 10), 3);
    }
    const onlineSkus = orderItems.filter(item => item.shipModeCode !== SELECTED_INSTORE_PICKUP && !item.isBundleItem);
    const pickupSkus = orderItems.filter(item => item.shipModeCode === SELECTED_INSTORE_PICKUP && !item.isBundleItem);
    // let bundleSkusPickup = bundleProductInfo.filter(item => item.shipModeCode === SELECTED_INSTORE_PICKUP);
    // bundleSkusPickup = bundleSkusPickup.map(item => {
    //   const bundleItems = this.filterOutBundleItems(item.bundleOrderItems);
    //   const obj = {
    //     skuId: item.skuId,
    //     inventorySource: 'pickup',
    //     storeId,
    //     skus: bundleItems.map(bundle => ({
    //       skuId: bundle.skuId,
    //       requestedQuantity: item.quantity
    //     }))
    //   };
    //   return obj;
    // });
    const bundleSkusPickup = [];
    let bundleSkusOnline = bundleProductInfo.filter(item => item.shipModeCode !== SELECTED_INSTORE_PICKUP);
    bundleSkusOnline = bundleSkusOnline.map(item => {
      const bundleItems = this.filterOutBundleItems(item.bundleOrderItems);
      const obj = {
        skuId: item.productId,
        inventorySource: 'online',
        skus: bundleItems.map(bundle => ({
          skuId: bundle.productId,
          requestedQuantity: item.quantity
        }))
      };
      return obj;
    });

    fnDoInventory({
      dataObj: {
        orderId,
        zipcode: getMystoreDetails.zipcode,
        storeId,
        onlineSkus,
        pickupSkus,
        bundleSkusOnline,
        bundleSkusPickup
      },
      eventLabel: cms.commonLabels.checkoutLabel,
      analyticsContent: obj => analyticsContent(obj)
    });
  }

  /**
   * Method to filter out all associated bundle items to product.
   * @param {array} orders List of child items for bundle
   */
  filterOutBundleItems(orders) {
    const { orderItems } = this.props;
    const ids = orders.map(item => item.orderItemId);
    return orderItems.filter(item => ids.indexOf(item.orderItemId) > -1);
  }

  updateButtonSize() {
    if (window.innerWidth <= 576) {
      this.setState({ size: 'S' });
    } else {
      this.setState({ size: 'M' });
    }
  }

  render() {
    const { cms } = this.props;
    const { size } = this.state;
    const { commonLabels } = cms;
    return (
      <Button auid="Checkout" className={checkoutBtn} size={size} onClick={() => this.onClickCheckout()}>
        {commonLabels.checkoutLabel}
      </Button>
    );
  }
}

CartOption.propTypes = {
  cms: PropTypes.object.isRequired,
  orderId: PropTypes.string,
  orderItems: PropTypes.array,
  fnDoInventory: PropTypes.func,
  findAStore: PropTypes.object,
  bundleProductInfo: PropTypes.array,
  analyticsContent: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  fnDoInventory: data => dispatch(doInventory(data))
});

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <CartOption {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default connect(
  null,
  mapDispatchToProps
)(CartOption);
