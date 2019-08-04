import { combineReducers } from 'redux';
import {
    PUT_SWEEP_STAKES_REQUEST,
    PUT_SWEEP_STAKES_SUCCESS,
    PUT_SWEEP_STAKES_FAILURE
  } from './../constants';
  export const sweepstakesData = (state = { isFetching: false, error: false, data: {} }, action) => {
    switch (action.type) {
      case PUT_SWEEP_STAKES_REQUEST:
        return { ...state, isFetching: true, error: false };
      case PUT_SWEEP_STAKES_SUCCESS:
        return { ...state, isFetching: false, error: false, data: action.data };
      case PUT_SWEEP_STAKES_FAILURE:
        return { ...state, isFetching: false, error: true, data: action.data };
      default:
        return state;
    }
  };

export default combineReducers({
    sweepstakesData
});
