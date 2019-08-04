import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import GiftCardFormSubmitBtn from './giftCardFormSubmitBtn';
import RenderTextField from './gcRenderInputField';
import { validationRules, normalizeGCNumber, normalizeGCPin } from './gcValidationRules';
import { boxBlock, bgNone, iconColor } from './styles';
import { FORM_NAME } from './constants';
class AddNewGiftCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.addGiftCard = this.addGiftCard.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
  }
  /**
   * Handling add gift card Api
   */
  addGiftCard(gcData) {
    const data = {
      giftCardNumber: gcData.giftCardNumber ? gcData.giftCardNumber.replace(/ - /g, '') : '',
      giftCardPin: gcData.giftPin ? gcData.giftPin : ''
    };
    if (gcData.giftCardNumber && gcData.giftPin) {
        this.props.fnaddGiftCardsProp(data);
        if (this.props.emptyCondition) {
          this.props.showGiftFormOnEmptyClick();
        } else {
          this.props.toggleGiftCard(false);
        }
    }
  }
  /**
   * Discard adding new gift card
   */
  handleCancelClick() {
    if (this.props.emptyCondition) {
      this.props.showGiftFormOnEmptyClick();
    } else {
      this.props.toggleGiftCard(false);
    }
  }
  render() {
    const { cms, analyticsContent } = this.props;
    return (
      <form name="addNewGiftCardForm">
        <div className={classNames(`${boxBlock}`, 'px-0', 'px-md-3', 'mb-half', 'pb-3')}>
          <div className={classNames('pb-3', 'pt-md-3', 'o-copy__14reg')}>{cms.addNewGiftCardLabel}</div>
          <div className={classNames('row', 'pb-3', 'col-12', 'px-0')}>
            <div className={classNames('col-12 col-md-9 pr-0 pr-md-2 pb-half')}>
              <Field
                name="giftCardNumber"
                id="myaccount-gcnumber"
                label={cms.checkoutLabels.giftCardNumberLabel}
                normalize={normalizeGCNumber}
                type="tel"
                component={RenderTextField}
              />
            </div>
            <div className={classNames('col-md-3', 'col-5', 'p-0', 'pb-half', 'ml-1 ml-md-0')}>
              <Field
                name="giftPin"
                id="myaccount-gcpin"
                normalize={normalizeGCPin}
                maxLength="8"
                type="tel"
                label={cms.pinLabel}
                component={RenderTextField}
                tooltipData={cms.checkoutLabels.pinHintTextLabel}
              />
            </div>
          </div>
          <div className={classNames('d-flex', 'flex-column', 'flex-md-row', 'flex-column-reverse', 'justify-content-end', 'pb-3')}>
            <div className="d-flex justify-content-center">
              <button
                className={classNames(`${bgNone}`, `${iconColor}`, 'o-copy__14reg', 'pt-2', 'pt-sm-0', 'pr-2')}
                onClick={this.handleCancelClick}
              >
                {' '}
                {cms.commonLabels.cancelLabel}{' '}
              </button>
            </div>
            <div>
              <GiftCardFormSubmitBtn analyticsContent={analyticsContent} onSubmitForm={data => this.addGiftCard(data)} btnText={cms.commonLabels.addLabel} />
            </div>
          </div>
        </div>
      </form>
    );
  }
}
AddNewGiftCard.propTypes = {
  toggleGiftCard: PropTypes.func,
  fnaddGiftCardsProp: PropTypes.func,
  cms: PropTypes.object,
  emptyCondition: PropTypes.bool,
  showGiftFormOnEmptyClick: PropTypes.func,
  analyticsContent: PropTypes.func
};
const giftCardFormContainer = reduxForm({
  form: FORM_NAME,
  validate: validationRules,
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true
})(AddNewGiftCard);
export default connect(
  null,
  null
)(giftCardFormContainer);
