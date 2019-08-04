import { ENABLE_REDUX_DEV_TOOL } from '@academysports/aso-env';
import CreateReducer from './reducers';

export default (Redux, ReduxSaga, ExecutionEnvironment) => {
  const { createStore, compose, applyMiddleware } = Redux;
  const createSagaMiddleware = ReduxSaga.default;
  const sagaMiddleware = createSagaMiddleware();
  const REDUX_DEV_TOOL_CONFIG = {
    name: 'ASO',
    maxAge: 10,
    latency: 1000,
    features: {
      pause: true,
      lock: true,
      persist: false,
      export: false,
      jump: false,
      skip: false,
      reorder: false,
      test: false
    }
  };

  /**
   * Configure the store with initial data and reducer. This also applies a middleware called redux-thunk
   * @param initialState
   * @returns {Store<any> & {dispatch: any}}
   */
  return function configureStore(initialState = {}) {
    if (!ExecutionEnvironment.canUseDOM) return {};
    const middlewares = [sagaMiddleware];
    /* eslint-disable */
    let enableReduxDevTool = false;
    if (
      typeof window === 'object' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      (ENABLE_REDUX_DEV_TOOL || process.env.NODE_ENV !== 'production')
    ) {
      enableReduxDevTool = true;
    }
    const composeEnhancers = enableReduxDevTool ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(REDUX_DEV_TOOL_CONFIG) : compose;
    /* eslint-enable */
    if (ENABLE_REDUX_DEV_TOOL || process.env.NODE_ENV !== 'production') {
      const { logger } = require('redux-logger'); // eslint-disable-line
      middlewares.push(logger);
    }

    const enhancer = composeEnhancers(applyMiddleware(...middlewares));

    const store = createStore(CreateReducer(Redux)(), initialState, enhancer);

    // Extensions
    store.runSaga = sagaMiddleware.run;
    store.injectedReducers = {};
    store.injectedSagas = {};
    return store;
  };
};
