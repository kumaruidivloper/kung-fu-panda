/**
 * AVS modal which shows the list of address suggestions provided by the AVS.
 */
import React, { Component } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import Button from '@academysports/fusion-components/dist/Button';

import { OverLay, addressStyle, suggestAddressAnchor, suggestAddress, textStyle, clsBtn, modifyAddressStyles, iconColorCode, modalStyles } from '../addressBook/styles';

class AvsAddressSuggestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAddress: 0,
      selectedAddressValue: this.props.formStates || ''
    };
    this.handleAddressSelect = this.handleAddressSelect.bind(this);
    this.renderSuggestedAddress = this.renderSuggestedAddress.bind(this);
  }
  /**
   * This function stores the address selected by the user
   * @param {index} index value of address in address list
   */
  handleAddressSelect(index) {
      // this.setState({
      //   selectedAddress: index
      // });
    if (index === 0) {
      this.setState({
        selectedAddressValue: this.props.formStates,
        selectedAddress: index
      });
    } else {
      this.setState({ selectedAddressValue: this.props.validatedAddress.data.avsErrors.altAddresList[index - 1], selectedAddress: index });
    }
  }
  /**
   * This function provides the card list view for all the address in list.
   * By default the address provided by the user is marked selected.
   * @param {validatedAddress} - address list provided by avs
   * @param {index} index val of the address list
   */
  renderSuggestedAddress(validatedAddress, index) {
    const { cms } = this.props;
    return (
      <a className={`${suggestAddressAnchor} w-100`} href=" #" onClick={() => this.handleAddressSelect(index + 1)}>
        <div className={` ${this.state.selectedAddress === index + 1 ? suggestAddress('#0055a6') : suggestAddress()} p-2`}>
          <p className="o-copy__16bold mb-1"> {cms.checkoutLabels.suggestedAddressLabel} </p>
          <div className="d-flex flex-row justify-content-between">
            {validatedAddress ? (
              <div className="d-flex flex-column w-100">
                <div className={`${addressStyle} o-copy__16reg`}>
                  {validatedAddress.address} {','}
                </div>
                <div className={`${addressStyle} o-copy__16reg`}>
                  {validatedAddress.city} {validatedAddress.state} {validatedAddress.zipcode}
                </div>
              </div>
            ) : null}
            {this.state.selectedAddress === index + 1 ? <div className={`${iconColorCode} academyicon icon-check-mark`} /> : null}
          </div>
        </div>
      </a>
    );
  }
  render() {
    const { cms, creditCardData, validatedAddress, modalIsOpen, closeModal } = this.props;
    const validatedAddressAVS = validatedAddress.data.avsErrors
      ? validatedAddress.data.avsErrors.altAddresList
      : null;
    return (
      <div>
        <Modal
          overlayClassName={OverLay}
          isOpen={modalIsOpen}
          className={modalStyles}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={closeModal}
          shouldCloseOnOverlayClick
        >
          <div>
            <div className="d-flex flex-row-reverse pr-1 py-1">
              <button onClick={this.props.closeModal} className={clsBtn} data-auid="email-signup-main-modal-close">
                {' '}
                X{' '}
              </button>
            </div>
            <div data-auid="email-modal-page" className="container px-3 pb-1">
              <div className="d-flex flex-column justify-content-center">
                <div className="pb-2">
                  <h5 className="text-center">{cms.checkoutLabels.addressVerification}</h5>
                </div>
                <div className="pb-3">
                  <div className={` ${textStyle} o-copy__14reg text-center px-1`}>{cms.checkoutLabels.addressVerificationUnableDescription}</div>
                </div>
                <div className="pb-3 w-100">
                  {validatedAddressAVS ? validatedAddressAVS.map((address, k) => this.renderSuggestedAddress(address, k)) : null}
                  <a className={`${suggestAddressAnchor} w-100 `} href=" #" onClick={() => this.handleAddressSelect(0)}>
                    <div className={` ${this.state.selectedAddress === 0 ? suggestAddress('#0055a6') : suggestAddress()} p-2`}>
                      <p className="o-copy__16bold"> {cms.checkoutLabels.youEnteredAddressLabel} </p>
                      <div className="d-flex flex-row justify-content-between">
                        <div className="d-flex flex-column w-100">
                          <div className={`${addressStyle} o-copy__16reg`}>
                            {creditCardData.data.address} {','}
                          </div>
                          <div className={`${addressStyle} o-copy__16reg`}>
                            {creditCardData.data.city} {creditCardData.data.state} {creditCardData.data.zipCode}
                          </div>
                        </div>
                        {this.state.selectedAddress === 0 ? <div className={`${iconColorCode} academyicon icon-check-mark`} /> : null}
                      </div>
                      <a href=" #" className={` ${modifyAddressStyles} o-copy__14reg`} onClick={this.props.closeModal}>
                        {' '}
                        {cms.checkoutLabels.modifyAddressLabel}{' '}
                      </a>
                    </div>
                  </a>
                </div>
                <div className="d-flex justify-content-center">
                  <Button auid="suggest_btn" size="S" onClick={() => this.props.onSubmitSuggestHandler(this.state.selectedAddressValue, this.state.selectedAddress)}>
                    {cms.checkoutLabels.useSelectedAddressLabel}{''}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

AvsAddressSuggestions.propTypes = {
  cms: PropTypes.object.isRequired,
  modalIsOpen: PropTypes.bool,
  closeModal: PropTypes.isRequired,
  onSubmitSuggestHandler: PropTypes.isRequired,
  formStates: PropTypes.isRequired,
  validatedAddress: PropTypes.object,
  creditCardData: PropTypes.object
};

function mapStateToProps(state) {
  return {
    formStates: getFormValues('myAccountPaymentForm')(state)
  };
}

export default connect(mapStateToProps)(AvsAddressSuggestions);
