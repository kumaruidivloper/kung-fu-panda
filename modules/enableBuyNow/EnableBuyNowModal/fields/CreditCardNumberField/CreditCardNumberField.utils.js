import { VISA, AMEX, MASTER, DISCOVER } from '../../../../../utils/validationRules';
const CMS_VISA = 'visa';
const CMS_AMEX = 'amex';
const CMS_MASTER = 'mast';
const CMS_DISCOVER = 'disc';

/**
 * @param {string} cardName - provided by ourself for validation
 * @param {*} propValues - list of creditcard urls
 */
const getCreditCardImage = (cardName, cardsAccepted) => {
  let cardurl = '';
  if (cardsAccepted && cardsAccepted.length) {
    cardurl = cardsAccepted.filter(cardObj => (cardObj.label && cardObj.label.toLowerCase().indexOf(cardName) !== -1 ? cardObj.url : ''));
  }
  return cardurl && cardurl[0] ? cardurl[0].url : '';
};

/**
 * @description Determines the Image URL for the passed in Credit Card Type
 * @param  {string} type The assumed type of credit card
 * @param  {string} cms The AEM data object passed from html template containing labels / credit card image references.
 * @returns {string} the url of the matching credit card type image.
 */
export const getCreditCardImageByType = (type, cms) => {
  const cardType = (type || '').replace(' ', '').toLowerCase();
  const { buyNow } = cms || {};
  const { data } = buyNow || {};
  const { cardsAccepted } = data || {};

  switch (cardType) {
    case VISA:
      return getCreditCardImage(CMS_VISA, cardsAccepted);
    case AMEX:
      return getCreditCardImage(CMS_AMEX, cardsAccepted);
    case MASTER:
      return getCreditCardImage(CMS_MASTER, cardsAccepted);
    case DISCOVER:
      return getCreditCardImage(CMS_DISCOVER, cardsAccepted);
    default:
      return '';
  }
};
