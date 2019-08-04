import {
  GET_CREDIT_CARDS_SUCCESS,
  GET_GIFT_CARDS_SUCCESS,
  ADD_GIFT_CARD,
  ADD_GIFT_CARD_SUCCESS,
  ADD_GIFT_CARDS_ERROR,
  DELETE_GIFT_CARD_SUCCESS,
  DELETE_GIFT_CARD,
  DELETE_GIFT_CARD_ERROR,
  DELETE_CREDIT_CARD_SUCCESS,
  GET_GIFT_CARDS_ERROR,
  ADD_CREDIT_CARD_ERROR,
  PUT_CREDIT_CARD_ERROR,
  DELETE_CREDIT_CARD_ERROR,
  GET_CREDIT_CARD_ERROR
} from './constants';
/**
 * Handling Error Code
 */
const initialState = {
  errorCode: ''
};
export const userCreditCardList = (state = { data: {} }, action) => {
  switch (action.type) {
    case GET_CREDIT_CARDS_SUCCESS:
      return Object.assign({}, state, { data: action.data, error: false });
    case ADD_CREDIT_CARD_ERROR:
      return Object.assign({}, state, { error: true, errorCode: action.data });
    case PUT_CREDIT_CARD_ERROR:
      return Object.assign({}, state, { error: true, errorCode: action.data });
    case DELETE_CREDIT_CARD_ERROR:
      return Object.assign({}, state, { error: true, errorCode: action.data });
    case GET_CREDIT_CARD_ERROR:
      return Object.assign({}, state, { error: true, errorCode: action.data });
    default:
      return state;
  }
};

export const userGiftCards = (state = initialState, action) => {
  switch (action.type) {
    case GET_GIFT_CARDS_SUCCESS:
      return Object.assign({}, state, { error: false, data: action.data, errorCode: '' });
    case GET_GIFT_CARDS_ERROR:
      return Object.assign({}, state, { error: true, errorCode: action.data });
    default:
      return state;
  }
};

export const addGiftCardData = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case ADD_GIFT_CARD:
      return Object.assign({}, state, { isFetching: true, error: false });
    case ADD_GIFT_CARD_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data, errorCode: '' });
    case ADD_GIFT_CARDS_ERROR:
      return Object.assign({}, state, { isFetching: false, error: true, errorCode: action.data });
    default:
      return state;
  }
};

export const deleteGiftCardData = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case DELETE_GIFT_CARD:
      return Object.assign({}, state, { isFetching: true, error: false });
    case DELETE_GIFT_CARD_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });
    case DELETE_GIFT_CARD_ERROR:
      return Object.assign({}, state, { isFetching: false, error: true, data: action.data });
    default:
      return state;
  }
};

export const userDeleteCreditCardSuccess = (state = { data: {} }, action) => {
  switch (action.type) {
    case DELETE_CREDIT_CARD_SUCCESS:
      return Object.assign({}, state, { data: action.data });
    default:
      return state;
  }
};
