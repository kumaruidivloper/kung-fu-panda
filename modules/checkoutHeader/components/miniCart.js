import React from 'react';
import PropTypes from 'prop-types';
import { miniCartStyles } from '../checkoutHeader.styles';
/* ******* Display Mini Cart ******* */
class MiniCart extends React.PureComponent {
  render() {
    const { url, miniCartResp } = this.props;
    const count = miniCartResp && miniCartResp.quantity;
    return (
      <div className={`${miniCartStyles} position-relative`}>
        <a
          href={url}
          onClick={this.props.handleAnalytics}
          aria-label={`${
            (count && count.totalCartQuantity <= 0) || !count ? 'No Items added to Cart' : `${count && count.totalCartQuantity} items added to cart`
          }`}
          className="mini-cart"
        >
          {count &&
            count.totalCartQuantity > 0 && (
              <span className="mini-cart-count">{count.totalCartQuantity > 999 ? '99+' : count.totalCartQuantity}</span>
            )}
          <span className="academyicon icon-cart" aria-hidden="true" />
        </a>
      </div>
    );
  }
}
MiniCart.propTypes = {
  url: PropTypes.string,
  miniCartResp: PropTypes.object,
  handleAnalytics: PropTypes.func
};

export default MiniCart;
