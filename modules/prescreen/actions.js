import { PRE_SCREEN_CALL_REQUEST, PRE_SCREEN_CALL_SUCCESS, PRE_SCREEN_CALL_FAILURE } from './constants';
export const preScreenCallRequest = data => ({ type: PRE_SCREEN_CALL_REQUEST, data });
export const preScreenCallFailure = data => ({ type: PRE_SCREEN_CALL_FAILURE, data });
export const preScreenCallSuccess = data => ({ type: PRE_SCREEN_CALL_SUCCESS, data });