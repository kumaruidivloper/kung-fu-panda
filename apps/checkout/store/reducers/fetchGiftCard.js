import {
  GIFTCARD_FETCH_SUCCESS,
  GIFTCARD_FETCH_FAILURE
} from '../../checkout.constants';

export const savedGiftCards = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case GIFTCARD_FETCH_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

    case GIFTCARD_FETCH_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: true, data: action.error });

    default:
      return state;
  }
};
