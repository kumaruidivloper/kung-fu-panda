import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import Button from '@academysports/fusion-components/dist/Button';

import { isMobile } from '../../../../utils/navigator';
import { getAddressSuggestionLabel } from '../../../../utils/buyNow/buyNow.utils';
import {
  formTitle,
  addressStyle,
  suggestAddressAnchor,
  styleSuggestAddress,
  textStyle,
  modifyAddressStyles,
  iconColor
} from './AddressSuggestionsSelector.emotion';
import { xsButtonTweaks } from '../EnableBuyNowModal.emotion';

const TYPE_ORIGINAL = 'original';
const TYPE_SUGGESTED = 'suggested';

const ADDRESS_VERIFICATION_LABEL = 'addressVerification';
const ADDRESS_VERIFICATION_UNABLE_DESCRIPTION = 'addressVerificationUnableDescription';
const MODIFY_ADDRESS_LABEL = 'modifyAddressLabel';
const SUGGESTED_ADDRESS_LABEL = 'suggestedAddressLabel';
const YOU_ENTERED_ADDRESS_LABEL = 'youEnteredAddressLabel';
const SUBMIT_TEXT = 'submitText';

class AddressSuggestionsSelector extends PureComponent {
  constructor(props) {
    super(props);
    this.isMobileView = isMobile();
  }

  componentDidMount() {
    this.props.scrollPageToTop();
  }

  isSelected(index) {
    const { selectedIndex } = this.props;
    return index === selectedIndex;
  }

  createOnSelectAddress = index => () => this.props.onSelect(index);

  renderAddress(address, index, title, type = TYPE_SUGGESTED) {
    return (
      <a
        key={`${type}-addr-${index}`}
        data-auid={`select_${type}_address_${index + 1}`}
        className={cx(suggestAddressAnchor, 'w-100')}
        href=" #"
        onClick={this.createOnSelectAddress(index)}
      >
        <div className={cx('d-flex flex-row p-2  mb-1', styleSuggestAddress(this.isSelected(index)))}>
          <div className="d-flex flex-column w-100">
            <p className="o-copy__16bold mb-1"> {title} </p>
            {address ? (
              <div>
                <div className={`${addressStyle} o-copy__16reg`}>
                  {address.address} {','}
                </div>
                <div className={`${addressStyle} o-copy__16reg`}>
                  {address.city} {address.state} {address.zipcode}
                </div>
                {this.renderModifyAddressLink(type)}
              </div>
            ) : null}
          </div>
          {this.isSelected(index) && <div className={`${iconColor} academyicon icon-check-circle`} />}
        </div>
      </a>
    );
  }

  renderModifyAddressLink(type) {
    if (type !== TYPE_ORIGINAL) {
      return null;
    }

    const { cms, onClickModifyAddress } = this.props;
    const ctaText = getAddressSuggestionLabel(cms, MODIFY_ADDRESS_LABEL);
    return (
      <a
        href=" #"
        data-auid="checkout_modify_shipping_address_link"
        className={` ${modifyAddressStyles} o-copy__14reg`}
        onClick={onClickModifyAddress}
      >
        {ctaText}
      </a>
    );
  }

  renderSuggestedAddresses() {
    const { suggestedAddresses, cms } = this.props;
    const title = getAddressSuggestionLabel(cms, SUGGESTED_ADDRESS_LABEL);
    return suggestedAddresses ? suggestedAddresses.map((address, idx) => this.renderAddress(address, idx, title, TYPE_SUGGESTED)) : null;
  }

  renderOriginalAddress() {
    const { originalAddress, cms } = this.props;
    const title = getAddressSuggestionLabel(cms, YOU_ENTERED_ADDRESS_LABEL);
    return this.renderAddress(originalAddress, -1, title, 'original');
  }

  renderSubmitButton() {
    const { cms, onSubmit, isSubmitting } = this.props;
    const buttonClassName = cx('w-100 o-copy__14bold', xsButtonTweaks); // eslint-disable-line no-useless-computed-key
    return (
      <Button
        className={buttonClassName}
        size={this.isMobileView ? 'S' : 'M'}
        aria-label="Use Selected Address button"
        auid="checkout_use_selected_address_btn"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {getAddressSuggestionLabel(cms, SUBMIT_TEXT)}
      </Button>
    );
  }

  render() {
    const { cms, suggestedAddresses } = this.props;
    return (
      suggestedAddresses && (
        <div>
          <div className="container p-0">
            <div className="d-flex flex-column justify-content-center">
              <div className="pb-2">
                <h6 className={cx(formTitle, 'text-uppercase text-center')}>{getAddressSuggestionLabel(cms, ADDRESS_VERIFICATION_LABEL)}</h6>
              </div>
              <div className="pb-3">
                <div className={cx(textStyle, 'o-copy__14reg text-center px-0 px-md-1')}>
                  {getAddressSuggestionLabel(cms, ADDRESS_VERIFICATION_UNABLE_DESCRIPTION)}
                </div>
              </div>
              <div className="pb-3 w-100">
                {this.renderSuggestedAddresses()}
                {this.renderOriginalAddress()}
                <div className="text-center">{this.renderSubmitButton()}</div>
              </div>
            </div>
          </div>
        </div>
      )
    );
  }
}
AddressSuggestionsSelector.propTypes = {
  cms: PropTypes.object,
  onClickModifyAddress: PropTypes.isRequired,
  originalAddress: PropTypes.object,
  selectedIndex: PropTypes.number,
  onSubmit: PropTypes.func,
  onSelect: PropTypes.func,
  suggestedAddresses: PropTypes.array,
  isSubmitting: PropTypes.bool,
  scrollPageToTop: PropTypes.func.isRequired
};

export default AddressSuggestionsSelector;
