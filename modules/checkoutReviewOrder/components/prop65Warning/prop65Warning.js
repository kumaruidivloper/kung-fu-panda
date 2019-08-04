import React from 'react';
import PropTypes from 'prop-types';
import { warningWrapper, itemThumbnail, warningText } from '../../styles';
const renderItem = (cms, itemObj, k) => (
  <div data-auid="checkout_review_order_prop65Warning_items" className="d-flex mb-1" key={k}>
    <div>
      <img
        data-auid={`checkout_review_order_prop65Warning_items_${itemObj.skuDetails.skuInfo.name}`}
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
    <div className={`o-copy__14reg mb-0 ${warningText}`}>
      <i className="academyicon icon-warning" />
      {cms.warningMsgLabel}
    </div>
  </div>
);

const Prop65Warning = props => {
  const { orderDetails, cms } = props;
  return (
    <section className={`${warningWrapper} w-100 d-flex flex-column p-1 mb-2`}>
      {orderDetails.orderItems.map((itemObj, k) => renderItem(cms, itemObj, k))}
    </section>
  );
};

Prop65Warning.propTypes = {
  orderDetails: PropTypes.object,
  cms: PropTypes.object
};

export default Prop65Warning;
