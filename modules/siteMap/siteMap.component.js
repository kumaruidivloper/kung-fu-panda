import { siteMapAPI } from '@academysports/aso-env';
import classNames from 'classnames';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { compose } from 'redux';

import axiosSsr from '../../../axios-ssr';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import * as actions from './actions';
import { DATA_COMP_ID, NODE_TO_MOUNT, SITE_MAP_TITLE } from './constants';
import reducer from './reducer';
import saga from './saga';
import { anchorClass } from './styles';

// import axios from 'axios';
class SiteMap extends React.PureComponent {
  componentDidMount() {
    if (this.props.api && this.props.api.categorySiteMap) {
      this.props.fnSiteMapLoaded(this.props.api);
    } else {
      this.props.fnLoadSiteMapDetails();
    }
  }
  static getInitialProps(params) {
    return axiosSsr.get(siteMapAPI, {
      params: {
        correlationId: params.correlationId,
        trueClientIp: params.trueClientIp,
        userAgent: params.userAgent
      }
    });
  }
  renderSiteMap = () => {
    const { siteMapData } = this.props;
    return siteMapData.siteMapdetails.categorySiteMap.data.map(data => (
      <div className="col-12 col-md-3 mb-5">
        <a href={data.seoURL} className={classNames(`${anchorClass}`, 'o-copy__20bold')} key={data.categoryId}>
          {data.name}
        </a>
        <hr className="my-1" />
        {data.subCategories.map(subcat => (
          <div>
            <a href={subcat.seoURL} className={classNames(`${anchorClass}`, 'o-copy__14reg')}>
              {subcat.name}
            </a>
          </div>
        ))}
      </div>
    ));
  };

  render() {
    const { siteMapData } = this.props;
    return (
      <div className="container mt-3 mt-md-6 mb-1">
        <h4 className="mb-3">{SITE_MAP_TITLE}</h4>
        <div className="row">{siteMapData && siteMapData.siteMapdetails.categorySiteMap && this.renderSiteMap()}</div>
      </div>
    );
  }
}

SiteMap.propTypes = {
  api: PropTypes.object,
  fnLoadSiteMapDetails: PropTypes.func,
  siteMapData: PropTypes.object,
  fnSiteMapLoaded: PropTypes.func
};

const mapStateToProps = state => ({
  siteMapData: state.siteMap
});
const mapDispatchToProps = dispatch => ({
  fnLoadSiteMapDetails: data => dispatch(actions.loadSiteMapDetails(data)),
  fnSiteMapLoaded: data => dispatch(actions.siteMapLoaded(data))
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const SiteMapContainer = compose(
    withReducer,
    withSaga,
    withConnect
  )(SiteMap);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <SiteMapContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(SiteMap);
