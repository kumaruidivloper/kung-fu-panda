import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { headingBox, editBtn } from './style';
import { NODE_TO_MOUNT, DATA_COMP_ID, EMAIL_PLACEHOLDER } from './constants';
import { titleCase, replaceGlobalCharacters } from './../../utils/stringUtils';
import { CREDIT_CARD, PAYPAL } from './../../modules/checkoutPaymentOptions/constants';
import { dollarFormatter } from './../../utils/helpers';
class ShowPaymentInfo extends React.PureComponent {
  /**
   * renderHeading showing the payment title and edit link in collapse drawer.
   */
  renderHeading() {
    const { cms, showEditLink } = this.props;
    return (
      <div className={`w-100 ${headingBox} pb-2 d-flex justify-content-between`}>
        <div className="o-copy__16bold text-uppercase">{cms.paymentTitle}</div>
        {showEditLink && (
          <a data-auid="checkout_edit_payment" href=" #" onClick={this.props.onEditHandler} className={`o-copy__14reg ${editBtn}`}>
            {cms.commonLabels.editLabel}
          </a>
        )}
      </div>
    );
  }
  /**
   *
   * renderCreditcardPaymentDetails will show if user is paying the payment using credit card.
   * @param {object} payments will have the data related to creditcard payment
   */
  renderCreditcardPaymentDetails(payments) {
    const { cms } = this.props;
    let paymentData;
    if (Object.keys(payments).length > 0) {
      const { ccPaymentInstruction } = payments;
      const expiryDate = ccPaymentInstruction.exp_date;
      const expiryMonth = expiryDate.substr(0, 2);
      const expiryYear = `20${expiryDate.substr(2)}`;
      paymentData = (
        <Fragment>
          <div className="o-copy__14bold pt-half">
            {`${ccPaymentInstruction.cardType} ${cms.commonLabels.cardEndingInLabel} - ${ccPaymentInstruction.lastFourCCDigit}`}
          </div>
          <div className="o-copy__14reg">{`Exp: ${expiryMonth}/${expiryYear}`}</div>
        </Fragment>
      );
    }
    return paymentData;
  }
  /**
   *
   * renderGiftcardPaymentDetails will show if user is paying the payment using gift card.
   * @param {array} giftCardDetails gift card payment details
   * @param {object} totals information on gift card amount details
   */
  renderGiftcardPaymentDetails() {
    const {
      cms,
      orderDetails: { giftCardDetails }
    } = this.props;
    let paymentData;
    if (giftCardDetails.length > 0) {
      paymentData = giftCardDetails.map(card => {
        const { giftcard } = card;
        const lastFourGCDigit = giftcard.substr(giftcard.length - 4, giftcard.length);
        return <div className="o-copy__14bold pt-half">{`${cms.giftCardEndingInLabel} - ${lastFourGCDigit}`}</div>;
      });
    }
    return paymentData;
  }
  /**
   * renders collapsed view for respective payment method.
   */
  renderBody() {
    const { paymentMethod } = this.props.orderDetails.payments;
    switch (paymentMethod) {
      case CREDIT_CARD: {
        return this.renderCreditCardCollapsedDrawer();
      }
      case PAYPAL: {
        return this.renderPaypalCollapsedDrawer();
      }
      default:
        return this.renderCreditCardCollapsedDrawer();
    }
  }
  /**
   * renders collapsed view for credit card payment.
   */
  renderCreditCardCollapsedDrawer() {
    const {
      cms,
      orderDetails: {
        addresses: { billingAddress },
        payments
      }
    } = this.props;
    return (
      <div className="w-100 pt-1 d-flex flex-column">
        <div className="w-100 o-copy__14reg text-uppercase pt-1">{cms.billingInformation}</div>
        <div className="row">
          <div className="col-12 col-md-6 pb-half pb-md-0">
            <div className="o-copy__14bold pt-half">{titleCase(`${billingAddress.firstName} ${billingAddress.lastName}`)}</div>
            <div className="o-copy__14reg">
              {`${titleCase(`${billingAddress.address}, ${billingAddress.city}`)}, ${billingAddress.state}, ${billingAddress.zipCode}`}
            </div>
            <div className="o-copy__14reg">{billingAddress.companyName || ''}</div>
            <div className="o-copy__14reg">{billingAddress.email}</div>
          </div>
          <div className="col-12 col-md-6">
            {this.renderCreditcardPaymentDetails(payments)}
            {this.renderGiftcardPaymentDetails()}
          </div>
        </div>
      </div>
    );
  }
  /**
   * renders collapsed view for paypal payments.
   */
  renderPaypalCollapsedDrawer() {
    const { cms, orderDetails } = this.props;
    const { addresses: { billingAddress: { email } } } = orderDetails;
    const paymentText = replaceGlobalCharacters(cms.paypalPaymentTextLabel, EMAIL_PLACEHOLDER, email);
    return (
      <div className="w-100 pt-1 d-flex flex-column">
        <div className="w-100 o-copy__14reg text-uppercase pt-1">{cms.paymentMethod}</div>
        <div className="w-100 o-copy__14reg pt-1">{`${paymentText} ${dollarFormatter(orderDetails.totals.orderGrandTotal)}`}</div>
      </div>
    );
  }
  render() {
    return (
      <div className="w-100 container px-0">
        {this.renderHeading()}
        {this.renderBody()}
      </div>
    );
  }
}

ShowPaymentInfo.propTypes = {
  cms: PropTypes.object.isRequired,
  onEditHandler: PropTypes.func.isRequired,
  orderDetails: PropTypes.object,
  showEditLink: PropTypes.bool,
  paymentMethod: PropTypes.string
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<ShowPaymentInfo {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default ShowPaymentInfo;
