import { signOut } from '@academysports/aso-env';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';

import StorageManager from '../../../utils/StorageManager';
import { isLoggedIn } from '../../../utils/UserSession';
import { CREATEPASS, CONFIRMATION_PAGE } from '../constants';
import { accountlist, menuActive } from '../header.styles';
import { updateAnalytics } from '../helpers';
import { scrollIntoView } from '../../../utils/scroll';

import { getSelectedStoreFromCookies, setSelectedStoreCookies, deleteSelectedStoreCookies } from '../../../utils/cookies/SelectedStore';

class AccountInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasMyAccount: false,
      showAccountPopOver: false
    };
    this.toggleAccountList = this.toggleAccountList.bind(this);
    this.checkLoggedIn = this.checkLoggedIn.bind(this);
    this.setWrapperRef = React.createRef();
    this.myAccountToggleRef = React.createRef();
    this.manageActiveListeners = this.manageActiveListeners.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillMount() {
    /* ******* Check the UserType Cookie to show SignIn Cta or My Account CTA ******* */
    if (isLoggedIn()) {
      this.setState({ hasMyAccount: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { showAccountPopOver: prevShowAccountPopOver } = prevState;
    const { showAccountPopOver } = this.state;
    if (showAccountPopOver && !prevShowAccountPopOver) {
      this.scrollPageToTop();
    }
  }

  /**
   * Method for removing mousedown listener when component unmounts.
   */
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  scrollPageToTop() {
    const { containerRef } = this.props;
    const { current: containerEl } = containerRef || {};
    scrollIntoView(this.myAccountToggleRef.current, { duration: 150, offset: 0 }, containerEl);
  }

  /* ******* Toggle Account List PopOver ******* */
  toggleAccountList(e) {
    e.preventDefault();
    this.setState({ showAccountPopOver: !this.state.showAccountPopOver });
  }
  /**
   * function for checking the cookie for registered or a guest user, and show popup or redirect to sign in
   * @param {object} e event object
   */
  checkLoggedIn(e) {
    e.preventDefault();
    const { gtmDataLayer, label, breadList, url } = this.props;
    if (isLoggedIn()) {
      this.setState({ hasMyAccount: true, showAccountPopOver: true });
    } else {
      updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', `${label}`, breadList, url);
    }
  }
  isSelected(url) {
    return window.location.pathname === url ? menuActive : '';
  }
  /**
   * On click of the links on myaccount Popover
   * Desktop: Close the my account dropdown before calling analytics and navigating away
   * Mobile: Close the hamburger before calling analytics and navigating away
   */
  closeMyAccountDropdown(event, label, link) {
    const { fnToggleHamburger, isMobile, gtmDataLayer, breadList } = this.props;
    if (isMobile) {
      fnToggleHamburger(false);
    } else {
      this.toggleAccountList(event);
    }
    updateAnalytics(event, gtmDataLayer, 'headerLinks', 'header', `${label}`, breadList, link);
  }
  /**
   * @param {object} event to be passed - handles clicks outside the dropdown and resets the state to close the dropdown.
   */
  handleClickOutside(event) {
    if (this.setWrapperRef.current && !this.setWrapperRef.current.contains(event.target) && !this.myAccountToggleRef.current.contains(event.target)) {
      this.setState({ showAccountPopOver: false });
    }
  }

  /* adds and removes keyboard listeners on dropdown collapse. */
  manageActiveListeners() {
    if (ExecutionEnvironment.canUseDOM) {
      if (this.state.showAccountPopOver) {
        document.addEventListener('mousedown', this.handleClickOutside);
      } else {
        document.removeEventListener('mousedown', this.handleClickOutside);
      }
    }
  }

  /**
   * Signout click handler
   */
  signOutClickHandler = e => {
    e.preventDefault();
    const { gtmDataLayer, myAccDropDown, breadList, toggleLoader } = this.props;

    // report to anlytics
    updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', myAccDropDown.signOutLabel, breadList, '#');

    // Prevent user from signing out if the user has to create password
    const passwordExpired = StorageManager.getCookie('PASSWORD_EXPIRED_FLAG');
    if (passwordExpired) {
      this.closeMyAccountDropdown(e, myAccDropDown.signOutLabel, myAccDropDown.signOutLink);
      window.location.href = '/shop/createpassword';
    } else {
      toggleLoader(true);
      axios.post(signOut).then(response => {
        if (response.data && response.data.identity && response.data.identity.passwordExpiredFlag) {
          window.location.href = CREATEPASS;
        } else {
          StorageManager.removeSessionStorage('userId');
          StorageManager.removeSessionStorage('storeId');
          StorageManager.removeSessionStorage('cartUserChangedZip');
          if (!ExecutionEnvironment.canUseDOM) {
            return;
          }
          const urlmatch = window.location.href.indexOf(CONFIRMATION_PAGE) > -1;
          if (!urlmatch) {
            window.location.reload();
          } else {
            window.location.href = '/';
          }
        }
      });
      try {
        const userInfo = getSelectedStoreFromCookies();
        delete userInfo.userId;
        setSelectedStoreCookies(userInfo);
      } catch (err) {
        deleteSelectedStoreCookies();
      }
    }
  };
  /* ******* Display Account List PopOver ******* */
  renderAccountInfoList() {
    const { myAccDropDown, isMobile, cssClass } = this.props;
    const mobileAuid = isMobile ? '_m' : '';
    const defaultHref = '#';
    const myaccountLinks = {
      profile: '/myaccount/profile',
      wishlist: '/myaccount/wishlist',
      addressBook: '/myaccount/addressBook',
      payment: '/myaccount/payment',
      orders: '/myaccount/orders'
    };
    return (
      <ul className={isMobile ? 'mobile-popover w-100 d-block px-0' : 'myAccLinks'} ref={this.setWrapperRef}>
        <li key="my_account_orders_lbl" className={`${accountlist} ${!isMobile ? 'p-half' : 'pt-half'} ${this.isSelected(myaccountLinks.orders)}`}>
          <a
            className={`o-copy__12reg ${cssClass}`}
            href="/myaccount/orders"
            aria-label={myAccDropDown.orderLabel}
            data-auid={`${myAccDropDown.orderLabel}${mobileAuid}`}
            onClick={e => this.closeMyAccountDropdown(e, myAccDropDown.orderLabel, myaccountLinks.orders)}
          >
            {myAccDropDown.orderLabel}
          </a>
        </li>
        <li key="my_account_summary_lbl" className={`${accountlist} ${!isMobile ? 'p-half' : 'pt-half'} ${this.isSelected(myaccountLinks.profile)}`}>
          <a
            className={`o-copy__12reg ${cssClass}`}
            href="/myaccount/profile"
            aria-label={myAccDropDown.profileLabel}
            data-auid={`${myAccDropDown.profileLabel}${mobileAuid}`}
            onClick={e => this.closeMyAccountDropdown(e, myAccDropDown.profileLabel, myaccountLinks.profile)}
          >
            {myAccDropDown.profileLabel}
          </a>
        </li>
        <li
          key="my_account_addressbook_lbl"
          className={`${accountlist} ${!isMobile ? 'p-half' : 'pt-half'} ${this.isSelected(myaccountLinks.addressBook)}`}
        >
          <a
            className={`o-copy__12reg ${cssClass}`}
            href="/myaccount/addressBook"
            aria-label={myAccDropDown.addressLabel}
            data-auid={`${myAccDropDown.addressLabel}${mobileAuid}`}
            onClick={e => this.closeMyAccountDropdown(e, myAccDropDown.addressLabel, myaccountLinks.addressBook)}
          >
            {myAccDropDown.addressLabel}
          </a>
        </li>
        <li
          key="my_account_wishlist_lbl"
          className={`${accountlist} ${!isMobile ? 'p-half' : 'pt-half'} ${this.isSelected(myaccountLinks.wishlist)}`}
        >
          <a
            className={`o-copy__12reg ${cssClass}`}
            href="/myaccount/wishlist"
            aria-label={myAccDropDown.wishListLabel}
            data-auid={`${myAccDropDown.wishListLabel}${mobileAuid}`}
            onClick={e => this.closeMyAccountDropdown(e, myAccDropDown.wishListLabel, myaccountLinks.wishlist)}
          >
            {myAccDropDown.wishListLabel}
          </a>
        </li>
        <li key="my_account_payment_lbl" className={`${accountlist} ${!isMobile ? 'p-half' : 'pt-half'} ${this.isSelected(myaccountLinks.payment)}`}>
          <a
            className={`o-copy__12reg ${cssClass}`}
            href="/myaccount/payment"
            aria-label={myAccDropDown.paymentLabel}
            data-auid={`${myAccDropDown.paymentLabel}${mobileAuid}`}
            onClick={e => this.closeMyAccountDropdown(e, myAccDropDown.paymentLabel, myaccountLinks.payment)}
          >
            {myAccDropDown.paymentLabel}
          </a>
        </li>
        <li key="my_account_signOut_lbl" className={`${accountlist} ${!isMobile ? 'p-half' : 'pt-half'}`}>
          <a
            data-auid={`${myAccDropDown.signOutLabel}${mobileAuid}`}
            className={`o-copy__12reg ${cssClass}`}
            href={defaultHref}
            aria-label={myAccDropDown.signOutLabel}
            onClick={this.signOutClickHandler}
          >
            {myAccDropDown.signOutLabel}
          </a>
        </li>
      </ul>
    );
  }
  render() {
    const { label, url, isMobile, cssClass } = this.props;
    const defaultHref = '#';
    const { hasMyAccount, showAccountPopOver } = this.state;
    const mobileAuid = isMobile ? '_m' : '';
    this.manageActiveListeners();
    return (
      <Fragment>
        {!hasMyAccount && (
          <a
            onClick={e => this.checkLoggedIn(e)}
            className={`o-copy__12reg ${cssClass}`}
            data-auid={`signInCta${mobileAuid}`}
            href={url}
            aria-label={label}
          >
            {label}
          </a>
        )}
        {hasMyAccount && (
          <Fragment>
            <a
              onClick={this.toggleAccountList}
              data-auid={`myAccountCta${mobileAuid}`}
              className={`o-copy__12reg ${isMobile ? 'd-block w-100 py-1' : ''} ${cssClass}`}
              href={defaultHref}
              aria-label="My Account"
              ref={this.myAccountToggleRef}
            >
              {label}
            </a>
            {showAccountPopOver && (
              <div className="account-popover">
                <span className="arrow" />
                {this.renderAccountInfoList()}
              </div>
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
}
AccountInfo.propTypes = {
  label: PropTypes.string,
  url: PropTypes.string,
  myAccDropDown: PropTypes.object,
  isMobile: PropTypes.bool,
  gtmDataLayer: PropTypes.array,
  breadList: PropTypes.string,
  cssClass: PropTypes.string,
  fnToggleHamburger: PropTypes.func,
  containerRef: PropTypes.any,
  toggleLoader: PropTypes.func
};

export default AccountInfo;
