import { GIFT_CARD_ERROR_MESSAGE_1, GIFT_CARD_ERROR_MESSAGE_AND } from '../constants';

export const getSwatchProps = (identifiersMap, gcAmounts, CUSTOM_CARD_VALUE) => {
  // eslint-disable-next-line
  identifiersMap.amount = gcAmounts.map(item => ({
    identifier: {
      key: 'Amount',
      value: `$${item}`
    },
    itemId: `$${item}`,
    sellable: true,
    text: `$${item}`
  }));

  // eslint-disable-next-line
  identifiersMap.amount = identifiersMap.amount || [];
  identifiersMap.amount.push({
    identifier: { key: 'Amount', value: CUSTOM_CARD_VALUE },
    itemId: CUSTOM_CARD_VALUE,
    sellable: true,
    text: CUSTOM_CARD_VALUE
  });

  return {
    swatchList: identifiersMap.amount
  };
};

export const getUpdatedGcAmount = (productItem, gcAmt, gcMaxAmount) => {
  if (Number.isNaN(gcAmt) || gcAmt < parseInt(productItem.gcMinAmount, 10) || gcAmt > parseInt(productItem.gcMaxAmount, 10)) {
    return {
      giftCardAmount: Number.isNaN(gcAmt) ? '' : gcAmt,
      errorMessage: `${GIFT_CARD_ERROR_MESSAGE_1} ${productItem.gcMinAmount} ${GIFT_CARD_ERROR_MESSAGE_AND} ${gcMaxAmount}`
    };
  }
  return {
    giftCardAmount: gcAmt,
    errorMessage: ''
  };
};
