import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@academysports/fusion-components/dist/Tooltip';
import { get } from '@react-nitro/error-boundary';
import { link, InvMsg, IconStyle, tooltipStyle, disableClicks } from './../styles';
import {
  CHANGE_LOCATION,
  CHOOSE_LOCATION,
  CHOOSE_PICKUP_LOCATION,
  CHANGE_PICKUP_LOCATION,
  MORE_STORES,
  FIND_A_STORE,
  ESTIMATED_SHIPPING,
  ASSEMBLY_REQUIRED,
  STORE_LOCATOR_LINK
} from '../constants';
import { isMobile, isIpad } from '../../../utils/userAgent';
import { printBreadCrumb } from '../../../utils/breadCrumb';
import { pickupDayInfo, dateFormatter } from './../../../utils/dateUtils';
import { TODAY, TOMORROW, FAM_PAGE_TYPE_PDP } from './../../../utils/constants';
import { replaceGlobalCharacters } from './../../../utils/stringUtils';

class BopisMessage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.openFindAStore = this.openFindAStore.bind(this);
    this.getFindAStore = this.getFindAStore.bind(this);
  }
  getFindAStore() {
    return this.props.findAStoreModal;
  }
  /**
   * Method to get the store details.
   */
  getMystoreDetails() {
    const findAStoreModal = this.getFindAStore();
    return findAStoreModal && findAStoreModal.storeId;
  }
  /**
   * Method to get the store name.
   */
  getStoreName(myStore) {
    return myStore && myStore.neighborhood ? myStore.neighborhood : '';
  }
  /**
   * Method to get the store hours.
   */
  getOpenHours() {
    const myStoreDetails = this.getMystoreDetails() || {};
    const { openhours = '' } = myStoreDetails;
    return openhours.replace(/\+/g, ' ');
  }

  /**
   * Get pick up SLA
   * @returns {string}
   */
  getPickUpSLA() {
    const {
      shippingInfo,
      labels: { pickupTodayIfOrdered, pickupTomorrow }
    } = this.props;
    if (get(shippingInfo, 'inStorePickUpSLA.estimatedFromDate', null)) {
      const {
        inStorePickUpSLA: { estimatedFromDate, estimatedTime }
      } = shippingInfo;
      const pickUpDate = pickupDayInfo(dateFormatter(estimatedFromDate));
      switch (pickUpDate) {
        case TODAY: {
          let pickUpMsg = '';
          pickUpMsg = replaceGlobalCharacters(pickupTodayIfOrdered, '{{today}}', 'today');
          pickUpMsg = replaceGlobalCharacters(pickUpMsg, '{{time}}', estimatedTime);
          return pickUpMsg;
        }
        case TOMORROW: {
          return pickupTomorrow;
        }
        default:
          // TODO - CMS label to be added
          return replaceGlobalCharacters('Pickup on {{date}}', '{{date}}', pickUpDate);
      }
    }
    return '';
  }

  /**
   * Method to check the limited stock.
   */
  checkLimitedStock(key) {
    if (key === 'LIMITED_STOCK_IN_STORE_SOF' || key === 'LIMITED_STOCK_IN_STORE') {
      return true;
    }
    return false;
  }
  checkInventoryCheck(key) {
    return key === 'INVENTORY_LOOK_UP_NOT_AVAILABLE_STORE';
  }
  showStoreTime(key) {
    return key === 'STORE_NOT_ASSOCIATED';
  }
  /**
   * Method to open the find a store modal box
   */
  openFindAStore = e => {
    const { toggleFindAStore, updateAnalytics, productItem, fnGetProductItemId, message = {}, selectedQuantity } = this.props;
    const { breadCrumb = [] } = productItem;
    const targetText = (e.target.textContent && e.target.textContent.toLowerCase()) || '';
    if (toggleFindAStore) {
      fnGetProductItemId({
        itemId: productItem.partNumber,
        skuItemId: productItem.itemId,
        categoryId: productItem.categoryId,
        productId: productItem.id,
        skuId: productItem.skuId,
        isSof: this.props.isSof,
        ecomCode: message.ecomCode,
        inventoryStatus: message && message.inventoryStatus,
        thumbnail: productItem.imageURL,
        quantity: selectedQuantity
      });
      toggleFindAStore({ status: true, isBopisEligible: false, pageType: FAM_PAGE_TYPE_PDP });
    }
    if (updateAnalytics) {
      const removeAcademyLabel = {
        removeAcademyLabel: true
      };
      updateAnalytics({
        analyticsObject: {
          event: 'pdpDetailClick',
          eventCategory: 'pdp interactions',
          eventAction: `pdp|${targetText}`,
          eventLabel: `${printBreadCrumb([...breadCrumb, productItem.name], removeAcademyLabel)}`.toLowerCase()
        }
      });
    }
  };
  /**
   * Method to check whether the store should display or not
   */
  displayStore(qty, ecomCode) {
    if (qty) {
      return true;
    } else if (ecomCode === '02') {
      return true;
    }
    return false;
  }

  checkClearance(isClearance, isSafetyStockEnabled) {
    return isClearance === 'Y' || isSafetyStockEnabled === 'Y';
  }
  /**
   * Method to select store is selected
   */
  shouldDisplayLink(key, clearance) {
    if (key === 'NOT_SOLD_IN_STORE' || key === 'BOPIS_INELIGIBLE' || key === 'NOT_AVAILABLE_IN_STORE_SOF') {
      return false;
    } else if (clearance) {
      return false;
    }
    return true;
  }
  /**
   * Method to select store is selected
   */
  isStoreSelected() {
    const myStoreDetails = this.getMystoreDetails();
    if (!myStoreDetails) return false;
    return !!Object.keys(myStoreDetails).length;
  }

  /**
   * Check if product requires assembly
   * @returns {object}
   */
  isAssemblyRequired() {
    const {
      productItem: { productAttributes }
    } = this.props;
    return productAttributes.find(attr => attr.key.toLowerCase() === ASSEMBLY_REQUIRED.toLowerCase());
  }

  formatStoreId(storeId) {
    switch (storeId.length) {
      case 1:
        return `store-000${storeId}`;
      case 2:
        return `store-00${storeId}`;
      case 3:
        return `store-0${storeId}`;
      default:
        return `store-${storeId}`;
    }
  }

  renderStoreSelection(storeInvType, storeSelected, displayLink, labels) {
    if (displayLink) {
      if (storeInvType === 'LSI') {
        return storeSelected ? labels.MORE_STORES || MORE_STORES : labels.FIND_A_STORE || FIND_A_STORE;
      } else if (storeInvType === 'BOPIS') {
        return storeSelected ? labels.CHANGE_LOCATION || CHANGE_PICKUP_LOCATION : labels.CHOOSE_PICKUP_LOCATION || CHOOSE_PICKUP_LOCATION;
      }
      return storeSelected ? labels.CHANGE_LOCATION || CHANGE_LOCATION : labels.CHOOSE_LOCATION || CHOOSE_LOCATION;
    }
    return null;
  }

  renderIcon(isAvailable, storeInvType, shipping) {
    let iconClasses;
    let topMargin = '';

    if (!shipping) {
      if (storeInvType === 'LSI') {
        iconClasses = `${IconStyle(isAvailable)} ${isAvailable ? 'academyicon icon-check-circle' : 'academyicon icon-x-circle'}`;
        topMargin = 'mt-quarter';
      } else {
        iconClasses = isAvailable ? `${InvMsg.icons} ${InvMsg.StoreIcon}` : `${InvMsg.icons} ${InvMsg.StoreIconFail}`;
      }
      return (
        <div className={`${topMargin} mr-1`}>
          <span className={iconClasses} />
        </div>
      );
    }
    return null;
  }

  renderInvMessage(message) {
    return (
      <div className={` o-copy__14bold ${InvMsg.boldText}`} data-auid="PDP_IventoryMessage">
        {message}
      </div>
    );
  }

  renderPickUpSLA(shippingInfo = {}, storeSelected, isAvailable, storeInvType) {
    if (storeInvType === 'BOPIS') {
      const { labels: { mayRequirehoursForAssembly } = {} } = this.props;
      const assemblyRequired = this.isAssemblyRequired();

      if (storeSelected && isAvailable && assemblyRequired) {
        return <p className="o-copy__14reg">{mayRequirehoursForAssembly}</p>;
      } else if (storeSelected && isAvailable && shippingInfo && shippingInfo.inStorePickUpSLA) {
        return <p className="o-copy__14reg">{this.getPickUpSLA()}</p>;
      }
      return null;
    }
    return null;
  }

  render() {
    const { message, authMsgs = {}, labels = {}, myStore = {}, shippingInfo, shipping } = this.props;
    const { city = '', state = '', zipCode = '', streetAddress = '', todayTiming, storeId } = myStore;

    const myStoreName = this.getStoreName(myStore);
    const availableBoolean = {
      true: true,
      false: false
    };
    const { key, value, showTick, isClearance, isSafetyStockEnabled, storeInvType } = message;

    const isAvailable = availableBoolean[showTick];
    const isInventoryCheck = this.checkInventoryCheck(key);
    // const showStoreTime = this.showStoreTime(key);
    const checkClearance = this.checkClearance(isClearance, isSafetyStockEnabled);
    const displayLink = this.shouldDisplayLink(key, checkClearance);
    const storeSelected = this.isStoreSelected();
    const displayStore = storeSelected && displayLink;
    return (
      <div className="col-12 px-0">
        <div className={InvMsg.flex}>
          {this.renderIcon(isAvailable, storeInvType, shipping)}
          <div className="mt-quarter">
            <div>
              {this.renderInvMessage(authMsgs[key] || value)}
              {this.renderPickUpSLA(shippingInfo, storeSelected, isAvailable, storeInvType)}
              {!isInventoryCheck &&
                displayStore && (
                  <div className="mt-quarter o-copy__14reg">
                    <a
                      className="o-copy__14reg"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`${STORE_LOCATOR_LINK}/${state}/${city}/${this.formatStoreId(storeId)}`}
                    >
                      {myStoreName}
                    </a>
                    <Tooltip
                      auid="productBopisMsg"
                      direction="top"
                      align={isIpad() ? 'L' : 'C'}
                      lineHeightFix={1.5}
                      className="body-12-normal"
                      content={
                        <div id="descriptionTooltipBopicMsg" role="alert" className={`${InvMsg.toolTipContainer} o-copy__12reg`}>
                          <div>{myStoreName}</div>
                          <div>{streetAddress}</div>
                          <div>
                            {city}, {state.toUpperCase()}, {zipCode}
                          </div>
                          <div className="mt-1">
                            <span className="o-copy__12bold">{todayTiming}</span>
                          </div>
                        </div>
                      }
                      showOnClick={isMobile()}
                      ariaLabel={myStoreName}
                    >
                      &nbsp;
                      <span>
                        <button
                          className={`academyicon icon-information pl-quarter ${tooltipStyle}`}
                          role="tooltip" //eslint-disable-line
                          aria-describedby="descriptionTooltipBopicMsg"
                        />
                      </span>
                    </Tooltip>
                    {!shipping && isAvailable && <div className="o-copy__14reg">{todayTiming}</div>}
                  </div>
                )}
              {shipping &&
                isAvailable && (
                  <div className="o-copy__14reg">
                    {ESTIMATED_SHIPPING} {this.props.estimatedShipping}
                  </div>
                )}
              {!isInventoryCheck && (
                <button
                  className={`${link} mt-quarter o-copy__14reg ${(authMsgs.isStoreLocatorEnabled === 'false' && disableClicks) || ''}`}
                  onClick={this.openFindAStore}
                  data-auid="PDP_FindAStore"
                  tabIndex="0"
                >
                  {this.renderStoreSelection(storeInvType, storeSelected, displayLink, labels)}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
BopisMessage.propTypes = {
  isSof: PropTypes.bool,
  message: PropTypes.object,
  authMsgs: PropTypes.object,
  findAStoreModal: PropTypes.object,
  toggleFindAStore: PropTypes.func,
  updateAnalytics: PropTypes.func,
  labels: PropTypes.object,
  productItem: PropTypes.object,
  fnGetProductItemId: PropTypes.func,
  myStore: PropTypes.object,
  selectedQuantity: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  shipping: PropTypes.bool,
  estimatedShipping: PropTypes.string,
  shippingInfo: PropTypes.object
};
export default BopisMessage;
