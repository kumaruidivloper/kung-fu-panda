// global reducers...if needed
// import globalReducer from './common/reducer';

export default Redux => {
  const { combineReducers } = Redux;
  /**
   * Reducer to update the GTM data layer object on the window.
   * @param {*} state
   */
  const gtmDataLayer = (state = window.dataLayer) => state || [];

  /**
   * Preserve the initial state for dynamically loaded reducers, as redux ignore properties which are not present as part of our reducers
   * This creates stubs for each intial state so that our dynamically loaded reducer can sit comfortably in the store.
   * @param {object} reducers - an object containing our target reducer functions.
   */
  const preserveIntialState = reducers => {
    const reducerNames = Object.keys(reducers);
    Object.keys(window.INITIAL_STATE).forEach(item => {
      if (reducerNames.indexOf(item) === -1) {
        reducers[item] = (state = null) => { //eslint-disable-line
          return state;
        };
      }
    });
    return combineReducers(reducers);
  };

  /**
   * createReducer is used to create the initial reducer and called to update subsequent reducers on run time
   * @param {*} injectedReducers reducers functions to be passed
   */
  return function createReducer(injectedReducers) {
    return preserveIntialState({
      // global: globalReducer, // if needed
      gtmDataLayer,
      ...injectedReducers
    });
  };
};
