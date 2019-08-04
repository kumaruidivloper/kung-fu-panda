import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as styles from './styles';
import RenderCreditCard from './renderCreditCard';
import CardCommonMyAccount from '../cardCommonMyAccount';
import { addressDetails, removeDisplay, creditCardExpiredDisplay } from './myAccountPaymentDisplay';
import { MASTER_CARD_ITEM_TYPE, MASTER_CARD_CARD_TYPE, AMERICAN__ITEM_TYPE, AMEX_CARD_TYPE, ANALYTICS_EVENT_IN, ANALYTICS_EVENT_CATEGORY, analyticsEventLabel, analyticsEventAction } from './constants';
import AlertComponent from './../genericError/components/alertComponent';
import EmptyCondition from './emptyCondition';
import { isMobile } from '../../utils/navigator';
/**
 global declation for date object
 it is used to validate whether the credit card date is expire or not
 */
const date = new Date();
const month = (date.getUTCMonth() + 1).toString();
const year = date.getUTCFullYear().toString();
class CreditCardDisplay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showCreditCardForm: false,
      showCreditFormOnEmpty: false,
      editCreditCardItemID: '',
      removeCreditCardItemID: '',
      undoClick: false
    };

    this.wrapperRef = React.createRef();

    this.emptyCheckCreditCardRender = this.emptyCheckCreditCardRender.bind(this);
    this.renderEditCreditCardOrCommonCom = this.renderEditCreditCardOrCommonCom.bind(this);
    this.renderEmptyCreditCardOrForm = this.renderEmptyCreditCardOrForm.bind(this);
    this.toggleCreditCard = this.toggleCreditCard.bind(this);
    this.creditCardEditClick = this.creditCardEditClick.bind(this);
    this.creditCardEditCancelClick = this.creditCardEditCancelClick.bind(this);
    this.handleCreditCardRemove = this.handleCreditCardRemove.bind(this);
    this.displayRemoveDivOrCardCommon = this.displayRemoveDivOrCardCommon.bind(this);
    this.handleUndoClick = this.handleUndoClick.bind(this);
    this.showFormOnEmptyClick = this.showFormOnEmptyClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.displayCommonExpiry = this.displayCommonExpiry.bind(this);
    this.creditCardError = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    const { scrollPageToTop, analyticsContent, tokenizeError } = this.props;
    if (this.props.tokenizeError) {
      const analyticsData = {
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'form validation error|add credit card',
        eventLabel: `${tokenizeError}`
      };
      analyticsContent(analyticsData);
    }
    const { showCreditCardForm, editCreditCardItemID } = this.state;
    const newCreditCardFormClosed = showCreditCardForm !== prevState.showCreditCardForm && !showCreditCardForm;
    const editCreditCardFormClosed = editCreditCardItemID !== prevState.editCreditCardItemID && editCreditCardItemID === '';
    if (isMobile() && (newCreditCardFormClosed || editCreditCardFormClosed)) {
      scrollPageToTop();
    }
  }

  showFormOnEmptyClick() {
    this.setState({ showCreditFormOnEmpty: !this.state.showCreditFormOnEmpty });
  }
  handleCreditCardRemove(itemID) {
    this.setState({ undoClick: false });
    this.setState({ removeCreditCardItemID: itemID.xWalletId });
    setTimeout(() => {
      this.setState({ removeCreditCardItemID: '' });
      if (!this.state.undoClick) {
        this.props.fnRemoveCreditCard(this.props.profileID, itemID.xWalletId);
      }
    }, 5000);
  }
  handleCloseClick() {
    this.setState({ undoClick: true });
    this.props.fnRemoveCreditCard(this.props.profileID, this.state.removeCreditCardItemID);
    this.setState({ removeCreditCardItemID: '' });
  }
  handleUndoClick() {
    this.setState({ undoClick: true });
    this.setState({ removeCreditCardItemID: '' });
  }
  creditCardEditClick(itemID) {
    this.setState({ showCreditCardForm: false }, () => this.setState({ editCreditCardItemID: itemID }));
  }
  creditCardEditCancelClick() {
    this.setState({ editCreditCardItemID: '' });
  }
  toggleCreditCard(flag) {
    this.setState({ editCreditCardItemID: '' });
    this.setState({ showCreditCardForm: flag });
  }
  /**
   *@function this function checks if the user saved credit card is expired or not
   * @param {object} item
   * @param {object} cms
   * @param {number} index of each credit card object
   * @param {string} cardLabel specifies which type of card it is i.e visa, master
   */
  displayCommonExpiry(item, cms, index, cardLabel) {
    const { defaultFlag } = this.props.userCreditCards.payment[index];
    const cardExpMonth = parseInt(item.expiryDate.slice(0, 2), 10);
    const cardExpYear = parseInt(item.expiryDate.slice(2, 4), 10);
    let expiry = false;
    if ((cardExpYear * 12) + cardExpMonth < (12 * parseInt(year.slice(2, 4), 10)) + parseInt(month, 10)) {
      expiry = true;
    }
    return (
      <React.Fragment>
        <div>{expiry ? creditCardExpiredDisplay(cms, this.creditCardEditClick, this.handleCreditCardRemove, item) : null}</div>
        <CardCommonMyAccount
          render={addressDetails(cms, item, cardLabel)}
          showEdit={!expiry}
          showRemove={!expiry}
          showSetAsDefaultButton={!defaultFlag}
          cms={cms}
          deleteItemID={item.xWalletId}
          id={index}
          RemoveHandler={this.handleCreditCardRemove}
          submitHandlerEdit={this.props.onSubmitForm}
          profileID={this.props.profileID}
          EditHandler={this.creditCardEditClick}
          showDefaultBanner={defaultFlag}
          setAsDefaultHandler={this.props.setAsDefaultHandler}
          deleteItem={item}
        />
      </React.Fragment>
    );
  }
  displayRemoveDivOrCardCommon(item, cms, index) {
    const cardString = cms.commonLabels.cardEndingDeletedText.replace('{{cardNo}}', '-'.concat(item.creditCardNumber.slice(-4)));
    const displayLabel = `${cms.commonLabels.cardEndingInLabel} - ${item.creditCardNumber.slice(-4)}`;
    let cardType = '';
    if (item.type.toLowerCase() === MASTER_CARD_ITEM_TYPE) {
      cardType = MASTER_CARD_CARD_TYPE;
    } else if (item.type.toLowerCase() === AMERICAN__ITEM_TYPE) {
      cardType = AMEX_CARD_TYPE;
    } else {
      cardType = `${item.type} `;
      cardType = cardType.charAt(0).toUpperCase() + cardType.slice(1);
    }
    const displayText = cardType.concat(cardString);
    const cardLabel = cardType.concat(displayLabel);
    const { removeCreditCardItemID } = this.state;
    return (
      <React.Fragment>
        {removeCreditCardItemID.length > 0 && removeCreditCardItemID === item.xWalletId
          ? removeDisplay(this.handleUndoClick, this.handleCloseClick, cms, displayText)
          : this.displayCommonExpiry(item, cms, index, cardLabel)}
      </React.Fragment>
    );
  }
  emptyCheckCreditCardRender(cms) {
    const { userCreditCards } = this.props;
    return (
      <React.Fragment>
        {userCreditCards && userCreditCards.payment.length > 0
          ? this.renderEditCreditCardOrCommonCom(cms)
          : this.renderEmptyCreditCardOrForm(this.props.cms)}
      </React.Fragment>
    );
  }
  /**
   * collects and pushes analytics data for update credit card event.
   */
  postUpdateCreditCardAnalyticsData(props) {
    const { analyticsContent } = props;
    const analyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventLabel.EDIT,
      eventLabel: analyticsEventAction.UPDATE
    };
    analyticsContent(analyticsData);
  }
  renderEditCreditCardOrCommonCom(cms) {
    const { payment } = this.props.userCreditCards;
    const { fnLoadCityStateData, zipCodeCityStateData, onSubmitForm, scrollToTop, analyticsContent } = this.props;
    return payment.map(
      (item, index) =>
        this.state.editCreditCardItemID.length > 0 && this.state.editCreditCardItemID === item.xWalletId ? (
          <RenderCreditCard
            cms={cms}
            onSubmitForm={onSubmitForm}
            emptyCondition={false}
            editClickFromCommon
            creditCardEditCancelClick={this.creditCardEditCancelClick}
            editItemId={index}
            userCreditCards={payment}
            editCreditCard
            deleteItemID={this.state.editCreditCardItemID}
            fnLoadCityStateData={fnLoadCityStateData}
            zipCodeCityStateData={zipCodeCityStateData}
            emptyClickCreditCard={false}
            scrollToTop={scrollToTop}
            analyticsContent={analyticsContent}
            postUpdateCreditCardAnalyticsData={this.postUpdateCreditCardAnalyticsData}
          />
        ) : (
          this.displayRemoveDivOrCardCommon(item, cms, index)
        )
    );
  }
  renderEmptyCreditCardOrForm(cms) {
    const { scrollToTop, analyticsContent } = this.props;
    return (
      <React.Fragment>
        {this.state.showCreditFormOnEmpty ? (
          <RenderCreditCard
            cms={cms}
            onSubmitForm={this.props.onSubmitForm}
            emptyCondition
            showFormOnEmptyClick={this.showFormOnEmptyClick}
            toggleCreditCard={this.toggleCreditCard}
            editClickFromCommon={false}
            editCreditCard={false}
            fnLoadCityStateData={this.props.fnLoadCityStateData}
            zipCodeCityStateData={this.props.zipCodeCityStateData}
            emptyClickCreditCard
            scrollToTop={scrollToTop}
            analyticsContent={analyticsContent}
            postUpdateCreditCardAnalyticsData={this.postUpdateCreditCardAnalyticsData}
          />
        ) : (
          <EmptyCondition
            heading={cms.youHaveNoCreditLabel}
            button={cms.addNewCreditCardLabelUpper}
            creditCardOpen
            creditCardForm={this.renderCreditcard}
            cms={cms}
            toggleCreditCard={this.toggleCreditCard}
            onSubmitForm={this.props.onSubmitForm}
            showFormOnEmptyClick={this.showFormOnEmptyClick}
          />
        )}
      </React.Fragment>
    );
  }

  render() {
    const { cms, tokenizeError, userCreditCardsErr, userCreditCards, scrollToTop, analyticsContent } = this.props;
    const { showCreditCardForm } = this.state;
    if (userCreditCardsErr.length > 0 && this.creditCardError.current) {
      scrollToTop(this.creditCardError.current);
    }
    return (
      <div ref={this.wrapperRef}>
        {tokenizeError.length > 0 ? (
          <div>
            <AlertComponent message={tokenizeError} />
          </div>
        ) : null}
        {userCreditCardsErr.length > 0 ? (
          <div ref={this.creditCardError}>
            <AlertComponent message={cms.errorMsg[userCreditCardsErr]} />
          </div>
        ) : null}
        <div className="d-flex flex-sm-row flex-column justify-content-between pb-2 pb-md-2">
          <div className="o-copy__16bold">{cms.creditCardLabel}</div>
          {!showCreditCardForm && userCreditCards && userCreditCards.payment.length > 0 ? (
            <button
              data-auid="add-new-Credit-Card-btn"
              className={`${styles.bgNone} o-copy__14reg pt-2 pt-sm-0 d-flex`}
              onClick={() => this.toggleCreditCard(true)}
            >
              <span className={classNames('academyicon icon-plus', 'pr-half', styles.iconColor)} />
              <span className={styles.textLink}>{cms.addNewCreditCardLabelLower}</span>
            </button>
          ) : null}
        </div>
        {showCreditCardForm ? (
          <RenderCreditCard
            cms={cms}
            onSubmitForm={this.props.onSubmitForm}
            emptyCondition={false}
            showFormOnEmptyClick={this.showFormOnEmptyClick}
            toggleCreditCard={this.toggleCreditCard}
            editClickFromCommon={false}
            editCreditCard={false}
            fnLoadCityStateData={this.props.fnLoadCityStateData}
            zipCodeCityStateData={this.props.zipCodeCityStateData}
            emptyClickCreditCard={false}
            scrollToTop={scrollToTop}
            analyticsContent={analyticsContent}
            postUpdateCreditCardAnalyticsData={this.postUpdateCreditCardAnalyticsData}
          />
        ) : null}
        {this.emptyCheckCreditCardRender(cms)}
      </div>
    );
  }
}
CreditCardDisplay.propTypes = {
  cms: PropTypes.object.isRequired,
  userCreditCards: PropTypes.array,
  profileID: PropTypes.string,
  onSubmitForm: PropTypes.func,
  fnRemoveCreditCard: PropTypes.func,
  setAsDefaultHandler: PropTypes.func,
  fnLoadCityStateData: PropTypes.func,
  zipCodeCityStateData: PropTypes.object,
  tokenizeError: PropTypes.string,
  userCreditCardsErr: PropTypes.string,
  scrollToTop: PropTypes.func,
  scrollPageToTop: PropTypes.func,
  analyticsContent: PropTypes.func
};

export default CreditCardDisplay;
