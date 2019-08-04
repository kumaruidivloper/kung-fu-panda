import { PUT_SWEEP_STAKES_REQUEST, PUT_SWEEP_STAKES_SUCCESS, PUT_SWEEP_STAKES_FAILURE } from './../constants';


export function putSweepstakesData(data) {
  return {
    type: PUT_SWEEP_STAKES_REQUEST,
    data
  };
}

export function putSweepstakesDataSuccess(data) {
  return {
    type: PUT_SWEEP_STAKES_SUCCESS,
    data
  };
}

export function putSweepstakesDataError(error) {
  return {
    type: PUT_SWEEP_STAKES_FAILURE,
    error
  };
}
