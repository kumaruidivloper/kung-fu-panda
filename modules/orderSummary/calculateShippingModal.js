import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'react-modal';
import InputField from '@academysports/fusion-components/dist/InputField';
import Button from '@academysports/fusion-components/dist/Button';
import { get } from '@react-nitro/error-boundary';
import * as styles from './orderSummary.styles';

class CalculateShippingModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      zipcode: '',
      showErrMsg: false
    };
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
  }

  /**
   * This is for removing a console warning.
   */
  componentWillMount() {
    Modal.setAppElement('body');
  }

  /**
   * Method to handle change in the input field.
   * @param {object} e Event object representing the change in the input field.
   */
  handleZipChange(e) {
    if (this.props.zipCodeAPIInfo.error) {
      this.props.clearZipcode();
    }
    this.setState({ showErrMsg: false });
    if (e.target.value && Number.isNaN(parseInt(e.target.value, 10))) {
      this.setState({ showErrMsg: true });
      return false;
    }
    if (e.target.value && e.target.value.length > 5) {
      return false;
    }
    if (e.target.value.toString().length <= 5) {
      this.setState({ zipcode: e.target.value });
    }
    return true;
  }

  /**
   * Method for handling click of Submit button in modal.
   * If User has entered a number with 5 digits, make a get cart API call and close modal.
   * Else, Do nothing.
   * @param {object} e Event object representing a submit action.
   */
  handleSubmitClick(e) {
    if (this.state.zipcode.toString().length === 5) {
      this.setState({ showErrMsg: false });
      if (e.key && e.key === 'Enter') {
        e.preventDefault();
      }
      this.props.onSetZipCode(this.state.zipcode);
    } else {
      this.setState({ showErrMsg: true });
    }
  }
  /**
   * Method for rendering the zipcode modal.
   * @param  {object} cms object containing static label.
   */
  constructModalContent(cms) {
    const { labels: { enterYourZipCodeTitle, accurateShippingInfoSubText } = '' } = this.props;
    const errorDetails = this.props.zipCodeAPIInfo;
    const { zipCodeLabel } = cms.checkoutLabels ? cms.checkoutLabels : '';
    return (
      <React.Fragment>
        <div className="pl-3 pr-1 my-1 d-flex justify-content-end">
          <button onClick={this.props.toggleModal} tabIndex={0} className={`${styles.clsBtn} p-0`} aria-label="Close Calculate Shipping Modal">
            <i className="academyicon icon-close icon a-close-icon" />
          </button>
        </div>
        <div className="px-3 px-lg-4 mb-lg-6">
          <h5 className="mb-2 text-center">{enterYourZipCodeTitle}</h5>
          <span className={`mb-3 o-copy__16reg text-center ${styles.displayBlock}`}>{accurateShippingInfoSubText}</span>
          <label htmlFor="crt-inputZip"><span className={`o-copy__14bold mb-half ${styles.displayBlock}`}>{zipCodeLabel}</span></label>
          <InputField
            autoFocus
            data-auid="crt_inputZip"
            id="crt-inputZip"
            className={styles.displayBlock}
            tabIndex={0}
            aria-label={cms.enterZipcodeLabel}
            type="tel"
            width="100%"
            value={this.state.zipcode}
            onChange={e => this.handleZipChange(e)}
            onKeyPress={e => (e.which < 48 || e.which > 57) && e.preventDefault()}
            onKeyDown={e => e.key === 'Enter' && this.handleSubmitClick(e)}
          />
          {(this.state.showErrMsg || (errorDetails && errorDetails.error)) && (
            <span className={`${styles.errMsg} mt-half o-copy__14reg`} role="alert">
              {errorDetails.error && errorDetails.errorInfo.errors && errorDetails.errorInfo.errors[0].errorMessage}
              {/* TODO:  Currently we dont have generic message, we need to get it from AEM */}
              {errorDetails.error && !errorDetails.errorInfo.errors && 'An error occurred'}
              {this.state.showErrMsg && get(cms, 'errorMsg.mandatoryZipCode', 'Please enter a zip code.')}
            </span>
          )}
          <div className={styles.shippingModalOption}>
            <Button
              className={`mb-md-5 mt-2 ${styles.calcShippingBtn}`}
              size="M"
              onClick={this.handleSubmitClick}
              auid="crt_btnCalcShippingModal"
              type="primary"
            >
              {cms.commonLabels.submitLabel}
            </Button>
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { cms } = this.props;
    return (
      <Modal
        ariaHideApp={false}
        overlayClassName={styles.overlay}
        className={styles.modal}
        isOpen={this.props.openModal}
        aria-label="Add To Cart Modal"
        onRequestClose={this.props.toggleModal}
        shouldCloseOnOverlayClick
        role="dialog"
      >
        {this.constructModalContent(cms)}
      </Modal>
    );
  }
}

CalculateShippingModal.propTypes = {
  cms: PropTypes.object,
  openModal: PropTypes.bool,
  toggleModal: PropTypes.func,
  zipCodeAPIInfo: PropTypes.object,
  onSetZipCode: PropTypes.func,
  clearZipcode: PropTypes.func,
  labels: PropTypes.object
};

export default CalculateShippingModal;
