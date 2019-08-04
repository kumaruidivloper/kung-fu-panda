import { espotAPI, searchDexCat } from '@academysports/aso-env';
import axios from 'axios';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import * as HTML from 'html-parse-stringify';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import Safe from 'react-safe';
import { compose } from 'redux';

import axiosSsr from '../../../axios-ssr';
import errorHandler from '../../utils/ErrorHandler';
import injectReducer from '../../utils/injectReducer';
import { DATA_COMP_ID, NODE_TO_MOUNT } from './constants';
import reducer from './reducer';
import { prefoot } from './styles';

class PreFooter extends React.PureComponent {
  static getInitialProps(params) {
    let categoryId = '';
    const envBase = params.env.API_HOSTNAME;
    const promises = [];
    if (params.pageInfo) {
      ({ categoryId } = params.pageInfo);
    } else if (params.cmsPageInfo) {
      categoryId = params.cmsPageInfo.previewId;
    }
    const apiPath = `${envBase}${espotAPI}${categoryId}`;
    promises.push(
      axiosSsr.get(apiPath, {
        params: {
          correlationId: params.correlationId,
          trueClientIp: params.trueClientIp,
          userAgent: params.userAgent
        }
      })
    );
    const sdApiPath = `${searchDexCat}${categoryId}.html`;
    const catDex = new Promise((resolve, reject) => {
      axios
        .get(sdApiPath, {
          headers: {
            'Content-Type': 'text/html'
          }
        })
        .then(resp => {
          const parsed = HTML.parse(resp.data);
          resolve({ data: parsed });
        })
        .catch(error => reject(error));
    });
    promises.push(catDex);
    return axiosSsr.all(promises);
  }

  /**
   * Returns stringified HTML after removing  unnecessary comments and script tags
   * @param {object} api - Parsed HTML object
   */
  cleanSearchDex(catlinks) {
    const searchDexLinks = HTML.stringify(catlinks);
    // Remove the unnecessary comments and script tags to avoid console errors
    return searchDexLinks
      .replace(/[\r\n]+/g, '')
      .replace(/<!?[/]?--.*?[--]?>/g, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  render() {
    let marketingText = '';
    let linkBlock = '';
    let categoryespot = {};
    const { api } = this.props;
    if (api.length && (Object.keys(api[0]).length && api[0].constructor === Object)) {
      const [espot, searchDex] = api;
      ({ categoryespot } = espot);
      ({ marketingText } = categoryespot);
      linkBlock = this.cleanSearchDex(searchDex);
    }
    return (
      <React.Fragment>
        {marketingText || linkBlock ? (
          <div className={`container ${prefoot}`}>
            <div className="row">
              <div className="container pb-half">
                {marketingText ? <Safe.div>{marketingText}</Safe.div> : null}
                {linkBlock ? <Safe.div>{linkBlock}</Safe.div> : null}
              </div>
            </div>
          </div>
        ) : null}
      </React.Fragment>
    );
  }
}

PreFooter.propTypes = {
  api: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

const mapStateToProps = state => ({
  api: state.preFooter
});
const mapDispatchToProps = () => ({});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const PreFooterContainer = compose(
    withReducer,
    withConnect,
    errorHandler
  )(PreFooter);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <PreFooterContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(PreFooter);
