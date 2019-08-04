import AxiosInterceptor from '../utils/interceptor';
import ConfigureStore from './configureStore';
import '../assets/scss/vendor.scss';
import StorageManager from '../utils/StorageManager';
import '../utils/analytics/analyticsOnScroll';

/**
 * Function to inject common data authored by AEM into all the component before store initialization.
 * @param {Object} asoData The window.ASOData containing individual component data.
 */
const commonDataInjector = asoData => {
  for (const key in asoData) {
    if (asoData[key] && asoData[key].cms) {
      /* eslint-disable no-param-reassign */
      // Necessary to prevent same data being injected by node into script tags increasing page size.
      asoData[key].labels = Object.assign({}, asoData[key].labels, asoData.labels);
      asoData[key].messages = Object.assign({}, asoData[key].messages, asoData.messages);
      /* eslint-enable no-param-reassign */
    }
  }
  // Get data-components on the page and push the comp ID based data to window initial state
  // TBD: Unique ID based push
  [...document.querySelectorAll('[data-component]')].forEach(componentNode => {
    // Get componentNode.dataset.compid & componentNode.dataset.component
    const compId = componentNode.getAttribute('data-compId');
    const compName = componentNode.getAttribute('data-component');
    if (compId && compName) {
      if (asoData[compId]) {
        window.INITIAL_STATE = window.INITIAL_STATE || {};
        window.INITIAL_STATE[compName] = asoData[compId].api || {};
        // TBD: move to component name to unique component ID
        // window.INITIAL_STATE[compId] = asoData[compId].api || {};
      }
    }
  });
  // Check if there exists persisted data from the session storage and assign it to the inital data.
  const persistedObject = JSON.parse(StorageManager.getSessionStorage(StorageManager.getCookie('JSESSIONID')));
  if (persistedObject && typeof persistedObject === 'object' && !Array.isArray(persistedObject)) {
    Object.keys(persistedObject).forEach(key => {
      window.INITIAL_STATE[key] = persistedObject[key];
    });
  }
};

/**
 * Function to get the query parameter from the URL.
 * NOTE: Not tested with complex Query params, only used for PWA check
 * @param {string} key The query param to find
 */
// const getQueryStringValue = key =>
//   decodeURIComponent(
//     /* eslint-disable no-useless-escape */
//     window.location.search.replace(new RegExp(`^(?:.*[&\\?]${encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&')}(?:\\=([^&]*))?)?.*$`, 'i'), '$1')
//     /* eslint-enable no-useless-escape */
//   );

Promise.all([import('./includes/react'), import('./includes/redux'), import('./includes/utils')]).then(modules => {
  const vendorModules = Object.assign({}, { ...modules[0] }, { ...modules[1] }, { ...modules[2] });
  // Assign modules to global window object
  for (const key in vendorModules) {
    if (vendorModules[key]) {
      window[key] = window[key] || vendorModules[key];
    }
  }
  // Inject common data into window.ASOData[<component-ids>]
  commonDataInjector(window.ASOData);
  // Local variables for data interchange
  const { axios, Redux, ReduxSaga, ExecutionEnvironment } = vendorModules;
  const interceptor = new AxiosInterceptor(axios);
  interceptor.initialize();
  /* Store is created by hydrating with the initialstate recevied fron node.
   */
  window.INITIAL_STATE = window.INITIAL_STATE || {};
  window.store = ConfigureStore(Redux, ReduxSaga, ExecutionEnvironment)(window.INITIAL_STATE);

  // if ('serviceWorker' in navigator && getQueryStringValue('pwa')) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const staticCDN = encodeURIComponent(window.ASOPMEnv.staticAssetsBucketPath);
      navigator.serviceWorker
        .register(`/sw.js?staticCDN=${staticCDN}`)
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
});
