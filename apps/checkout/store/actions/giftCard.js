import { GIFTCARD_APPLY_REQUEST, GIFTCARD_APPLY_SUCCESS, GIFTCARD_APPLY_FAILURE, GIFTCARD_REMOVE_REQUEST, GIFTCARD_REMOVE_SUCCESS, GIFTCARD_REMOVE_FAILURE, GIFTCARD_FETCH_REQUEST, GIFTCARD_FETCH_SUCCESS, GIFTCARD_FETCH_FAILURE, CLEAR_GIFTCARD_ERRORS } from './../../checkout.constants';


export function giftCardApplyRequest(data) {
 return {
   type: GIFTCARD_APPLY_REQUEST,
   data
 };
}

export function giftCardApplySuccess(data) {
 return {
   type: GIFTCARD_APPLY_SUCCESS,
   data
 };
}

export function giftCardApplyFailure(error) {
 return {
   type: GIFTCARD_APPLY_FAILURE,
   error
 };
}

export function giftCardRemoveRequest(data) {
  return {
    type: GIFTCARD_REMOVE_REQUEST,
    data
  };
 }
 export function giftCardRemoveSuccess(data) {
  return {
    type: GIFTCARD_REMOVE_SUCCESS,
    data
  };
 }
 export function giftCardRemoveFailure(error) {
  return {
    type: GIFTCARD_REMOVE_FAILURE,
    error
  };
 }

export function giftCardFetchRequest(data) {
  return {
    type: GIFTCARD_FETCH_REQUEST,
    data
  };
}
export function giftCardFetchSuccess(data) {
  return {
    type: GIFTCARD_FETCH_SUCCESS,
    data
  };
}
export function giftCardFetchFailure(error) {
  return {
    type: GIFTCARD_FETCH_FAILURE,
    error
  };
}

export function clearGiftCardErrors() {
  return {
    type: CLEAR_GIFTCARD_ERRORS
  };
}
