import { FETCH_SHIPPINGMODES_FAILURE, FETCH_SHIPPINGMODES_SUCCESS, FETCH_SHIPPINGMODES_REQUEST, POST_SHIPPINGMODES_FAILURE, POST_SHIPPINGMODES_SUCCESS, POST_SHIPPINGMODES_REQUEST } from '../../checkout.constants';

export const fetchSavedShippingModes = data => ({ type: FETCH_SHIPPINGMODES_REQUEST, data });
export const fetchSavedShippingModesSuccess = data => ({ type: FETCH_SHIPPINGMODES_SUCCESS, data });
export const fetchSavedShippingModesError = data => ({ type: FETCH_SHIPPINGMODES_FAILURE, data });
export const postShippingAddressModes = data => ({ type: POST_SHIPPINGMODES_REQUEST, data });
export const postShippingAddressModesSuccess = data => ({ type: POST_SHIPPINGMODES_SUCCESS, data });
export const postShippingAddressModesError = data => ({ type: POST_SHIPPINGMODES_FAILURE, data });
