import { UPDATE_BREADCRUMB, INIT_STATE } from './constants';

export function updateBreadCrumb(data) {
  return {
    type: UPDATE_BREADCRUMB,
    payload: data
  };
}

export function initCompState(data) {
  return {
    type: INIT_STATE,
    payload: data
  };
}
