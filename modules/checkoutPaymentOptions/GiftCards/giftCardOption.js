import PropTypes from 'prop-types';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import Button from '@academysports/fusion-components/dist/Button';
import { get } from '@react-nitro/error-boundary';
import RenderTextField from './renderInputField';
import StorageManager from '../../../utils/StorageManager';
import { validationRules, normalizeGCNumber, normalizeGCPin } from './validationRules';
import GiftCardFormSubmitBtn from './giftCardFormSubmitBtn';
import { link, iconColor, giftCardTitle } from './giftCardOption.style';
import { GC_NUMBER_16, GC_NUMBER_13, LIVE_CHAT, CUSTOMER_CARE_NO, SOMETHING_WENT_WRONG, analyticsErrorEvent, analyticsErrorEventCategory, analyticsErrorEventAction } from '../constants';
import { analyticsErrorTracker, getErrorMessagesFromDOM } from './../../../utils/analyticsUtils';

export class GiftCardOptions extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showGiftCardForm: false,
      showForm: null,
      index: 0,
      apierror: null
    };
    this.onAddGiftCard = this.onAddGiftCard.bind(this);
    this.addGiftCard = this.addGiftCard.bind(this);
    this.clearError = this.clearError.bind(this);
    this.fetchSavedGiftCards = this.fetchSavedGiftCards.bind(this);
    this.hideGiftCard = this.hideGiftCard.bind(this);
    this.showAppliedCard = this.showAppliedCard.bind(this);
    this.renderAddGiftCard = this.renderAddGiftCard.bind(this);
    this.renderAddGiftCardForm = this.renderAddGiftCardForm.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.filterOutGiftCardOptions = this.filterOutGiftCardOptions.bind(this);
  }

  componentDidMount() {
    this.fetchSavedGiftCards(this.props.isLoggedIn);
  }
  /**
   * fetch giftcards again if any giftcard is added or removed
   * @param {object} newProps New Props
   */
  componentWillReceiveProps(newProps) {
    const { giftCardDetails } = this.props.orderDetails; // current applied GC's
    const newgiftCardDetails = newProps.orderDetails.giftCardDetails; // New list of applied GC's
    if (giftCardDetails && newgiftCardDetails && giftCardDetails.length !== newgiftCardDetails.length) {
      // if length is not same i.e new GC added or removed
      this.fetchSavedGiftCards(newProps.isLoggedIn); // fetch list of saved GC's
      this.setState({ index: 0 });
    }
  }

  componentDidUpdate(prevProps) {
    const previousErrorStatus = prevProps && prevProps.giftCardData && prevProps.giftCardData.error;
    const { error } = this.props.giftCardData;
    // if error status changes, error has occurred and hence pushing error tracking data.
    if (!previousErrorStatus && error) {
      this.pushAnalyticsErrors();
    }
  }

  /**
   * Called on click of Apply to add gift card
   * @param {object} data GiftCard Data : GiftCard Number and Pin
   * @param {string} orderid Current OrderID
   */
  onAddGiftCard(data, orderid, index = null, savedGiftCards = null) {
    if (savedGiftCards) {
      const { giftCards } = this.filterOutGiftCardOptions();
      const cardData = {
        orderId: orderid,
        giftCardNumber: giftCards[index].giftCardNumber,
        giftCardPin: giftCards[index].giftCardPin
      };
      this.props.fngiftCardApplyRequest(cardData);
    } else {
      const cardData = {
        orderId: orderid,
        giftCardNumber: data.cardId.replace(/ /g, '').replace(/-/g, ''),
        giftCardPin: data.cardPin
      };
      this.props.fngiftCardApplyRequest(cardData);
    }
  }
  /**
   * Clicked on Add Gift Card to Show Gift Card Fields
   * @param {object} evt Event Object
   */
  addGiftCard(evt) {
    this.props.fnClearGiftCardErrors();
    evt.preventDefault();
    this.setState({
      showGiftCardForm: true
    });
  }
  /**
   * Renders the Add Gift Card Link
   * @param {object} cms Object with list of Labels from AEM
   */
  addGiftCardOption(cms) {
    return (
      <div className="w-100 o-copy__14reg">
        <a data-auid="checkout_payment_add_gift_card_icon" href=" #" onClick={this.addGiftCard} className={`${link}`}>
          <i className={`${iconColor} academyicon icon-plus mr-half`} /> <span className="label">{cms.giftCardLabel}</span>
        </a>
      </div>
    );
  }
  /**
   * Called on click of add another giftcard link
   * @param {object} evt Event Object
   */
  addAnotherGiftCard(evt) {
    this.addGiftCard(evt);
  }
  /**
   * Renders add another gift card Option
   * @param {object} cms object with list of label from AEM
   */
  addAnotherGiftCardOption(cms) {
    return (
      <div className="w-100 o-copy__14reg pb-2">
        <a data-auid="checkout_payment_add_another_gift_card_icon" href=" #" onClick={this.addGiftCard} className={`${link}`}>
          <i className={`${iconColor} academyicon icon-plus mr-half`} /> <span className="label">{cms.addAnotherGiftCardLabel}</span>
        </a>
      </div>
    );
  }
  /**
   * returns true if more giftcards can be added
   * @param {object} orderGrandTotal Total amount to be paid
   */
  canAddGiftCard(orderGrandTotal) {
    // TODO mapping of key for discounted order total(Remaining total amount)
    if (Number(orderGrandTotal) === 0) {
      return false;
    }
    return true;
  }
  /**
   * clears server side errors
   */
  clearError() {
    this.props.fnClearGiftCardErrors();
    this.setState({ apierror: null });
  }

  fetchSavedGiftCards(isLoggedIn) {
    const profileId = StorageManager.getSessionStorage('userId');
    if (isLoggedIn && profileId) {
      this.props.fngiftCardFetchRequest({
        profileId
      });
    }
  }
  /**
   * On click of hide add gift card fields
   * @param {object} evt Event Object
   */
  hideGiftCard(evt) {
    evt.preventDefault();
    this.setState({
      showGiftCardForm: false,
      index: 0
    });
  }
  /**
   * Renders hide Giftcard Option
   * @param {object} cms object of list of Labels from AEM
   */
  hideGiftCardOption(cms) {
    return (
      <div className="w-100 o-copy__14reg pb-2">
        <a data-auid="checkout_payment_hide_gift_card_icon" href=" #" onClick={this.hideGiftCard} className={`${link}`}>
          <i className={` ${iconColor} academyicon icon-minus mr-half`} /> <span className="label">{cms.hideGiftCardLabel}</span>
        </a>
      </div>
    );
  }

  isCardUsed(GCNumber, appliedCards) {
    if (appliedCards.filter(card => card.giftcard === GCNumber).length > 0) {
      return true;
    }
    return false;
  }

  /**
   * Reders all applied giftcards
   * @param {object} cms object of list of labels from AEM
   * @param {object} giftCardDetails Object with array of giftcards already applied
   * @param {string} orderId Current Order ID
   */
  showAllAppliedCards(cms, giftCardDetails, orderId) {
    if (giftCardDetails && giftCardDetails.length && giftCardDetails.length > 0) {
      return (
        <div>
          {giftCardDetails.map((card, key) => this.showAppliedCard(cms, card, orderId, key))}
          {this.showGiftCardCancellationText(cms)}
        </div>
      );
    }
    return null;
  }
  /**
   * Mask the Gift Card Number to show only last 4/5 digits
   * @param {string} GCNumber unmasked GiftCard Number
   */
  maskGCNumber(GCNumber) {
    let GC;
    if (GCNumber.length === GC_NUMBER_16) {
      GC = GCNumber.replace(/\d(?=\d{4})/g, 'X'); // show last 4 digits if 16 digit GCNumber
    } else if (GCNumber.length === GC_NUMBER_13) {
      GC = GCNumber.replace(/\d(?=\d{5})/g, 'X'); // show last 5 digits if 13 digit GCNumber
    }
    const parts = [];
    for (let i = 0, len = GC ? GC.length : 0; i < len; i += 4) {
      if (GC && GC.length === GC_NUMBER_13 && i === 8) {
        parts.push(GC.substring(i, i + 5)); // break 13 digit GC number in 3 parts only last part with 5 digits
        break;
      } else {
        parts.push(GC && GC.substring(i, i + 4));
      }
    }
    if (parts.length) {
      return parts.join(' - ');
    }
    return null;
  }
  /**
   * Renders a applied gift card with remove option
   * @param {object} cms object with list of labels from AEM
   * @param {object} card object with applied gift card
   * @param {string} orderId current order Id
   * @param {number} key unique key
   */
  showAppliedCard(cms, card, orderId, key) {
    return (
      <div key={key} className="w-100 o-copy__14reg pb-2 d-flex flex-column">
        <div>
          {cms.giftCardAddedLabel.replace('{{giftcardnumber}}', this.maskGCNumber(card.giftcard)).replace('{{amount}}', `$${card.GcAppliedAmount}`)}
          {Number(card.totalGCBalance) !== 0 && ` ${cms.remainingBalanceLabel} $${card.totalGCBalance}`}
        </div>
        <div className="pt-1">
          <a data-auid="checkout_payment_remove_gift_card_icon" href=" #" onClick={evt => this.removeCard(evt, card, orderId)} className={`${link}`}>
            <i className={`${iconColor} academyicon icon-x-circle mr-half`} /> <span className="label">{cms.commonLabels.removeLabel}</span>
          </a>
        </div>
      </div>
    );
  }
  /**
   * Renders Gift Card Cancellation Text
   * @param {object} cms object with list of labels from AEM
   */
  showGiftCardCancellationText(cms) {
    return <div className={`${giftCardTitle} w-100 o-copy__14reg pb-2`}>{cms.giftCardTextLabel}</div>;
  }
  /**
   * Removes the applied gift card
   * @param {object} evt Event Object
   * @param {object} card gift card to be removed
   * @param {string} orderid Current Order Id
   */
  removeCard(evt, card, orderid) {
    evt.preventDefault();
    const cardData = {
      orderId: orderid,
      gcPiId: card.gcPiId
    };
    this.props.fngiftCardRemoveRequest(cardData);
  }
  /**
   * Displays gift card error
   * @param {object} giftCardData Errors related giftcard
   */
  showErrorIfAny(cms, giftCardData) {
    const { commonLabels: { liveChatUrl, customerCareNumber, liveChatLabel } = '' } = cms || {};
    if (giftCardData && giftCardData.error && giftCardData.data) {
      const { errors } = giftCardData.data.data || giftCardData.data;
      if (!errors || !errors.length) {
        return;
      }
      let apierror = get(cms, `errorMsg[${errors[0].errorKey}]`, SOMETHING_WENT_WRONG);
      if (apierror.indexOf(LIVE_CHAT) > -1) {
        // If we keep anchor tag string in constant, then we need to do replace call 3 times. To Avoid that handled directly here.
        apierror = apierror.replace(
          LIVE_CHAT,
          `<a href=${liveChatUrl} class="text-link-12" rel="noopener noreferrer" target="_blank">${liveChatLabel || 'Live Chat'}</a>`
        );
      }
      if (apierror.indexOf(CUSTOMER_CARE_NO) > -1) {
        apierror = apierror.replace(CUSTOMER_CARE_NO, customerCareNumber);
      }
      this.setState({ apierror });
    } else if (giftCardData && giftCardData.data && giftCardData.data.orderId) {
      this.setState({ showGiftCardForm: false, apierror: null });
    }
  }
  /**
   * extracts errors from DOM and pushes analytics data to GTM layer.
   */
  pushAnalyticsErrors() {
    const giftCardContainer = document.querySelectorAll('#paymentGiftCardForm');
    getErrorMessagesFromDOM(giftCardContainer, '.text-error').then(data => {
    analyticsErrorTracker(analyticsErrorEvent, analyticsErrorEventCategory, analyticsErrorEventAction, data, {}, {}, this.props);
    });
  }

  /**
   * Method to filter out gift card options which is not applied and will construct dropdown options.
   */
  filterOutGiftCardOptions() {
    const { savedGiftCards, orderDetails, cms } = this.props;
    const { giftCardDetails } = orderDetails;

    const giftCardsOptions = [];
    const giftCards = [];
    const savedGcList = get(savedGiftCards, 'data.profile.payment', null);

    if (savedGcList && savedGcList.length) {
      savedGcList.forEach(card => {
        const gcBalance = parseInt(card.giftCardBalance, 10);
        if (!Number.isNaN(gcBalance) && gcBalance > 0 && !this.isCardUsed(card.giftCardNumber, giftCardDetails)) {
          giftCardsOptions.push({
            title: `${cms.giftCardEndingInLabel} - ${card.giftCardNumber.slice(card.giftCardNumber.length - 4, card.giftCardNumber.length)}`,
            subtitle: `${cms.remainingBalanceLabel} $${card.giftCardBalance}`
          });
          giftCards.push(card);
        }
      });
    }

    return { giftCardsOptions, giftCards };
  }

  renderAddGiftCardForm(cms, orderid) {
    const { analyticsContent } = this.props;
    return (
      <form>
        <div className="w-100 o-copy__14reg d-flex flex-column pb-2 pb-md-3">
          <div className="w-100 d-flex flex-column flex-lg-row">
            <div className="col-12 col-lg-6 p-0">
              <Field
                data-auid="checkout_payment_gift_card_number_field"
                name="cardId"
                id="checkout-payment-gift-card-cardId"
                normalize={normalizeGCNumber}
                type="tel"
                label={cms.giftCardNumberLabel}
                component={RenderTextField}
                tooltipData={cms.giftCardNumberHintTextLabel}
                apierror={this.state.apierror}
                onChange={() => this.clearError()}
              />
            </div>
            <div className="col-12 col-lg-6 p-0 d-flex pt-1 pt-lg-0">
              <div className="col-6 p-0 pl-lg-2">
                <Field
                  data-auid="checkout_payment_gift_card_pin_field"
                  name="cardPin"
                  id="checkout-payment-gift-card-cardPin"
                  normalize={normalizeGCPin}
                  maxLength="8"
                  type="tel"
                  label={cms.pinLabel}
                  component={RenderTextField}
                  tooltipData={cms.pinHintTextLabel}
                />
              </div>
              <div className="col-6 p-0 pt-1 pl-2">
                <div className="w-100">
                  <GiftCardFormSubmitBtn onSubmitForm={data => this.onAddGiftCard(data, orderid)} btnText={cms.commonLabels.applyLabel} analyticsContent={analyticsContent} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  /**
   * renders gift card form fields
   * @param {object} cms object of list of labels from AEM
   * @param {string} orderid Current Order ID
   */
  renderAddGiftCard(cms, orderid, isLoggedIn, savedGiftCards) {
    if (this.state.showGiftCardForm) {
      const { giftCardsOptions } = this.filterOutGiftCardOptions();

      if (!isLoggedIn || giftCardsOptions.length === 0) {
        return (
          <div>
            {this.hideGiftCardOption(cms)}
            {this.renderAddGiftCardForm(cms, orderid)}
          </div>
        );
      }

      giftCardsOptions.push({ title: cms.addANewGiftCardLabel });

      return (
        <div>
          {this.hideGiftCardOption(cms)}
          <div className="o-copy__14bold pb-half">{cms.chooseGiftCardLabel}</div>
          <div className="w-100 d-flex flex-column flex-lg-row pb-2 pb-md-3">
            <div className="col-12 col-lg-6 p-0">
              <Dropdown
                DropdownOptions={giftCardsOptions}
                initiallySelectedOption={0}
                disabled={false}
                width="100%"
                height="3.5rem"
                borderColor="#cccccc"
                borderWidth="1px"
                borderRadius="4px"
                listBorderRadius="5px"
                titleClass="o-copy__14reg"
                subtitleClass="o-copy__12reg"
                onSelectOption={index => {
                  if (index === giftCardsOptions.length - 1) {
                    this.setState({ showForm: true, index });
                  } else {
                    this.setState({ showForm: false, index });
                  }
                }}
              />
            </div>
            <div className="col-12 col-lg-3 p-0 pt-1 pt-lg-0 pl-lg-2">
              {!this.state.showForm && (
                <Button
                  type="submit"
                  btntype="secondary"
                  disabled={false}
                  size="XS"
                  className="w-100 o-copy__14bold"
                  onClick={() =>
                    this.onAddGiftCard(
                      {
                        cardId: null,
                        cardPin: null
                      },
                      orderid,
                      this.state.index,
                      savedGiftCards.data.profile.payment
                    )
                  }
                >
                  {'APPLY'}
                </Button>
              )}
            </div>
          </div>
          {this.state.showForm && this.renderAddGiftCardForm(cms, orderid)}
        </div>
      );
    }
    return null;
  }
  render() {
    const { orderDetails, cms, giftCardData, isLoggedIn, savedGiftCards } = this.props;
    const { orderId, giftCardDetails, totals } = orderDetails;
    const { orderGrandTotal } = totals;
    this.showErrorIfAny(cms, giftCardData);
    return (
      <div id="paymentGiftCardForm">
        {this.showAllAppliedCards(cms, giftCardDetails, orderId)}
        {(this.state.showGiftCardForm && this.renderAddGiftCard(cms, orderId, isLoggedIn, savedGiftCards)) ||
          (giftCardDetails &&
            giftCardDetails.length &&
            giftCardDetails.length > 0 &&
            this.canAddGiftCard(orderGrandTotal) &&
            this.addAnotherGiftCardOption(cms)) ||
          (this.canAddGiftCard(orderGrandTotal) && this.addGiftCardOption(cms))}
      </div>
    );
  }
}

GiftCardOptions.propTypes = {
  cms: PropTypes.object.isRequired,
  giftCardData: PropTypes.object,
  savedGiftCards: PropTypes.object,
  orderDetails: PropTypes.object.isRequired,
  fngiftCardApplyRequest: PropTypes.func.isRequired,
  fngiftCardRemoveRequest: PropTypes.func.isRequired,
  fngiftCardFetchRequest: PropTypes.func.isRequired,
  fnClearGiftCardErrors: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool,
  analyticsContent: PropTypes.func
};

const giftCardFormContainer = reduxForm({
  form: 'giftCard',
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true,
  validate: validationRules
})(GiftCardOptions);

export default giftCardFormContainer;
