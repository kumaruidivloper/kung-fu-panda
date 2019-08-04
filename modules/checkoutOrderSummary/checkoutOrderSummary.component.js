import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { cx } from 'emotion';
import Drawer from '@academysports/fusion-components/dist/Drawer';
import { has } from './../../utils/objectUtils';
import { NODE_TO_MOUNT, DATA_COMP_ID, ITEMS_FOR_PICKUP, SHIP_TO_STORE, orderSummaryAnalyticsEventAction } from './constants';
import { ANALYTICS_SUB_EVENT_IN, ANALYTICS_EVENT_CATEGORY } from './../checkoutReviewOrder/constants';
import {
  editCartLink,
  orderSummaryDiv,
  orderSummaryHeading,
  pricesBox,
  itemImage,
  editMyCart,
  upperBorderBox,
  hideOndesktop,
  showOndesktop,
  itemsArrowIcon,
  drawerBodyStyle,
  titleStyleOpen,
  titleStyle,
  BoxBorder,
  discountColor,
  fontIconColor,
  triangleUp,
  bundleItemContainer,
  imageMobileView,
  sticky,
  positionRelative,
  orderExpandedHeight,
  imageContainer,
  fullWidth,
  shippingItem,
  colorGreen,
  stickyBackGroundColor
} from './style';
import { dollarFormatter } from './../../utils/helpers';
class CheckoutOrderSummary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      makeSticky: false
    };
    this.OSummaryRef = React.createRef();
    this.makeSummarySticky = this.makeSummarySticky.bind(this);
    this.onEditCart = this.onEditCart.bind(this);
  }

  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      window.addEventListener('scroll', this.makeSummarySticky);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { orderDetails } = nextProps;
    // calculate sticky height only after order API response is returned
    if (orderDetails && orderDetails.orderItems.length > 0) {
      this.makeSummarySticky();
    }
  }
  /**
   * tracks analytics on click of edit cart link
   * @param {string} label link text
   */
  onEditCart(label) {
    const { analyticsContent } = this.props;

    const analyticsData = {
      event: ANALYTICS_SUB_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: orderSummaryAnalyticsEventAction,
      eventLabel: `${label.toLowerCase()}`,
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    };

    analyticsContent(analyticsData);
  }
  /**
   * gets Height for the Drawer body
   * @param {object} order Order Summary with all Order Items
   */
  getDrawerBodyHeight(order) {
    return window.innerWidth < 768 ? this.calcDrawerBodyHeight(order) : 'auto';
  }
  /**
   * it gets the order items which needs to show as bundle items.
   * @param {Object} itemjson - order items json coming from order details
   * @param {Object} cms - standard cms json
   */
  getBundle(itemjson, cms) {
    return itemjson.bundleProductInfo.map(bundle => (
      <div className="mt-2">
        <div className="d-flex">
          <div className={imageMobileView}>
            <div className={`${imageContainer} mr-half`}>
              <img className={`${itemImage}`} alt={bundle.skuDetails.skuInfo.imageAltDescription} src={bundle.skuDetails.skuInfo.thumbnail} />
            </div>
          </div>
          <div className="flex-column flex-grow-1">
            <span>{bundle.skuDetails.skuInfo.name}</span>
            <div className="d-flex justify-content-between flex-wrap">
              <span>
                <strong className="o-copy__14bold">{cms.commonLabels.quantityLabel}:</strong> {bundle.quantity}
              </span>
              <span className="o-copy__16reg">{dollarFormatter(bundle.orderItemPrice)}</span>
            </div>
          </div>
        </div>
        <div className="">
          <div className={`${triangleUp} ml-3`} />
          <div className={`${bundleItemContainer} col-12 py-1`}>
            <div className="px-half">
              {bundle.bundleOrderItems.map(item =>
                itemjson.orderItems.map((orderItem, k) => (orderItem.orderItemId === item.orderItemId ? this.renderItem(orderItem, cms, k) : null))
              )}
            </div>
          </div>
        </div>
      </div>
    ));
  }

  /**
   * make summary sticky if the bottom position of drawer goes below the viewport
   */
  makeSummarySticky() {
    const orderSummaryStickyElm = document.querySelector('.orderSummary');
    const bounding = this.OSummaryRef.current.getBoundingClientRect();
    let shouldStick = false;
    if (bounding.bottom > (window.innerHeight || document.documentElement.clientHeight)) {
      orderSummaryStickyElm.style.height = `${bounding.height}px`;
      shouldStick = true;
    } else {
      shouldStick = false;
      orderSummaryStickyElm.style.height = 'auto';
    }
    this.setState({
      makeSticky: shouldStick
    });
  }
  /**
   * segregates order items on the basis of fulfillment type [Pickup, Shiptostore and shipping to home]
   * @param {object} order object with order Details
   */
  groupItems(order) {
    const pickupItems = order.orderItems.filter(item => item.shipModeCode === ITEMS_FOR_PICKUP);
    const shipToStoreItems = order.orderItems.filter(item => item.shipModeCode === SHIP_TO_STORE);
    const shippingItems = order.orderItems.filter(item => item.shipModeCode !== ITEMS_FOR_PICKUP && item.shipModeCode !== SHIP_TO_STORE);
    return { pickupItems, shipToStoreItems, shippingItems };
  }

  /**
   * Should Drawer be Collapsible, [it shd be in mobile view]
   */
  shouldDrawerbeCollapsible() {
    return window.innerWidth < 768;
  }

  /**
   * Calculates the height of Collapsible Body of Drawer based on no. of items
   * @param {object} order Order Summary with all Order Items
   */
  calcDrawerBodyHeight(order) {
    return order.orderItems.length > 2 ? orderExpandedHeight : `${order.orderItems.length * 11}rem`;
  }

  /**
   * Renders a Order Item for Drawer
   * @param {object} itemObj Object with Item Details
   * @param {object} cms Lables from AEM CMS
   * @param {number} k unique key
   */
  renderItem(itemObj, cms, k) {
    return (
      <div data-auid="checkout_order_summary_shipping_items" className={`${k === 0 ? 'mt-1' : 'mt-2'} d-flex`} key={k}>
        <div className={imageMobileView}>
          <div className={`${imageContainer} mr-half`}>
            <img
              data-auid={`checkout_order_summary_img_${itemObj.skuDetails.skuInfo.name}`}
              src={itemObj.skuDetails.skuInfo.thumbnail}
              alt={itemObj.skuDetails.skuInfo.imageAltDescription}
              className={`${itemImage}`}
            />
          </div>
        </div>
        <div className="flex-column flex-grow-1">
          <div>
            <div className="o-copy__14reg mb-quarter">{itemObj.skuDetails.skuInfo.name}</div>
          </div>
          {itemObj.skuDetails.skuInfo.skuAttributes.map(attribute => (
            <div className="pb-quarter">
              <span className="o-copy__14bold">{attribute.name}:</span>
              <span className={`o-copy__14reg ml-half ${fullWidth}`}>{attribute.value}</span>
            </div>
          ))}
          <div className="d-flex justify-content-between flex-xs-row flex-sm-column flex-lg-row flex-wrap">
            <div className="mr-quarter">
              <span className="o-copy__14bold">{cms.commonLabels.quantityLabel}:</span>
              <span className="o-copy__14reg ml-quarter">{itemObj.quantity}</span>
            </div>
            <div className="o-copy__16reg">{dollarFormatter(itemObj.unitPrice)}</div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renders the Order Summary with Subtotal taxes and all
   * @param {object} cms Labels From AEM CMS
   * @param {object} order Object with order data
   * @param {boolean} shippingAddressRequired flag that tells is shipping Address Required
   */
  renderSummary(cms, orderTotals, shippingAddressRequired, items) {
    const subTotal = orderTotals.totalProductPrice;
    const shipping = shippingAddressRequired ? orderTotals.totalEstimatedShippingCharge : orderTotals.totalShippingCharge;
    const tax = shippingAddressRequired ? orderTotals.totalEstimatedTax : orderTotals.totalTax;
    const { commonLabels, inStorePickupLabel, orderSummaryGiftCardText } = cms;
    const {
      orderSummaryLabel,
      subTotalLabel,
      estimatedShippingLabel,
      shippingLabel,
      freeLabel,
      employeeDiscountLabel,
      estimatedTaxesLabel,
      taxesLabel,
      discountsLabel,
      totalLabel
    } = commonLabels;
    const freeShip = Number(shipping) === 0;
    return (
      <Fragment>
        <div className="w-100">
          <h2 className={`${orderSummaryHeading} mb-half`}>{orderSummaryLabel}</h2>
        </div>
        <div className={`${pricesBox} pb-1 w-100`}>
          {/* SubTotal */}
          <div className="w-100 d-flex justify-content-between mt-1 mt-md-1">
            <div className="o-copy__14reg">{subTotalLabel}:</div>
            <div className="o-copy__16reg">{dollarFormatter(subTotal)}</div>
          </div>
          {/* Shipping */}
          {items.shippingItems.length > 0 && (
            <div className="w-100 d-flex justify-content-between mt-half mt-md-1">
              <div className="o-copy__14reg">{shippingAddressRequired ? estimatedShippingLabel : shippingLabel}:</div>
              <div className={`${freeShip ? 'o-copy__16bold' : 'o-copy__16reg'}`}>
                {freeShip ? freeLabel.toUpperCase() : dollarFormatter(shipping)}
              </div>
            </div>
          )}
          {/* In Store Pickup */}
          {items.pickupItems.length > 0 && (
            <div className="w-100 d-flex justify-content-between mt-half mt-md-1">
              <div className="o-copy__14reg">{cms.inStorePickupLabel.inStorePickupLabel}:</div>
              <div className="o-copy__16bold">{freeLabel.toUpperCase()}</div>
            </div>
          )}
          {/* Spl order */}
          {has(orderTotals, 'specialOrderShipToStoreCharge') && (
            <div className="w-100 d-flex justify-content-between mt-half mt-md-1">
              <div className="o-copy__14reg">{inStorePickupLabel.shipTostoreLabel}:</div>
              <div className="copy__16reg">{dollarFormatter(orderTotals.specialOrderShipToStoreCharge)}</div>
            </div>
          )}
          {/* Taxes */}
          <div className="w-100 d-flex justify-content-between mt-half mt-md-1">
            <div className="o-copy__14reg">{shippingAddressRequired ? estimatedTaxesLabel : taxesLabel}:</div>
            <div className="o-copy__16reg">{dollarFormatter(tax)}</div>
          </div>
          {/* Discounts */}
          <Fragment>
            {has(orderTotals, 'employeeDiscount') && (
              <div className="w-100 d-flex justify-content-between mt-half mt-md-1">
                <div className={`o-copy__14reg ${discountColor}`}>{employeeDiscountLabel}:</div>
                <div className={`o-copy__16bold ${discountColor}`}>{dollarFormatter(orderTotals.employeeDiscount)}</div>
              </div>
            )}
            {has(orderTotals, 'totalAdjustment') && (
              <div className="w-100 d-flex justify-content-between mt-half mt-md-1">
                <div className={`o-copy__14reg ${discountColor}`}>{discountsLabel}:</div>
                <div className={`o-copy__16reg ${discountColor}`}>{dollarFormatter(orderTotals.totalAdjustment)}</div>
              </div>
            )}
          </Fragment>
          {/* gift Cards */}
          {has(orderTotals, 'gcAppliedAmount') && (
            <div className="w-100 d-flex justify-content-between mt-half mt-md-1">
              <div className={cx('o-copy__14reg', colorGreen)}>{orderSummaryGiftCardText}</div>
              <div className={cx('o-copy__16reg', colorGreen)}>-{dollarFormatter(orderTotals.gcAppliedAmount)}</div>
            </div>
          )}
        </div>
        {/* Totals */}
        <div className="w-100 d-flex justify-content-between mt-1">
          <div className="o-copy__16bold align-self-center">{totalLabel}:</div>
          <div className="o-copy__16bold align-self-center">{dollarFormatter(orderTotals.orderGrandTotal)}</div>
        </div>
      </Fragment>
    );
  }
  /**
   *
   * renderItemsCount will return the products quantity
   * @param {array} items products array
   */
  renderItemsCount(items) {
    if (typeof items === 'object') {
      return items.map(item => item.quantity).reduce((total, num) => total + num);
    }
    return null;
  }
  /**
   * Renders the title for Drawer
   * @param {object} cms Labels from AEM CMS
   * @param {object} order Order Data
   */
  renderTitleForItems() {
    const {
      cms,
      orderDetails,
      orderDetails: { orderItems = 0 }
    } = this.props;
    return (
      <div className="d-flex w-100">
        <div className="o-copy__16reg mr-auto">
          {cms.commonLabels.itemsLabel} ({this.renderItemsCount(orderItems)})
        </div>
        <div className={`o-copy__16bold ${hideOndesktop}`}>
          {cms.commonLabels.totalLabel}: {dollarFormatter(orderDetails.totals.orderGrandTotal)}
        </div>
      </div>
    );
  }
  renderItems(cms, order, Items, cat, icon, type = '') {
    return (
      <div className={`${BoxBorder} ${shippingItem} my-1 pt-1 w-100 `}>
        <div className="w-100 text-uppercase o-copy__14reg d-flex align-items-center">
          <i className={`${fontIconColor} ${icon} subtitle-24`} />
          {cat}
        </div>
        {Items.map((item, k) => (item.isBundleItem ? null : this.renderItem(item, cms, k)))}
        {type !== 'shipToStoreItems' && order.bundleProductInfo.length > 0 && this.getBundle(order, cms)}
      </div>
    );
  }

  /**
   * renders Items Drawer
   * @param {object} cms Labels from AEM CMS
   * @param {object} order Order Data
   * @param {string} cartUrl Url to navigate to cart Page
   */
  renderItemsCard(cms, order, cartUrl, items) {
    const { orderDetails } = this.props;
    const { shippingAddressRequired } = orderDetails.checkoutStates;
    const groupedItem = this.groupItems(orderDetails);
    return (
      <div className={`${stickyBackGroundColor}`}>
        <Drawer
          closeIcon={`academyicon icon-chevron-up ml-1 ${itemsArrowIcon}`}
          openIcon={`academyicon icon-chevron-down ml-1 ${itemsArrowIcon}`}
          title={this.renderTitleForItems()}
          backgroundColor="#FFFFFF"
          bodyHeight={this.getDrawerBodyHeight(order)}
          expandBelow={false}
          isCollapsible={this.shouldDrawerbeCollapsible()}
          titleStyle={this.shouldDrawerbeCollapsible() ? null : titleStyle}
          bodyStyle={drawerBodyStyle}
          titleStyleOpen={titleStyleOpen}
          tabIndex={-1}
        >
          <div data-auid="checkout_order_summary_drawer_m">
            <div className={`w-100 pb-0 pb-md-1 pt-md-half ${editMyCart} ${hideOndesktop}`}>{this.renderEditCartOption(cms, cartUrl)}</div>
            <div>
              <div>
                {items.shippingItems.length > 0 &&
                  this.renderItems(cms, order, items.shippingItems, cms.commonLabels.shippingItemsLabel, 'academyicon icon-package pr-1')}
              </div>
              <div>
                {items.pickupItems.length > 0 &&
                  this.renderItems(cms, order, items.pickupItems, cms.inStorePickupLabel.itemsForPickupLabel, 'academyicon icon-store pr-1')}
              </div>
              <div>
                {items.shipToStoreItems.length > 0 &&
                  this.renderItems(
                    cms,
                    order,
                    items.shipToStoreItems,
                    cms.inStorePickupLabel.specialOrderShipToStoreTitle,
                    'academyicon icon-shipping-truck pr-1',
                    'shipToStoreItems'
                  )}
              </div>
              <div className={`w-100 pb-2 pb-md-3 pt-md-1 ${editMyCart} ${showOndesktop}`}>{this.renderEditCartOption(cms, cartUrl)}</div>
            </div>
            <Fragment>
              {this.state.makeSticky && (
                <div className={`${BoxBorder} my-1 pt-1`}>{this.renderSummary(cms, orderDetails.totals, shippingAddressRequired, groupedItem)}</div>
              )}
            </Fragment>
          </div>
        </Drawer>
      </div>
    );
  }
  /**
   * Renders the Edit Cart Option
   * @param {object} cms Labels from AEM CMS
   * @param {string} cartUrl Url to navigate to cart Page
   */
  renderEditCartOption(cms, cartUrl) {
    return (
      <a
        data-auid="checkout_order_summary_edit_cart_link"
        className={`pr-half ${editCartLink}`}
        href={`${cartUrl}`}
        onClick={() => this.onEditCart(cms.commonLabels.editMyCartLabel)}
      >
        <i className="academyicon icon-pencil mr-half o-copy__16reg align-middle" />
        <span className="o-copy__14reg align-middle">{cms.commonLabels.editMyCartLabel}</span>
      </a>
    );
  }

  render() {
    const { cms, orderDetails, cartUrl } = this.props;
    const { shippingAddressRequired } = orderDetails.checkoutStates;
    const items = this.groupItems(orderDetails);
    return (
      <div>
        <div className={`w-100 d-flex ${orderSummaryDiv}`}>
          <div data-auid="checkout_order_summary_section" className={`d-flex flex-wrap px-2 pt-2 mb-2 mb-md-1 ${upperBorderBox}`}>
            {this.renderSummary(cms, orderDetails.totals, shippingAddressRequired, items)}
          </div>
          <div className="orderSummary pt-md-1" ref={this.OSummaryRef}>
            <div className={`w-100 ${this.state.makeSticky ? sticky : positionRelative}`}>
              {this.renderItemsCard(cms, orderDetails, cartUrl, items)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CheckoutOrderSummary.propTypes = {
  cms: PropTypes.object.isRequired,
  orderDetails: PropTypes.object.isRequired,
  cartUrl: PropTypes.string.isRequired,
  analyticsContent: PropTypes.func
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<CheckoutOrderSummary {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default CheckoutOrderSummary;
