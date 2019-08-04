import { headerAutoSuggestAPI, miniCartAPI, visualGuidedCategoriesBrandsAPI } from '@academysports/aso-env';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import axios from 'axios';
import { all, call, put, takeLatest } from 'redux-saga/effects';

import * as actions from './actions';
import { FETCH_AUTO_SUGGESTIONS, FETCH_MINI_CART, SEARCH_ACTION_REGEX, PERSISTANT_WHITELIST } from './constants';
import StorageManager from '../../utils/StorageManager';
// import has from '../../utils/objectUtils';

const delay = ms => new Promise(res => setTimeout(res, ms));
const { CancelToken } = axios;
let sourceAutoSuggestion;
let sourceProductSuggestion;

/* **** API Requests **** */
export function apiReq(params) {
  // Check if API is autosuggest or productSuggestions
  const isAutoSuggest = params.match(/autosuggest/);
  if (isAutoSuggest && sourceAutoSuggestion) {
    // Cancel call for autosuggest if in progress
    sourceAutoSuggestion.cancel();
  } else if (!isAutoSuggest && sourceProductSuggestion) {
    // Cancel call for productSuggestions if in progress
    sourceProductSuggestion.cancel();
  }
  if (isAutoSuggest) {
    // Create cancellable token for autosuggest
    sourceAutoSuggestion = CancelToken.source();
  } else {
    // Create cancellable token for productSuggestions
    sourceProductSuggestion = CancelToken.source();
  }
  return axios
    .get(`${params}`, {
      // Cancel token to cancel in progress call for new call
      cancelToken: isAutoSuggest ? sourceAutoSuggestion.token : sourceProductSuggestion.token
    })
    .catch(err => {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message);
      } else {
        console.log(err.toString());
      }
    });
}
/* **** Get Header Search Suggestions Data **** */
function getDataFromResponse(response, path) {
  if (!response) return null;
  const paths = path && path.split('.');
  const data = paths.reduce((obj, nextPath) => {
    if (!obj) return null;
    if (obj[nextPath]) {
      return obj[nextPath];
    }
    return null;
  }, response);
  return data;
}
/* **** Get Header Search Suggestions Data **** */
export function* searchSuggestions(action) {
  try {
    const { params = {} } = action;
    if (params) {
      if (ExecutionEnvironment.canUseDOM && window.ASOData && window.ASOData.messages) {
        const { desktopSearchDelayTime, mobileSearchDelayTime } = window.ASOData.messages;
        if (params.isMobile && mobileSearchDelayTime) {
          yield delay(parseInt(mobileSearchDelayTime, 10));
        } else if (desktopSearchDelayTime) {
          yield delay(parseInt(desktopSearchDelayTime, 10));
        }
      }
      const ignoreSpecialChars = params.value.replace(SEARCH_ACTION_REGEX, '');
      const callsToMake = [
        call(apiReq, `${headerAutoSuggestAPI}${ignoreSpecialChars}`),
        call(apiReq, `${visualGuidedCategoriesBrandsAPI}${ignoreSpecialChars}`)
      ];
      const [autoSuggestions, visualGuidedCategoriesBrands] = yield all(callsToMake);
      return yield all([
        put(actions.saveAutoSuggestions(getDataFromResponse(autoSuggestions, 'data.typeAheadResults'))),
        put(actions.saveVisualGuidedCategoriesBrands(getDataFromResponse(visualGuidedCategoriesBrands, 'data')))
      ]);
    }
    return yield all([yield put(actions.saveAutoSuggestions(null))]);
  } catch (e) {
    return null;
  }
}

/* **** Header Mini Cart **** */
export function* miniCart() {
  const getCartResponse = yield call(apiReq, `${miniCartAPI}000000/summary`);
  try {
    yield put(actions.fetchMiniCartSuccess(getCartResponse && getCartResponse.data));
    yield call(persistToLocalStorage);
  } catch (error) {
    yield put(actions.fetchMiniCartError(error));
  }
}

export default function* headerSaga() {
  yield takeLatest(FETCH_AUTO_SUGGESTIONS, searchSuggestions);
  yield takeLatest(FETCH_MINI_CART, miniCart);
}
/**
 * Method to update header local Storage
 */
function persistToLocalStorage() {
  // Check if user has set the aso_persist_store flag
  // TBD: remove check once code is production ready
  if (StorageManager.getSessionStorage('persistStore')) {
    const persistedObject = { ...window.store.getState() };
    // If key not in whitelist remove it from the object before persisting to localstorage
    Object.keys(persistedObject).forEach(key => {
      if (PERSISTANT_WHITELIST.indexOf(key) === -1) {
        delete persistedObject[key];
      }
    });
    StorageManager.setSessionStorage(StorageManager.getCookie('JSESSIONID'), JSON.stringify(persistedObject));
  }
}
