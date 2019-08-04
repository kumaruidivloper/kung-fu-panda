import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from '@academysports/fusion-components/dist/Drawer';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { orderSummaryDiv, orderSummaryHeading, orderSummaryLine, addIcon, pricesBox, itemImage, itemRow, itemRowValue, itemBox, itemImageBox, itemsBox, editMyCart, upperBorderBox, hideOndesktop, showOndesktop, itemsArrowIcon, drawerBodyStyle, titleStyleOpen, titleStyle, orderSummaryBox, BoxBorder } from './style';

class OrderSumaryCheckout extends React.PureComponent {
  getDrawerBodyHeight(order) {
    return window.innerWidth < 768 ? this.calcDrawerBodyHeight(order) : 'auto';
  }

  shouldDrawerbeCollapsible() {
    return window.innerWidth < 768;
  }

  calcDrawerBodyHeight(order) {
    return order.orderItems.length > 2 ? '30rem' : `${(order.orderItems.length * 11) + 5}rem`;
  }

  renderItem(itemObj, cms, k) {
    return (
      <div className={`d-flex ${itemBox}`} key={k}>
        <div className={`${itemImageBox}`}>
          <img src={itemObj.orderItem.skuDetails.skuInfo.thumbnail} alt={itemObj.orderItem.skuDetails.skuInfo.imageAltDescription} className={`${itemImage}`} />
        </div>
        <div className="d-flex flex-column flex-grow-1 ">
          <div>
            <div className="o-copy__14reg">
              {itemObj.orderItem.skuDetails.skuInfo.name}
            </div>
          </div>
          {
            itemObj.orderItem.skuDetails.skuInfo.skuAttributes.map(attribute => (
              <div className={`d-flex ${itemRow}`}>
                <div className="o-copy__14bold">
                  {attribute.name}:
                </div>
                <div className={`o-copy__14reg ${itemRowValue}`}>
                  {attribute.value}
                </div>
              </div>
              ))
          }
          <div className={`d-flex justify-content-between ${itemRow}`}>
            <div className="d-flex">
              <div className="o-copy__14bold">
                {cms.commonLabels.quantityLabel}:
              </div>
              <div className={`o-copy__14reg ${itemRowValue}`}>
                {itemObj.orderItem.quantity}
              </div>
            </div>
            <div className="d-flex">
              <div className="o-copy__16reg">
                ${itemObj.orderItem.unitPrice}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  renderSummary(cms, order) {
    return (
      <div className={`d-flex flex-wrap px-1 pt-2 ${orderSummaryBox} ${upperBorderBox}`}>
        <div className="w-100">
          <h6 className={`${orderSummaryHeading}`}>Order Summary</h6>
        </div>

        <div className="w-100">
          <div className="o-copy__14reg">
            <div><i className={`academyicon icon-plus mr-1 ${addIcon}`} /> {cms.commonLabels.addPromoCodeLabel}</div>
          </div>
        </div>
        <div className={`${pricesBox} w-100`}>
          <div className="w-100 d-flex justify-content-between mt-1">
            <div className="o-copy__14reg">
              {cms.commonLabels.subTotalLabel}:
            </div>
            <div className="o-copy__16reg">
              ${order.totals.totalProductPrice || '0.00'}
            </div>
          </div>
          <div className={`w-100 d-flex justify-content-between ${orderSummaryLine}`}>
            <div className="o-copy__14reg">
              {cms.commonLabels.shippingLabel}:
            </div>
            <div className="o-copy__16bold">
              {Number(order.totals.totalShippingCharge) > 0 ? `$${order.totals.totalShippingCharge}` : cms.commonLabels.freeLabel}
            </div>
          </div>

          <div className={`w-100 d-flex justify-content-between ${orderSummaryLine}`}>
            <div className="o-copy__14reg">
              {cms.commonLabels.taxesLabel}:
            </div>
            <div className="o-copy__16reg">
              ${order.totals.totalEstimatedTax || '0.00'}
            </div>
          </div>
        </div>

        <div className={`w-100 d-flex justify-content-between ${orderSummaryLine}`}>
          <div className="o-copy__16bold">
            {cms.commonLabels.totalLabel}:
          </div>
          <div className="o-copy__20bold">
            ${order.totals.orderTotal}
          </div>
        </div>
      </div>
    );
  }

  renderTitleForItems(cms, order) {
    return (
      <div className="d-flex w-100">
        <div className="o-copy__16reg mr-auto">
          {cms.commonLabels.itemsLabel} ({order.orderItems.length})
        </div>
        <div className={`o-copy__16bold ${hideOndesktop}`}>
          {cms.commonLabels.totalLabel}: ${order.totals.orderTotal}
        </div>
      </div>
    );
  }

  renderItemsCard(cms, order, cartUrl) {
    return (
      <Drawer closeIcon={`academyicon icon-chevron-up ml-1 ${itemsArrowIcon}`} openIcon={`academyicon icon-chevron-down ml-1 ${itemsArrowIcon}`} title={this.renderTitleForItems(cms, order)} backgroundColor="#FFFFFF" bodyHeight={this.getDrawerBodyHeight(order)} expandBelow={false} isCollapsible={this.shouldDrawerbeCollapsible()} titleStyle={this.shouldDrawerbeCollapsible() ? null : titleStyle} bodyStyle={drawerBodyStyle} titleStyleOpen={titleStyleOpen}>
        <div>
          <div className={`w-100 ${editMyCart} ${hideOndesktop}`} >
            {this.renderEditCartOption(cms, cartUrl)}
          </div>
          <div className={`${BoxBorder} pb-1 w-100 ${showOndesktop}`}>
          </div>
          <div className={`${itemsBox}`}>
            <div className="w-100 text-uppercase o-copy__14reg">
              <i className="academyicon icon-chevron-down pr-1" />{cms.commonLabels.shippingItemsLabel}
            </div>
            { order.orderItems.map((itemObj, k) => this.renderItem(itemObj, cms, k)) }
            <div className={`w-100 ${editMyCart} ${showOndesktop}`} >
              {this.renderEditCartOption(cms, cartUrl)}
            </div>
          </div>
        </div>
      </Drawer>
    );
  }

  renderEditCartOption(cms, cartUrl) {
    return (
      <a data-auid="checkout_order_summary_edit_cart_link" href={`${cartUrl}`}>
        <div className="w-100 o-copy__14reg">
          <i className="academyicon icon-plus" /> {cms.commonLabels.editMyCartLabel}
        </div>
      </a>
    );
  }

  render() {
    const {
      cms, order, cartUrl
    } = this.props;
    return (
      <div className={`w-100 d-flex ${orderSummaryDiv}`}>
        {this.renderSummary(cms, order)}
        {this.renderItemsCard(cms, order, cartUrl)}
      </div>
    );
  }
}

OrderSumaryCheckout.propTypes = {
  cms: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  cartUrl: PropTypes.string.isRequired
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <OrderSumaryCheckout {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />,
      el
    );
  });
}

export default OrderSumaryCheckout;
