import React from 'react';
import PropTypes from 'prop-types';
import { updateAnalytics } from '../helpers';
import { initiateTaxService } from './../../../utils/productDetailsUtils';
/* ******* Display Mini Cart ******* */
class MiniCart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClickMiniCartHandler = this.onClickMiniCartHandler.bind(this);
  }
  onClickMiniCartHandler(evt) {
    const {
      miniCartResults: { orderId },
      breadList,
      gtmDataLayer
    } = this.props;
    initiateTaxService(orderId).finally(() => {
      updateAnalytics(evt, gtmDataLayer, 'headerLinks', 'header', 'mini cart', breadList, '/shop/cart');
      window.location.href = '/shop/cart';
    });
  }
  render() {
    const { miniCartResults } = this.props;
    const count = miniCartResults && miniCartResults.quantity;
    return (
      <div className="position-relative">
        <button
          aria-label={`${
            (count && count.totalCartQuantity <= 0) || !count ? 'No Items added to Cart' : `${count && count.totalCartQuantity} items added to cart`
          }`}
          className="mini-cart"
          onClick={evt => {
            this.onClickMiniCartHandler(evt);
          }}
        >
          {count &&
            count.totalCartQuantity > 0 && (
              <span className="mini-cart-count">{count.totalCartQuantity >= 999 ? '99+' : count.totalCartQuantity}</span>
            )}
          {!miniCartResults && <span className="" />}
          <span className="academyicon icon-cart" aria-hidden="true" />
        </button>
      </div>
    );
  }
}
MiniCart.propTypes = {
  url: PropTypes.string, // eslint-disable-line
  miniCartResults: PropTypes.object,
  breadList: PropTypes.string,
  gtmDataLayer: PropTypes.array
};

export default MiniCart;
