import classNames from 'classnames';
import React from 'react';
import { removeAlertRed, bgNone, redColor, iconColor } from './styles';

export const addressDetails = (cms, cardDetails, cardLabel) => (
  <div>
    <div className={classNames('mb-1', 'o-copy__14bold')}>{cardLabel}</div>

    <div className={classNames('mb-1', 'o-copy__14reg')}>{cms.checkoutLabels.billingInformation}</div>
    <div className={classNames('mb-half', 'o-copy__14bold')}>{cardDetails.creditCardHolderName}</div>

    <p className={classNames('mb-half', 'o-copy__14reg')}>
      {cardDetails.billingAddress.address}
      <br />
      {cardDetails.billingAddress.companyName.length > 0 ? cardDetails.billingAddress.companyName.concat(' ,') : null}{' '}
      {cardDetails.billingAddress.state} {cardDetails.billingAddress.zipCode}
    </p>
  </div>
);
export const internalGiftDivision = (cms, cardDetails) => {
  let zeroBalance = true;
  if (parseInt(cardDetails.giftCardBalance, 10)) {
    zeroBalance = false;
  }
  return (
    <div>
      <div className={classNames('mb-1', 'o-copy__14bold')}>
        {cms.giftCardEndingInLabel} {'-'} {cardDetails.giftCardNumber.slice(-4)}
      </div>
      <p className={classNames('mb-half', 'o-copy__14reg')}>{cms.availableBalanceLabel}</p>
      {zeroBalance ? (
        <div className={classNames('mb-half', 'o-copy__14bold', redColor)}>${cardDetails.giftCardBalance}</div>
      ) : (
        <div className={classNames('mb-half', 'o-copy__14bold')}>${cardDetails.giftCardBalance}</div>
      )}
    </div>
  );
};

export const removeDisplay = (undoClick, closeClick, cms, displayText) => (
  <div className={classNames('d-flex justify-content-between', 'py-1 my-1', removeAlertRed)}>
    <div className="ml-half">
      <span className={classNames('o-copy__14bold', bgNone, redColor)}>{displayText}</span>
      <button data-auid="undo-btn" className={classNames('o-copy__14bold', bgNone)} onClick={undoClick}>
        <span className={classNames('o-copy__14bold', iconColor)}>{cms.commonLabels.undoLabel}</span>
      </button>
    </div>
    <div>
      <button data-auid="close-btn" className={classNames('pr-half mr-half', bgNone)} onClick={closeClick}>
        <span className={classNames('academyicon icon-close', redColor)} />
      </button>
    </div>
  </div>
);
/**
 * @param {object} cms
 * @param {function} creditCardUpdate to update expired credit card
 * @param {function} creditCardRemove to remove expired credit card
 * @param {object} item list of saved credit card
 */
export const creditCardExpiredDisplay = (cms, creditCardUpdate, creditCardRemove, item) => (
  <div className={classNames('d-flex justify-content-between', 'py-1 my-1', removeAlertRed)}>
    <div>
      <span className={classNames('o-copy__14reg', 'ml-1', bgNone, redColor)}>{cms.errorMsg.creditCardExpiredLabel}</span>
    </div>
    <div>
      <button data-auid="close-btn" aria-label="Update Credit Card" className={classNames('pr-half mr-half', bgNone)} onClick={() => creditCardUpdate(item.xWalletId)}>
        <span className={classNames('o-copy__14reg', iconColor)}>{cms.commonLabels.updateLabel}</span>
      </button>
      <button data-auid="close-btn" aria-label="Remove Credit Card" className={classNames('pr-half mr-half', bgNone)} onClick={() => creditCardRemove(item)}>
        <span className={classNames('o-copy__14reg', iconColor)}>{cms.commonLabels.removeLabel}</span>
      </button>
    </div>
  </div>
);
