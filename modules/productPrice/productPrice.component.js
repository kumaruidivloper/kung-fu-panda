import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Responsive from 'react-responsive';
import Tooltip from '@academysports/fusion-components/dist/Tooltip';
// import styled, { css } from 'emotion';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  KEY_WAS_NOW_PRICE,
  COLOR_CLEARANCE,
  COLOR_SECONDARY,
  KEY_PRICE_IN_CART,
  TEXT_OUR_PRICE_IN_CART,
  TEXT_COMPARE_AT,
  TOOLTIP_TEXT,
  KEY_CALL_FOR_PRICING,
  TEXT_CALL_PRIMARY_MESSAGE,
  TEXT_CALL_MESSAGE_NUMBER,
  KEY_LIVE_CHAT,
  LIVE_CHAT_URL,
  TEXT_CHAT_NOW,
  TEXT_LIVE_CHAT_MESSAGE,
  KEY_TEXT_CALL_PRIMARY_MESSAGE,
  KEY_TEXT_CALL_MESSAGE_NUMBER,
  KEY_TEXT_OUR_PRICE_IN_CART
} from './constants';
import Price from './price';
import { DroppedPrice, ContentTextInline, TitleText, ContentText, LiveChatWrapper, ChatNow, IconStyles, ReactToolTip } from './productPrice.styles';

const openChat = () => {
  const newWin = window.open(LIVE_CHAT_URL, '_blank', 'resizable=yes, scrollbars=yes, titlebar=yes, width=650, height=650, top=10, left=10');
  newWin.opener = null;
};

class ProductPrice extends React.PureComponent {
  getDoublePrecisionPrice = value => {
    const [num, dec] = value.replace(/[^\.\d]/g, '').split('.'); // eslint-disable-line no-useless-escape
    if (!num || num.trim().length === 0) {
      return null;
    }

    return dec && dec.length > 0 ? `$${num}.${dec}` : `$${num}.00`;
  };

  getToolTipProps() {
    return {
      className: ReactToolTip.toolTip,
      direction: { mobile: 'top', desktop: 'top' },
      align: 'C',
      auid: 'PDP_ToolTip',
      content: <div>{TOOLTIP_TEXT}</div>
    };
  }
  /**
   * CASE TO HANDLE WAS NOW PRICING
   */
  renderWasNowPrice = () => {
    const { price } = this.props;
    const { savings, listPrice, salePrice } = price;
    return (
      <Fragment>
        <Price price={salePrice} data-auid="PDP_SalePrice" color={COLOR_CLEARANCE} />
        <DroppedPrice>
          <Price price={listPrice} color={COLOR_SECONDARY} data-auid="PDP_DroppedPrice" strikethrough />
        </DroppedPrice>
        {!!savings && <ContentTextInline>Save {savings}</ContentTextInline>}
      </Fragment>
    );
  };
  /**
   * CASE TO HANDLE PRICE IN CART
   */
  renderPriceInCart = () => {
    const { price, isToolTip, labels = {}, inCartFont, baitToolTipSize } = this.props;
    const { listPrice } = price;
    return (
      <Fragment>
        <TitleText color={COLOR_CLEARANCE} fontSize={inCartFont}>
          {labels[KEY_TEXT_OUR_PRICE_IN_CART] || TEXT_OUR_PRICE_IN_CART}
          {isToolTip && (
            <Fragment>
              <Responsive maxWidth={767}>
                <Tooltip {...this.getToolTipProps()} showOnClick>
                  <IconStyles className="academyicon icon-information" baitToolTip={baitToolTipSize} />
                </Tooltip>
              </Responsive>
              <Responsive minWidth={768}>
                <Tooltip {...this.getToolTipProps()}>
                  <IconStyles className="academyicon icon-information" baitToolTip={baitToolTipSize} />
                </Tooltip>
              </Responsive>
            </Fragment>
          )}
        </TitleText>
        <ContentText color={COLOR_SECONDARY}>
          {TEXT_COMPARE_AT} {this.getDoublePrecisionPrice(listPrice)}
        </ContentText>
      </Fragment>
    );
  };
  /**
   * CASE TO HANDLE CALL FOR PRICING
   */
  renderCallForPricing = () => {
    const { labels = {} } = this.props;
    return (
      <Fragment>
        <TitleText>{labels[KEY_TEXT_CALL_PRIMARY_MESSAGE] || TEXT_CALL_PRIMARY_MESSAGE}</TitleText>
        <ContentText>{labels[KEY_TEXT_CALL_MESSAGE_NUMBER] || TEXT_CALL_MESSAGE_NUMBER}</ContentText>
      </Fragment>
    );
  };
  /**
   * CASE TO HANDLE LIVE CHAT
   */
  renderLiveChatPricing = () => (
    <LiveChatWrapper>
      <TitleText>{TEXT_LIVE_CHAT_MESSAGE}</TitleText>
      <ChatNow data-auid="PDP_ProductPrice_LiveChat" href={LIVE_CHAT_URL} target="_blank" onClick={openChat}>
        <i role="presentation" aria-label="facets" className="academyicon icon-information" />
        {TEXT_CHAT_NOW}
      </ChatNow>
    </LiveChatWrapper>
  );

  renderPriceType = () => {
    const { price, isBundle } = this.props;
    if (!price) {
      return null;
    }
    let { listPrice, salePrice } = price;
    if (isBundle) {
      listPrice = price.regularPrice;
      salePrice = price.offerPrice;
    }
    const { priceMessage } = price;
    if (priceMessage === KEY_WAS_NOW_PRICE) {
      return this.renderWasNowPrice();
    }
    if (priceMessage === KEY_PRICE_IN_CART) {
      return this.renderPriceInCart();
    }
    if (priceMessage === KEY_CALL_FOR_PRICING) {
      return this.renderCallForPricing();
    }
    if (priceMessage === KEY_LIVE_CHAT) {
      return this.renderLiveChatPricing();
    }
    /**
     * STANDARD PRICE
     */
    return <Price price={salePrice || listPrice} />; // Standard Price
  };
  render() {
    return this.renderPriceType();
  }
}

ProductPrice.propTypes = {
  price: PropTypes.object.isRequired,
  isBundle: PropTypes.bool,
  isToolTip: PropTypes.bool,
  labels: PropTypes.object,
  inCartFont: PropTypes.string,
  baitToolTipSize: PropTypes.string
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<ProductPrice {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default ProductPrice;
