import { categoriesAPI } from '@academysports/aso-env';
import classNames from 'classnames';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import styled, { css } from 'react-emotion';
import { connect, Provider } from 'react-redux';
import { compose } from 'redux';

import axiosSsr from '../../../axios-ssr';
import media from '../../utils/media';
import QueryStringManager from '../../utils/QueryParamsManager';
import QueryStringUtils from '../productGrid/QueryStringUtils';
import CategoryGridComponent from './categoryGrid';
import { DATA_COMP_ID, NODE_TO_MOUNT, R_AFFCODE, R_CID, R_CM_MMC } from './constants';

// import axios from 'axios';
// The array value having all restricted params
const restrictedQueries = [R_AFFCODE, R_CM_MMC, R_CID];

const getBackgroundStyle = image => css`
  background-image: url('${image.mobile}');
  background-size: cover;
  background-repeat: no-repeat;
  z-index: -1;

  @media (min-width: 992px) {
    background-image: url('${image.desktop}');
  }
`;
const headerStyle = props => css`
  text-align: ${props.headlineAlignment};
  text-transform: uppercase;
  ${media.md`
    font-size:2.625rem;
    line-height: 2.625rem;
  `};
`;

const StyledHeader = styled('h3')`
  ${headerStyle};
`;

class ShopByCategory extends React.PureComponent {
  constructor(props) {
    super(props);
    const { facet } = this.props.pageInfo || {};
    this.state = {
      categoryData: this.props.api ? this.props.api : {},
      hasFacets: !!facet
    };

    this.gridList = this.gridList.bind(this);
    this.analyticsData = this.analyticsData.bind(this);
    this.isCompToHide = this.isCompToHide.bind(this);
  }

  static getInitialProps(params) {
    const { pageInfo, cmsPageInfo } = params;
    const newCategoryId = pageInfo && pageInfo.categoryId ? pageInfo.categoryId : cmsPageInfo && cmsPageInfo.previewId;
    const envBase = params.env.API_HOSTNAME;
    const requestUrl = QueryStringManager.getUrlWithRestrictedParams({
      queries: restrictedQueries,
      data: pageInfo,
      url: `${envBase}${categoriesAPI}${newCategoryId}`
    });
    return axiosSsr.get(requestUrl, {
      params: {
        correlationId: params.correlationId,
        trueClientIp: params.trueClientIp,
        userAgent: params.userAgent
      }
    });
  }

  /**
   * Function to check if the URL has restricted query string
   *
   * @returns {Boolean} true or false based on the data found in qs
   * @memberof ProductGrid
   */
  hasRestrictedQS() {
    let found = false;
    restrictedQueries.forEach(key => {
      const val = QueryStringUtils.getParameter(key);
      if (val !== '') {
        found = true;
      }
    });
    return found;
  }

  gridList() {
    const { categoryData } = this.state;
    const category = categoryData && categoryData.categories[0];
    const subCategories = category && category.subCategories;
    if (subCategories && subCategories.length > 0) {
      return this.state.categoryData.categories[0].subCategories.map((categories, index) => (
        <CategoryGridComponent
          key={categories.uniqueID}
          uniqueID={categories.uniqueID}
          href={categories.seoURL}
          LinkTitle={categories.name}
          src={categories.thumbnail}
          auid={index}
          onClick={e => this.analyticsData(e, categories)}
        >
          {categories.name}
        </CategoryGridComponent>
      ));
    }
    return (
      <div className="p-5 ">
        <p>No Categories here!..</p>
      </div>
    );
  }

  analyticsData(e, category) {
    e.preventDefault();
    if (ExecutionEnvironment.canUseDOM) {
      this.props.gtmDataLayer.push({
        event: 'shopbyCategory',
        eventCategory: 'shop by category clicks',
        eventAction: `category - ${category.name && category.name.toLowerCase()}`,
        eventLabel: `${category.seoURL}`
      });
      window.location.href = `${category.seoURL}`;
    }
  }
  isCompToHide() {
    const { categoryData } = this.state;
    const categories = categoryData && categoryData.categories[0];
    const subCategories = categories && categories.subCategories;
    if (this.hasRestrictedQS() && subCategories.length <= 0) {
      return true;
    }
    return false;
  }
  render() {
    const { cms } = this.props;
    const headingTitle = cms.headlineCopy && cms.headlineCopy.split(' ');
    const { categoryData } = this.state;
    if (this.isCompToHide() || this.state.hasFacets) {
      return null;
    }
    return (
      <div
        data-auid="shopbycategorysection"
        className={classNames(
          getBackgroundStyle({
            desktop: cms.backgroundDesktopImage,
            mobile: cms.backgroundMobileImage
          }),
          ''
        )}
      >
        <section className="container">
          <div className="row">
            <StyledHeader data-auid="shopByCategory_title" headlineAlignment={cms.headlineAlignment} className="col-12 mt-0 mb-2 mb-md-3">
              <span id="shopByCategoryId">{headingTitle && headingTitle[0]} </span>
              <span id="shopByCategoryIdChild">
                {headingTitle && headingTitle[1]} {headingTitle && headingTitle[2]}
              </span>
            </StyledHeader>
          </div>
          {categoryData.categories && (
            <div data-auid="shopByCategory_tiles" className="row pb-1 pb-md-4">
              {this.gridList()}
            </div>
          )}
        </section>
      </div>
    );
  }
}

ShopByCategory.propTypes = {
  cms: PropTypes.object,
  api: PropTypes.object,
  pageInfo: PropTypes.object,
  gtmDataLayer: PropTypes.array
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer
});
const withConnect = connect(
  mapStateToProps,
  null
);
if (ExecutionEnvironment.canUseDOM) {
  const ShopByCategoryContainer = compose(withConnect)(ShopByCategory);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <ShopByCategoryContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(ShopByCategory);
