import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AddressForm from './paymentAddressForm';
import ShippingAddressFormSubmitBtn from './shippingAddressFormSubmitBtn';
import { AMEX, VISA, DISC, MAST } from './constants';
import * as styles from './styles';

/**
 variable to handle credit card first two digit
 and show image even on copy and paste situations
 */
let creditCardFirstTwoDigit = '';
class RenderCreditCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      creditCardSrc: '',
      showValidCard: false,
      cardMaxLength: 3
    };

    this.wrapperRef = React.createRef();

    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.onChangeCreditCardFieldHandler = this.onChangeCreditCardFieldHandler.bind(this);
    this.validateCard = this.validateCard.bind(this);
    this.getCurrentImage = this.getCurrentImage.bind(this);
    this.setCvvLengthOnEdit = this.setCvvLengthOnEdit.bind(this);
    this.getinitialValues = this.getinitialValues.bind(this);
  }

  componentDidMount() {
    const { scrollToTop } = this.props;
    scrollToTop(this.wrapperRef.current);
  }
  /**
   * @function that handles credit card input field change
   * @param {event} eve
   */
  onChangeCreditCardFieldHandler(eve) {
    const { value } = eve.target;
    if (value.length >= 2 && eve.target.name === 'creditcardField' && creditCardFirstTwoDigit !== value.slice(0, 2)) {
      creditCardFirstTwoDigit = value.slice(0, 2);
      this.onCreditcardValidate(creditCardFirstTwoDigit);
      this.setState({ showValidCard: true });
    } else if (value.length < 2 && eve.target.name === 'creditcardField') {
      this.setState({ showValidCard: false, creditCardSrc: '' });
      creditCardFirstTwoDigit = '';
    }
  }
  /**
  @function that validates the card type and supply the required image
 * @param {string} creditcardInputVal
 */
  onCreditcardValidate(creditcardInputVal) {
    const { commonLabels } = this.props.cms;
    if (creditcardInputVal.length <= 1) {
      this.setState({ creditCardSrc: '' });
    } else if (creditcardInputVal.length === 2) {
      if (this.validateCard(creditcardInputVal, /^(?:3[47])$/)) {
        this.setState({ creditCardSrc: this.getCurrentImage(AMEX, commonLabels.cardsAccepted), cardMaxLength: 4 });
      } else if (this.validateCard(creditcardInputVal, /^(?:5[1-5])$/)) {
        this.setState({ creditCardSrc: this.getCurrentImage(MAST, commonLabels.cardsAccepted), cardMaxLength: 3 });
      } else if (this.validateCard(creditcardInputVal, /^(?:4[0-9]{1}?)$/)) {
        this.setState({ creditCardSrc: this.getCurrentImage(VISA, commonLabels.cardsAccepted), cardMaxLength: 3 });
      } else if (this.validateCard(creditcardInputVal, /^(?:6(?:0|5))$/)) {
        this.setState({ creditCardSrc: this.getCurrentImage(DISC, commonLabels.cardsAccepted), cardMaxLength: 3 });
      } else {
        this.setState({ creditCardSrc: '', cardMaxLength: 3 });
      }
    }
  }
  /**
   *
   * @param {string} cardName - provided by ourself for validation
   * @param {*} propValues - list of creditcard urls
   */
  getCurrentImage(cardName, cardsAccepted) {
    let cardurl = '';
    if (cardsAccepted && cardsAccepted.length) {
      cardurl = cardsAccepted.filter(cardObj => (cardObj.label && cardObj.label.toLowerCase().indexOf(cardName) !== -1 ? cardObj.url : ''));
    }
    return cardurl && cardurl[0] ? cardurl[0].url : '';
  }
  /**
   * @function this function handles the cvv length when user clicks the edit option
   * @param {number} cvvLength
   */
  setCvvLengthOnEdit(cvvLength) {
    this.setState({ cardMaxLength: cvvLength });
  }
  /**
   * FUNCTION returns the credit card initial values based on condition whether it is
   * edit credit card or add new credit card
   * @param {string} maskedCreditCardNumber
   * @param {string} expiryEdit
   */
  getinitialValues(maskedCreditCardNumber, expiryEdit) {
    const { editClickFromCommon } = this.props;
    if (editClickFromCommon) {
      const { editItemId, userCreditCards } = this.props;
      const { address, companyName, firstName, lastName, city, state, zipCode, phoneNumber } = userCreditCards[editItemId].billingAddress;
      return {
        address,
        companyName,
        firstName,
        lastName,
        city,
        state,
        zipCode,
        phoneNumber,
        creditcardFieldEdit: maskedCreditCardNumber,
        expiryField: expiryEdit
      };
    }
    return null;
  }
  validateCard(value, pattern) {
    return value.match(pattern);
  }
  /**
   * FUNCTION handles credit card form cancel click on 3 scenario
   * first when credit card cancel button is clicked from empty condition
   * second when cancel button is clicked from edit condition
   * third when cancel button is clicked from add new credit card from
   */
  handleCancelClick() {
    const { emptyCondition, showFormOnEmptyClick, editClickFromCommon, creditCardEditCancelClick, toggleCreditCard } = this.props;
    if (emptyCondition) {
      showFormOnEmptyClick();
    } else if (editClickFromCommon) {
      creditCardEditCancelClick();
    } else {
      toggleCreditCard(false);
    }
  }
  render() {
    const {
      cms,
      editItemId,
      editClickFromCommon,
      userCreditCards,
      fnLoadCityStateData,
      zipCodeCityStateData,
      editCreditCard,
      onSubmitForm,
      deleteItemID,
      toggleCreditCard,
      creditCardEditCancelClick,
      showFormOnEmptyClick,
      emptyClickCreditCard,
      analyticsContent,
      postUpdateCreditCardAnalyticsData
    } = this.props;
    const { cvvLabel, creditCardNumberLabel, cvvHintText } = cms.checkoutLabels;
    const { showValidCard, creditCardSrc } = this.state;
    let expiryEdit;
    let maskedCreditCardNumber;
    if (editCreditCard) {
      const { expiryDate, creditCardNumber } = this.props.userCreditCards[this.props.editItemId];
      expiryEdit = expiryDate
        .slice(0, 2)
        .concat('/')
        .concat(expiryDate.slice(2, expiryDate.length));
      const ccNum = creditCardNumber.slice(0, creditCardNumber.length - 4);
      maskedCreditCardNumber = ccNum.replace(/[0-9]/g, '*').concat(creditCardNumber.slice(-4));
    }
    return (
      <div className={classNames('pt-md-2 px-md-3 mb-2', styles.boxBlock)} ref={this.wrapperRef}>
        <span className={classNames('o-copy__14reg', 'pt-2')}>{editCreditCard ? cms.editCreditCardLabel : cms.addNewCreditCardLabelUpper}</span>
        <div className="pb-3 pt-3">
          <AddressForm
            cvvLabel={cvvLabel}
            creditCardNumberLabel={creditCardNumberLabel}
            cvvHintText={cvvHintText}
            expirationDateLabel={cms.expiryDateLabel}
            cardsAccepted="card excepted"
            cms={cms}
            editCreditCard={editCreditCard}
            showValidCard={showValidCard}
            creditCardSrc={creditCardSrc}
            onEditHandler={this.onChangeCreditCardFieldHandler}
            fnLoadCityStateData={fnLoadCityStateData}
            zipCodeCityStateData={zipCodeCityStateData}
            initialVals={this.getinitialValues(maskedCreditCardNumber, expiryEdit)}
            cardMaxLength={this.state.cardMaxLength}
            getCurrentImage={this.getCurrentImage}
            cardType={editClickFromCommon ? userCreditCards[editItemId].type : null}
            setCvvLengthOnEdit={this.setCvvLengthOnEdit}
          />
        </div>
        <div className="d-flex flex-column flex-md-row flex-column-reverse justify-content-end pb-3">
          <div className="d-flex justify-content-center">
            <button className={`${styles.bgNone} ${styles.iconColor} o-copy__14reg pt-2 pt-sm-0 pr-2`} onClick={this.handleCancelClick}>
              {cms.commonLabels.cancelLabel}
            </button>
          </div>
          <div>
            <ShippingAddressFormSubmitBtn
              onSubmitForm={onSubmitForm}
              btnText={editCreditCard ? cms.commonLabels.updateLabel : cms.commonLabels.addLabel}
              editCreditCard={editCreditCard}
              deleteItemID={deleteItemID}
              toggleCreditCard={toggleCreditCard}
              creditCardEditCancelClick={creditCardEditCancelClick}
              editItemIndex={editItemId}
              showFormOnEmptyClick={showFormOnEmptyClick}
              emptyClickCreditCard={emptyClickCreditCard}
              analyticsContent={analyticsContent}
              postUpdateCreditCardAnalyticsData={postUpdateCreditCardAnalyticsData}
            />
          </div>
        </div>
      </div>
    );
  }
}

RenderCreditCard.propTypes = {
  cms: PropTypes.object,
  onSubmitForm: PropTypes.func,
  emptyCondition: PropTypes.bool,
  toggleCreditCard: PropTypes.func,
  showFormOnEmptyClick: PropTypes.func,
  editClickFromCommon: PropTypes.bool,
  creditCardEditCancelClick: PropTypes.func,
  userCreditCards: PropTypes.object,
  editItemId: PropTypes.string,
  editCreditCard: PropTypes.bool,
  deleteItemID: PropTypes.string,
  fnLoadCityStateData: PropTypes.func,
  zipCodeCityStateData: PropTypes.object,
  emptyClickCreditCard: PropTypes.bool,
  scrollToTop: PropTypes.func,
  analyticsContent: PropTypes.func,
  postUpdateCreditCardAnalyticsData: PropTypes.func
};

export default RenderCreditCard;
