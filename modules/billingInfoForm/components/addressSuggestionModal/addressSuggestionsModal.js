import React, { Component } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import Button from '@academysports/fusion-components/dist/Button';

import { addressStyle, suggestAddressAnchor, suggestAddress, textStyle, iconColor, checkCircleFont, containerMargin } from '../../style';

class AddressSuggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: 1
    };
    this.handleAddressSelect = this.handleAddressSelect.bind(this);
    this.renderSuggestedAddress = this.renderSuggestedAddress.bind(this);
    this.renderSuggestions = this.renderSuggestions.bind(this);
    this.onSubmitAddress = this.onSubmitAddress.bind(this);
  }

  componentWillMount() {
    Modal.setAppElement('body');
  }
  /**
   * Submit address based on user selection
   */
  onSubmitAddress() {
    let selectedAddress = null;
    const index = this.state.selectedAddress;
    if (index === 0) {
      selectedAddress = this.props.formStates;
    } else {
      selectedAddress = this.props.validateBillingAddress.data.avsErrors.altAddresList[index - 1];
    }
    this.props.onSubmitSuggestHandler(selectedAddress);
  }

  handleAddressSelect(index) {
      this.setState({
        selectedAddress: index
      });
  }

  renderSuggestedAddress(validateAddress, index) {
    const { cms } = this.props;
    return (
      <a
        key={`suggestedAddr-${index}`}
        data-auid={`checkout_select_suggested_address_${index + 1}`}
        className={`${suggestAddressAnchor} w-100`}
        href=" #"
        onClick={evt => { evt.preventDefault(); this.handleAddressSelect(index + 1); }}
      >
        <div className={` ${this.state.selectedAddress === index + 1 ? suggestAddress('#0055a6') : suggestAddress()} d-flex flex-row p-2`}>
          <div className="d-flex flex-column w-100">
            <p className="o-copy__16bold mb-1"> {cms.suggestedAddressLabel} </p>
            {validateAddress ? (
              <div>
                <div className={`${addressStyle} o-copy__16reg`}>
                  {validateAddress.address} {','}
                </div>
                <div className={`${addressStyle} o-copy__16reg`}>
                  {validateAddress.city} {validateAddress.state} {validateAddress.zipcode}
                </div>
              </div>
            ) : null}
          </div>
          {this.state.selectedAddress === index + 1 ? <i className={`academyicon icon-check-circle ${iconColor} ${checkCircleFont}`} /> : null}
        </div>
      </a>
    );
  }
  renderSuggestions(addresses) {
    return addresses ? addresses.map((address, k) => this.renderSuggestedAddress(address, k)) : null;
  }
  render() {
    const { formStates, cms } = this.props;
    const validateAddress = this.props.validateBillingAddress.data.avsErrors
      ? this.props.validateBillingAddress.data.avsErrors.altAddresList
      : null;
    return (
      validateAddress &&
      <div className="loginModal">
        <Modal
          overlayClassName="modalOverlay"
          className="modalContent"
          isOpen={this.props.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.props.closeModal}
          contentLabel="Address Verification Modal"
          shouldCloseOnOverlayClick
        >
          <div className={containerMargin}>
            <button
              onClick={this.props.closeModal}
              className="modalCloseButton"
              aria-label="Close AVS Modal"
              data-auid="checkout_billing_address_verification_modal_close"
            >
              <span className="academyicon icon-close" />
              <span className="sr-only">Close</span>
            </button>
            <div className="container px-2 px-md-3 pb-1">
              <div className="d-flex flex-column justify-content-center">
                <div className="pb-2">
                  <h5 className="text-uppercase text-center">{cms.addressVerification}</h5>
                </div>
                <div className="pb-3">
                  <div className={` ${textStyle} o-copy__14reg text-center px-1`}>{cms.addressVerificationUnableDescription}</div>
                </div>
                <div className="pb-3 w-100">
                  {this.renderSuggestions(validateAddress)}
                  <a className={`${suggestAddressAnchor} w-100 mt-1`} data-auid="checkout_initial_selected_address" href=" #" onClick={evt => { evt.preventDefault(); this.handleAddressSelect(0); }}>
                    <div className={` mt-1 ${this.state.selectedAddress === 0 ? suggestAddress('#0055a6') : suggestAddress()} d-flex flex-row p-2`}>
                      <div className="d-flex flex-column w-100">
                        <p className="o-copy__16bold"> {cms.youEnteredAddressLabel} </p>
                        <div>
                          <div className={`${addressStyle} o-copy__16reg`}>
                            {formStates.billingAddress1}, {formStates.billingAddress2}
                          </div>
                          <div className={`${addressStyle} o-copy__16reg`}>
                            {formStates.billingCity}, {formStates.billingState}, {formStates.billingZipCode}
                          </div>
                        </div>
                        <a
                          href=" #"
                          data-auid="checkout_modify_billing_address_link"
                          className=" mt-half o-copy__14reg"
                          onClick={this.props.closeModal}
                        >
                          {' '}
                          {cms.modifyAddressLabel}{' '}
                        </a>
                      </div>
                      {this.state.selectedAddress === 0 ? <div className={`${iconColor} ${checkCircleFont} academyicon icon-check-circle`} /> : null}
                    </div>
                  </a>
                </div>
                <div className="d-flex justify-content-center">
                  <div className="col-md-9 col-lg-8 col-12">
                    <Button
                      className="w-100 o-copy__14bold"
                      aria-label="Use Selected Address button"
                      auid="checkout_use_selected_address_btn"
                      size="M"
                      onClick={this.onSubmitAddress}
                    >
                      {cms.useSelectedAddressLabel}
                      {''}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

AddressSuggestions.propTypes = {
  cms: PropTypes.object.isRequired,
  modalIsOpen: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  onSubmitSuggestHandler: PropTypes.func.isRequired,
  formStates: PropTypes.object.isRequired,
  validateBillingAddress: PropTypes.object
};

function mapStateToProps(state) {
  return {
    formStates: getFormValues('paymentForm')(state)
  };
}

export default connect(mapStateToProps)(AddressSuggestions);
