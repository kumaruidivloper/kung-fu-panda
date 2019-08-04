/**
 * shippingAddressForm.component.js renders the form for shipping Address and maintains state
 * of the form with respect to city,state,zipcode and other fields with their related logic.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormValues, change as changeFieldValue } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import RenderCheckbox from './components/renderCheckbox/renderCheckboxComponent';
import { openAccount } from './styles';
import validationRules from './validationRules';

const sampleText = `There are many variations of passages of Lorem Ipsum available, but the majority have 
suffered alteration in some form, by injected humour, or randomised words which don't look even slightly
 believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything
  embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat 
  predefined chunks as necessary, making this the first true generator on the Internet. It uses a 
  dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate 
  Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, 
  injected humour, or non-characteristic words etc.`;

const checkboxText = `By Checking this box and clicking "Submit", I agree to Terms and Conditions and acknowledge
the receipt of the Privacy Notes, consent to recive documents electronically and electronically sogn this application`;


export class creditApplicationStep2 extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { agreeTermsAndConditions: false };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }


  /**
   * Method for handling keyup and resetting the value if it exceeds the maxLength.
   * @param {object} e Event object corresponding to key down.
   */
  handleKeyUp = e => {
    if (e.target && e.target.maxLength && e.target.value.length >= e.target.maxLength) {
      e.target.value = e.target.value.substring(0, e.target.maxLength); // Resetting the value for Andriod devices
      return false;
    }
    return null;
  };

  /**
   * Method for handling key presses. Submits the form on an any of the field trigger submit event.
   * @param {object} e Event object corresponding to key down.
   */
  handleKeyDown = e => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault();
      const { handleSubmit, onSubmitForm } = this.props;
      handleSubmit(data => onSubmitForm(data))();
    }
  };

  toggleCheckbox = () => {
    this.setState({ agreeTermsAndConditions: !this.state.agreeTermsAndConditions });
    console.log('data');
    this.props.termCondition(this.state.agreeTermsAndConditions);
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <div className="mt-3">
          <h5> ACCOUNT TERMS AND CONDITIONS </h5>
          <p className="mt-2 mb-2">{sampleText} </p>
        </div>
        <div className="mt-1">
          <h5 className="mt-2"> CONSENT TO ACCOUNT TERMS AND CONDITIONS </h5>
          <div className={`${openAccount}`}>
            <p>{sampleText} </p>
          </div>
        </div>
        <div className="mt-1 mb-2">
          <h5 className="mt-2"> CONSENT TO FINANCIAL TERMS OF THE ACCOUNT </h5>
          <div className={`${openAccount}`}>
            <p>{sampleText} </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} name="creditApplicationModal">
          <div className="form mb-2">
            <div className="d-flex flex-column flex-md-row justify-content-between">
              <div className="form-group pr-md-1 col-md-12 px-0 col-12">
                <Field
                   data-auid="credit_application_modal_agree"
                   name="agreeTermsAndConditions"
                   id="agreeTermsAndConditions"
                   label={checkboxText}
                   component={RenderCheckbox}
                   labelClass="body-14-regular"
                   onKeyDown={this.handleKeyDown}
                   checked={this.state.agreeTermsAndConditions}
                   onChange={this.toggleCheckbox}
                 />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

creditApplicationStep2.propTypes = {
  handleSubmit: PropTypes.func,
  onSubmitForm: PropTypes.func,
  termCondition: PropTypes.func
};

const mapStateToProps = (reduxState, ownProps) => {
  const { initialVals } = ownProps;
  const existingValues = getFormValues('creditApplicationModal')(reduxState);
  const initialVal = Object.assign({}, initialVals, existingValues);
  return {
    initialValues: initialVal
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ changeFieldValue }, dispatch);

const creditApplicationStep2Container = reduxForm({
  form: 'creditApplicationModal',
  validate: validationRules
})(creditApplicationStep2);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(creditApplicationStep2Container);
