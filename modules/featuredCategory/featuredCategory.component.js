import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { get } from '@react-nitro/error-boundary';
import classNames from 'classnames';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import { reducer as form } from 'redux-form';
import reducer from './reducer';
import { enhancedAnalyticsPromoClick } from '../../utils/analytics';
import { isMobile } from '../../utils/navigator';
import PreScreen from '../prescreen';
import Benefit from '../benefitSection';
import ApplyForCard from '../applyForCard';
import saga from './saga';
import injectSaga from '../../utils/injectSaga';
import { preScreenCallRequest } from './actions';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import {
  WrapperDiv,
  Headline,
  MobileHeadline,
  contentText,
  categoryCard,
  categoryTile,
  categoryTileMobile,
  categoryImgContainer,
  imageSize,
  parentContainer,
  getPaddings
} from './featuredCategory.styles';

import injectReducer from '../../utils/injectReducer';

class FeaturedCategory extends React.PureComponent {
  constructor(props) {
    super(props);

    this.categoryBanner = this.categoryBanner.bind(this);
    this.analyticsData = this.analyticsData.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
    this.presScreenApi = this.presScreenApi.bind(this);
  }

  onSubmitHandler(data) {
   console.log(data, 'daii');
  }

  isClientMobile() {
    if (!ExecutionEnvironment.canUseDOM) return true; // returning true to default to mobile view at node
    const mql = window.matchMedia('(max-width: 750px)');
    if (isMobile() && mql.matches) {
      return true;
    }
    return false;
  }

  categoryBanner(category, i) {
    const key = `category-${i}`;
    const bMobile = this.isClientMobile();
    return (
      <div className={classNames('col-6 col-md-3 py-md-half', { [categoryTileMobile]: bMobile, [categoryTile]: !bMobile })} key={key}>
        <a
          href={category.ctaPath}
          data-auid={`HP_FC_Anchor_${i}`}
          className={`${categoryCard} w-100`}
          title={category.categoryTileLabel}
          onClick={e => this.analyticsData(e, category)}
        >
          <div className={`${categoryImgContainer}`}>
            <img src={category.categoryImageUrl} alt={`${category.categoryImageAltText}_image`} className={`${imageSize}`} />
          </div>
          <h6 className={`d-flex px-quarter justify-content-center o-copy__16bold ${contentText}`}>{category.categoryTileLabel.toUpperCase()}</h6>
        </a>
      </div>
    );
  }

  analyticsData(e, category) {
    e.preventDefault();

    const { gtmDataLayer, cms } = this.props;
    if (gtmDataLayer) {
      const categoryTileLabel = category.categoryTileLabel && category.categoryTileLabel.toLowerCase();
      const eventURL = category.ctaPath && category.ctaPath.toLowerCase();
      enhancedAnalyticsPromoClick(gtmDataLayer, cms, eventURL);
      gtmDataLayer.push({
        event: 'featuredCategoryClicks',
        eventCategory: 'featured category clicks',
        eventAction: categoryTileLabel || 'NA',
        eventLabel: eventURL
      });
    }
    if (ExecutionEnvironment.canUseDOM) {
      window.location = `${category.ctaPath}`;
    }
  }

  presScreenApi(data) {
    if (data) {
      this.props.fnPreScreenFeatureCallPart(data);
    }
  }

  render() {
    const { cms } = this.props;
    const { bottomPadding, topPadding } = { cms };
    const componentPaddings = getPaddings(topPadding, bottomPadding);
    console.log(this.props.serverError, 'dadajk');
    return (
      <WrapperDiv
        className={`c-promo-impression-tracking ${componentPaddings} featured-category`}
        backgroundDesktopImage={cms.backgroundDesktopImage}
        data-auid={cms.auid}
        {...cms}
      >
        {!this.isClientMobile() ? (
          <Headline className="mb-3 mt-0" headlineAlignment={cms.headlineAlignment}>
            {cms.headline}
          </Headline>
        ) : (
          <MobileHeadline className="mb-2 mt-0" headlineAlignment={cms.headlineAlignment}>
            {cms.headline}
          </MobileHeadline>
        )}
        <div className={classNames(`${parentContainer}`, 'container')}>
          <div className="d-flex flex-wrap">{cms.category.map(this.categoryBanner)}</div>
        </div>
        <ApplyForCard />
        <Benefit />
        <PreScreen fnPreScreenFeatureCall={this.presScreenApi} errorPart={this.props.serverError} />
      </WrapperDiv>
    );
  }
}

FeaturedCategory.propTypes = {
  cms: PropTypes.object.isRequired,
  gtmDataLayer: PropTypes.array
};

const mapStateToProps = state => ({
  gtmDataLayer: state.gtmDataLayer,
  serverError: get(state, 'featuredCategory.preScreen.errorCode', false)
});

const mapDispatchToProps = dispatch => ({ fnPreScreenFeatureCallPart: data => dispatch(preScreenCallRequest(data)) });

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const formReducer = injectReducer({ key: 'form', reducer: form });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const FeaturedCategoryContainer = compose(
    withReducer,
    formReducer,
    withConnect,
    withSaga
  )(FeaturedCategory);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <FeaturedCategoryContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(FeaturedCategory);
