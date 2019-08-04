import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Provider, connect } from 'react-redux';
import Button from '@academysports/fusion-components/dist/Button';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import { emptyCart, btn, continueShopping, arrowIcon } from './style';
import { showSigninModal } from '../loginModal/actions';
import Storage from '../../utils/StorageManager';

class EmptyCart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      size: 'M'
    };
    this.updateButtonSize = this.updateButtonSize.bind(this);
    this.redirectToHome = this.redirectToHome.bind(this);
  }

  componentDidMount() {
    this.emptyCart.addEventListener('resize', this.updateButtonSize);
    this.updateButtonSize();
    const { analyticsContent } = this.props;
    const analyticsData = {
      ecommerce: {
        checkout: {
          actionField: {
            step: 1,
            option: 'view cart'
          }
        }
      }
    };
    analyticsContent(analyticsData);
  }

  componentWillUnmount() {
    this.emptyCart.removeEventListener('resize', this.updateButtonSize);
  }

  onClickSignin() {
    this.props.fnTriggerSignIn();
  }

  redirectToHome() {
    if (ExecutionEnvironment.canUseDOM) {
      window.location.href = '/';
    }
  }

  updateButtonSize() {
    if (window.innerWidth <= 576) {
      this.setState({ size: 'S' });
    } else {
      this.setState({ size: 'M' });
    }
  }

  render() {
    const { cms } = this.props;
    return (
      <div
        data-auid="crt_empty_cart_component"
        ref={elem => {
          this.emptyCart = elem;
        }}
        className={`mt-2 px-1 px-md-0 mt-md-4 ${emptyCart}`}
      >
        <a data-auid="cart_continue_shopping_link" href="\" className={`o-copy__14reg mb-2 mb-md-3 ${continueShopping} cntShoping`}>
          <i className={`academyicon icon-chevron-left mr-half ${arrowIcon}`} />
          <span>{cms.commonLabels.continueShoppingLabel}</span>
        </a>
        <div className="col-12 col-lg-9 px-0">
          <h4 className="mb-2">{cms.emptyCartHeading}</h4>
          <div className="o-copy__16reg mb-2 subHeading">{cms.emptyCartSubHeading}</div>
        </div>
        <div className="row">
          <div className="col-md-5 col-lg-4 col-xl-3 order-sm-1">
            <Button auid="crt_btnCntinueShop" size={this.state.size} className={`${btn} cntShoping mb-1 px-lg-2`} onClick={this.redirectToHome}>
              {cms.commonLabels.continueShoppingLabel}
            </Button>
          </div>
          {(!Storage.getCookie('USERTYPE') || Storage.getCookie('USERTYPE') !== 'R') && (
            <div className="col-md-5 col-lg-4 col-xl-3">
              <Button
                auid="crt_btnSignIn"
                size={this.state.size}
                btntype="secondary"
                className={classNames('mb-1 mb-md-0 signIn', btn)}
                onClick={() => this.onClickSignin()}
              >
                {cms.commonLabels.signInLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

EmptyCart.propTypes = {
  cms: PropTypes.object.isRequired,
  fnTriggerSignIn: PropTypes.func,
  analyticsContent: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  fnTriggerSignIn: data => dispatch(showSigninModal(data))
});

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <EmptyCart {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default connect(
  null,
  mapDispatchToProps
)(EmptyCart);
