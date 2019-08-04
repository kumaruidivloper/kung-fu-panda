/**
 * It renders the AVS modal with suggested addresss and entered address
 */
import React, { Component } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import Button from '@academysports/fusion-components/dist/Button';
import { titleCase } from '../../utils/stringUtils';

import {
  addressStyle,
  suggestAddressAnchor,
  suggestAddress,
  textStyle,
  modifyAddressStyles,
  iconColor,
  containerMargin
} from './shippingAddress.styles';

class AddressSuggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: 1,
      isAddressVerified: false
    };
    this.handleAddressSelect = this.handleAddressSelect.bind(this);
    this.renderSuggestedAddress = this.renderSuggestedAddress.bind(this);
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
    const { data } = this.props.validateShippingAddress;
    const { formStates, analyticsContent } = this.props;
    const { firstName, lastName, phoneNumber, companyName, id } = formStates;

    if (this.state.selectedAddress === 0) {
      selectedAddress = formStates;
    } else {
      const validateSavedAddress = data.avsErrors.altAddresList[this.state.selectedAddress - 1];
      const { address, zipcode, city, state } = validateSavedAddress;
      selectedAddress = {
        firstName, lastName, phoneNumber, address, zipCode: zipcode, city, state, ...formStates.companyName && { companyName }, ...formStates.id && { id }
      };
    }
    this.props.onSubmitSuggestHandler(selectedAddress, this.state.isAddressVerified);
    const analyticsData = {
      event: 'checkoutsteps',
      eventCategory: 'checkout',
      eventAction: 'shipping information',
      eventLabel: 'use selected address',
      customerleadlevel: null,
      customerleadtype: null,
      leadsubmitted: 0,
      newslettersignupcompleted: 0
    };
    analyticsContent(analyticsData);
  }
  /**
   * It takes index of selected addresss drowdown and set state according to it i.e. return ReduxForm data when index is 0 and otherwise alternative address.
   * @param {number} index - Index number of selected addresss from modal.
   */
  handleAddressSelect(index) {
    this.setState({
      selectedAddress: index
    });
  }
  /**
   *  It gets the suggested address and renders the suggested address in modal.
   * @param {Object} validateShippingAddress - It contains the object of address.
   * @param {Number} index - It gets the index number and pass when address selects
   */
  renderSuggestedAddress(validateShippingAddress, index) {
    const { cms } = this.props;
    return (
      <a
        key={`suggestedAddr-${index}`}
        data-auid={`checkout_select_suggested_address_${index + 1}`}
        className={`${suggestAddressAnchor} w-100`}
        href=" #"
        onClick={evt => { evt.preventDefault(); this.handleAddressSelect(index + 1); }}
      >
        <div className={` ${this.state.selectedAddress === index + 1 ? suggestAddress('#0055a6') : suggestAddress()} d-flex flex-row p-2  mb-1`}>
          <div className="d-flex flex-column w-100">
            <p className="o-copy__16bold mb-1"> {cms.suggestedAddressLabel} </p>
            {validateShippingAddress ? (
              <div>
                <div className={`${addressStyle} o-copy__16reg`}>{titleCase(`${validateShippingAddress.address}`)}
                  {','}
                </div>
                <div className={`${addressStyle} o-copy__16reg`}>
                  {titleCase(`${validateShippingAddress.city} ${validateShippingAddress.state} ${validateShippingAddress.zipcode}`)}
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
    const validateShippingAddress = this.props.validateShippingAddress.data.avsErrors
      ? this.props.validateShippingAddress.data.avsErrors.altAddresList
      : null;
    return (
      <div>
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
              data-auid="checkout_shipping_address_verification_modal_close"
            >
              <span className="academyicon icon-close" />
              <span className="sr-only">Close</span>
            </button>
            <div className="container px-2 px-md-3 pb-1">
              <div className="d-flex flex-column justify-content-center">
                <div className="pb-2">
                  <h4 className="text-uppercase text-center">{cms.addressVerification}</h4>
                </div>
                <div className="pb-3">
                  <div className={` ${textStyle} o-copy__14reg text-center px-1`}>{cms.addressVerificationUnableDescription}</div>
                </div>
                <div className="pb-3 w-100">
                  {validateShippingAddress ? validateShippingAddress.map((address, key) => this.renderSuggestedAddress(address, key)) : null}
                  <a
                    className={`${suggestAddressAnchor} w-100`}
                    data-auid="checkout_initial_selected_address"
                    href=" #"
                    onClick={evt => { evt.preventDefault(); this.handleAddressSelect(0); }}
                  >
                    <div className={` ${this.state.selectedAddress === 0 ? suggestAddress('#0055a6') : suggestAddress()} d-flex flex-row p-2 mb-1`}>
                      <div className="d-flex flex-column w-100">
                        <p className="o-copy__16bold"> {cms.youEnteredAddressLabel} </p>
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
                          {cms.modifyAddressLabel}{' '}
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
  closeModal: PropTypes.isRequired,
  onSubmitSuggestHandler: PropTypes.isRequired,
  formStates: PropTypes.isRequired,
  validateShippingAddress: PropTypes.object,
  analyticsContent: PropTypes.func
};

export default AddressSuggestions;
