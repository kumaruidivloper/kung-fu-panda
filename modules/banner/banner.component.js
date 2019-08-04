import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { withErrorBoundary } from '@react-nitro/error-boundary';
import { NODE_TO_MOUNT, DATA_COMP_ID, BANNER_TYPE_PAGE, BANNER_TYPE_SITE } from './constants';
import SiteBanner from './siteBanner/siteBanner';
import PageBanner from './pageBanner/pageBanner';
import HigherOrder from '../higherOrder/higherOrder.component';

class Banner extends React.PureComponent {
  render() {
    /* istanbul ignore next */
    const {
      cms: { bannerType }
    } = this.props;
    /* istanbul ignore else if */
    if (bannerType === BANNER_TYPE_SITE) {
      return (
        <div className="animate-opacity">
          <SiteBanner {...this.props} />
        </div>
      );
    } else if (bannerType === BANNER_TYPE_PAGE) {
      return <PageBanner {...this.props} />;
    }
    /* istanbul ignore next */
    return <div />;
  }
}

Banner.propTypes = {
  cms: PropTypes.object.isRequired
};

// const BannerWrapped = withErrorBoundary(Banner, null, 'Banner');
const BannerWrapped = withErrorBoundary(HigherOrder(Banner), null, 'Banner');

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <BannerWrapped {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default BannerWrapped;
