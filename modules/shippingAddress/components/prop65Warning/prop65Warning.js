import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { prop65WarningWrapper, itemThumbnail, warningText, wordBreak } from '../../shippingAddress.styles';
import { scrollIntoView } from '../../../../utils/scroll';

export class Prop65Warning extends PureComponent {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
  }
  componentDidMount() {
    this.scrollIntoView();
  }
  /**
   * returns order item details like image and name
   * @param {object} orderDetails - contain order item list which are restricted to prop 65 warning and order details
   */
  getOrderItems(orderDetails) {
    const { prop65WarningItems, orderItems } = orderDetails;
    return (
      prop65WarningItems &&
      prop65WarningItems.map(
        item =>
          orderItems.find(data => data.orderItemId === item.orderItemId)
            ? {
                ...orderItems.find(data => data.orderItemId === item.orderItemId).skuDetails.skuInfo,
                warningMsg: item.warningMessage
              }
            : ''
      )
    );
  }
  /**
   * Scroll the element to the view
   */
  scrollIntoView() {
    const el = this.wrapperRef.current;
    if (el) {
      scrollIntoView(el);
    }
  }
  /**
   * returns html string
   * @param {string} label - error message
   */
  createLabel(label) {
    return { __html: label };
  }
  /**
   * returns order items with image card and name
   * @param {object} cms - From AEM
   * @param {object} itemObj -contain order item details
   * @param {integer} k -key
   */
  renderItem(cms, itemObj, k, length) {
    const { warningMsg, name, thumbnail } = itemObj;
    let borderClass = 'border-bottom mb-1';
    if (k === length - 1) {
      borderClass = '';
    }
    return (
      <div data-auid="checkout_prop65Warning_items" className={`d-flex flex-column ${borderClass}`} key={k}>
        <div className="d-flex flex-row">
          <img data-auid={`checkout_prop65Warning_items_${name}`} src={thumbnail} alt="" className={`${itemThumbnail} mr-1`} />
          <p className="o-copy__14reg">{name}</p>
        </div>
        <div className={`o-copy__14reg mb-0 ${warningText} mt-1 d-flex flex-row`}>
          <i className="academyicon icon-alert text-warning mr-quarter" />
          <p className={`o-copy__14reg mb-0 ${wordBreak}`} dangerouslySetInnerHTML={this.createLabel(warningMsg)} />
        </div>
      </div>
    );
  }
  render() {
    const { orderDetails, cms } = this.props;
    const orderItems = this.getOrderItems(orderDetails);
    return (
      <section ref={this.wrapperRef} className={`${prop65WarningWrapper} w-100 d-flex flex-column p-1 mb-2 error`}>
        {orderItems.map((itemObj, k) => this.renderItem(cms, itemObj, k, orderItems.length))}
      </section>
    );
  }
}

Prop65Warning.propTypes = {
  orderDetails: PropTypes.object,
  cms: PropTypes.object
};

export default Prop65Warning;
