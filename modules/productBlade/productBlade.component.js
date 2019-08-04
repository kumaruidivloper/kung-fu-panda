import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { get } from '@react-nitro/error-boundary';
import PropTypes from 'prop-types';
import { NODE_TO_MOUNT, DATA_COMP_ID, outOfStock, selectedBOPIS, limitedStock } from './constants';
import { showSigninModal } from '../loginModal/actions';
import updateMode from './saga';
import injectSaga from '../../utils/injectSaga';
import * as actions from './actions';
import Blade from './blade/blade';
import { toggleFindAStore } from '../findAStoreModalRTwo/actions';
import UnavailableItemsModal from './unavilableItemsModal';
import { toggleSOFModal } from '../specialOrderProceedModal/actions';
import { updateStore } from '../../utils/storeUtils';
// import { typeOfOrder } from '../../utils/analyticsUtils';

class ProductBlade extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      unavailableItems: [],
      freeGiftOf: {}
    };
  }

  componentDidMount() {
    this.isPickInStoreSelected();
    this.filterOutNonAvailableStocks();
    this.mapFreeGift();
    this.updateAnalytics(this.props.data);
  }

  componentDidUpdate(props) {
    if (JSON.stringify(this.props.data) === JSON.stringify(props.data)) {
      return;
    }
    this.isPickInStoreSelected();
    this.filterOutNonAvailableStocks(true);
    this.mapFreeGift();
  }

  getSportsTeamName(Attribute) {
    const sportsTeam = Attribute.skuAttributes.find(attr => attr.name === 'Team');
    return sportsTeam ? sportsTeam.value : 'n/a';
  }

  adBugMapper = (adBug = '') => {
    switch (adBug) {
      case 'Clearance':
        return 'clearance';
      case 'Hot Deal':
        return 'Hot Deal';
      default:
        return 'regular';
    }
  };

  typeOfOrder = availableShippingMethods => {
    const orderFulfillmentTypes = type => {
      switch (type) {
        case 'PICKUPINSTORE':
          return 'bopis';
        case 'STS':
          return 'ship to store';
        case 'Ship To Store':
          return 'ship to store';
        case 'SG':
          return 'ship to store';
        default:
          return 'ship to home';
      }
    };
    const shippingMethodsMessage = orderFulfillmentTypes(availableShippingMethods);
    return shippingMethodsMessage;
  };

  /**
   * @param  {} properties
   * Method to handle analytics Data to be pushed on load of product Blade
   */
  updateAnalytics(properties) {
    const analyticsObject = {
      shoppingcartImpression: 1,
      ecommerce: {
        checkout: {
          actionField: { step: 1, option: 'view cart' },
          products: []
        }
      }
    };
    properties.map(eachProp => {
      const color = eachProp.skuDetails.skuInfo.skuAttributes.find(item => item.name === 'Color');

      const onlineInventoryArr = get(eachProp, 'skuDetails.inventory.online', []);
      const storeInventoryArr = get(eachProp, 'skuDetails.inventory.store', []);

      const onlineStockStatus = onlineInventoryArr.length > 0 ? onlineInventoryArr[0].inventoryStatus : 'n/a';
      const storeStockStatus = storeInventoryArr.length > 0 ? storeInventoryArr[0].inventoryStatus : 'n/a';
      const {
        skuDetails = {},
        skuId = '',
        quantity = '',
        orderItemId = '',
        isSOFItem = false,
        shipModeCode = '',
        isBundleItem = false,
        unitPrice = '',
        orderItemPrice = ''
      } = eachProp;
      const { skuInfo = {}, inventory = {} } = skuDetails;
      const { manufacturer = '', categoryName = '', name = '', adBug = [], parentSkuId = '' } = skuInfo;
      const analyticsData = {
        name,
        id: parentSkuId,
        price: orderItemPrice,
        brand: manufacturer,
        category: categoryName,
        variant: skuId,
        quantity,
        'dimension 4': inventory.store.length > 0,
        'dimension 5': orderItemId,
        'dimension 25': adBug && adBug.length > 0 ? this.adBugMapper(adBug[0]) : 'regular',
        'dimension 29': 'in page browse',
        'dimension 72': skuId,
        'dimension 74': `${parentSkuId} – ${name}`,
        'dimension 70': this.getSportsTeamName(skuInfo),
        'dimension 77': isSOFItem,
        'dimension 68': color && color.value ? color.value : 'NA',
        'dimension 34': onlineStockStatus,
        'dimension 35': storeStockStatus,
        'dimension 86': this.typeOfOrder(shipModeCode),
        'dimension 87': isBundleItem ? 'bundled' : 'single',
        metric22: unitPrice,
        metric47: 1
      };

      return analyticsObject.ecommerce.checkout.products.push(analyticsData);
    });
    analyticsObject.dimension85 = this.orderType(properties);
    // analyticsObject.ecommerce.products.push(analyticsObjectToUpdate);
    this.props.analyticsContent(analyticsObject);
  }

  orderType = availableShippingMethods => {
    const shippingMethods = availableShippingMethods.map(method => method.shipModeCode);
    const uniqueValuesOfShippingMethods = shippingMethods.filter((value, index) => shippingMethods.indexOf(value) === index);
    return uniqueValuesOfShippingMethods.length > 1
      ? uniqueValuesOfShippingMethods.reduce((accumulator, shippingMethod) => `${this.typeOfOrder(accumulator)}|${this.typeOfOrder(shippingMethod)}`)
      : this.typeOfOrder(shippingMethods[0]);
  };

  /**
   * Method to update freeGiftOf object of state; this object is for a mapping between a product
   * and its child free gift. key is product ID, value is object corresponding to free gift child.
   * Since the object has flags isfreeGift and freeGiftParentId and a free gift has to be displayed with
   * its parent product.
   */
  mapFreeGift() {
    const freeGiftItems = this.props.data.filter(obj => obj.isfreeGift);
    if (!freeGiftItems.length) {
      return;
    }
    const mapGiftToParent = {};
    /* eslint-disable */
    freeGiftItems.map(obj => (mapGiftToParent[obj.freeGiftParentId] = obj));
    /* eslint-enable */
    this.setState({ freeGiftOf: mapGiftToParent });
  }

  /**
   * Method to filter out all associated bundle items to product
   * @param {*} orders
   */
  filterOutBundleItems(orders) {
    if (!orders || !orders.length) {
      return [];
    }
    const ids = orders.map(item => item.orderItemId);
    return this.props.data.filter(item => ids.indexOf(item.orderItemId) > -1);
  }

  /**
   * Method to return list of objects which selected as Pick up In Store.
   */
  isPickInStoreSelected() {
    const pickupInStore = this.props.data.filter(item => item.shipModeCode === 'PickupInStore');
    if (pickupInStore.length) {
      this.props.fnPickUpStoreSelected();
      return;
    }
    this.props.fnPickUpStoreUnSelected();
  }

  toggleUnAvailableItemsModal() {
    this.setState({ showUnavailableModal: !this.state.showUnavailableModal });
  }

  /**
   * Method to check the item is limited stock or not
   * @param {object} item Product Object
   */
  isLimitedStock(item) {
    const { online = [], store = [] } = item.skuDetails.inventory;
    let data = online && online[0];
    if (item.shipModeCode === selectedBOPIS) {
      data = store && store[0];
    }
    if (!data) {
      return false;
    }
    const { availableQuantity, inventoryStatus } = data;
    return availableQuantity > 0 && (item.quantity > availableQuantity || inventoryStatus === limitedStock);
  }

  /**
   * Method to check the item is out of stock or not
   * @param {object} item Product Object
   */
  isOutOfStock(item) {
    let onlineStatus;
    let storeStatus;
    const { online = [], store = [] } = item.skuDetails.inventory;
    // For Online Inventory
    if (online.length) {
      onlineStatus = online[0].inventoryStatus;
    } else {
      onlineStatus = outOfStock;
    }
    // For Store Inventory
    if (store.length) {
      storeStatus = store[0].inventoryStatus;
    } else {
      storeStatus = outOfStock;
    }

    return onlineStatus === outOfStock && storeStatus === outOfStock;
  }

  /**
   * Method to find limited stock items and will set error type.
   * If it is limited stock then we need to auto update for that we are pushing into array.
   * @param {object} product Product object
   * @param {array} limitedStockItems Limited stock items will be add into array
   * @param {boolean} isBundle Flag to indicate is bundle item or not
   */
  constructUnAvailablityItems(item, limitedStockItems, isBundle) {
    const { online = [], store = [] } = item.skuDetails.inventory;
    if (this.isOutOfStock(item)) {
      // adding eslint disable because we need to set errortype to show appropriate modal and to avoid creating extra local variable.
      item.errorType = outOfStock; // eslint-disable-line
      return item;
    }

    // Need to skip if it is bundle item
    if (item.isBundleItem) {
      return false;
    }

    // Checking item For Limited Stock, we are setting proposed quantity for "How to proceed modal?"
    const data = item.shipModeCode === selectedBOPIS ? store : online;

    if (data.length) {
      return this.isLimtedStockItem(item, data[0], limitedStockItems, isBundle);
    }

    return false;
  }

  /**
   * Method to return the boolean value whether the item is limited stock or not
   * @param {object} item Product Item Object
   * @param {object} data Inventory object
   * @param {array} limitedStockItems Array of limited stock items
   * @param {bool} isBundle Bundle flag
   */
  isLimtedStockItem(item, data, limitedStockItems, isBundle) {
    const { inventoryStatus, availableQuantity } = data;
    if (availableQuantity > 0 && (item.quantity > availableQuantity || inventoryStatus === limitedStock)) {
      limitedStockItems.push({ ...item, quantity: availableQuantity, proposedQuantity: item.quantity, skipUpdate: isBundle });
      if (isBundle) {
        item.bundleOrderItems.map(bundleItem =>
          limitedStockItems.push({ ...bundleItem, quantity: availableQuantity, proposedQuantity: item.quantity, skipDisplay: true })
        );
      }
      // Adding eslint disable to avoid local variable
      item.errorType = limitedStock; // eslint-disable-line
      return item;
    }

    return false;
  }

  /**
   * Method to filter out all non available items
   * items will be like out_of_stock and limited_stock state.
   * @param {boolean} calledByUpdate Based on flag need to skip the modal dialog.
   */
  filterOutNonAvailableStocks(calledByUpdate) {
    let limitedStockItems = [];
    let isSOFItems = [];
    let unavailableOrderItems = [];
    const { data, bundleProductInfo = [] } = this.props;
    unavailableOrderItems = data.filter(obj => {
      if (obj.isBundleItem || obj.isfreeGift) {
        return false;
      }
      return this.constructUnAvailablityItems(obj, limitedStockItems, false);
    });

    const unavailableBundleItems = bundleProductInfo.filter(obj => this.constructUnAvailablityItems(obj, limitedStockItems, true));

    // On click of checkout CTA, if any sof items then we need open "How to proceed modal?".
    if (calledByUpdate && limitedStockItems.length) {
      isSOFItems = limitedStockItems.filter(item => item.shipModeCode === selectedBOPIS && item.isSOFItem);
      limitedStockItems = limitedStockItems.filter(item => {
        if (item.isSOFItem && item.shipModeCode === selectedBOPIS) {
          return false;
        }
        return true;
      });
    }

    // Open How to Proceed Modal, if any SOF
    if (isSOFItems.length) {
      this.props.fnToggleSOFM({ status: true, sofItems: isSOFItems });
    }

    // Trigger update call with avilable quantity if anything limited stock.
    if (limitedStockItems.length) {
      this.props.fnUpdateQty({ orderId: this.props.orderId, orderItem: limitedStockItems.filter(item => !item.skipUpdate) });
    }

    unavailableOrderItems = unavailableOrderItems.filter(item => !item.skipDisplay);
    if ((unavailableOrderItems.length || unavailableBundleItems.length) && !calledByUpdate) {
      this.setState({ showUnavailableModal: true, unavailableItems: [...unavailableOrderItems, ...unavailableBundleItems] });
    }
  }

  constructBladeLayout(bladeInfo, qtyUpdateLoader) {
    const { freeGiftOf } = this.state;
    const {
      cms,
      findAStore,
      orderId,
      fnUpdateMode,
      fnUpdateQty,
      data,
      fnRemoveitem,
      fnAddToWishList,
      fnTriggerSignIn,
      fnToggleFASM,
      fnToggleSOFM,
      productUpdate,
      analyticsContent,
      labels
    } = this.props;

    if (bladeInfo.isBundleItem || (bladeInfo.isfreeGift && bladeInfo.freeGiftParentId)) {
      return false;
    }
    return (
      <Blade
        key={bladeInfo.orderItemId}
        data={bladeInfo}
        cms={cms}
        cartQuantity={data.length}
        findAStore={findAStore}
        orderId={orderId}
        qtyUpdateLoader={qtyUpdateLoader}
        fnUpdateMode={fnUpdateMode}
        fnUpdateQty={fnUpdateQty}
        fnRemoveitem={fnRemoveitem}
        fnAddToWishList={fnAddToWishList}
        fnTriggerSignIn={fnTriggerSignIn}
        fnToggleFASM={fnToggleFASM}
        fnToggleSOFM={fnToggleSOFM}
        isLimitedStock={this.isLimitedStock(bladeInfo)}
        isOutOfStock={this.isOutOfStock(bladeInfo)}
        bundleProductInfo={this.filterOutBundleItems(bladeInfo.bundleOrderItems)}
        freeGift={freeGiftOf[bladeInfo.productId]}
        productUpdate={productUpdate}
        analyticsContent={analyticsContent}
        labels={labels}
      />
    );
  }

  render() {
    const { data, cms, qtyUpdateLoader, analyticsContent, findAStore } = this.props;
    const { unavailableItems, showUnavailableModal } = this.state;
    if (!data.every(({ storeAddress }) => data[0].storeAddress && storeAddress[1] === data[0].storeAddress[1]) && findAStore) {
      updateStore(findAStore.getMystoreDetails.gx_id);
    }
    return (
      <React.Fragment>
        {/* Contructing Blade Layout */}
        {data.map(bladeInfo => this.constructBladeLayout(bladeInfo, qtyUpdateLoader))}
        {this.props.bundleProductInfo && this.props.bundleProductInfo.map(bladeInfo => this.constructBladeLayout(bladeInfo, qtyUpdateLoader))}

        {unavailableItems.length > 0 && (
          <UnavailableItemsModal
            cms={cms}
            items={unavailableItems}
            modalStatus={showUnavailableModal}
            toggleModal={() => this.toggleUnAvailableItemsModal()}
            analyticsContent={analyticsContent}
          />
        )}
      </React.Fragment>
    );
  }
}

ProductBlade.propTypes = {
  cms: PropTypes.object.isRequired,
  labels: PropTypes.object,
  data: PropTypes.array.isRequired,
  orderId: PropTypes.string,
  fnUpdateMode: PropTypes.func,
  fnUpdateQty: PropTypes.func,
  fnRemoveitem: PropTypes.func,
  qtyUpdateLoader: PropTypes.array,
  fnAddToWishList: PropTypes.func,
  fnTriggerSignIn: PropTypes.func,
  findAStore: PropTypes.object,
  fnPickUpStoreUnSelected: PropTypes.func,
  fnPickUpStoreSelected: PropTypes.func,
  fnToggleFASM: PropTypes.func,
  bundleProductInfo: PropTypes.array,
  fnToggleSOFM: PropTypes.func,
  productUpdate: PropTypes.object,
  analyticsContent: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  fnUpdateMode: data => dispatch(actions.updateShippingMode(data)),
  fnUpdateQty: data => dispatch(actions.updateQty(data)),
  fnRemoveitem: data => dispatch(actions.removeItem(data)),
  fnAddToWishList: data => dispatch(actions.addToWishList(data)),
  fnTriggerSignIn: data => dispatch(showSigninModal(data)),
  fnPickUpStoreUnSelected: () => dispatch(actions.pickUpStoreUnSelected()),
  fnPickUpStoreSelected: () => dispatch(actions.pickUpStoreSelected()),
  fnToggleFASM: data => dispatch(toggleFindAStore(data)),
  fnToggleSOFM: data => dispatch(toggleSOFModal(data))
});

const withConnect = connect(
  null,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga: updateMode });
  const ProductBladeContainer = compose(
    withSaga,
    withConnect
  )(ProductBlade);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ProductBladeContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(ProductBlade);
