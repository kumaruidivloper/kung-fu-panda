import { BREAD_CRUMB } from './../../myaccount.constants';

export const breadCrumb = (state = { isFetching: false, error: false, data: '' }, action) => {
    switch (action.type) {
      case BREAD_CRUMB:
        return { ...state, isFetching: true, error: false, data: action.data };
      default:
        return state;
    }
  };
