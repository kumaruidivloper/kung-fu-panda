import PropTypes from 'prop-types';
import { find } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import {
  blueBackground,
  cardheader,
  PriceStyle,
  cardbody,
  QuantityHeader,
  QuantityPanel,
  card,
  cardBlueBorder,
  mt20,
  w60,
  w40,
  whiteText,
  WasNowWrapper,
  OurPriceInCart
} from './quantityCardStyles';
import QuantityCounter from './QuantityCounter';
import Price from '../../productPrice/productPrice.component';
import { getStoreMessage } from '../../../utils/productDetailsUtils';
import InventoryMessage from '../../productActionItems/components/shippingMessage';
import BackInStock from '../../productActionItems/components/BackInStockNotification';
import {
  COLOR,
  DEFINING,
  WEIGHT,
  QUANTITY_LABEL,
  SKU,
  KEY_WAS_NOW_PRICE,
  KEY_PRICE_IN_CART,
  KEY_OUT_OF_STOCK,
  KEY_OUT_OF_STOCK_STORE
} from '../constants';
import * as actions from '../../productActionItems/actions';
import { toggleFindAStore } from '../../findAStoreModalRTwo/actions';

export class QuantityCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.updateAnalytics = this.updateAnalytics.bind(this);
  }

  getColorFromAttributes = attributes => {
    const colors = [];
    attributes.forEach(item => {
      const { name, usage, value } = item;
      if (name === COLOR && usage === DEFINING) {
        colors.push(value);
      }
    });
    return colors && colors.length > 0 && colors.toString();
  };

  getShippingEstimate(sla) {
    let eta = null;
    if (sla && sla.estimatedFromDate && sla.estimatedToDate) {
      const fd = new Date(`${sla.estimatedFromDate}T10:00:00`).toDateString().split(' ');
      const td = new Date(`${sla.estimatedToDate}T10:00:00`).toDateString().split(' ');
      eta = fd.length > 0 && td.length > 0 ? `${fd[1]} ${fd[2]} - ${td[1]} ${td[2]}` : null;
    }
    return eta;
  }

  getWeightFromAttributes = attributes => {
    const weights = [];
    attributes.forEach(item => {
      const { name, usage, value } = item;
      if (name === WEIGHT && usage === DEFINING) {
        weights.push(value);
      }
    });
    return weights && weights.length > 0 && weights.toString();
  };

  updateAnalytics({ event, analyticsObject = {} }) {
    const dataLayerObj = {
      event: analyticsObject.event || 'pdpDetailClick',
      eventCategory: analyticsObject.eventCategory || 'pdp detail clicks',
      eventAction: analyticsObject.eventAction || 'click',
      eventLabel: `${analyticsObject.eventLabel || (event && event.currentTarget.textContent).toLowerCase() || 'action item'}`
    };
    this.props.gtmDataLayer.push(dataLayerObj);
  }

  updateQuantity = qty => {
    const { data, updateQuantity } = this.props;
    const total = parseFloat(data.price.salePrice) * qty;
    if (updateQuantity) {
      updateQuantity(qty, { ...data, totalQty: qty, totalPrice: total });
    }
  };

  /**
   * Online Inventory Stock available check
   */
  isOutOfStockOnline = value => value && value.inventoryStatus === KEY_OUT_OF_STOCK;

  /**
   * Store inventory stock available check
   */
  isOutOfStockStore = value => value && value.key === KEY_OUT_OF_STOCK_STORE;

  renderPrice = (price, labels) => {
    const { priceMessage } = price;
    if (priceMessage === KEY_WAS_NOW_PRICE) {
      return (
        <WasNowWrapper>
          <Price price={price} isBundle={false} isToolTip labels={labels} />
        </WasNowWrapper>
      );
    } else if (priceMessage === KEY_PRICE_IN_CART) {
      return (
        <OurPriceInCart>
          <Price price={price} isBundle={false} isToolTip labels={labels} />
        </OurPriceInCart>
      );
    }

    return <Price price={price} isBundle={false} isToolTip labels={labels} />;
  };

  renderInventoryMessage = () => {
    const { data, store, messages, labels, productItem, myStoreDetails, shippingSLA } = this.props;
    const { inventory } = productItem;
    const { skuId, itemId } = data;
    const storeMessage = getStoreMessage(inventory, skuId);
    const nextProductItem = {
      ...productItem,
      skuId,
      itemId
    };

    return (
      <div className="d-flex">
        {storeMessage && (
          <InventoryMessage
            message={storeMessage}
            authMsgs={messages}
            productItem={nextProductItem}
            store={store}
            myZipCode={myStoreDetails && myStoreDetails.zipCode}
            labels={labels}
            estimatedShipping={this.getShippingEstimate(shippingSLA)}
            updateAnalytics={this.updateAnalytics}
          />
        )}
      </div>
    );
  };

  render() {
    const { data, labels = {}, productItem, endColumn, selectedQty, gtmDataLayer } = this.props;
    const { price } = data;
    const { showBIS } = productItem;
    const changeToBoolean = {
      true: true,
      false: false
    };
    const onlineInventory = find(productItem.inventory && productItem.inventory.online, { skuId: data.skuId });

    return (
      <div className={`col-lg-4 col-md-5 col-sm-12 pl-0 pb-half pb-md-2 ${endColumn && 'pr-md-2'}`}>
        <div className={`${parseInt(selectedQty, 10) > 0 ? cardBlueBorder : card}`}>
          <div className={`${parseInt(selectedQty, 10) > 0 ? blueBackground : cardheader}`}>
            <QuantityHeader className="d-flex justify-content-around">
              <div className={`pl-1 o-copy__12bold ${parseInt(selectedQty, 10) > 0 ? whiteText : ''}`}>{data.weight}</div>
              <div className={`pr-1 o-copy__12bold ml-auto ${parseInt(selectedQty, 10) > 0 ? whiteText : ''}`}>
                {SKU}
                <span className={`pl-half o-copy__12reg ${parseInt(selectedQty, 10) > 0 ? whiteText : ''}`}>{data.itemId}</span>
              </div>
            </QuantityHeader>
          </div>
          <div className={`d-flex flex-column ${cardbody}`}>
            <div className={`d-flex align-items-center pb-half ${PriceStyle}`}>
              <div className={`${mt20} ${w40}`}>{this.renderPrice(price, labels)}</div>
              <div className={`${w60}`}>
                {this.isOutOfStockOnline(onlineInventory) ? (
                  <div className={`o-copy__14reg ${mt20}`}>
                    <BackInStock isBait showBis={changeToBoolean[showBIS]} />
                  </div>
                ) : (
                  <QuantityPanel className="d-flex flex-column">
                    <span className="pb-half o-copy__14bold">{labels.QUANTITY_LABEL || QUANTITY_LABEL}</span>
                    <QuantityCounter
                      productItem={productItem}
                      updateQuantity={this.updateQuantity}
                      quantity={selectedQty}
                      gtmDataLayer={gtmDataLayer}
                    />
                  </QuantityPanel>
                )}
              </div>
            </div>
            {this.renderInventoryMessage()}
          </div>
        </div>
      </div>
    );
  }
}

QuantityCard.propTypes = {
  data: PropTypes.array,
  updateQuantity: PropTypes.func,
  selectedQty: PropTypes.number,
  labels: PropTypes.object,
  productItem: PropTypes.object,
  messages: PropTypes.object,
  store: PropTypes.object,
  myStoreDetails: PropTypes.object,
  shippingSLA: PropTypes.object,
  endColumn: PropTypes.number,
  gtmDataLayer: PropTypes.array
};

QuantityCard.defaultProps = {
  productItem: {
    inventory: {}
  }
};

const mapStateToProps = state => ({
  store: state,
  myStoreDetails: state.findAStoreModalRTwo.getMystoreDetails,
  gtmDataLayer: state.gtmDataLayer
});

const mapDispatchToProps = dispatch => ({
  fnToggleFindAStore: data => dispatch(toggleFindAStore(data)),
  fnGetProductItemId: data => dispatch(actions.getProductItemId(data))
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default withConnect(QuantityCard);
