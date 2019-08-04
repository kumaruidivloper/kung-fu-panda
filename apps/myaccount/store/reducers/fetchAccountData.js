import { MY_ACCOUNT_DATA_SUCCESS, MY_ACCOUNT_DATA_FAILURE } from './../../myaccount.constants';
export const fetchAccountData = (state = { data: { profile: { firstName: '' } } }, action) => {
  switch (action.type) {
    case MY_ACCOUNT_DATA_SUCCESS:
      return Object.assign({}, state, { data: action.data });
    case MY_ACCOUNT_DATA_FAILURE:
      return Object.assign({}, state, { data: { profile: { firstName: '' } } });
    default:
      return state;
  }
};
