import { POST_PICKUPINSTORE_REQUEST, POST_PICKUPINSTORE_SUCCESS, POST_PICKUPINSTORE_FAILURE } from './../../checkout.constants';


export function postPickupInStore(data) {
  return {
    type: POST_PICKUPINSTORE_REQUEST,
    data
  };
}

export function postPickupInStoreSuccess(data) {
  return {
    type: POST_PICKUPINSTORE_SUCCESS,
    data
  };
}

export function postPickupInStoreError(error) {
  return {
    type: POST_PICKUPINSTORE_FAILURE,
    error
  };
}
