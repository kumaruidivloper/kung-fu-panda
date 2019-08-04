import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { cx } from 'react-emotion';
import Input from '@academysports/fusion-components/dist/InputField';
import PasswordField from '@academysports/fusion-components/dist/PasswordField';
import Dropdown from '@academysports/fusion-components/dist/Dropdown';
import Button from '@academysports/fusion-components/dist/Button';
import Checkbox from '@academysports/fusion-components/dist/Checkbox';
import { Provider } from 'react-redux';
import EmailField from '@academysports/fusion-components/dist/EmailField';
import FormErrorScrollManager from '../../utils/FormErrorScrollManager';
import {
  fullWidth,
  signin,
  errorWrapper,
  Btn,
  hr,
  checkStyle,
  errorRedColor,
  passwordFocus,
  errorText,
  errorBorder,
  TitleSuccessMsg
} from './styles';
import StorageManager from './../../utils/StorageManager';
import PasswordStrengthMeter from '../passwordStrengthMeter';
import { NODE_TO_MOUNT, DATA_COMP_ID, SIGNIN_LINK, SIGNIN, ANALYTICS_EVENT_IN, ANALYTICS_EVENT_ACTION, ANALYTICS_EVENT_CATEGORY, ADDRESS_TYPE
 } from './constants';
import { domainsList, PREVIOUS_URL, SUB_URL, USStates, COUNTRY } from './../../utils/constants';
import { isValidEmail, isValidName, isValidCity, isValidZipCode, isValidAddress, isValidPhoneNumber } from '../../utils/validationRules';
import { scrollIntoView } from '../../utils/scroll';
import AddressSuggestions from './Components/addressSuggestionsModal';
import { SHOW_LABEL, HIDE_LABEL, BTN_LABEL_FONT_SIZE, INLINE_BUTTON_FONT_SIZE } from '../../apps/myaccount/myaccount.constants';
class SignUpComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      signupSuccess: true,
      firstName: '',
      lastName: '',
      logonId: '',
      logonPassword: '',
      address: '',
      zipcode: '',
      city: '',
      phoneNo: '',
      statePart: '',
      stateIndex: 0,
      addCompany: '',
      emailOptIn: true,
      submitButtonActive: false,
      validFirstName: true,
      validLastName: true,
      validEmail: true,
      validPass: true,
      validZipCode: true,
      apiValidZipCode: true,
      validCity: true,
      validPhoneNo: true,
      validAddress: true,
      validStatePart: true,
      showPass: false,
      invalidEmail: '',
      invalidFirstName: '',
      invalidLastName: '',
      invalidPass: '',
      invalidAddress: '',
      invalidStatePart: '',
      checkboxStatus: true,
      addressDetailPart: false,
      addCompanyFlag: false,
      modalIsOpen: false,
      enteredAddress: ''
    };

    this.errorScrollManager = new FormErrorScrollManager('.form-scroll-to-error');

    this.signupConatinerRef = React.createRef();
    this.handleSignUpClick = this.handleSignUpClick.bind(this);
    this.firstName = this.firstName.bind(this);
    this.lastName = this.lastName.bind(this);
    this.addresMain = this.addresMain.bind(this);
    this.zipCode = this.zipCode.bind(this);
    this.phoneNo = this.phoneNo.bind(this);
    this.myCity = this.myCity.bind(this);
    this.checkValidation = this.checkValidation.bind(this);
    this.validateFName = this.validateFName.bind(this);
    this.validateLName = this.validateLName.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePass = this.validatePass.bind(this);
    this.validateAddress = this.validateAddress.bind(this);
    this.validatePhoneNo = this.validatePhoneNo.bind(this);
    this.validateCity = this.validateCity.bind(this);
    this.validateZipCode = this.validateZipCode.bind(this);
    this.validStateAddress = this.validStateAddress.bind(this);
    this.checkbox = this.checkbox.bind(this);
    this.checkboxAddress = this.checkboxAddress.bind(this);
    this.handleSignInClick = this.handleSignInClick.bind(this);
    this.postAnalyticsData = this.postAnalyticsData.bind(this);
    this.getErrorMsg = this.getErrorMsg.bind(this);
    this.onShowCompanyAddress = this.onShowCompanyAddress.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.signupCall = this.signupCall.bind(this);
    this.zipPlusFourFormatValidator = this.zipPlusFourFormatValidator.bind(this);
    this.loadCityStateInStore = this.loadCityStateInStore.bind(this);
 }

  /**
   * @function, This function sets the userId in cookies after succesful signup ,
   * @param {object} nextProps, nextProps takes the changes in props of component
   * @return {null} , returns nothing
   */
  componentWillReceiveProps(nextProps) {
    const { analyticsContent } = nextProps;
    const { identity } = nextProps.registerData;
    const { addressValid } = nextProps;
    if (identity) {
      StorageManager.setSessionStorage('userId', identity.userId);
      StorageManager.setSessionStorage('storeId', null);
    }
    if ((addressValid !== this.props.addressValid) || (nextProps.errorAddressVerify !== this.props.errorAddressVerify)) {
      if (addressValid && addressValid.avsErrors) {
        this.setState({ modalIsOpen: true });
      } else if (
        nextProps.errorAddressVerify ||
        (addressValid && addressValid.address === 'Verified')
      ) {
        this.signupCall(this.state.enteredAddress);
      }
    }
    if (nextProps.errorSignUp === true) {
      const container = this.signupConatinerRef.current;
      scrollIntoView(container, true);
    }
    if (nextProps.errorCode && this.props.errorSignUp !== nextProps.errorSignUp) {
      const analyticsData = {
        event: 'errormessage',
        eventCategory: 'error message',
        eventAction: 'validation error|signup',
        eventLabel: this.getErrorMsg(nextProps)
      };
      analyticsContent(analyticsData);
    }
    if (nextProps.cityStore !== this.props.cityStore) {
      if ('city' in nextProps.cityStore) {
          this.setState({
              city: nextProps.cityStore.city
          });
          const index = this.getStateIndex(nextProps.cityStore.state);
          this.setState({
              stateIndex: index + 1
          });
          this.setState({
            apiValidZipCode: true,
            validZipCode: true,
            invalidZipCode: ''
        });
      } else if ('errors' in nextProps.cityStore) {
          this.setState({
              city: ''
          });
          this.setState({
              stateIndex: 0
          });
          this.setState({
              invalidZipCode: nextProps.cityStore.errors[0].errorMessage,
              apiValidZipCode: false,
              validZipCode: false
          });
      }
  }
  }

  componentDidUpdate() {
    const {
      registerData: { identity }
    } = this.props;
    if (identity) {
      this.postAnalyticsData(true);
    }
  }

  onShowCompanyAddress(evt) {
    evt.preventDefault();
    this.setState({ addCompanyFlag: true });
  }

  getErrorMsg(data) {
    const { cms, errorCode } = data;
    const errorMessageToPublish = cms.errorMsg && cms.errorMsg[errorCode];
    return errorMessageToPublish || '';
  }

  getDropdownOption() {
    const options = USStates;
    const optionsValue = [];
    optionsValue.push({ title: 'Select' });
    if (options) {
       options.map(data => optionsValue.push({ title: data.text, ...data }));
      }
    return optionsValue;
  }

    /**
   * get the index of states array based on the selected state name
   * @param stateStr
   * @returns {number}
   */
  getStateIndex(stateStr) {
    const stateIndex = USStates.findIndex(item => item.title === stateStr);
    const derivedIndex = stateIndex > -1 ? stateIndex : 0;
    return derivedIndex;
  }

  getSelectedOption(index, ddOptions) {
    const value = ddOptions[index];
    console.log(value);
    if (value) {
      this.setState({
        statePart: value,
        validStatePart: true,
        invalidStatePart: '',
        stateIndex: index
      });
    } else {
      this.setState({
        validStatePart: false,
        invalidStatePart: 'Please enter state'
      });
    }
  }

  checkboxAddress() {
    this.setState({
      addressDetailPart: !this.state.addressDetailPart,
      address: this.state.address
    });
  }

  postAnalyticsData(isRegistered) {
    const { checkboxStatus } = this.state;
    const { analyticsContent } = this.props;
    const registrationStatus = isRegistered ? '1' : '0';
    const eventCheck = document.referrer.indexOf('checkout') !== -1 ? 'checkout' : 'header';
    const analyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: ANALYTICS_EVENT_ACTION,
      eventLabel: `${ANALYTICS_EVENT_IN}|${eventCheck}`,
      accregistrationcomplete: registrationStatus,
      authenticationcomplete: registrationStatus,
      customerleadlevel: this.customerleadlevel(checkboxStatus),
      customerleadtype: this.customerleadtype(checkboxStatus),
      leadsubmitted: registrationStatus,
      newslettersignupcompleted: registrationStatus
    };
    analyticsContent(analyticsData);
  }
  /**
   * @description signup button handler.
   * Validate the form fieldbs and submit the form on successful validation
   * @param {object} e - onClick event parameter
   * @memberof SignUpComponent
   */
  handleSignUpClick(e) {
    e.preventDefault();
    const { fnShowLoader, analyticsContent } = this.props;
    e.stopPropagation();

    if (!this.state.addressDetailPart) {
      Promise.all([this.validateFName(), this.validateLName(), this.validateEmail(), this.validatePass()])
        .then(() => {
          if (this.state.validFirstName && this.state.validLastName && this.state.validEmail && this.state.validPass) {
            fnShowLoader();
            const data = this.requestBody();
            this.signupCall(data);
          } else {
            const clientErrorMsg = [this.state.invalidEmail, this.state.invalidFirstName, this.state.invalidLastName, this.state.invalidPass];
            const errorEventLabel = clientErrorMsg.filter(Boolean).join(',');
            const analyticsData = {
              event: 'errormessage',
              eventCategory: 'error message',
              eventAction: 'validation error|signup',
              eventLabel: errorEventLabel
            };
            analyticsContent(analyticsData);
            this.errorScrollManager.scrollToError();
          }
        })
        .catch(() => this.errorScrollManager.scrollToError());
     } else {
       Promise.all([this.validateFName(), this.validateLName(), this.validateEmail(), this.validatePass(), this.validateAddress(), this.validateZipCode(), this.validateCity(), this.validatePhoneNo(), this.validStateAddress()])
        .then(() => {
          if (this.state.validFirstName && this.state.validLastName && this.state.validEmail && this.state.validPass && this.state.validAddress && this.state.validZipCode && this.state.validCity && this.state.validPhoneNo && this.state.validStatePart) {
            fnShowLoader();
            // con
            const data = this.requestBodyAddressValid();
            const registerData = this.requestBody();
            this.setState({ enteredAddress: { ...registerData } });
            this.props.fnvalidateshippingAddress(data);
          } else {
            const clientErrorMsg = [this.state.invalidEmail, this.state.invalidFirstName, this.state.invalidLastName, this.state.invalidPass, this.state.invalidAddres, this.state.invalidZipCode, this.state.invalidCity, this.state.invalidPhoneNo, this.state.invalidStatePart];
            const errorEventLabel = clientErrorMsg.filter(Boolean).join(',');
            const analyticsData = {
              event: 'errormessage',
              eventCategory: 'error message',
              eventAction: 'validation error|signup',
              eventLabel: errorEventLabel
            };
            analyticsContent(analyticsData);
            this.errorScrollManager.scrollToError();
          }
        })
        .catch(() => this.errorScrollManager.scrollToError());
    }
  }

  /* Signin api call function */
  signupCall(data) {
    this.closeModal();
    if (data) {
      this.props.fnShowLoader();
      this.props.fnSignup(data);
    }
  }

  signupCallAddress(data) {
    this.closeModal();
    if (data) {
      data.addressType = ADDRESS_TYPE;
      data.address.phoneNo = this.state.phoneNo;
      data.address.addressLine2 = this.state.addCompany || '';
      data.address.country = COUNTRY;
      this.props.fnShowLoader();
      this.props.fnSignup(data);
    }
  }

  /**
   * FUNCTION prevents the anchor tag default action and redirects user to signIn page
   * @param {event} e
   */
  handleSignInClick(e) {
    e.preventDefault();
    const { handleRedirect, analyticsContent } = this.props;
    const analyticsData = {
      event: 'signup',
      eventCategory: 'user account',
      eventAction: 'signup link click',
      eventLabel: 'sign up|header',
      accregistrationcomplete: 0,
      authenticationcomplete: 0,
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    };
    analyticsContent(analyticsData);
    handleRedirect(SIGNIN);
  }

   /**
   * setState First Name
   * @param {*} data
   */
  firstName(data) {
    this.setState({ firstName: data });
  }
  /**
   * validate firstname on blur
   */
  validateFName() {
    const { cms } = this.props;
    const first = isValidName(this.state.firstName);
    if (this.state.firstName.length < 1) {
      this.setState({
        invalidFirstName: cms.errorMsg.mandatoryFirstName,
        validFirstName: false
      });
    } else if (!first) {
      this.setState({
        invalidFirstName: cms.errorMsg.invalidFirstName,
        validFirstName: false
      });
    } else {
      this.setState({
        invalidFirstName: '',
        validFirstName: true
      });
    }
  }
  /**
   * setState Last Name
   */
  lastName = data => {
    this.setState({ lastName: data });
  };
  /**
   * validate last name on blur
   */
  validateLName() {
    const { cms } = this.props;
    const first = isValidName(this.state.lastName);
    if (this.state.lastName.length < 1) {
      this.setState({
        invalidLastName: cms.errorMsg.mandatoryLastName,
        validLastName: false
      });
    } else if (!first) {
      this.setState({
        invalidLastName: cms.errorMsg.invalidLastName,
        validLastName: false
      });
    } else {
      this.setState({
        invalidLastName: '',
        validLastName: true
      });
    }
  }
  /**
   * setState Email Id
   */
  logonId = data => {
    this.setState({ logonId: data });
  };
  /**
   * validate EmailId
   */
  validateEmail() {
    const { cms } = this.props;
    const email = isValidEmail(this.state.logonId);
    if (this.state.logonId === '') {
      this.setState({
        invalidEmail: cms.errorMsg.blankEmailAddress,
        validEmail: false
      });
    } else if (!email) {
      this.setState({
        invalidEmail: cms.errorMsg.emailFormatIncorrect,
        validEmail: false
      });
    } else {
      this.setState({
        invalidEmail: '',
        validEmail: true
      });
    }
  }

  /**
   * setState Password
   */
  logonPassword = data => {
    const { cms } = this.props;
    const forceValidState = data.length > 0;
    const validationState = {
      invalidPass: forceValidState ? undefined : cms.errorMsg.mandatoryPassword,
      validPass: forceValidState
    };
    this.setState({
      logonPassword: data,
      showPass: true,
      ...validationState
    });
  };
  /**
   * validate password
   */
  validatePass() {
    const { cms } = this.props;
    const consData = /(.)\1\1/g;
    const checkRegEx = consData.test(this.state.logonPassword);

    if (this.state.logonPassword.length < 1) {
      this.setState({
        validPass: false,
        invalidPass: cms.errorMsg.mandatoryPassword,
        showPass: true
      });
    } else if (checkRegEx) {
      this.setState({
        validPass: false,
        invalidPass: cms.errorMsg.passwordCanNotContainACharacterConsecutivelyThanThreeTimes,
        showPass: true
      });
    } else if (this.state.logonPassword.length < 8) {
      this.setState({
        validPass: false,
        invalidPass: cms.errorMsg.passwordLengthError,
        showPass: true
      });
    } else {
      this.setState({
        validPass: true,
        invalidPass: '',
        showPass: false
      });
    }
  }
  /**
   * On focus Display Password Strength Meter
   */
  logonFocusPassword = () => {
    const { logonPassword } = this.state;
    this.setState({ showPass: true, logonPassword });
  };
  emailOptIn = data => this.setState({ emailOptIn: data });
  checkbox() {
    this.setState({
      checkboxStatus: !this.state.checkboxStatus,
      emailOptIn: !this.state.emailOptIn
    });
  }

  /**
   * setState address
   */
  addresMain(data) {
    this.setState({ address: data });
  }
 /**
   * validate address
   */
  validateAddress() {
    // const { cms } = this.props;
    const address = isValidAddress(this.state.address);
    if (this.state.address.length < 1) {
      this.setState({
        invalidAddress: 'Please Enter an Address',
        validAddress: false
      });
    } else if (!address) {
      this.setState({
        invalidAddress: 'Please enter valid address',
        validAddress: false
      });
    } else {
      this.setState({
        invalidAddress: '',
        validAddress: true
      });
    }
  }


  addresCompany(data) {
    this.setState({ addCompany: data });
  }

  /**
   * @param {string} value of the zip code field to be validated with ZIP+4 validation schema.
   * so either ZIP code string will be 5 digits or '5-4' digit string.
   */
  zipPlusFourFormatValidator(value) {
    const ZIP_FOUR_REGEX = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return ZIP_FOUR_REGEX.test(value);
  }

  /**
   * Callback for zip code change
   * @param event
   */
  zipCode(event) {
    this.setState({
      zipcode: event.target.value
    });
    this.loadCityStateInStore(event.target.value);
}

   /**
   *
   * @param {Object} event carries the event object from the zip code input field
   * validates the input zip code with zip+4 format and saves the first five into redux store.
   * from there the city and state data can be loaded via API call to geocoding API.
   * In case, the input is not valid - erase the existing zip code data from store.
   */
  loadCityStateInStore(value) {
    if (value.length <= 5) {
        if (this.zipPlusFourFormatValidator(value)) {
            const queryZipCode = value.substring(0, 5);
            this.props.fnvalidateZipCodeshippingAddress(queryZipCode);
            this.setState({
                city: this.props.cityStore.city
            });
        }
    }
}

   /**
   * validate zipcode
   */
  validateZipCode() {
    const zipcode = isValidZipCode(this.state.zipcode);

    if (!this.state.zipcode) {
      this.setState({
        invalidZipCode: "Zip code can't be empty",
        validZipCode: false
      });
    } else if (!zipcode) {
      this.setState({
        invalidZipCode: 'Please enter valid zipcode format',
        validZipCode: false
      });
    } else if (!this.state.apiValidZipCode) {
      this.setState({
        invalidZipCode: 'Please provide a valid zipcode',
        validZipCode: false
      });
    } else if (zipcode) {
      this.setState({
        invalidZipCode: '',
        validZipCode: true
      });
    }
  }

  /**
   * setState city
   */

  myCity(data) {
    this.setState({ city: data });
  }
 /**
   * validate city
   */
  validateCity() {
    const city = isValidCity(this.state.city);

    if (!this.state.city) {
      this.setState({
        invalidCity: "City can't be empty!",
        validCity: false
      });
    } else if (!city) {
      this.setState({
        invalidCity: 'Please enter valid city name',
        validCity: false
      });
    } else if (city) {
      this.setState({
        invalidCity: '',
        validCity: true
      });
    }
  }

 /**
   * setstate phone
   */
 // eslint-disable-next-line consistent-return
 phoneNo(data) {
    const pattern = /^[0-9-]*$/;

    if (!pattern.test(data)) {
        return false;
    } else if (pattern.test(data)) {
        const val = data.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        this.setState({
            phoneNo: val
        });
    }
}
  /**
   * validate phoneno
   */
  validatePhoneNo() {
    // const phoneNo = isValidPhoneNumber(this.state.phoneNo);
    const myNumber = this.state.phoneNo.replace('-', '');

    if (!myNumber) {
        this.setState({
            invalidPhoneNo: 'Please enter valid phone number',
            validPhoneNo: false
        });
    } else if (myNumber.length < 1) {
        this.setState({
            invalidPhoneNo: "Phone number can't be empty",
            validPhoneNo: false
        });
    } else if (myNumber.length > 11) {
        this.setState({
            invalidPhoneNo: "Phone number can't be more than 10 digits",
            validPhoneNo: false
        });
    } else if (myNumber.length < 11) {
        this.setState({
            invalidPhoneNo: "Phone number can't be less than 10 digits",
            validPhoneNo: false
        });
    } else {
        this.setState({
            invalidPhoneNo: '',
            validPhoneNo: true
        });
    }
}

  /* validate state */

  validStateAddress() {
    if (this.state.statePart.length < 1 || (this.state.statePart.title && this.state.statePart.title === 'Select')) {
      this.setState({
        invalidStatePart: "State can't be empty",
        validStatePart: false
      });
    } else {
      this.setState({
        invalidStatePart: '',
        validStatePart: true
      });
    }
  }

  changeState = () => {
    this.setState({
      signupSuccess: !this.state.signupSuccess
    });
  };
  requestBody = () => {
    const body = {};
    if (
      this.state.emailOptIn === '' ||
      this.state.firstName === '' ||
      this.state.lastName === '' ||
      this.state.logonId === '' ||
      this.state.logonPassword === ''
    ) {
      return null;
    }
    body.emailOptIn = this.state.emailOptIn;
    body.firstName = this.state.firstName;
    body.lastName = this.state.lastName;
    body.logonId = this.state.logonId;
    body.logonPassword = this.state.logonPassword;
    body.logonPasswordVerify = this.state.logonPassword;
    if (this.state.addressDetailPart && this.state.phoneNo && this.state.zipcode && this.state.city && this.state.statePart && this.state.statePart.title) {
      body.addressType = ADDRESS_TYPE;
      body.address = {
        addressLine1: this.state.address,
        addressLine2: this.state.addCompany || '',
        phoneNumber: this.state.phoneNo,
        city: this.state.city,
        zipcode: this.state.zipcode,
        state: this.state.statePart.title,
        country: COUNTRY
      };
    }
    return body;
  };

 /* addresss data mapping for api call */
  requestBodyAddressValid = () => {
    const body = {};
    if (
      this.state.city === '' ||
      this.state.statePart === '' ||
      this.state.zipcode === '' ||
      this.state.address === ''
    ) {
      return null;
    }
    body.city = this.state.city;
    body.state = this.state.statePart.title;
    body.zipcode = this.state.zipcode;
    body.street = this.state.address;
    return body;
  };
  checkValidation(active) {
    this.setState({
      submitButtonActive: active
    });
  }
  serverError(errorMessage, cms) {
    return this.props.errorSignUp ? (
      <div className="px-1">
        <section className={cx(errorWrapper, 'd-flex flex-column p-1 mb-2')}>
          <p className={`${errorText} o-copy__14reg mb-0`} role="alert">
            {cms.errorMsg[errorMessage]}
          </p>
        </section>
      </div>
    ) : null;
  }
  redirectToHome() {
    if (ExecutionEnvironment.canUseDOM) {
      window.location.href = '/';
    }
  }
  displaySuccessPage() {
    if (this.props.isRegistered) {
      if (StorageManager.getSessionStorage(PREVIOUS_URL) && StorageManager.getSessionStorage(PREVIOUS_URL).match(SUB_URL)) {
        const redirectUrl = StorageManager.getSessionStorage(PREVIOUS_URL);
        StorageManager.removeSessionStorage(PREVIOUS_URL);
        if (ExecutionEnvironment.canUseDOM) {
          // Execution environment check for server side rendering.
          window.location.href = redirectUrl;
        }
      } else return true;
    }
    return false;
  }
  /**
   * Function to set the intent for submit
   * Needed to prevent blur event from firing on create password
   */
  submitButtonClickIntentHandler = e => {
    e.preventDefault();
    e.stopPropagation();
  };
  /**
   * computed properties for analytics.
   */
  customerleadtype = flag => (flag ? 'registration' : 'null');
  customerleadlevel = flag => (flag ? 'fully qualified' : 'null');

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { cms } = this.props;
    const { commonLabels: { showLabel, hideLabel } = '' } = cms;
    const errorMessage = this.props.errorCode;
    const ddOptions = this.getDropdownOption();
    return (
      <div className="row mt-3 mb-5 my-md-6" ref={this.signupConatinerRef}>
        {this.state.modalIsOpen && (
          <AddressSuggestions
            modalIsOpen={this.state.modalIsOpen}
            closeModal={this.closeModal}
            validateShippingAddress={this.props.addressValid}
            formStates={this.state.enteredAddress}
            onSubmitSuggestHandler={this.signupCallAddress}
          />
        )}
        {this.displaySuccessPage() ? (
          <div className="col-12 col-md-6 offset-md-3">
            <h4 className={cx(TitleSuccessMsg, 'my-3 mt-md-6 mb-md-3')}>{cms.signUpSuccessLabel}</h4>
            <span className="o-copy__20reg">{cms.signUpSuccessMessageLabel}</span>
            <Button auid="singin_redirect_btn" size="M" className={cx('mt-3', fullWidth)} onClick={() => this.redirectToHome()}>
              {cms.commonLabels.letsShopLabel}
            </Button>
            {scrollIntoView(this.signupConatinerRef.current, true)}
          </div>
        ) : (
          <div className="col-12">
            <div className="mb-3 col-12 col-md-6 offset-md-3">
              {this.serverError(errorMessage, cms)}
              <h4>{cms.signUpHeadingLabel}</h4>
              <div className="mt-3">{cms.signUpMessageLabel}</div>
              <form noValidate onSubmit={this.handleSignUpClick}>
                {/* eslint-disable-next-line no-useless-computed-key */}
                <div className={cx('o-copy__16bold mt-2', { ['form-scroll-to-error']: !this.state.validFirstName })}>
                  <label htmlFor="signup-firstname">{cms.checkoutLabels.firstNameLabel}</label>
                </div>
                <Input
                  data-auid="firstname_input"
                  id="signup-firstname"
                  classname={`w-100 ${!this.state.validFirstName && errorBorder}`}
                  onChange={evt => this.firstName(evt.target.value)}
                  onBlur={this.validateFName}
                  maxLength="50"
                />
                {!this.state.validFirstName ? (
                  <span className={cx('o-copy__12reg', errorRedColor)} role="alert">
                    {this.state.invalidFirstName}
                  </span>
                ) : null}
                {/* eslint-disable-next-line no-useless-computed-key */}
                <div className={cx('o-copy__16bold mt-2', { ['form-scroll-to-error']: !this.state.validLastName })}>
                  <label htmlFor="signup-lastname">{cms.checkoutLabels.lastNameLabel}</label>
                </div>
                <Input
                  data-auid="lastname_input"
                  id="signup-lastname"
                  classname={`w-100 ${!this.state.validLastName && errorBorder}`}
                  onChange={evt => this.lastName(evt.target.value)}
                  onBlur={this.validateLName}
                  maxLength="50"
                />
                {!this.state.validLastName ? (
                  <span className={cx('o-copy__12reg', errorRedColor)} role="alert">
                    {this.state.invalidLastName}
                  </span>
                ) : null}
                {/* eslint-disable-next-line no-useless-computed-key */}
                <div className={cx('o-copy__16bold mt-2', { ['form-scroll-to-error']: !this.state.validEmail })}>
                  <label htmlFor="signup-email">{cms.commonLabels.emailaddressLabel}</label>
                </div>
                <EmailField
                  data-auid="email_input"
                  id="signup-email"
                  className={`w-100 ${!this.state.validEmail && errorBorder}`}
                  onChange={evt => this.logonId(evt)}
                  onBlur={this.validateEmail}
                  domainsList={domainsList}
                  maxLength="255"
                />
                <div className="d-flex flex-column">
                  {!this.state.validEmail ? (
                    <span className={cx('o-copy__12reg', errorRedColor)} role="alert">
                      {this.state.invalidEmail}
                    </span>
                  ) : null}
                </div>
                {/* eslint-disable-next-line no-useless-computed-key */}
                <div className={cx('o-copy__16bold mt-2', { ['form-scroll-to-error']: !this.state.validPass })}>
                  <label htmlFor="signup-passwordfield">{cms.createPassword}</label>
                </div>
                <PasswordField
                  autocomplete="off"
                  classname={cx('w-100', passwordFocus, { [errorBorder]: !this.state.validPass })}
                  id="signup-passwordfield"
                  tabIndex={0}
                  onChange={evt => this.logonPassword(evt.target.value)}
                  inlinebuttontextshow={showLabel ? showLabel.toUpperCase() : SHOW_LABEL}
                  inlinebuttontexthide={hideLabel ? hideLabel.toUpperCase() : HIDE_LABEL}
                  buttontextfont={INLINE_BUTTON_FONT_SIZE}
                  fontSize={BTN_LABEL_FONT_SIZE}
                  onBlur={this.validatePass}
                  onFocus={() => this.logonFocusPassword()}
                />
                {!this.state.validPass ? (
                  <span className={cx('o-copy__12reg', errorRedColor)} role="alert">
                    {this.state.invalidPass}
                  </span>
                ) : null}
                {this.state.showPass ? (
                  <PasswordStrengthMeter cms={this.props.cms} password={this.state.logonPassword} callbackValidator={this.checkValidation} />
                ) : null}
                {/* eslint-disable-next-line no-useless-computed-key */}

                {/* Address part implementation starts here */}

                <div className={cx('o-copy__14reg mt-3')}>
                  <label className={`${checkStyle} d-flex flex-row`}>
                    <Checkbox
                      id="profile-signup-promotional-msg"
                      disabled={false}
                      checked={this.state.addressDetailPart}
                      onMouseDown={this.submitButtonClickIntentHandler}
                      onChange={this.checkboxAddress}
                    />
                    <div className="ml-half">Add Address for Faster Checkout</div>
                  </label>
                </div>

                {this.state.addressDetailPart ?
                  (<div>
                    <div className="form-group">
                      <div className={cx('o-copy__16bold mt-2')}>
                        <label htmlFor="signup-address">Address</label>
                      </div>
                      <Input
                        data-auid="address_input"
                        id="signup-address"
                        classname="w-100"
                        onChange={evt => this.addresMain(evt.target.value)}
                        onBlur={this.validateAddress}
                        value={this.state.address}
                      />
                      {!this.state.validAddress ? (
                        <span className={cx('o-copy__12reg', errorRedColor)} role="alert">
                          {this.state.invalidAddress}
                        </span>
                      ) : null}
                    </div>

                    {!this.state.addCompanyFlag ? (
                      <div className="mb-2">
                        <a
                          data-auid="signup_address_add_more_details_link"
                          onClick={this.onShowCompanyAddress}
                          href=" #"
                          className="o-copy__14reg mt-1"
                        >
                          {' '}
                          Add company name, Apt.Number, etc. (Optional)
                        </a>
                      </div>
                    ) : (
                      <div className="form-group">
                        <div className={cx('o-copy__16bold mt-2')}>
                          <label htmlFor="signup_address_add_more_details">Add company name, Apt.Number, etc. (Optional) </label>
                        </div>
                        <Input
                          data-auid="signup_address_add_more_details"
                          id="signup_address_add_more_details"
                          classname="w-100"
                          onChange={evt => this.addresCompany(evt.target.value)}
                          value={this.state.addCompany}
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <div className={cx('o-copy__16bold mt-2')}>
                        <label htmlFor="signup-zipcode">Zip code</label>
                      </div>
                      <Input
                        data-auid="address_zipcode"
                        id="signup-zipcode"
                        classname="w-100"
                        maxLength="5"
                        onChange={e => this.zipCode(e)}
                        onBlur={this.validateZipCode}
                        value={this.state.zipcode}
                      />
                      {!this.state.validZipCode ? (
                        <span className={cx('o-copy__12reg', errorRedColor)} role="alert">
                          {this.state.invalidZipCode}
                        </span>
                      ) : null}
                    </div>

                    <div className="d-flex flex-column flex-md-row justify-content-between">
                      <div className="form-group col-12 col-md-6 px-0 pr-md-1">
                        <div className={cx('o-copy__16bold mt-2')}>
                          <label htmlFor="signup-city">City</label>
                        </div>
                        <Input
                          data-auid="address_city"
                          id="signup-city"
                          classname="w-100"
                          maxLength="50"
                          onChange={evt => this.myCity(evt.target.value)}
                          onBlur={this.validateCity}
                          value={this.state.city}
                        />
                        {!this.state.validCity ? (
                          <span className={cx('o-copy__12reg', errorRedColor)} role="alert">
                            {this.state.invalidCity}
                          </span>
                      ) : null}
                      </div>

                      <div className="form-group col-12 col-md-6 px-0">
                        <div className={cx('o-copy__16bold mt-2')}>
                          <label htmlFor="signup-city">State</label>
                        </div>
                        <Dropdown
                          DropdownOptions={ddOptions}
                          onSelectOption={index => {
                              this.getSelectedOption(index, ddOptions);
                            }}
                          initiallySelectedOption={this.state.stateIndex}
                          disabled={false}
                          borderWidth="1px"
                          borderRadius="4px"
                          titleClass="o-copy__14reg"
                        />
                        {!this.state.validStatePart ? (<span className={cx('o-copy__12reg', errorRedColor)} role="alert">{this.state.invalidStatePart}</span>) : null}
                      </div>
                    </div>

                    <div className="form-group">
                      <div className={cx('o-copy__16bold mt-2')}>
                        <label htmlFor="signup-phonenumber">Phone number</label>
                      </div>
                      <Input
                        data-auid="address_phone"
                        id="signup-phonenumber"
                        classname="w-100"
                        maxLength="50"
                        onChange={evt => this.phoneNo(evt.target.value)}
                        onBlur={this.validatePhoneNo}
                        value={this.state.phoneNo}
                      />
                      {!this.state.validPhoneNo ? (
                        <span className={cx('o-copy__12reg', errorRedColor)} role="alert">
                          {this.state.invalidPhoneNo}
                        </span>
                      ) : null}
                    </div>
                  </div>) : null}

                {/* Address part implementation ends here */}

                <div className={cx('o-copy__14reg', this.state.showPass ? 'mb-3' : 'my-3')}>
                  <label className={`${checkStyle} d-flex flex-row`}>
                    <Checkbox
                      id="profile-signup-promotional-msg"
                      disabled={false}
                      checked={this.state.checkboxStatus}
                      onMouseDown={this.submitButtonClickIntentHandler}
                      onChange={this.checkbox}
                    />
                    <div className="ml-half">{cms.promotionalMessageLabel}</div>
                  </label>
                </div>
                <Button auid="signup_btn" type="submit" className="w-100" onMouseDown={this.submitButtonClickIntentHandler}>
                  {cms.signUp}
                </Button>
              </form>
            </div>
            <div className={cx('col-12 col-md-6 offset-md-3 text-center', 'o-copy__14reg', signin)}>
              <hr className={`${hr} my-3`} />
              {cms.alreadyHaveAnAccountLabel}{' '}
              <a
                data-auid="redirect_signin_btn"
                // TODO replace this URL from URL that we will get from AEM
                href={SIGNIN_LINK}
                className={`${Btn}`}
                onMouseDown={this.submitButtonClickIntentHandler}
                onClick={this.handleSignInClick}
              >
                {cms.signInNow}
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

SignUpComponent.propTypes = {
  cms: PropTypes.object.isRequired,
  fnSignup: PropTypes.func,
  isRegistered: PropTypes.isRequired,
  errorSignUp: PropTypes.bool,
  handleRedirect: PropTypes.func,
  errorCode: PropTypes.any,
  registerData: PropTypes.object,
  fnShowLoader: PropTypes.func,
  analyticsContent: PropTypes.func,
  fnvalidateshippingAddress: PropTypes.func,
  addressValid: PropTypes.object,
  errorAddressVerify: PropTypes.object,
  fnvalidateZipCodeshippingAddress: PropTypes.func,
  cityStore: PropTypes.object
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <SignUpComponent {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default SignUpComponent;
