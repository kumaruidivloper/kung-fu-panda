import { breadCrumbAPI } from '@academysports/aso-env';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'react-emotion';
import { connect, Provider } from 'react-redux';
import { compose } from 'redux';

import axiosSsr from '../../../axios-ssr';
import injectReducer from '../../utils/injectReducer';
import media from '../../utils/media';
import { BREADCRUMB_SRC_AEM, DATA_COMP_ID, NODE_TO_MOUNT } from './constants';
import reducer from './reducer';

const BreadCrumbWrapper = styled.span(css`
  width: 61px;
  height: 18px;
  .line-separator {
    padding: 0 5px 0 5px;
    color: inherit;
  }
`);
const BackIcon = styled.span(css`
  font-size: 0.8em;
  color: #0055a6;
  padding-right: 0.6em;
`);
const BreadCrumbStyle = styled.div(css`
  margin: 24px 0 12px;
  ${media.sm`
    margin: 17px 0 3px;
  `};
`);

const BreadCrumbResponsive = styled.div(css`
  margin-top: 1em;
  color: #585858;
`);

const AnchorStyle = styled.a(css`
  text-decoration: none;
  color: #333333;
`);
class BreadCrumb extends React.Component {
  constructor(props) {
    super(props);

    const { breadCrumb } = this.getBreadCrumb();

    let previous = null;
    let bLength = 0;
    if (breadCrumb) {
      bLength = breadCrumb.length;
      previous = breadCrumb[bLength - 1];
    }

    this.state = {
      previousLink: previous,
      previousIndex: bLength - 2,
      breadCrumb
    };
    this.getPreviousLink = this.getPreviousLink.bind(this);
    this.analyticData = this.analyticData.bind(this);
    this.findAndReplace = this.findAndReplace.bind(this);
  }

  static getInitialProps(params) {
    const { pageInfo, cmsPageInfo } = params;
    const categoryId = pageInfo && pageInfo.categoryId ? pageInfo.categoryId : cmsPageInfo && cmsPageInfo.previewId;
    const envBase = params.env.API_HOSTNAME;
    const isSearch = pageInfo && pageInfo.isSearch;
    const breadCrumbAPIUrl = `${envBase}${breadCrumbAPI}${categoryId}`;
    if (isSearch) {
      // pass searchterm
      return new Promise(resolve => {
        resolve({
          data: [
            {
              type: 'FACET_ENTRY_CATEGORY',
              label: pageInfo.searchTerm
            }
          ]
        });
      });
    }
    return axiosSsr.get(breadCrumbAPIUrl, {
      params: {
        correlationId: params.correlationId,
        trueClientIp: params.trueClientIp,
        userAgent: params.userAgent
      }
    });
  }

  /**
   * Returns breadCrumb list
   */
  getBreadCrumb() {
    const { api, breadList, breadCrumbs, isCSR, cms } = this.props;
    let breadCrumb = [];
    let name = '';
    if (api && api.length) {
      breadCrumb = api.map(a => ({ ...a }));
      const [lastItem] = breadCrumb.splice(breadCrumb.length - 1, 1);
      name = decodeURIComponent(lastItem.label);
    } else if (breadList && Object.keys(breadList).length && breadList.constructor === Object) {
      ({ breadCrumb, name } = breadList);
    }

    if (isCSR && breadCrumbs && Object.keys(breadCrumbs).length && breadCrumbs.constructor === Object) {
      ({ breadCrumb, name } = breadCrumbs);
    }
    // if breadcrumb is authored for static pages
    if (cms && cms.breadCrumbSource === BREADCRUMB_SRC_AEM) {
      breadCrumb = (cms.breadCrumbs || []).map(a => ({ ...a }));
      const [lastItem] = breadCrumb.splice(breadCrumb.length - 1, 1);
      name = lastItem ? lastItem.label : '';
    }

    breadCrumb = this.addBreadCrumbRoot(breadCrumb, name);
    return { breadCrumb, name };
  }
  /**
   * Returns previous menu item for mobile device breadCrumb
   */
  getPreviousLink() {
    const { previousIndex, previousLink } = this.state;
    const index = previousIndex - 1;
    const currentIndex = previousIndex + 1;
    const { breadCrumb } = this.state;
    this.analyticData(breadCrumb[currentIndex]);
    if (index >= 0) {
      this.setState({ previousLink: breadCrumb[index], previousIndex: index });
    }
    if (ExecutionEnvironment.canUseDOM) {
      window.location = previousLink.seoURL;
    }
  }
  /**
   * Returns AUid
   */
  getAuid() {
    const { pageInfo = {} } = this.props;
    return pageInfo.page || 'BreadCrumb_Academy';
  }
  /**
   * Updates the GA analytics
   * @param {object} clicked - Clicked breadcrumb item
   */
  analyticData(clicked) {
    const { breadCrumb } = this.state;
    const { breadList } = this.props;
    let breadCrumbLabel = breadCrumb.length && breadCrumb.map(list => list.label);
    if (!breadCrumbLabel && Object.keys(breadList).length && breadList.constructor === Object) {
      breadCrumbLabel = breadList.map(list => list.label);
    }
    const breadCrumbListItems = breadCrumbLabel && breadCrumbLabel.length > 0 ? breadCrumbLabel.join('_') : '';
    this.props.gtmDataLayer.push({
      event: 'breadcrumbClicks',
      eventCategory: 'navigation',
      eventAction: `br_${breadCrumbListItems && breadCrumbListItems.toLowerCase()}`,
      eventLabel: ExecutionEnvironment.canUseDOM ? this.findAndReplace(decodeURIComponent(window.location.pathname)) : '',
      navIdentifier: clicked.label && clicked.label.toLowerCase(),
      navPlacement: 'top navigation'
    });
  }
  /**
   *
   *replacing special Characters from string
   * @param {String} str
   * @returns {String} str without special Characters
   * @memberof BreadCrumb
   */
  findAndReplace(str) {
    const lettersToReplace = ["'", '"', '™', '®'];
    let string = str ? str.toLowerCase() : '';
    if (string) {
      for (let i = 0; i <= lettersToReplace.length; i += 1) {
        string = string.replace(lettersToReplace[i], '');
      }
    }
    return string;
  }
  updateState(breadCrumb) {
    const previous = breadCrumb[breadCrumb.length - 2];
    this.setState({
      breadCrumb,
      previousLink: previous,
      previousIndex: breadCrumb.length - 1
    });
  }

  /**
   * Adds academy site root to breadCrumb
   * @param {array} breadCrumb - BreadCrumb list
   * @param {string} name - Current page title
   */
  addBreadCrumbRoot(breadCrumb, name) {
    const isPresent = breadCrumb && breadCrumb.find(item => item.label === 'Academy');
    if (breadCrumb && !isPresent && name && name.trim()) {
      const base = { label: 'Academy', seoURL: '/' };
      breadCrumb.unshift(base);
    }
    return breadCrumb;
  }

  /**
   * Renders breadCrumb for desktop
   * @param {array} breadCrumb - BreadCrumb list
   * @param {object} list - BreadCrumb object
   * @param {string} name - Current page title
   * @param {Number} index - Current index
   */
  desktopBreadCrumb(breadCrumb, list, name, index) {
    const auid = `breadCrumb_link_${index}_${(list.label || ' ').split(' ')[0]}`;
    return (
      <React.Fragment key={list.seoURL}>
        <BreadCrumbWrapper itemprop="itemListElement" itemscope="" itemtype="http://schema.org/ListItem" key={list.label} className="o-copy__14reg">
          {list.seoURL !== '' && (
            <span>
              <AnchorStyle
                itemtype="http://schema.org/Thing"
                itemprop="item"
                href={list.seoURL}
                onClick={() => this.analyticData(list)}
                data-auid={auid}
              >
                <span itemProp="name">{list.label}</span>
              </AnchorStyle>
              <meta itemProp="position" content={index + 1} />
              <span className="line-separator"> / </span>
            </span>
          )}
        </BreadCrumbWrapper>
        {breadCrumb.length - 1 === index ? this.renderLastChild(list, name) : null}
      </React.Fragment>
    );
  }

  /**
   * Renders breadCrumb
   * @param {array} breadCrumb - BreadCrumb list
   * @param {object} previousLink - Previous page
   * @param {string} name - Current page title
   */
  renderBreadCrumb(breadCrumb, previousLink, name) {
    const breadCrumbList = breadCrumb.map((list, index) => this.desktopBreadCrumb(breadCrumb, list, name, index));
    return (
      <React.Fragment>
        {breadCrumb.length &&
          name.trim() && (
            <div className="d-none d-md-flex">
              <BreadCrumbStyle itemscope="" itemtype="http://schema.org/BreadcrumbList">
                {breadCrumbList}
              </BreadCrumbStyle>
            </div>
          )}
        {previousLink && (
          <div className="d-flex d-md-none">
            <BreadCrumbResponsive>
              <AnchorStyle href={previousLink.seoURL} onClick={this.getPreviousLink} data-auid="breadcrumb_m">
                <BackIcon className="academyicon icon-chevron-left" data-auid="breadCrumb_backIcon" />
                {previousLink.label}
              </AnchorStyle>
            </BreadCrumbResponsive>
          </div>
        )}
      </React.Fragment>
    );
  }

  /**
   * Renders last child
   * @param {object} list - BreadCrumb object
   * @param {string} name - Current page title
   * @param {Number} index - Current index
   */
  renderLastChild(list, name) {
    return (
      <BreadCrumbWrapper key={list.label} className="o-copy__14reg">
        <span>
          <span>{name}</span>
        </span>
      </BreadCrumbWrapper>
    );
  }

  render() {
    const { breadCrumb, name } = this.getBreadCrumb();
    const { previousLink } = this.state;
    if (!breadCrumb || breadCrumb.length < 1) {
      return null;
    }

    const containerClassName = this.props.disableContainer ? '' : 'container';
    return (
      <div
        className={`${containerClassName} breadCrumbComponent`}
        aria-label="breadcrumb navigation region"
        area-role="breadcrumb"
        data-auid={this.getAuid()}
      >
        {this.renderBreadCrumb(breadCrumb, previousLink, name)}
      </div>
    );
  }
}

BreadCrumb.propTypes = {
  api: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  breadList: PropTypes.object,
  breadCrumbs: PropTypes.object,
  isCSR: PropTypes.bool,
  disableContainer: PropTypes.bool,
  pageInfo: PropTypes.object,
  cms: PropTypes.object
};

const mapStateToProps = state => ({
  breadList: state.breadCrumb,
  gtmDataLayer: state.gtmDataLayer
});
const withConnect = connect(
  mapStateToProps,
  null
);
if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const BreadCrumbContainer = compose(
    withReducer,
    withConnect
  )(BreadCrumb);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <BreadCrumbContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(BreadCrumb);
