import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { cx, css } from 'react-emotion';
import { NavLink } from 'react-router-dom';
import Button from '@academysports/fusion-components/dist/Button';
import { NODE_TO_MOUNT, DATA_COMP_ID, DATE_YEAR_FORMAT, TOTAL_AMOUNT } from './constants';
import { dollarFormatter } from '../../utils/helpers';
import { dateFormatter } from '../../utils/dateUtils';

const buttonPlay = css`
  font-size: 14px;
  padding: 1rem 1.5rem;
  @media screen and (min-width: 768px) {
    font-size: 11px;
    padding: 0.5rem 0.5rem;
  }
  @media screen and (min-width: 1025px) {
    font-size: 14px;
    padding: 1rem 1.5rem;
  }
`;
class OrderRow extends React.PureComponent {
  render() {
    const { cms, orderItem, beginIndex } = this.props;
    const date = orderItem.orderPlacedDate ? dateFormatter(orderItem.orderPlacedDate, DATE_YEAR_FORMAT) : '';
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-12 col-md-3">
            <div className="d-block d-md-none">
              <div className="row my-2">
                <span className="col-6 o-copy__14bold pr-0">{cms.orderPlacedOnLabel}</span>
                <span className="col-6 o-copy__14reg pr-0">{date}</span>
              </div>
            </div>
            <span className="o-copy__16reg mt-1 d-none d-md-block">{date}</span>
          </div>
          <div className="col-12 col-md-3">
            <div className="d-block d-md-none">
              <div className="row mb-2">
                <span className="col-6 o-copy__14bold pr-0">{cms.orderNumberMyAccount}</span>
                <span className="col-6 o-copy__14reg pr-0">{orderItem.orderNumber}</span>
              </div>
            </div>
            <span className="o-copy__16reg mt-1 d-none d-md-block">{orderItem.orderNumber}</span>
          </div>
          <div className="col-12 col-md-3">
            <div className="d-block d-md-none">
              <div className="row mb-2">
                <span className="col-6 o-copy__14bold pr-0">{cms.totalAmount || TOTAL_AMOUNT}</span>
                <span className="col-6 o-copy__14reg pr-0">{dollarFormatter(orderItem.totalPrice)}</span>
              </div>
            </div>
            <span className="o-copy__16reg mt-1 d-none d-md-block">{dollarFormatter(orderItem.totalPrice)}</span>
          </div>
          <div className="col-12 col-md-3 w-100">
            <NavLink to={`/myaccount/orders/${orderItem.orderNumber}?beginIndex=${beginIndex}`} aria-current="page" tabIndex="-1">
              <Button auid="button-3" size="S" className={cx(buttonPlay, 'w-100 mb-2 my-md-half')}>
                {cms.viewDetailsButtonLabel}
              </Button>
            </NavLink>
          </div>
        </div>
        <hr />
      </React.Fragment>
    );
  }
}

OrderRow.propTypes = {
  cms: PropTypes.object.isRequired,
  orderItem: PropTypes.object,
  beginIndex: PropTypes.string
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<OrderRow {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default OrderRow;
