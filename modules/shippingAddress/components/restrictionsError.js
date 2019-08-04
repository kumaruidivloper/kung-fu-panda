import React from 'react';
import PropTypes from 'prop-types';
import { prop65ErrorWrapper, errorText, itemThumbnail, thumbnailImg } from '../shippingAddress.styles';

const RestrictionsError = props => {
  const { errorMsg = '', restrictedItems = [], orderKey, state } = props;

  /**
   * returns order item details like image and name
   * @param {Array} errorData - contain order item list which are restricted to PO/APO/FPO
   */
  const getOrderItems = errorData => {
    const { orderDetails } = props;
    const parsedData = typeof errorData === 'string' ? JSON.parse(errorData) : errorData;
    const { orderItems = [] } = orderDetails;
    const filteredArray = [];
    parsedData.forEach(item => {
      const tempFiltered = orderItems.filter(row => row[orderKey] === item.toString());
      if (tempFiltered.length) {
        filteredArray.push(...tempFiltered);
      }
    });
    return filteredArray;
  };

  /**
   * it return order items with image card and name
   * @param {object} itemObj - contain order item details
   * @param {interger} k - key
   */
  const renderItem = (itemObj, k) => {
    const { skuDetails: { skuInfo = {} } = {} } = itemObj;
    const { name, imageAltDescription, thumbnail } = skuInfo;
    return (
      <div data-auid="checkout_fpoRestricted_items" className="d-flex flex-row align-items-center mb-1" key={k}>
        <div className={`${itemThumbnail} d-flex flex-row align-items-center mr-1`}>
          <img data-auid={`checkout_review_order_fpoRestricted_items_${name}`} src={thumbnail} alt={imageAltDescription} className={thumbnailImg} />
        </div>
        <span className="o-copy__14reg">{name}</span>
      </div>
    );
  };

  const updatedMessage = state ? errorMsg.replace('{{state}}', state) : errorMsg;

  return (
    <section className={`${prop65ErrorWrapper} w-100 d-flex flex-column p-1 mb-2 error`}>
      <p className={`o-copy__14reg mb-0 pb-1 ${errorText}`} dangerouslySetInnerHTML={{ __html: updatedMessage }} />
      {getOrderItems(restrictedItems).map((itemObj, k) => renderItem(itemObj, k))}
    </section>
  );
};

RestrictionsError.propTypes = {
  orderDetails: PropTypes.object,
  errorMsg: PropTypes.string,
  orderKey: PropTypes.string,
  restrictedItems: PropTypes.object,
  state: PropTypes.string
};

export default RestrictionsError;
