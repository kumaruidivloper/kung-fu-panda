import {
  FETCH_PAGE_DATA_REQUEST,
  FETCH_PAGE_DATA_SUCCESS,
  FETCH_PAGE_DATA_FAILURE,
  SET_INIT_PAGE_STATE,
  SET_AUTH_STATUS,
  MARK_SECTION_EDIT,
  MARK_SECTION_COMPLETED
} from './../../checkout.constants';

export function fetchOrderDetails(params) {
  return {
    type: FETCH_PAGE_DATA_REQUEST,
    params
  };
}

export function fetchOrderDetailsSuccess(data) {
  return {
    type: FETCH_PAGE_DATA_SUCCESS,
    data
  };
}

export function fetchOrderDetailsError(error) {
  return {
    type: FETCH_PAGE_DATA_FAILURE,
    error
  };
}
export function setInitialPageState(pageState) {
  return {
    type: SET_INIT_PAGE_STATE,
    pageState
  };
}

export function setAuthStatus(flag) {
  return {
    type: SET_AUTH_STATUS,
    flag
  };
}

export function markSectionToEdit(pageSection) {
  return {
    type: MARK_SECTION_EDIT,
    pageSection
  };
}
export function markSectionCompleted(pageSection) {
  return {
    type: MARK_SECTION_COMPLETED,
    pageSection
  };
}
