import { POST_SHIPTOSTORE_REQUEST, POST_SHIPTOSTORE_SUCCESS, POST_SHIPTOSTORE_FAILURE } from './../../checkout.constants';


export function postShipToStore(data) {
  return {
    type: POST_SHIPTOSTORE_REQUEST,
    data
  };
}

export function postShipToStoreSuccess(data) {
  return {
    type: POST_SHIPTOSTORE_SUCCESS,
    data
  };
}

export function postShipToStoreError(error) {
  return {
    type: POST_SHIPTOSTORE_FAILURE,
    error
  };
}
