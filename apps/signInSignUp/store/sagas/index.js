import { fork } from 'redux-saga/effects';
import signIndata from '../../../../modules/signIn/saga';
import forgotPassword from '../../../../modules/forgotPassword/saga';
import signUpData from '../../../../modules/signUpComponent/saga';
export default function* rootSaga() {
    yield [
        fork(signIndata),
        fork(forgotPassword),
        fork(signUpData)
    ];
  }
