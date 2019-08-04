import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { OtherAmount, swatchLabel, Divider, otherAmount, warningText } from '../styles';
import { OTHER_AMOUNT, SWATCH_DEFAULT_BOX_SIZE, GC_CUSTOM_MESSAGES } from '../constants';
import Swatches from '../../swatches/swatches.component';

const GiftCard = ({ gcSwatchProps, updateGiftCardAmount, handleOnClick, productItem, s, customCardValue }) => (
  <Fragment>
    <Fragment key="Amount">
      <span className={`${swatchLabel} o-copy__14bold`}>Card Amount:</span>
      <span className="o-copy__14reg">{s.selectedItem}</span>
      <Swatches cms={gcSwatchProps} boxSize={SWATCH_DEFAULT_BOX_SIZE} handleSwatchClick={e => handleOnClick(e)} default={s.selectedItem} />
    </Fragment>

    {s.selectedItem === customCardValue && (
      <div className="row">
        <div className="col-12 pt-3 pt-md-2">
          <OtherAmount.Heading>{OTHER_AMOUNT}</OtherAmount.Heading>
          <div className={otherAmount}>
            <span>$</span>
            <OtherAmount.Input
              className="col-12 col-md-12 col-lg-12"
              type="tel"
              pattern="[0-9]"
              value={s.giftCardAmount}
              onChange={e => updateGiftCardAmount(e, productItem)}
              data-auid="PDP_giftCardAmount"
            />
            <div className="mt-half">{GC_CUSTOM_MESSAGES.msg1}</div>
            <div className="mt-quarter">{GC_CUSTOM_MESSAGES.msg2}</div>
          </div>
          <div className="pb-3 pb-md-2 pt-3">
            <Divider />
          </div>
          {s.errorMessage !== '' && (
            <div className={warningText}>
              <span>{s.errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    )}

    {s.selectedItem !== customCardValue && (
      <div className="row">
        <div className="col-12 py-3">
          <Divider />
        </div>
      </div>
    )}
  </Fragment>
);

GiftCard.propTypes = {
  s: PropTypes.object,
  handleOnClick: PropTypes.func,
  gcSwatchProps: PropTypes.object,
  updateGiftCardAmount: PropTypes.func,
  productItem: PropTypes.object,
  customCardValue: PropTypes.string
};

export default GiftCard;
