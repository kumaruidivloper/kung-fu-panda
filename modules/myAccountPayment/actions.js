import { LOAD_SAVED_CREDITCARDS, STORE_CREDITCARDS } from '../../apps/checkout/checkout.constants';
import {
  GET_CREDIT_CARDS,
  GET_CREDIT_CARDS_SUCCESS,
  ADD_GIFT_CARDS_ERROR,
  GET_GIFT_CARDS,
  GET_GIFT_CARDS_SUCCESS,
  ADD_GIFT_CARD,
  ADD_GIFT_CARD_SUCCESS,
  DELETE_GIFT_CARD,
  DELETE_GIFT_CARD_SUCCESS,
  DELETE_CREDIT_CARD,
  ADD_CREDIT_CARD,
  PUT_CREDIT_CARD,
  DELETE_CREDIT_CARD_SUCCESS,
  GET_GIFT_CARDS_ERROR,
  ADD_CREDIT_CARD_ERROR,
  DELETE_CREDIT_CARD_ERROR,
  PUT_CREDIT_CARD_ERROR,
  DELETE_GIFT_CARD_ERROR,
  GET_CREDIT_CARD_ERROR
} from './constants';

export const loadsavedCreditcards = data => ({ type: LOAD_SAVED_CREDITCARDS, data });
export const storeCreditcards = data => ({ type: STORE_CREDITCARDS, data });

export const getCreditCards = data => ({ type: GET_CREDIT_CARDS, data });
export const getCreditCardsSuccess = data => ({ type: GET_CREDIT_CARDS_SUCCESS, data });
// get credit card Error
export const getCreditCardError = data => ({ type: GET_CREDIT_CARD_ERROR, data });

export const getGiftCards = data => ({ type: GET_GIFT_CARDS, data });
export const getGiftCardsSuccess = data => ({ type: GET_GIFT_CARDS_SUCCESS, data });
// gift card error handeling
export const getGiftCardsError = data => ({ type: GET_GIFT_CARDS_ERROR, data });
export const addGiftCardserror = data => ({ type: ADD_GIFT_CARDS_ERROR, data });

export const addGiftCard = (id, data) => ({ type: ADD_GIFT_CARD, id, data });
export const addCreditCard = (id, data) => ({ type: ADD_CREDIT_CARD, id, data });
// add credit card error
export const addCreditCardError = data => ({ type: ADD_CREDIT_CARD_ERROR, data });
export const addGiftCardSuccess = data => ({ type: ADD_GIFT_CARD_SUCCESS, data });

export const deleteGiftCard = (id, data) => ({ type: DELETE_GIFT_CARD, id, data });
export const deleteGiftCardSuccess = data => ({ type: DELETE_GIFT_CARD_SUCCESS, data });
// delete gift card error
export const deleteGiftCardError = data => ({ type: DELETE_GIFT_CARD_ERROR, data });
export const deleteCreditCard = (id, data) => ({ type: DELETE_CREDIT_CARD, id, data });
export const deleteCreditCardSuccess = data => ({ type: DELETE_CREDIT_CARD_SUCCESS, data });
// delete credit card error
export const deleteCreditCardError = data => ({ type: DELETE_CREDIT_CARD_ERROR, data });

export const putCreditCard = (id, itemID, data, makePrimary) => ({ type: PUT_CREDIT_CARD, id, itemID, data, makePrimary });
// put credit card error
export const putCreditCardError = data => ({ type: PUT_CREDIT_CARD_ERROR, data });
