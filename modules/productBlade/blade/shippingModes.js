import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import { get } from '@react-nitro/error-boundary';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import Tooltip from '@academysports/fusion-components/dist/Tooltip';
import RadioButton from '@academysports/fusion-components/dist/RadioButton';
import * as styles from '../styles';
import { isMobile } from '../../../utils/userAgent';
import { pickupDayInfo, dateFormatter } from '../../../utils/dateUtils';
import { TODAY } from '../../../utils/constants';
import {
  pickupInStore,
  storeNotSelected,
  outOfStock,
  NOT_AVAILABLE_FOR_SHIPPING_LABEL,
  PICKUP_TODAY_LABEL,
  PICKUP_TOMORROW_LABEL,
  TIME_LABEL,
  DATE_LABEL
} from '../constants';

export class ShippingModes extends React.PureComponent {
  constructor(props) {
    super(props);
    this.tooltipRef = React.createRef();
    this.infoIconRef = React.createRef();
    this.clickHandler = this.clickHandler.bind(this);
    this.state = {
      tooltipDirection: 'top'
    };
    this.setStateForTooltipDirection = this.setStateForTooltipDirection.bind(this);
  }

  /**
   * Method is used to attach a scroll listener to window.
   */
  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      window.addEventListener('scroll', debounce(this.setStateForTooltipDirection, 300));
    }
  }

  /**
   * Method to remove the scroll listener.
   */
  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      window.removeEventListener('scroll', this.setStateForTooltipDirection);
    }
  }

  /**
   * Method to set state 'tooltipDirection' between 'top' and 'bottom'.
   */
  setStateForTooltipDirection() {
    const { tooltipDirection } = this.state;
    if (!this.tooltipRef.current || !this.infoIconRef.current) {
      return;
    }
    const infoIconDOM = ReactDOM.findDOMNode(this.infoIconRef.current).getBoundingClientRect(); //eslint-disable-line
    const tooltipDOM = ReactDOM.findDOMNode(this.tooltipRef.current).getBoundingClientRect(); //eslint-disable-line
    // 30px is added to height of div to account for padding (top and bottom, 15px each)
    // provided in the atomic component.
    const newDirection = infoIconDOM.top - (tooltipDOM.height + 30) < 0 ? 'bottom' : 'top';
    if (newDirection !== tooltipDirection) {
      this.setState({ tooltipDirection: newDirection });
    }
  }

  /**
   * Method to handle click on radio button. Calls a callback function passed as props.
   * @param  {string} choice The fulfilment method chosen('SG','STS', et al).
   */
  clickHandler(choice) {
    this.props.handleChange(choice);
  }

  /**
   * Method to return BOPIS hint text
   * @param {object} shippingObj Object will contain shipping mode information
   */
  boipsHintText(shippingObj) {
    const { cms } = this.props;
    const todayHintLabel = get(cms, 'inStorePickupLabel.inStorePickupFreeHintText', PICKUP_TODAY_LABEL);
    const tomorrowHintLabel = get(cms, 'inStorePickupLabel.inStorePickupHintText', PICKUP_TOMORROW_LABEL);
    const { estimatedTime = 'NA', estimatedFromDate = '' } = shippingObj || {};
    const hintText = pickupDayInfo(estimatedFromDate);
    return hintText === TODAY ? todayHintLabel.replace(TIME_LABEL, estimatedTime) : tomorrowHintLabel.replace(DATE_LABEL, hintText);
  }

  /**
   * Method to render change location based on shipping type and global bopis setting
   */
  renderChangeLocation = (shippingType, bopisEnabled, findAStore, storeName) => {
    if (shippingType === pickupInStore) {
      return (
        getStoreId(findAStore) && (
          <React.Fragment>
            <span className={`pl-2 o-copy__14reg ${styles.displayBlock}`}>{storeName}</span>
            {changeLocationBtn(this.props)}
          </React.Fragment>
        )
      );
    }
    return null;
  };

  /**
   * Render store details section
   */
  renderStoreDetailsSection = (shippingType, bopisEnabled, findAStore, storeName, notAvailableAtLabel) => {
    if (bopisEnabled) {
      return (
        <React.Fragment>
          <div className="d-flex o-copy__14reg mb-half">
            <i className={`${styles.unavailableIcon} mr-half academyicon ${shippingType === pickupInStore ? 'icon-store' : 'icon-package'}`} />
            <span className={`${styles.displayInlineBlock} o-copy__14bold`}>
              {shippingType === pickupInStore ? notAvailableAtLabel : NOT_AVAILABLE_FOR_SHIPPING_LABEL}
            </span>{' '}
          </div>
          {this.renderChangeLocation(shippingType, bopisEnabled, findAStore, storeName)}
        </React.Fragment>
      );
    }
    return null;
  };

  render() {
    const { tooltipDirection } = this.state;
    const { availableShippingMethods, inventory, cms, currentChoice, findAStore, itemId, bopisEnabled } = this.props;
    const storeName = get(findAStore, 'getMystoreDetails.neighborhood', storeNotSelected);

    return (
      <div data-auid="cart_radio_button_div" className="pl-sm-0 pb-2 pb-md-0">
        {availableShippingMethods.map((obj, i) => (
          <div className={i !== availableShippingMethods.length - 1 ? 'mb-1' : undefined} key={obj.shippingType}>
            {!showUnavailableMsgInMode(obj.shippingType, inventory) ? (
              <div className={`o-copy__14bold mb-0 ${styles.radioButtonLabel} ${!bopisEnabled && styles.hideRadioBtn}`}>
                <RadioButton
                  data-auid={`crt_rdOpt_${i}`}
                  aria-labelledby={cms.commonLabels[obj.shippingType]}
                  id={`shipmentOptions${itemId}-${obj.shippingType}`}
                  value={obj.shippingType}
                  key={obj.shippingType}
                  radioName="shipmentOptions"
                  name={`shipmentOptions${itemId}`}
                  initialState={currentChoice}
                  onChange={this.clickHandler}
                  onKeyDown={event => event.key === 'Enter' && this.clickHandler}
                >
                  <span
                    className={`body-14-bold ${bopisEnabled && 'pl-2'} ${styles.displayInlineBlock}`}
                    aria-label={
                      obj.estimatedFromDate && obj.estimatedToDate
                        ? `Ship to me, estimate arrival between ${dateFormatter(obj.estimatedFromDate)} and ${dateFormatter(obj.estimatedToDate)}`
                        : ''
                    }
                  >
                    {cms.commonLabels[obj.shippingType]}
                  </span>
                </RadioButton>
              </div>
            ) : (
              this.renderStoreDetailsSection(obj.shippingType, bopisEnabled, findAStore, storeName, cms.inStorePickupLabel.notAvailableAtLabel)
            )}

            {currentChoice === obj.shippingType && (
              <span className="o-copy__14reg">
                {/* For SG, Display only Estimated arrival Date with tooltip */}
                {currentChoice === 'SG' &&
                  !showUnavailableMsgInMode(obj.shippingType, inventory) && (
                    <span className={`${bopisEnabled && 'pl-2'} mt-quarter ${styles.displayInlineBlock}`}>
                      {cms.estArrivalLabel}{' '}
                      {`${dateFormatter(getDateFromProps(availableShippingMethods, 'estimatedFromDate')) || ''} - 
                      ${dateFormatter(getDateFromProps(availableShippingMethods, 'estimatedToDate')) || ''}`}
                      {getTooltipContent(obj.shippingType, findAStore, cms, this.tooltipRef) &&
                        constructTooltip(i, obj, this.tooltipRef, this.infoIconRef, tooltipDirection, this.setStateForTooltipDirection, this.props)}
                    </span>
                  )}

                {/* Show if store not selected and user selected BOPIS */}
                {obj.shippingType === pickupInStore &&
                  !getStoreId(findAStore) && (
                    <React.Fragment>
                      <span className={`pl-2  mt-quarter ${styles.displayBlock}`}>{storeName}</span>
                      {changeLocationBtn(this.props, cms.commonLabels.findAStoreLabel)}
                    </React.Fragment>
                  )}

                {/* Pickup Message */}
                {obj.shippingType === pickupInStore &&
                  storeName !== storeNotSelected &&
                  obj.estimatedFromDate && <span className={`pl-2  mt-quarter ${styles.displayBlock}`}>{this.boipsHintText(obj)}</span>}

                {/* Store Details and Pickup information */}
                {currentChoice !== 'SG' &&
                  !showUnavailableMsgInMode(obj.shippingType, inventory) &&
                  (storeName !== storeNotSelected && (
                    <React.Fragment>
                      <span className={`${bopisEnabled && 'pl-2'} mt-quarter`}>
                        {storeName}
                        {getTooltipContent(obj.shippingType, findAStore, cms, this.tooltipRef) &&
                          constructTooltip(i, obj, this.tooltipRef, this.infoIconRef, tooltipDirection, this.setStateForTooltipDirection, this.props)}
                      </span>
                      {currentChoice === 'STS' ? (
                        <span className={`${bopisEnabled && 'pl-2'} ${styles.displayBlock}`}>
                          {`${cms.estArrivalLabel} ${dateFormatter(obj.estimatedFromDate) || ''} - ${dateFormatter(obj.estimatedToDate) || ''}`}
                        </span>
                      ) : (
                        <span className={`${bopisEnabled && 'pl-2'} ${styles.displayBlock}`}>{getOpenHours(findAStore)}</span>
                      )}
                    </React.Fragment>
                  ))}
              </span>
            )}
          </div>
        ))}
        {availableShippingMethods.length === 1 &&
          bopisEnabled && (
            <div className={`notEligible d-flex mt-1 ${styles.displayInlineBlock}`}>
              <i className={`${styles.unavailableIcon} mr-half academyicon icon-store`} />
              <span className="o-copy__14bold">{cms.inStorePickupLabel.notAvailableForPickupLabel}</span>
            </div>
          )}
      </div>
    );
  }
}

ShippingModes.propTypes = {
  handleChange: PropTypes.func,
  availableShippingMethods: PropTypes.array,
  inventory: PropTypes.object,
  cms: PropTypes.object,
  itemId: PropTypes.string,
  currentChoice: PropTypes.string,
  findAStore: PropTypes.object,
  bopisEnabled: PropTypes.bool
};

/**
 * Method to construct button for changing location of store.
 * @param {object} props Props; containing method for opening FASM modal.
 */
export const changeLocationBtn = (props, name) => (
  <button className={`${styles.changeLocationBtn} pl-2 o-copy__14reg`} onClick={() => props.toggleFASM(true)}>
    {name || props.cms.commonLabels.changeLocationLabel}
  </button>
);

changeLocationBtn.propTypes = {
  toggleFASM: PropTypes.func,
  cms: PropTypes.object
};

export const getDateFromProps = (availableShippingMethods, identifier) =>
  availableShippingMethods.filter(obj => obj.shippingType === 'SG')[0][identifier];

/**
 * Method to determine if particular mode has to be replaced with Not Available messaging.
 * @param {string} type ship mode type
 * @param {array} inventory Inventory details for the product
 */
export const showUnavailableMsgInMode = (type, inventory) => {
  if (type === pickupInStore && inventory.store && inventory.store.length) {
    return inventory.store[0].inventoryStatus === outOfStock;
  } else if (type !== pickupInStore) {
    return !inventory.online || inventory.online[0].inventoryStatus === outOfStock;
  }
  return false;
};

/**
 * Method to return storeName from FASM Object.
 * Negative fallback added.
 * @param {object} findAStore FASM object
 */
export const getStoreName = findAStore => {
  if (findAStore && findAStore.getMystoreDetails && findAStore.getMystoreDetails.neighborhood) {
    return findAStore.getMystoreDetails.neighborhood;
  }
  return storeNotSelected;
};

/**
 * Method to return open hours for store selected. Default time returned if no store is selected.
 * @param {object} findAStore : FASM object for store selected.
 */
export const getOpenHours = findAStore => {
  if (!findAStore) {
    return '';
  }
  const { todayTiming } = findAStore.getMystoreDetails || {};
  return todayTiming || '';
};

/**
 * Method to return Boolean value corresponding to whether a store is selected or not.
 * @param {object} findAStore : FASM object
 */
export const getStoreId = findAStore => {
  if (findAStore && findAStore.getMystoreDetails && findAStore.getMystoreDetails.storeId) {
    return true;
  }
  return false;
};

/**
 * Method to construct tooltip next to secondary text below radio button label.
 * @param {number} i unique index for appending to auid,
 * @param {object} obj Object of availableShippingMethods array for which tooltip is being constructed
 * @param {object} tooltipRef Ref to be passed to div shown when tooltip is opened.
 * @param {object} infoIconRef Ref to be attached to info icon.
 * @param {string} tooltipDirection Param used for 'direction' passed into Tooltip atomic component.
 * @param {function} setStateForTooltipDirection Callback method to be fired on hover of tooltip
 * @param {object} prop Props passed from parent object.
 */
export const constructTooltip = (i, obj, tooltipRef, infoIconRef, tooltipDirection, setStateForTooltipDirection, prop) => (
  <Tooltip
    auid={`crt_rdTooltip_${i}`}
    direction={`${tooltipDirection}`}
    align="C"
    lineHeightFix={1.5}
    content={getTooltipContent(obj.shippingType, prop.findAStore, prop.cms, tooltipRef)}
    showOnClick={isMobile()}
    ariaLabel={prop.cms.toolTipMessage}
  >
    <button
      className={`academyicon icon-information ml-quarter ${styles.tootipIcon}`}
      ref={infoIconRef}
      onMouseOver={setStateForTooltipDirection}
      onFocus={setStateForTooltipDirection}
      onKeyDown={setStateForTooltipDirection}
      onClick={setStateForTooltipDirection}
      role="tooltip" //eslint-disable-line
      aria-describedby="descriptionTooltipCart"
    />
  </Tooltip>
);

/**
 * Method to return tooltip content based on shipping type
 * @param {string} type Shipping Type
 * @param {object} findAStore FASM Object
 * @param {object} cms CMS object
 * @param {object} tooltipRef Ref to be attached to the div in tooltip content.
 */
export const getTooltipContent = (type, findAStore, cms, tooltipRef = null) => {
  if (type === 'SG') {
    return (
      <div className={`o-copy__12reg ${styles.storeInfo}`} ref={tooltipRef} role="alert" id="descriptionTooltipCart">
        {cms.toolTipMessage}
      </div>
    );
  }
  if (!findAStore || !findAStore.getMystoreDetails || !findAStore.getMystoreDetails.neighborhood) {
    return false;
  }
  const { neighborhood, streetAddress, city, state, zipCode, todayTiming } = findAStore.getMystoreDetails;
  return (
    <div className={`${styles.storeInfo} o-copy__12reg`} ref={tooltipRef}>
      <span>{neighborhood}</span>
      <span>{streetAddress}</span>
      <span>
        {city},{state && state.toUpperCase()} {zipCode}
      </span>
      <span className="mt-half">
        <span className="o-copy__12bold">{todayTiming}</span>
      </span>
    </div>
  );
};
