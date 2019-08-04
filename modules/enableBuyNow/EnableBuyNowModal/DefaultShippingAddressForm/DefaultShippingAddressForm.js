import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, getFormValues } from 'redux-form';
import { cx } from 'emotion';
import Button from '@academysports/fusion-components/dist/Button';

import withCityStateLookup from '../hoc/withCityStateLookup';
import ErrorFlash from '../elements/ErrorFlash';
import ShippingAddressForm from '../subForms/ShippingAddressForm';
import Pagination from '../elements/Pagination';
import FormErrorScrollManager from '../../../../utils/FormErrorScrollManager';
import validationRules from './DefaultShippingAddressForm.validate';
import { getShippingModalLabel, getEnableFlowType, MULTIPLE_STEPS } from '../../../../utils/buyNow/buyNow.utils';
import {
  TITLE,
  SUB_TITLE,
  SHIPPING_ADDRESS_TITLE,
  SUBMIT_TEXT,
  EVENT_ACTION,
  EVENT_CATEGORY,
  EVENT_NAME
} from './DefaultShippingAddressForm.constants';
import { printBreadCrumb } from '../../../../utils/breadCrumb';
import { isMobile } from '../../../../utils/navigator';
import { formTitleStyle, formSubTitleStyle } from '../EnableBuyNowModal.emotion';
import { gtmDataLayerErrorTracker } from '../../../../utils/analyticsUtils';

export const PDP_DEFAULT_SHIPPING_ADDRESS_FORM = 'pdpDefaultShippingAddressForm';
class DefaultShippingAddressForm extends PureComponent {
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
      this.props.change(PDP_DEFAULT_SHIPPING_ADDRESS_FORM, 'billingCity', nextProps.billingCity);
      this.props.change(PDP_DEFAULT_SHIPPING_ADDRESS_FORM, 'billingState', nextProps.billingState);
    }
  }

  /**
   *  analytics function to track when user clicks on "Add default Shipping"
   */
  onClickAddDefaultShippingLogGA(breadCrumb, productName) {
    const { gtmDataLayer } = this.props;
    const removeAcademyLabel = {
      removeAcademyLabel: true
    };
    gtmDataLayer.push({
      event: 'pdpDetailClick',
      eventCategory: 'pdp interactions',
      eventAction: 'pdp|add a default payment option',
      eventLabel: `${printBreadCrumb([...breadCrumb, productName], removeAcademyLabel)}`.toLowerCase()
    });
  }

  /**
   * @description Wrapper for redux-form handle submit.  Allows us to execute additional code on submit without being tied to redux-form handle submit.
   * @param  {Function} onSubmit - Function to be executed when form is submitted successfully.
   */
  handleSubmit = onSubmit => {
    const { handleSubmit, productItem } = this.props;
    const { breadCrumb = [], name } = productItem || {};

    const onSubmitWithAnalytics = () => {
      // call anlytics on click of 'add default submit button'
      this.onClickAddDefaultShippingLogGA(breadCrumb, name);
      onSubmit();
    };

    const reduxFormSubmit = handleSubmit(onSubmitWithAnalytics);
    return () => {
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
        <h5 className={cx(formTitleStyle, 'mb-2')}>{getShippingModalLabel(cms, TITLE, flowType)}</h5>
        <div className={cx('o-copy__14reg', formSubTitleStyle)}>{getShippingModalLabel(cms, SUB_TITLE, flowType)}</div>
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
   * @description Renders Section Title
   * @returns {JSX}
   */
  renderSectionTitle({ className }) {
    const { cms, profile } = this.props;
    const flowType = getEnableFlowType(profile);
    return <div className={`o-copy__14reg ${className}`}>{getShippingModalLabel(cms, SHIPPING_ADDRESS_TITLE, flowType)}</div>;
  }

  /**
   * @description Renders Submit Button
   * @returns {JSX}
   */
  renderSubmitButton() {
    const { cms, profile, isSubmitting, onSubmit } = this.props;
    const flowType = getEnableFlowType(profile);
    const buttonClassName = cx({ ['w-100, o-copy__14reg']: this.isMobileView }); // eslint-disable-line no-useless-computed-key
    return (
      <Button disabled={isSubmitting} size={this.isMobileView ? 'S' : 'M'} className={buttonClassName} onClick={this.handleSubmit(onSubmit)}>
        {getShippingModalLabel(cms, SUBMIT_TEXT, flowType)}
      </Button>
    );
  }

  /**
   * @description Renders Pagination
   * @returns {JSX}
   */
  renderPagination({ className }) {
    const { profile } = this.props;
    return getEnableFlowType(profile) === MULTIPLE_STEPS && <Pagination pageCount={2} currentPage={1} className={className} />;
  }

  render() {
    const { cms, onZipCodeChange, zipCodeState, initialValues = {} } = this.props;
    return (
      <section>
        <div className="mb-1 mb-md-5 text-center">
          {this.renderHeader()}
          {this.renderError({ className: 'my-2 text-left' })}
        </div>
        <div role="presentation" className="form" onKeyDown={this.handleEnter}>
          {this.renderSectionTitle({ className: 'mb-1' })}
          <ShippingAddressForm
            cms={cms}
            zipCodeState={zipCodeState}
            onZipCodeChange={onZipCodeChange}
            addressLine2={initialValues.shippingAddressLine2}
          />
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

DefaultShippingAddressForm.propTypes = {
  cms: PropTypes.object,
  profile: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  productItem: PropTypes.object,
  isSubmitting: PropTypes.bool,
  onSubmit: PropTypes.func,
  handleSubmit: PropTypes.func,
  errorMessage: PropTypes.string,
  scrollPageToTop: PropTypes.string.isRequired,
  ...HOCPropTypes
};

DefaultShippingAddressForm.defaultProps = {
  onSubmit: () => undefined
};

const mapStateToProps = (state = {}, ownProps) => {
  const { initialVals, zipCodeCity, zipCodeState } = ownProps;
  const existingValues = getFormValues(PDP_DEFAULT_SHIPPING_ADDRESS_FORM)(state);
  const initialVal = Object.assign(
    {},
    initialVals,
    existingValues,
    zipCodeCity && zipCodeState
      ? {
          shippingCity: zipCodeCity,
          shippingState: zipCodeState
        }
      : {}
  );
  return {
    initialValues: initialVal,
    gtmDataLayer: state.gtmDataLayer
  };
};

const DefaultShippingAddressFormWithReduxForm = reduxForm({
  form: PDP_DEFAULT_SHIPPING_ADDRESS_FORM,
  enableReinitialize: true,
  destroyOnUnmount: false,
  keepDirtyOnReinitialize: true,
  validate: validationRules,
  onSubmitFail: (errors, dispatch, submitError, props) =>
    gtmDataLayerErrorTracker(EVENT_NAME, EVENT_CATEGORY, EVENT_ACTION, errors, dispatch, submitError, props)
})(DefaultShippingAddressForm);

export default withCityStateLookup(connect(mapStateToProps)(DefaultShippingAddressFormWithReduxForm));
