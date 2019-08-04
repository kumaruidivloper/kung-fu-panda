import {
  LOAD_ADDRESS_DATA_FAILURE,
  LOAD_ADDRESS_DATA_SUCCESS,
  TOGGLE_FORM_DATA,
  TOGGLE_EDIT_FORM,
  TOGGLE_ALERT,
  ADDRESS_DATA_ERROR
} from './../../../myaccount.constants';

const formatAddressData = rawAddress => {
  const { addressLine, companyName, ...remainingProps } = rawAddress;
  const [address, addressLine2] = addressLine || [];
  return {
    address,
    companyName: addressLine2 && addressLine2.length > 0 ? addressLine2 : companyName || '',
    ...remainingProps
  };
};

const formatAddressesData = rawAddresses => {
  const addresses = rawAddresses || [];
  return addresses.map(formatAddressData);
};

export const fetchAddress = (
  state = { data: {}, showAddressForm: false, showEditAddressForm: false, showAlertBox: false, deleteID: '', errorCode: '', error: false },
  action
) => {
  switch (action.type) {
    case LOAD_ADDRESS_DATA_SUCCESS:
      return Object.assign({}, state, {
        data: formatAddressesData(action.data.profile.address),
        showAddressForm: false,
        showEditAddressForm: false,
        showAlertBox: false,
        deleteID: state.deleteID,
        errorCode: '',
        error: false
      });
    case LOAD_ADDRESS_DATA_FAILURE:
      return Object.assign({}, state, {
        data: {},
        showAddressForm: false,
        showEditAddressForm: state.showEditAddressForm,
        showAlertBox: false,
        deleteID: state.deleteID,
        errorCode: '',
        error: false
      });
    case TOGGLE_FORM_DATA:
      return Object.assign({}, state, {
        data: state.data,
        showAddressForm: action.data,
        showEditAddressForm: false,
        showAlertBox: false,
        deleteID: state.deleteID,
        errorCode: '',
        error: false
      });
    case TOGGLE_EDIT_FORM:
      return Object.assign({}, state, {
        data: state.data,
        showAddressForm: false,
        showEditAddressForm: action.data,
        showAlertBox: false,
        deleteID: state.deleteID,
        errorCode: '',
        error: false
      });
    case TOGGLE_ALERT:
      return Object.assign({}, state, {
        data: state.data,
        showAddressForm: false,
        showEditAddressForm: false,
        deleteID: action.data,
        showAlertBox: action.flag,
        errorCode: '',
        error: false
      });
    case ADDRESS_DATA_ERROR:
      return Object.assign({}, state, { ...state, showAddressForm: true, errorCode: action.data, error: true });
    default:
      return state;
  }
};
