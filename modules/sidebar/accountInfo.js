import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { accountPopover, arrow } from './style';
// import { updateAnalytics } from '../../modules/header/helpers';
// import { isLoggedIn } from '../../utils/UserSession';

class AccountInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasMyAccount: true,
      showAccountPopOver: false
    };
  }
  componentWillMount() {
    /* ******* Check the UserType Cookie to show SignIn Cta or My Account CTA ******* */
    // if (isLoggedIn()) {
    //   this.setState({ hasMyAccount: true });
    // }
  }
  /* ******* Toggle Account List PopOver ******* */
  toggleAccountList(e) {
    console.log('here', e);
    this.setState({ showAccountPopOver: !this.state.showAccountPopOver });
  }
  /* ******* Display Account List PopOver ******* */
  renderAccountInfoList() {
    const { myAccDropDown, isMobile, cssClass } = this.props;
    // const mobileAuid = isMobile ? '_m' : '';
    return (
      <ul className={isMobile ? 'mobile-popover w-100 d-block px-0' : ''}>
        <li key="my_account_summary_lbl">
          <a
            className="o-copy__12reg"
            href={myAccDropDown.wishListLink}
            // aria-label={myAccDropDown.accSummaryLabel}
            // data-auid={`${myAccDropDown.accSummaryLabel}${mobileAuid}`}
            // onClick={e =>
            //   updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', `${myAccDropDown.accSummaryLabel}`, breadList, myAccDropDown.accSummaryLink)
            // }
          >
            {myAccDropDown.wishListLabel}
          </a>
        </li>
        <li key="my_account_wishlist_lbl" className="pt-half">
          <a
            className={`o-copy__12reg ${cssClass}`}
            href={myAccDropDown.profileLink}
            // aria-label={myAccDropDown.wishListLabel}
            // data-auid={`${myAccDropDown.wishListLabel}${mobileAuid}`}
            // onClick={e =>
            //   updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', `${myAccDropDown.wishListLabel}`, breadList, myAccDropDown.wishListLink)
            // }
          >
            {myAccDropDown.profileLabel}
          </a>
        </li>
        <li key="my_account_wishlist_lbl" className="pt-half">
          <a
            className={`o-copy__12reg ${cssClass}`}
            href={myAccDropDown.paymentLink}
            // aria-label={myAccDropDown.wishListLabel}
            // data-auid={`${myAccDropDown.wishListLabel}${mobileAuid}`}
            // onClick={e =>
            //   updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', `${myAccDropDown.wishListLabel}`, breadList, myAccDropDown.wishListLink)
            // }
          >
            {myAccDropDown.paymentLabel}
          </a>
        </li>
        <li key="my_account_wishlist_lbl" className="pt-half">
          <a
            className={`o-copy__12reg ${cssClass}`}
            href={myAccDropDown.orderLink}
            // aria-label={myAccDropDown.wishListLabel}
            // data-auid={`${myAccDropDown.wishListLabel}${mobileAuid}`}
            // onClick={e =>
            //   updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', `${myAccDropDown.wishListLabel}`, breadList, myAccDropDown.wishListLink)
            // }
          >
            {myAccDropDown.orderLabel}
          </a>
        </li>
        <li key="my_account_wishlist_lbl" className="pt-half">
          <a
            className={`o-copy__12reg ${cssClass}`}
            href={myAccDropDown.addressLink}
            // aria-label={myAccDropDown.wishListLabel}
            // data-auid={`${myAccDropDown.wishListLabel}${mobileAuid}`}
            // onClick={e =>
            //   updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', `${myAccDropDown.wishListLabel}`, breadList, myAccDropDown.wishListLink)
            // }
          >
            {myAccDropDown.addressLabel}
          </a>
        </li>
        <li key="my_account_signOut_lbl" className="pt-half">
          <a
            // data-auid={`${myAccDropDown.signOutLabel}${mobileAuid}`}
            className={`o-copy__12reg ${cssClass}`}
            href={myAccDropDown.signOutLink}
            // aria-label={myAccDropDown.signOutLabel}
            // onClick={e =>
            //   updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', `${myAccDropDown.signOutLabel}`, breadList, myAccDropDown.signOutLink)
            // }
          >
            {myAccDropDown.signOutLabel}
          </a>
        </li>
      </ul>
    );
  }
  render() {
    const { label, url, isMobile } = this.props;
    const defaultHref = '#';
    const { hasMyAccount, showAccountPopOver } = this.state;
    const mobileAuid = isMobile ? '_m' : '';
    return (
      <Fragment>
        {!hasMyAccount && (
          <a
            // onClick={e => updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', `${label}`, breadList, url)}
            className="o-copy__12reg"
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
              onClick={e => this.toggleAccountList(e)}
              data-auid={`myAccountCta${mobileAuid}`}
              className={`o-copy__12reg ${isMobile ? 'd-block w-100 py-1' : ''}`}
              href={defaultHref}
              aria-label="My Account"
            >
              My Account
            </a>
            {showAccountPopOver && (
              <div className={`${accountPopover} ${!isMobile ? 'p-1' : ''}`}>
                <span className={`${arrow}`} />
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
  // gtmDataLayer: PropTypes.array
  // breadList: PropTypes.object,
  cssClass: PropTypes.string
};

export default AccountInfo;
