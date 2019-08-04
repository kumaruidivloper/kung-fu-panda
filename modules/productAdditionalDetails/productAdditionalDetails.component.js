import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import ProductPrice from '../productPrice/productPrice.component';
import { SHIPS_FOR } from './constants';
import { ProductAddDtlsWrapper, priceWrapperStyle, PromoMessage, DividerRule, PPUWrapper, DividerRuleDesktopOnly } from './styles';

class ProductAdditionalDetails extends React.PureComponent {
  render() {
    const isToolTip = true;
    const { promoMessage, shippingMessage, shippingPrice, price, isBundle = false, ppuEnabled, ppuMessage = '', labels = {} } = this.props;

    const ppuMsg = ppuEnabled ? price.ppuMsg : '';
    const displayPpuMsg = ppuEnabled && ppuMsg;
    const ppu = labels[ppuMessage] || ' per unit';

    if (!price) {
      return null;
    }

    // ProductPrice from same repo is used until ProductPrice moved to fusion-repo
    return (
      <ProductAddDtlsWrapper>
        <div data-auid="PDP_ProductPrice" className={cx('pb-2 pb-md-3', priceWrapperStyle)}>
          <ProductPrice price={price} isBundle={isBundle} isToolTip={isToolTip} labels={labels} />
          {displayPpuMsg && (
            <PPUWrapper>
              <span> {ppuMsg} </span>
              <span> {ppu} </span>
            </PPUWrapper>
          )}
          {shippingPrice && (
            <p>
              {labels.SHIPS_FOR || SHIPS_FOR} {shippingPrice}
            </p>
          )}
          {shippingMessage && <p>{shippingMessage}</p>}
        </div>
        {promoMessage && (
          <Fragment>
            <DividerRule />
            <PromoMessage data-auid="PDP_PromoMessage">{promoMessage}</PromoMessage>
          </Fragment>
        )}
        <DividerRuleDesktopOnly />
      </ProductAddDtlsWrapper>
    );
  }
}

ProductAdditionalDetails.propTypes = {
  promoMessage: PropTypes.string,
  shippingMessage: PropTypes.string,
  isBundle: PropTypes.bool,
  price: PropTypes.object,
  ppuEnabled: PropTypes.bool,
  ppuMessage: PropTypes.string,
  labels: PropTypes.object,
  shippingPrice: PropTypes.string
};

export default ProductAdditionalDetails;
