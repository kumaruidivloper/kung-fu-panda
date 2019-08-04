import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { dollarFormatter } from './../../utils/helpers';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { cartHeader, continueShopping, arrowIcon, qtyDetails } from './styles';

class CartHeader extends React.PureComponent {
  render() {
    const { cms } = this.props;
    return (
      <React.Fragment>
        <div>
          <a data-auid="crt_lnkCntShopping" href="\" className={`o-copy__14reg ${continueShopping}`}>
            <i className={`academyicon icon-chevron-left mr-half ${arrowIcon}`} />
            <span>{cms.commonLabels.continueShoppingLabel}</span>
          </a>
        </div>
        <h1 className={`${cartHeader} mt-1 mb-0`}>{cms.yourCartTitle}</h1>
        <div className={`${qtyDetails} mt-1`}>
          <span className="o-copy__14reg ml-0 ml-lg-2">
            {cms.commonLabels.itemsLabel} ({this.props.recordSetTotal})
          </span>
          <span className="o-copy__14reg ml-0 ml-lg-2">
            {cms.commonLabels.totalLabel}: {dollarFormatter(this.props.grandTotal)}
          </span>
        </div>
      </React.Fragment>
    );
  }
}

CartHeader.propTypes = {
  cms: PropTypes.object.isRequired,
  recordSetTotal: PropTypes.number,
  grandTotal: PropTypes.string
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<CartHeader {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default CartHeader;
