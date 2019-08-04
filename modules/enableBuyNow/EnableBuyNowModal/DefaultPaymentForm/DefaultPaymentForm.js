import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues, Field } from 'redux-form';
import { cx } from 'react-emotion';
import Button from '@academysports/fusion-components/dist/Button';
import withCityStateLookup from '../hoc/withCityStateLookup';
import ErrorFlash from '../elements/ErrorFlash';
import validationRules from './DefaultPaymentForm.validate';
import CreditCardForm from '../subForms/CreditCardForm';
import BillingAddressForm from '../subForms/BillingAddressForm';
import AddressDetailsDisplay from '../displays/AddressDetailsDisplay';
import CheckboxField from '../fields/CheckboxField';
import EmailFieldWrapper from '../fields/EmailField/EmailField';
import Hr from '../elements/Hr';
import Pagination from '../elements/Pagination';
import FormErrorScrollManager from '../../../../utils/FormErrorScrollManager';
import { getPaymentModalLabel, getBillingAddressLabel, getEnableFlowType, MULTIPLE_STEPS } from '../../../../utils/buyNow/buyNow.utils';
import { getCreditCardType } from '../../../../utils/validationRules';
import {
  TITLE,
  SUB_TITLE,
  CREDIT_CARD_TITLE,
  BILLING_ADDRESS_TITLE,
  SUBMIT_TEXT,
  EMAIL,
  EVENT_ACTION,
  EVENT_CATEGORY,
  EVENT_NAME
} from './DefaultPaymentForm.constants';
import { printBreadCrumb } from '../../../../utils/breadCrumb';
import { isMobile } from '../../../../utils/navigator';
import { formTitleStyle, formSubTitleStyle, xsButtonTweaks } from '../EnableBuyNowModal.emotion';
import { gtmDataLayerErrorTracker } from '../../../../utils/analyticsUtils';

export const PDP_DEFAULT_PAYMENT_FORM = 'pdpDefaultPaymentForm';

const SAME_AS_SHIPPING = 'sameAsShipping';

export const formFieldsToAddCreditCardProperties = {};

class DefaultPaymentForm extends PureComponent {
  constructor(props) {
    super(props);

    this.errorScrollManager = new FormErrorScrollManager('.form-scroll-to-error');
    this.handleEnter = this.handleEnter.bind(this);
    this.isMobileView = isMobile();
  }

  componentDidMount() {
    this.props.scrollPageToTop();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.billingCity &&
      nextProps.billingCity !== this.props.billingCity &&
      nextProps.billingState &&
      nextProps.billingState !== this.props.billingState
    ) {
      this.props.change(PDP_DEFAULT_PAYMENT_FORM, 'billingCity', nextProps.billingCity);
      this.props.change(PDP_DEFAULT_PAYMENT_FORM, 'billingState', nextProps.billingState);
    }
  }

  /**
   *  analytics function to track when user clicks on "Add default payment"
   */
  onClickAddDefaultPaymentLogGA(breadCrumb, productName) {
    const { gtmDataLayer } = this.props;
    const removeAcademyLabel = {
      removeAcademyLabel: true
    };
    gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: 'pdp| buy now',
      eventLabel: `${printBreadCrumb([...breadCrumb, productName], removeAcademyLabel)}`.toLowerCase()
    });
  }

  /**
   * @description Wrapper for redux-form handle submit.  Allows us to execute additional code on submit without being tied to redux-form handle submit.
   * @param  {Function} onSubmit - Function to be executed when form is submitted successfully.
   */
  handleSubmit = onSubmit => {
    const { handleSubmit, productItem } = this.props;
    const { breadCrumb = [] } = productItem || [];
    const reduxFormSubmit = handleSubmit(onSubmit);

    return () => {
      // call anlytics on click of 'buy now' on adding credit card
      this.onClickAddDefaultPaymentLogGA(breadCrumb, productItem ? productItem.name : '');
      reduxFormSubmit();
      const { scrollContainerEl } = this.props;
      this.errorScrollManager.scrollToError({ container: scrollContainerEl });
    };
  };
  handleEnter(e, onSubmit) {
    if (e.keyCode === 13) {
      this.handleSubmit(onSubmit);
    }
  }
  /**
   * @description Renders Header
   * @returns {JSX}
   */
  renderHeader() {
    const { cms, profile } = this.props;
    const flowType = getEnableFlowType(profile);

    return (
      <Fragment>
        <h5 className={cx(formTitleStyle, 'mb-2')}>{getPaymentModalLabel(cms, TITLE, flowType)}</h5>
        <div className={cx('o-copy__14reg', formSubTitleStyle)}>{getPaymentModalLabel(cms, SUB_TITLE, flowType)}</div>
      </Fragment>
    );
  }

  /**
   * @description Renders Error
   * @returns {JSX}
   */
  renderError({ className }) {
    const { errorMessage } = this.props;
    return <ErrorFlash message={errorMessage} className={className} />;
  }

  /**
   * @description Renders Credit Card Section Title
   * @returns {JSX}
   */
  renderCreditCardSectionTitle({ className }) {
    const { cms, profile } = this.props;
    const flowType = getEnableFlowType(profile);
    return this.renderSectionTitle(getPaymentModalLabel(cms, CREDIT_CARD_TITLE, flowType), { className });
  }

  /**
   * @description Renders Billing Address Section Title
   * @returns {JSX}
   */
  renderBillingAddressSectionTitle({ className }) {
    const { cms, profile } = this.props;
    const flowType = getEnableFlowType(profile);
    return this.renderSectionTitle(getPaymentModalLabel(cms, BILLING_ADDRESS_TITLE, flowType), { className });
  }

  /**
   * @description Renders Section Title
   * @returns {JSX}
   */
  renderSectionTitle(text, { className }) {
    return <div className={`o-copy__14reg ${className}`}>{text}</div>;
  }

  /**
   * @description Renders Credit Card Form
   * @returns {JSX}
   */
  renderCreditCardForm() {
    const { cms, initialValues } = this.props;
    const { creditCardNumber } = initialValues;
    return <CreditCardForm cms={cms} cardType={getCreditCardType(creditCardNumber)} />;
  }

  /**
   * @description Renders Same As Shipping Address Checkbox
   * @returns {JSX}
   */
  renderSameAsShippingCheckbox() {
    const { cms, profile, defaultShippingAddress } = this.props;
    const flowType = getEnableFlowType(profile);
    return (
      !!defaultShippingAddress && (
        <Field
          data-auid="sameAsShipping"
          id="sameAsShipping"
          name="sameAsShipping"
          type="checkbox"
          label={getBillingAddressLabel(cms, SAME_AS_SHIPPING, flowType)}
          component={CheckboxField}
          aria-label={getBillingAddressLabel(cms, SAME_AS_SHIPPING, flowType)}
        />
      )
    );
  }

  /**
   * @description Renders Billing Address Form
   * @returns {JSX}
   */
  renderBillingAddressForm() {
    const { cms, initialValues, onZipCodeChange, zipCodeState } = this.props;
    const { sameAsShipping, billingAddressLine2 } = initialValues;
    return (
      !sameAsShipping && (
        <BillingAddressForm cms={cms} onZipCodeChange={onZipCodeChange} zipCodeState={zipCodeState} addressLine2={billingAddressLine2} />
      )
    );
  }

  /**
   * @description Renders Billing Address Details when Same As Shipping Address Checkbox is checked
   * @returns {JSX}
   */
  renderBillingAddressDetails({ className }) {
    const { cms, defaultShippingAddress = {}, initialValues } = this.props;
    const { sameAsShipping } = initialValues;
    return !!sameAsShipping && <AddressDetailsDisplay className={className} cms={cms} {...defaultShippingAddress} />;
  }

  /**
   * @description Renders Email
   * @returns {JSX}
   */
  renderEmail() {
    const { cms } = this.props;
    const label = getBillingAddressLabel(cms, EMAIL);
    return (
      <Field
        auid="billingEmail"
        id="billingEmail"
        type="email"
        name="billingEmail"
        label={label}
        aria-label={label}
        component={EmailFieldWrapper}
        maxLength="255"
      />
    );
  }

  /**
   * @description Renders Submit Button
   * @returns {JSX}
   */
  renderSubmitButton() {
    const { cms, profile, isSubmitting, onSubmit } = this.props;
    const flowType = getEnableFlowType(profile);
    const buttonClassName = cx(xsButtonTweaks, { ['w-100']: this.isMobileView }); // eslint-disable-line no-useless-computed-key
    return (
      <Button
        auid="defaultPaymentFormSubmit"
        size={this.isMobileView ? 'S' : 'M'}
        className={buttonClassName}
        disabled={isSubmitting}
        onClick={this.handleSubmit(onSubmit)}
      >
        {getPaymentModalLabel(cms, SUBMIT_TEXT, flowType)}
      </Button>
    );
  }

  /**
   * @description Renders Pagination
   * @returns {JSX}
   */
  renderPagination({ className }) {
    const { profile } = this.props;
    return getEnableFlowType(profile) === MULTIPLE_STEPS && <Pagination pageCount={2} currentPage={2} className={className} />;
  }

  render() {
    return (
      <section>
        <div className="mb-1 mb-md-5 text-center">
          {this.renderHeader()}
          {this.renderError({ className: 'my-2 text-left' })}
        </div>
        <div role="presentation" className="form" onKeyDown={this.handleEnter}>
          {this.renderCreditCardSectionTitle({ className: 'mb-1' })}
          {this.renderCreditCardForm()}
          <Hr className="mt-2 mb-3" />
          {this.renderBillingAddressSectionTitle({ className: 'mb-1' })}
          {this.renderSameAsShippingCheckbox()}
          {this.renderBillingAddressForm()}
          {this.renderBillingAddressDetails({ className: 'mt-1 mb-2' })}
          <div className="row">
            <div className="mb-1 col-12">{this.renderEmail()}</div>
          </div>
          <div className="text-center mt-3">
            {this.renderSubmitButton()}
            {this.renderPagination({ className: 'mt-2' })}
          </div>
        </div>
      </section>
    );
  }
}

const HOCPropTypes = {
  onZipCodeChange: PropTypes.func,
  zipCodeCity: PropTypes.string,
  zipCodeState: PropTypes.string
};

DefaultPaymentForm.propTypes = {
  cms: PropTypes.object,
  profile: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  isSubmitting: PropTypes.bool,
  onSubmit: PropTypes.func,
  handleSubmit: PropTypes.func,
  errorMessage: PropTypes.string,
  defaultShippingAddress: PropTypes.object,
  initialValues: PropTypes.object,
  scrollPageToTop: PropTypes.func.isRequired,
  ...HOCPropTypes
};

DefaultPaymentForm.defaultProps = {
  onSubmit: () => undefined
};

const mapStateToProps = (state = {}, ownProps) => {
  const { initialVals, zipCodeCity, zipCodeState } = ownProps;
  const existingValues = getFormValues(PDP_DEFAULT_PAYMENT_FORM)(state);
  const initialVal = Object.assign(
    {},
    initialVals,
    existingValues,
    zipCodeCity && zipCodeState
      ? {
          billingCity: zipCodeCity,
          billingState: zipCodeState
        }
      : {}
  );
  return {
    initialValues: initialVal,
    gtmDataLayer: state.gtmDataLayer
  };
};

const DefaultPaymentFormWithReduxForm = reduxForm({
  form: PDP_DEFAULT_PAYMENT_FORM,
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true,
  validate: validationRules,
  onSubmitFail: (errors, dispatch, submitError, props) =>
    gtmDataLayerErrorTracker(EVENT_NAME, EVENT_CATEGORY, EVENT_ACTION, errors, dispatch, submitError, props)
})(DefaultPaymentForm);

export default withCityStateLookup(connect(mapStateToProps)(DefaultPaymentFormWithReduxForm));
