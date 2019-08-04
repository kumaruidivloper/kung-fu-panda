import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import reducer from '../header/reducer';
import * as actions from '../header/actions';
import saga from '../header/saga';
import MiniCart from './components/miniCart';
import AnalyticsWrapper from '../analyticsWrapper/analyticsWrapper.component';
import { container, header, iconsWrapper, logoWrapper } from './checkoutHeader.styles';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';

class CheckoutHeader extends React.PureComponent {
  constructor(props) {
      super(props);
      this.handleAnalytics = this.handleAnalytics.bind(this);
    }
  componentDidMount() {
    this.props.fnFetchMiniCart();
  }
  handleAnalytics(e) {
    const targetEventName = e.target.alt ? 'brand logo' : 'mini cart';
    const { analyticsContent } = this.props;
    const pageName = document.location.pathname;
    const analyticsData = {
      event: 'headerLinks',
      eventCategory: 'header',
      eventAction: targetEventName,
      eventLabel: pageName
    };
    analyticsContent(analyticsData);
  }
  render() {
    const { cms, miniCartResp } = this.props;
    return (
      <header data-auid="checkout_header_component" className={`${header}`}>
        <div className={`container ${container}`}>
          <div className={logoWrapper} key="d-0">
            <a data-auid="checkout_header_logo" onClick={this.handleAnalytics} href={cms.checkoutHeaderLogoTargetURL || '/'} aria-label="Academy Sports & Outdoors">
              <img src={cms.checkoutHeaderLogo} alt={cms.checkoutHeaderLogoAltText} />
            </a>
          </div>
          <div className={iconsWrapper} key="d-1" data-auid="checkout_header_miniCart">
            <MiniCart url={cms.cartSeoUrl} miniCartResp={miniCartResp} handleAnalytics={this.handleAnalytics} />
          </div>
        </div>
      </header>
    );
  }
}

CheckoutHeader.propTypes = {
  cms: PropTypes.object.isRequired,
  fnFetchMiniCart: PropTypes.func,
  miniCartResp: PropTypes.object,
  analyticsContent: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  fnFetchMiniCart: () => dispatch(actions.fetchMiniCart())
});
const mapStateToProps = state => ({
  miniCartResp: state.checkoutHeader && state.checkoutHeader.miniCart
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const CheckoutHeaderContainer = compose(
    withReducer,
    withSaga,
    withConnect
  )(CheckoutHeader);
  const CheckoutHeaderWrapper = AnalyticsWrapper(CheckoutHeaderContainer);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <CheckoutHeaderWrapper {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(AnalyticsWrapper(CheckoutHeader));
