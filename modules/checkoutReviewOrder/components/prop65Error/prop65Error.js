import React from 'react';
import PropTypes from 'prop-types';
import { errorWrapper, itemThumbnail, errorText } from '../../styles';
const renderItem = (itemObj, k) => (
  <div data-auid="checkout_review_order_prop65Restricted_items" className="d-flex mb-1" key={k}>
    <div>
      <img
        data-auid={`checkout_review_order_prop65Restricted_items_${itemObj.skuDetails.skuInfo.name}`}
        src={itemObj.skuDetails.skuInfo.thumbnail}
        alt={itemObj.skuDetails.skuInfo.imageAltDescription}
        className={`${itemThumbnail}`}
      />
    </div>
    <div className="d-flex flex-column flex-grow-1 ">
      <div>
        <div className="o-copy__14reg">{itemObj.skuDetails.skuInfo.name}</div>
      </div>
    </div>
  </div>
);

const Prop65Error = props => {
  const { orderDetails, errorDetails } = props;
  return (
    <section className={`${errorWrapper} w-100 d-flex flex-column p-1 mb-2`}>
      {orderDetails.orderItems.map((itemObj, k) => renderItem(itemObj, k))}
      <p className={`o-copy__14reg mb-0 ${errorText}`}>{errorDetails}</p>
    </section>
  );
};

Prop65Error.propTypes = {
  orderDetails: PropTypes.object,
  errorDetails: PropTypes.string
};

export default Prop65Error;
