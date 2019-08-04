import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { compose } from 'redux';
import { Provider, connect } from 'react-redux';
import { get } from '@react-nitro/error-boundary';
import CartOption from '../cartOption/cartOption.component';
import CalculateShippingModal from './calculateShippingModal';
import AcceptedPaymentDisplay from '../acceptedpaymentDisplay/acceptedpaymentDisplay.component';
import PromotionalMessaging from '../promotionalMessaging/promotionalMessaging.component';
import { toggleFindAStore } from '../findAStoreModalRTwo/actions';
import { NODE_TO_MOUNT, DATA_COMP_ID, FREE_LABEL } from './constants';
import { rowStyle, promoDiv, divider, zipcodeBtn, displayBlock, heading, disableClicks } from './orderSummary.styles';
import { zipcodeValidation, zipcodeSuccess } from './actions';
import { dollarFormatter } from './../../utils/helpers';

class OrderSummary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.createOrderSummaryLabels = this.createOrderSummaryLabels.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      calculateShippingModalStatus: false
    };
    this.triggerFindStoreModal = this.triggerFindStoreModal.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { analyticsContent, zipCodeAPIInfo } = this.props;
    let pageName = '';
    if (ExecutionEnvironment.canUseDOM) {
      pageName = document.location.pathname;
    }
    const analyticsOnSubmit = {
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventAction: 'change zip code completed',
      eventLabel: pageName
    };
    if (
      !zipCodeAPIInfo.error &&
      zipCodeAPIInfo.errorInfo &&
      Object.keys(zipCodeAPIInfo.errorInfo).length === 0 &&
      zipCodeAPIInfo !== nextProps.zipCodeAPIInfo
    ) {
      analyticsContent(analyticsOnSubmit);
    }
  }
  /**
   * Method to get store name from findAStore object in props.
   * Will return empty string if no store is found.
   */
  getStoreName() {
    const { findAStore } = this.props;
    return get(findAStore, 'getMystoreDetails.neighborhood', '');
  }

  /**
   * Method to set the zipcode displayed with estimated shipping label
   * @param {number} zip : Zipcode entered by user in calculate shipping modal.
   */
  setZipCode(zip) {
    this.props.fnZipValidation({ zipcode: zip, modalToggle: this.toggleModal });
  }

  /**
   * Method to return flag,if any of item has as selected as Pick up In Store.
   */
  isPickInStoreSelected() {
    const pickupInStore = this.props.orderItems.filter(item => item.shipModeCode === 'PickupInStore');
    if (pickupInStore.length) {
      return true;
    }
    return false;
  }

  /**
   * Method to return flag, if any item has as selected as SG.
   */
  isSGSelected() {
    const pickupInStore = this.props.orderItems.filter(item => item.shipModeCode !== 'Ship To Store' && item.shipModeCode !== 'PickupInStore');
    if (pickupInStore.length) {
      return true;
    }
    return false;
  }

  /**
   * Method to return flag, if any item has as selected as STS.
   */
  isSTSSelected() {
    const pickupInStore = this.props.orderItems.filter(item => item.shipModeCode === 'Ship To Store');
    if (pickupInStore.length) {
      return true;
    }
    return false;
  }

  /**
   * function to display the order Summary details
   * @param  {array} list List of objects containing keys 'label' and 'text' to be displayed
   */
  createOrderSummaryLabels(list) {
    const { deliveryZipcode } = this.props;
    const { cms: { commonLabels } = {}, messages = {} } = this.props;
    const storeName = this.getStoreName();

    return list.map(ele => (
      <div key={ele.label} className="mb-1 mx-0 d-flex justify-content-between">
        <div className="o-copy__16reg d-flex flex-column justify-content-end">
          {ele.label}
          {ele.label === commonLabels.estimatedShippingLabel && deliveryZipcode && deliveryZipcode !== 'null' && ` to ${deliveryZipcode}`}
          {ele.label === commonLabels.inStorePickUpLabel && storeName && ` at ${storeName}`}:
          {ele.label === commonLabels.estimatedShippingLabel && (
            <button
              className={`${zipcodeBtn} o-copy__14reg text-left pl-0 ${(messages.isStoreLocatorEnabled === 'false' && disableClicks) || ''}`}
              onClick={this.toggleModal}
            >
              {commonLabels.changeZipcodeLabel}
            </button>
          )}
          {ele.label === commonLabels.inStorePickUpLabel && (
            <button
              className={`${zipcodeBtn} o-copy__14reg text-left pl-0 ${(messages.isStoreLocatorEnabled === 'false' && disableClicks) || ''}`}
              onClick={this.triggerFindStoreModal}
            >
              {commonLabels.changeLocationLabel}
            </button>
          )}
        </div>
        <div className={`${ele.text !== 'FREE' ? 'o-copy__20reg' : 'o-copy__20bold'}`}>
          {ele.text !== 'FREE' && '$'}
          {ele.text}
        </div>
      </div>
    ));
  }

  /**
   * Method to trigger opening of Find A Store modal.
   */
  triggerFindStoreModal() {
    const { analyticsContent, fnToggleFindAStore } = this.props;
    let pageName = '';
    if (ExecutionEnvironment.canUseDOM) {
      pageName = document.location.pathname;
    }
    fnToggleFindAStore({
      origin: 'cart',
      status: true,
      isBopisEligible: true,
      source: 'realtime'
    });
    const analyticsData = {
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventAction: 'change location initiated',
      eventLabel: pageName
    };
    analyticsContent(analyticsData);
  }

  /**
   * Method to toggle open and close the clculate shipping modal.
   */
  toggleModal() {
    this.setState({ calculateShippingModalStatus: !this.state.calculateShippingModalStatus });
    let pageName = '';
    if (ExecutionEnvironment.canUseDOM) {
      pageName = document.location.pathname;
    }
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventAction: 'change zip code initiated',
      eventLabel: pageName
    };
    analyticsContent(analyticsData);
  }

  render() {
    const { cms, api, analyticsContent, labels, messages = {} } = this.props;
    const {
      totalProductPrice,
      totalEstimatedShippingCharge,
      specialOrderShipToStoreCharge,
      totalAdjustment,
      employeeDiscount,
      totalEstimatedTax,
      orderTotal
    } = api;
    const freeLabel = cms.commonLabels.freeLabel ? cms.commonLabels.freeLabel.toUpperCase().trim() : FREE_LABEL;
    const orderSummaryDetails = [{ label: cms.commonLabels.subTotalLabel, text: totalProductPrice }];

    if (this.isSGSelected()) {
      orderSummaryDetails.push({
        label: cms.commonLabels.estimatedShippingLabel,
        text: parseFloat(totalEstimatedShippingCharge, 10) === 0 ? freeLabel : totalEstimatedShippingCharge
      });
    }

    if (this.isPickInStoreSelected()) {
      orderSummaryDetails.push({ label: cms.commonLabels.inStorePickUpLabel, text: freeLabel });
    }

    return (
      <div className={classNames('container', 'p-0', rowStyle)}>
        <div className={classNames('row', 'mx-0', 'pt-2 pt-md-4 px-1 px-md-0 pb-2')}>
          <div className="col-12 col-md-6 pl-lg-4 pl-md-1 pl-0">
            <h2 className={classNames('mb-1', heading)}>{cms.commonLabels.orderSummaryLabel}</h2>
            <PromotionalMessaging
              cms={cms}
              api={this.props.promotions}
              orderId={this.props.orderId}
              apiErrorDetails={this.props.promoApiDetails}
              analyticsContent={analyticsContent}
            />
          </div>
          <div className="col-12 col-md-6 pl-0 pl-sm-1 pr-lg-4 pr-md-1 pr-0">
            {this.createOrderSummaryLabels(orderSummaryDetails)}

            {/* Showing STS Label if any item selected for STS */}
            {this.isSTSSelected() && (
              <div className="mb-1 mx-0 d-flex justify-content-between">
                <div className="o-copy__16reg">
                  {cms.specialOrderShipLabel} {` ${this.getStoreName()}`}:
                  <button
                    className={`${zipcodeBtn} ${displayBlock}  o-copy__14reg text-left pl-0 mt-quarter ${(messages.isStoreLocatorEnabled === 'false' && disableClicks) || ''}`}
                    onClick={this.triggerFindStoreModal}
                  >
                    {cms.commonLabels.changeLocationLabel}
                  </button>
                </div>
                <div className="o-copy__20reg">{specialOrderShipToStoreCharge ? dollarFormatter(specialOrderShipToStoreCharge) : ''}</div>
              </div>
            )}

            <div className="mb-1 mx-0 d-flex justify-content-between">
              <div className="o-copy__16reg d-flex flex-column justify-content-end">
                {get(cms, 'commonLabels.estimatedTaxesLabel', 'Estimated Taxes')}:
              </div>
              <div className="o-copy__20reg">{dollarFormatter(totalEstimatedTax)}</div>
            </div>

            {/* Showing Promo discount if it has value */}
            {parseFloat(totalAdjustment) !== 0 &&
              !Number.isNaN(parseFloat(totalAdjustment)) && (
                <div className="mb-1 mx-0 d-flex justify-content-between">
                  <div className={classNames('o-copy__16reg d-flex flex-column justify-content-end', promoDiv)}>
                    {cms.commonLabels.discountsLabel}:
                  </div>
                  <div className={classNames('o-copy__20reg', promoDiv)}>{dollarFormatter(totalAdjustment)}</div>
                </div>
              )}

            {/* For Employee Discount */}
            {employeeDiscount &&
              parseFloat(employeeDiscount) !== 0 &&
              !Number.isNaN(parseFloat(employeeDiscount)) && (
                <div className="mb-1 mx-0 d-flex justify-content-between">
                  <div className={classNames('o-copy__16reg d-flex flex-column justify-content-end', promoDiv)}>
                    {cms.commonLabels.employeeDiscountLabel}:
                  </div>
                  <div className={classNames('o-copy__20reg', promoDiv)}>{dollarFormatter(employeeDiscount)}</div>
                </div>
              )}
            <hr className={`mt-2 ${divider}`} />
            {/* Total Value Block */}
            <div className="mb-2 pt-1 pt-lg-2 mx-0 d-flex justify-content-between">
              <div className="o-copy__16bold d-flex flex-column justify-content-end">{cms.commonLabels.totalLabel}:</div>
              <div className="o-copy__20bold">{dollarFormatter(orderTotal)}</div>
            </div>

            <CartOption
              cms={cms}
              orderId={this.props.orderId}
              orderItems={this.props.orderItems}
              findAStore={this.props.findAStore}
              bundleProductInfo={this.props.bundleProductInfo}
              ref={el => this.props.checkoutBtnRef(el)}
              analyticsContent={analyticsContent}
            />
          </div>
        </div>
        <AcceptedPaymentDisplay cms={cms} />
        {this.state.calculateShippingModalStatus && (
          <CalculateShippingModal
            cms={cms}
            clearZipcode={this.props.fnZipcodeSuccess}
            zipCodeAPIInfo={this.props.zipCodeAPIInfo}
            openModal={this.state.calculateShippingModalStatus}
            toggleModal={() => this.toggleModal()}
            onSetZipCode={zip => this.setZipCode(zip)}
            labels={labels}
          />
        )}
      </div>
    );
  }
}
OrderSummary.propTypes = {
  cms: PropTypes.object.isRequired,
  api: PropTypes.object,
  promotions: PropTypes.array,
  orderId: PropTypes.string,
  promoApiDetails: PropTypes.object,
  fnZipValidation: PropTypes.func,
  findAStore: PropTypes.object,
  fnToggleFindAStore: PropTypes.func,
  orderItems: PropTypes.array,
  deliveryZipcode: PropTypes.string,
  bundleProductInfo: PropTypes.array,
  zipCodeAPIInfo: PropTypes.object,
  fnZipcodeSuccess: PropTypes.func,
  checkoutBtnRef: PropTypes.func,
  analyticsContent: PropTypes.func,
  labels: PropTypes.object,
  messages: PropTypes.object
};

const mapDispatchToProps = dispatch => ({
  fnZipValidation: data => dispatch(zipcodeValidation(data)),
  fnToggleFindAStore: data => dispatch(toggleFindAStore(data)),
  fnZipcodeSuccess: () => dispatch(zipcodeSuccess())
});

const withConnect = connect(
  null,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const OrderSummaryContainer = compose(withConnect)(OrderSummary);
  [...document.querySelectorAll(`[data-component='${NODE_TO_MOUNT}']`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <OrderSummaryContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}
export default withConnect(OrderSummary);
