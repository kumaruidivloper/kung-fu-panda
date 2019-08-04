import { LOADING_TRUE, LOADING_FALSE } from './../../checkout.constants';

export function showLoader() {
    return {
        type: LOADING_TRUE
    };
}
export function hideLoader() {
    return {
        type: LOADING_FALSE
    };
}
