import { staticPublisherPath } from '@academysports/aso-env';
import AxiosInterceptor from '../utils/interceptor';
import ConfigureStore from './configureStore';
import '../assets/scss/vendor.scss';

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
};

/**
 * Function to extract relevant information from the component template
 * @param {String} inputString The input template string to parse
 * @param {*} regex The regex from node code to parse the data
 */
function splitChunk(inputString, regex) {
  let ind = 0;
  let match;
  const outputArray = [];
  /* eslint-disable no-cond-assign */
  while ((match = regex.exec(inputString))) {
    outputArray.push({
      static: true,
      value: inputString.slice(ind, match.index)
    });

    ind = match.index + match[0].length;

    outputArray.push({
      static: false,
      value: match.slice(1)
    });
  }
  /* eslint-enable no-cond-assign */
  outputArray.push({
    static: true,
    value: inputString.slice(ind, inputString.length)
  });

  return outputArray;
}

/**
 * Function to get the reskin templates and parse the data and inject it into dom.
 * @param {Object} axios The axios isntant
 */
const getReskinComponentsData = axios => {
  /* eslint-disable no-useless-escape */
  const regex = /<div data-component\=\"([a-z]+)\" data-json\=\"(.*?)\" id\=\"([\S]+)\"\s?(data-isCSR\=\")?([a-z]+)?(\")?\s?(?:\/|>([\s\S]*?)<\/div)>/gi;
  /* eslint-enable no-useless-escape */
  const reskinComponentTemplates = [
    `${staticPublisherPath}.header.html`,
    `${staticPublisherPath}.footer.html`,
    `${staticPublisherPath}.email.html`,
    `${staticPublisherPath}.findAStore.html`
  ];
  const reskinComponentPromises = reskinComponentTemplates.map(templateUrl =>
    axios
      .get(templateUrl, { responseType: 'text' })
      .then(tpl => {
        const tokens = splitChunk(tpl.data, regex);
        let componentData = '';
        tokens.forEach(token => {
          if (!token.static && Array.isArray(token.value)) {
            componentData = token;
            window.ASOData = window.ASOData || {};
            const [compName, compData] = token.value;
            // Create the data for the component in the window object
            window.ASOData[compName] = JSON.parse(compData);
            // Rename cms-content to cms
            window.ASOData[compName].cms = window.ASOData[compName]['cms-content'];
            window.ASOData[compName].isCSR = true;
            delete window.ASOData[compName]['cms-content'];
            window.INITIAL_STATE = window.INITIAL_STATE || {};
            window.INITIAL_STATE[compName] = {};
          }
        });
        return componentData;
      })
      .catch(() => {
        /* eslint-disable no-console */
        console.error(new Error(`Component data not found @ ${templateUrl}`));
        /* eslint-enable no-console */
      })
  );
  return Promise.all(reskinComponentPromises);
};

Promise.all([import('./includes/react'), import('./includes/redux'), import('./includes/utils')]).then(modules => {
  const vendorModules = Object.assign({}, { ...modules[0] }, { ...modules[1] }, { ...modules[2] });
  // Assign modules to global window object
  for (const key in vendorModules) {
    if (vendorModules[key]) {
      window[key] = window[key] || vendorModules[key];
    }
  }

  const { axios, Redux, ReduxSaga, ExecutionEnvironment } = vendorModules;

  getReskinComponentsData(axios).then(() => {
    // Inject common data into window.ASOData[<component-ids>]
    commonDataInjector(window.ASOData);
    // Local variables for data interchange
    const interceptor = new AxiosInterceptor(axios);
    interceptor.initialize();
    /* Store is created by hydrating with the initialstate recevied fron node.
     */
    window.INITIAL_STATE = window.INITIAL_STATE || {};
    window.store = ConfigureStore(Redux, ReduxSaga, ExecutionEnvironment)(window.INITIAL_STATE);
  });
});
