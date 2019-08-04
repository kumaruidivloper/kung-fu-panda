import { fork } from 'redux-saga/effects';
import validateAddress from './validateAddress';
import fetchCityState from './fetchCityState';
import fetchAddress from './fetchAddress';
import postAddress from './postAddress';
import deleteAddress from './deleteAddress';
import editAddress from './editAddress';
import defaultAddress from './setAsDefaultAddress';
export default function* saga() {
    yield [
        fork(validateAddress),
        fork(fetchCityState),
        fork(fetchAddress),
        fork(postAddress),
        fork(deleteAddress),
        fork(editAddress),
        fork(defaultAddress)
    ];
  }
