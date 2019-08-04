import React, { Component } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@academysports/fusion-components/dist/Button';

import { OverLay, addressStyle, suggestAddressAnchor, suggestAddress, textStyle, clsBtn, modifyAddressStyles, iconColor, modalStyles } from './styles';

class MyAccountAddressSuggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: 1,
      selectedAddressValue: ''
    };
    this.handleAddressSelect = this.handleAddressSelect.bind(this);
    this.renderSuggestedAddress = this.renderSuggestedAddress.bind(this);
  }
  /**
   * It takes index of selected addresss drowdown and set state according to it i.e. return ReduxForm data when index is 0 and otherwise alternative address.
   * @param {number} index - Index number of selected addresss from modal.
   */
  handleAddressSelect(index) {
    this.setState({
      selectedAddress: index
    }, () => {
      if (index === 0) {
        this.setState({
          selectedAddressValue: this.props.formStates
        });
      } else {
        const validateSavedAddress = this.props.validatedAddress.data && this.props.validatedAddress.data.avsErrors.altAddresList[index - 1];
        const { address, zipcode, city, state } = validateSavedAddress;
        const { firstName, lastName, phoneNumber, companyName } = this.props.formStates;
        const newAddress = {
          firstName,
          lastName,
          phoneNumber,
          companyName,
          address,
          zipCode: zipcode,
          city,
          state
        };
        this.setState({ selectedAddressValue: newAddress });
      }
    });
  }
  /**
   * POST suggested Address
   * @param {*} event
   */
  submitAddress(event) {
    event.preventDefault();
      this.handleAddressSelect(this.state.selectedAddress);
      if (this.state.selectedAddressValue !== '') {
        this.props.onSubmitSuggestHandler(this.state.selectedAddressValue, this.state.isAddressVerified);
      }
  }
  /**
   *  It gets the suggested address and renders the suggested address in modal.
   * @param {Object} validateAddress - It contains the object of address.
   * @param {Number} index - It gets the index number and pass when address selects
   */
  renderSuggestedAddress(validatedAddress, index) {
    const { cms } = this.props;
    return (
      <a
        key={`suggestedAddr-${index}`}
        data-auid={`checkout_select_suggested_address_${index + 1}`}
        className={`${suggestAddressAnchor} w-100`}
        href=" #"
        onClick={() => this.handleAddressSelect(index + 1)}
      >
        <div className={` ${this.state.selectedAddress === index + 1 ? suggestAddress('#0055a6') : suggestAddress()} d-flex flex-row p-2  mb-1`}>
          <div className="d-flex flex-column w-100">
            <p className="o-copy__16bold mb-1"> {cms.checkoutLabels.suggestedAddressLabel} </p>
            {validatedAddress ? (
              <div>
                <div className={`${addressStyle} o-copy__16reg`}>
                  {validatedAddress.address} {','}
                </div>
                <div className={`${addressStyle} o-copy__16reg`}>
                  {validatedAddress.city} {validatedAddress.state} {validatedAddress.zipcode}
                </div>
              </div>
            ) : null}
          </div>
          {this.state.selectedAddress === index + 1 ? <div className={`${iconColor} academyicon icon-check-circle`} /> : null}
        </div>
      </a>
    );
  }
  render() {
    const { formStates, cms } = this.props;
    const validatedAddress = this.props.validatedAddress.data.avsErrors
      ? this.props.validatedAddress.data.avsErrors.altAddresList
      : null;
    return (
      validatedAddress &&
      <div>
        <Modal
          overlayClassName={OverLay}
          isOpen={this.props.modalIsOpen}
          className={modalStyles}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.props.closeModal}
          shouldCloseOnOverlayClick
        >
          <div>
            <div className="d-flex flex-row-reverse pr-1 py-1">
              <button
                onClick={this.props.closeModal}
                className={`${clsBtn} px-0`}
                aria-label="Close AVS Modal"
                data-auid="checkout_email_signup_main_modal_close"
              >
                <span className="academyicon icon-close" />
              </button>
            </div>
            <div className="container px-2 px-md-3 pb-1">
              <div className="d-flex flex-column justify-content-center">
                <div className="pb-2">
                  <h5 className="text-uppercase text-center">{cms.checkoutLabels.addressVerification}</h5>
                </div>
                <div className="pb-3">
                  <div className={` ${textStyle} o-copy__14reg text-center px-1`}>{cms.checkoutLabels.addressVerificationUnableDescription}</div>
                </div>
                <div className="pb-3 w-100">
                  {validatedAddress ? validatedAddress.map((address, key) => this.renderSuggestedAddress(address, key)) : null}
                  <a
                    className={`${suggestAddressAnchor} w-100`}
                    data-auid="checkout_initial_selected_address"
                    href=" #"
                    onClick={() => this.handleAddressSelect(0)}
                  >
                    <div className={` ${this.state.selectedAddress === 0 ? suggestAddress('#0055a6') : suggestAddress()} d-flex flex-row p-2 mb-1`}>
                      <div className="d-flex flex-column w-100">
                        <p className="o-copy__16bold"> {cms.checkoutLabels.youEnteredAddressLabel} </p>
                        <div>
                          <div className={`${addressStyle} o-copy__16reg`}>
                            {formStates.address} {','}
                          </div>
                          <div className={`${addressStyle} o-copy__16reg`}>
                            {formStates.city} {formStates.state} {formStates.zipCode}
                          </div>
                        </div>
                        <a
                          href=" #"
                          data-auid="checkout_modify_shipping_address_link"
                          className={` ${modifyAddressStyles} o-copy__14reg`}
                          onClick={this.props.closeModal}
                        >
                          {' '}
                          {cms.checkoutLabels.modifyAddressLabel}{' '}
                        </a>
                      </div>
                      {this.state.selectedAddress === 0 ? <div className={`${iconColor} academyicon icon-check-circle`} /> : null}
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
                      onClick={event => this.submitAddress(event)}
                    >
                      {cms.checkoutLabels.useSelectedAddressLabel}
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
MyAccountAddressSuggestions.propTypes = {
  cms: PropTypes.object.isRequired,
  modalIsOpen: PropTypes.bool,
  closeModal: PropTypes.isRequired,
  onSubmitSuggestHandler: PropTypes.isRequired,
  formStates: PropTypes.isRequired,
  validatedAddress: PropTypes.object
};

export default connect(null)(MyAccountAddressSuggestions);
