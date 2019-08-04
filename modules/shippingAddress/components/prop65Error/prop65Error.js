import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { prop65ErrorWrapper, errorText, itemThumbnail, thumbnailImg } from '../../shippingAddress.styles';
import { scrollIntoView } from '../../../../utils/scroll';

export class Prop65Error extends PureComponent {
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.errorRef = React.createRef();
    this.removeItem = this.removeItem.bind(this);
  }
  componentDidMount() {
    const removeLink = this.errorRef.current.querySelector('a');
    if (removeLink) {
      removeLink.removeEventListener('click', this.removeItem);
      removeLink.addEventListener('click', this.removeItem, false);
    }
    this.scrollIntoView();
  }
  /**
   * returns order item details like image and name
   * @param {Array} errorData - contain order item list which are restricted to prop 65
   */
  getOrderItems(errorData) {
    const { orderDetails } = this.props;
    return errorData.map(
      item =>
        orderDetails.orderItems.find(data => data.orderItemId === item)
          ? orderDetails.orderItems.find(data => data.orderItemId === item).skuDetails.skuInfo
          : ''
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
   * handles remove item
   * @param {event} evt - event
   */
  removeItem(evt) {
    evt.preventDefault();
    this.props.onRemove();
  }
  /**
   * returns html string
   * @param {string} label - error message
   */
  createLabel(label) {
    return { __html: label };
  }
  /**
   * it return order items with image card and name
   * @param {object} itemObj - contain order item details
   * @param {interger} k - key
   */
  renderItem(itemObj, k) {
    return (
      <div ref={this.wrapperRef} data-auid="checkout_prop65Restricted_items" className="d-flex flex-row align-items-center mb-1" key={k}>
        <div className={`${itemThumbnail} d-flex flex-row align-items-center mr-1`}>
          <img
            data-auid={`checkout_review_order_prop65Restricted_items_${itemObj.name}`}
            src={itemObj.thumbnail}
            alt={itemObj.imageAltDescription}
            className={thumbnailImg}
          />
        </div>
        <span className="o-copy__14reg">{itemObj.name}</span>
      </div>
    );
  }
  render() {
    const { cms, excData } = this.props;
    const errorData = excData.orderItems;
    const propOrderItem = this.getOrderItems(errorData);
    return (
      <section className={`${prop65ErrorWrapper} w-100 d-flex flex-column p-1 mb-2 error`}>
        {propOrderItem.map((itemObj, k) => this.renderItem(itemObj, k))}
        <p ref={this.errorRef} className={`o-copy__14reg mb-0 ${errorText}`} dangerouslySetInnerHTML={this.createLabel(cms.restrictedProp65)} />
      </section>
    );
  }
}

Prop65Error.propTypes = {
  orderDetails: PropTypes.object,
  cms: PropTypes.object,
  excData: PropTypes.object,
  onRemove: PropTypes.func
};

export default Prop65Error;
