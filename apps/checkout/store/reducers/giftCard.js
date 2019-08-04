import {
  GIFTCARD_APPLY_SUCCESS,
  GIFTCARD_APPLY_FAILURE,
  GIFTCARD_REMOVE_SUCCESS,
  GIFTCARD_REMOVE_FAILURE,
  CLEAR_GIFTCARD_ERRORS
} from '../../checkout.constants';

export const giftCardData = (state = { isFetching: false, error: false, data: {} }, action) => {
  switch (action.type) {
    case GIFTCARD_APPLY_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

    case GIFTCARD_APPLY_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: true, data: action.error });

    case GIFTCARD_REMOVE_SUCCESS:
      return Object.assign({}, state, { isFetching: false, error: false, data: action.data });

    case GIFTCARD_REMOVE_FAILURE:
      return Object.assign({}, state, { isFetching: false, error: true, data: action.error });

    case CLEAR_GIFTCARD_ERRORS:
      return Object.assign({}, state, { isFetching: false, error: false, data: null });

    default:
      return state;
  }
};
