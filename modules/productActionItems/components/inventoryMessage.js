import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { link, BaitStyle, InvMsg } from './../styles';
import { CHANGE_PICKUP_LOCATION, CHOOSE_PICKUP_LOCATION, CHANGE_LOCATION, MORE_STORES, FIND_A_STORE } from '../constants';
import { printBreadCrumb } from '../../../utils/breadCrumb';

class InventoryMessage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.openFindAStore = this.openFindAStore.bind(this);
  }
  onEnterFireOnClick(onClick) {
    return e => {
      if (onClick && e.which === 13) {
        onClick();
      }
    };
  }
  getStoreName() {
    const { findAStoreModal } = this.props;
    const myStoreDetails = findAStoreModal.getMystoreDetails || {};
    const { storeName = '' } = myStoreDetails;
    const updatedStoreName = storeName.replace(/\+/g, ' ');
    return (
      <a className={`o-copy__14reg ${link}`} href={findAStoreModal.getStoreURL} aria-label={`${updatedStoreName}`}>
        {updatedStoreName}
      </a>
    );
  }

  getOpenHours() {
    const { findAStoreModal } = this.props;
    const myStoreDetails = findAStoreModal.getMystoreDetails || {};
    const { openhours = '' } = myStoreDetails;
    return openhours.replace(/\+/g, ' ');
  }

  getTooltip() {
    return <span className="academyicon icon-information px-half" />;
  }

  checkLimitedStock(key) {
    if (key === 'LIMITED_STOCK_IN_STORE_SOF' || key === 'LIMITED_STOCK_IN_STORE') {
      return true;
    }
    return false;
  }

  openFindAStore() {
    const { toggleFindAStore, productItem, fnGetProductItemId, message = {} } = this.props;
    const removeAcademyLabel = {
      removeAcademyLabel: true
    };
    const productBreadCrumb = `${printBreadCrumb(productItem.breadCrumb, removeAcademyLabel)} > ${productItem.name}`;
    const eventaction = this.getStoreName() ? 'Change location button' : 'find a store';
    const analyticsObject = {
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: `pdp|${eventaction}`,
      eventLabel: productBreadCrumb && productBreadCrumb.toLowerCase()
    };
    this.props.store.gtmDataLayer.push(analyticsObject);
    if (toggleFindAStore) {
      fnGetProductItemId({
        itemId: productItem.partNumber,
        skuItemId: productItem.itemId,
        categoryId: productItem.categoryId,
        productId: productItem.id,
        skuId: productItem.skuId,
        isSof: this.props.isSof,
        ecomCode: message.ecomCode,
        inventoryStatus: message && message.inventoryStatus
      });
      toggleFindAStore({ status: true, isBopisEligible: false });
    }
  }

  displayStore(qty, ecomCode) {
    if (qty) {
      return true;
    } else if (ecomCode === '02') {
      // 02 ecomCode refers to display only products
      return true;
    }
    return false;
  }

  checkClearance(isClearance, isSafetyStockEnabled) {
    return isClearance === 'Y' || isSafetyStockEnabled === 'Y';
  }

  shouldDisplayLink(key, clearance) {
    if (key === 'NOT_SOLD_IN_STORE') {
      return false;
    } else if (clearance) {
      return false;
    }
    return true;
  }

  isStoreSelected() {
    const { findAStoreModal } = this.props;
    const myStoreDetails = findAStoreModal.getMystoreDetails;
    if (!myStoreDetails) return false;
    return !!Object.keys(myStoreDetails).length;
  }

  /**
   * Method to select and show appropriate store selection link for bait PDP variant
   */
  renderBaitStoreSelection = (isAvailable, storeSelected, labels, checkClearance) => {
    if (!checkClearance) {
      const { showStoreSelection } = this.props;
      const storeSelctionLabel = storeSelected ? labels.CHANGE_LOCATION || CHANGE_LOCATION : labels.FIND_A_STORE || FIND_A_STORE;
      if (isAvailable || showStoreSelection) {
        return <BaitStyle className="o-copy__14light">{storeSelctionLabel}</BaitStyle>;
      }
      return null;
    } else if (!storeSelected) {
      const storeSelctionLabel = labels.FIND_A_STORE || FIND_A_STORE;
      return <BaitStyle className="o-copy__14light">{storeSelctionLabel}</BaitStyle>;
    }
    return null;
  };

  renderInventoryIcon = isAvailable => (
    <Fragment>
      {isAvailable ? (
        <span className={`academyicon icon-check-mark ${InvMsg.IconSuccess}`} />
      ) : (
        <span className={`academyicon icon-close ${InvMsg.IconFail}`} />
      )}
    </Fragment>
  );

  renderDisplayStore = (displayStore, isBait) =>
    displayStore && <div className={isBait ? 'pt-half o-copy__14light' : 'mt-quarter o-copy__14reg'}>{this.getStoreName()}</div>;

  renderLimitedStock = isLimitedStock => isLimitedStock && <div className="mt-quarter o-copy__14reg">{this.getOpenHours()}</div>;

  renderSOFButtonContent = (storeSelected, labels) =>
    this.props.isSof &&
    (storeSelected ? labels.CHANGE_PICKUP_LOCATION || CHANGE_PICKUP_LOCATION : labels.CHOOSE_PICKUP_LOCATION || CHOOSE_PICKUP_LOCATION);

  renderInventoryButton = (labels, storeSelected, isBait, displayStore, checkClearance, displayLink) => (
    <button className={`${link} mt-quarter o-copy__14reg`} onClick={this.openFindAStore} data-auid="PDP_FindAStore" tabIndex="0">
      {this.renderSOFButtonContent(storeSelected, labels)}
      {!this.props.isSof && !isBait && displayLink && (storeSelected ? labels.MORE_STORES || MORE_STORES : labels.FIND_A_STORE || FIND_A_STORE)}
      {isBait && this.renderBaitStoreSelection(displayStore, storeSelected, labels, checkClearance)}
    </button>
  );

  renderAdditionalInfo = (isBait, additionalInfoKey, additionalInfoValue, authMsgs) =>
    additionalInfoValue && (
      <div className={`${!isBait && additionalInfoValue ? 'col-lg-6 col-sm-12 mt-quarter o-copy__14reg' : ''}`}>
        {authMsgs[additionalInfoKey] || additionalInfoValue}
      </div>
    );

  render() {
    const { message, authMsgs = {}, labels = {}, isBait } = this.props;
    const availableBoolean = {
      true: true,
      false: false
    };
    const { availableQuantity, key, value, additionalInfoValue, additionalInfoKey, ecomCode, showTick, isClearance, isSafetyStockEnabled } = message;
    const isAvailable = availableBoolean[showTick];
    const isLimitedStock = this.checkLimitedStock(key);
    const checkClearance = this.checkClearance(isClearance, isSafetyStockEnabled);
    const displayLink = this.shouldDisplayLink(key, checkClearance);
    const displayStore = this.displayStore(availableQuantity, ecomCode) && displayLink;
    const storeSelected = this.isStoreSelected();
    return (
      <div>
        <div className={`${!isBait && additionalInfoValue ? 'w-100' : ''} ${InvMsg.flex}`}>
          {/* {!this.props.isSof ? ( */}
          <div className="mr-half">{this.renderInventoryIcon(isAvailable)}</div>
          <div className={`${!isBait && additionalInfoValue ? 'row w-100 m-0 no-gutter o-copy__14reg' : 'ml-half'}`}>
            <div className={`${!isBait && additionalInfoValue ? 'col-lg-6 col-sm-12' : ''}`}>
              <div className={`${InvMsg.boldText} o-copy__14bold`} data-auid="PDP_IventoryMessage">
                {authMsgs[key] || value}
              </div>
              {this.renderDisplayStore(displayStore, isBait)}
              {this.renderLimitedStock(isLimitedStock)}
              {this.renderInventoryButton(labels, storeSelected, isBait, displayStore, checkClearance, displayLink)}
            </div>
            {this.renderAdditionalInfo(isBait, additionalInfoKey, additionalInfoValue, authMsgs)}
          </div>
        </div>
      </div>
    );
  }
}

InventoryMessage.propTypes = {
  isSof: PropTypes.bool,
  message: PropTypes.object,
  authMsgs: PropTypes.object,
  findAStoreModal: PropTypes.object,
  toggleFindAStore: PropTypes.func,
  labels: PropTypes.object,
  isBait: PropTypes.bool,
  productItem: PropTypes.object,
  fnGetProductItemId: PropTypes.func,
  showStoreSelection: PropTypes.bool,
  store: PropTypes.object
};

InventoryMessage.defaultProps = {
  findAStoreModal: {}
};
export default InventoryMessage;
