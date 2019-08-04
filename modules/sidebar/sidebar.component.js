import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Responsive from 'react-responsive';
import AccountInfo from './accountInfo';

import { desktopLinkStyle, myAccountCard, rightArrow, mobileLinkStyle } from './style';
import { NODE_TO_MOUNT, DATA_COMP_ID, MOBILE_MAX_WIDTH, DESKTOP_MIN_WIDTH } from './constants';

class Sidebar extends React.PureComponent {
  render() {
    const { cms } = this.props;
    if (this.props.condition === 'header') {
      return (
        <div>
          <AccountInfo
            cssClass="mh-62 d-flex align-items-center padding-18 flex-wrap"
            label={cms.signInLabel}
            url={cms.signInLink}
            myAccDropDown={cms.myAccDropDown}
          />
        </div>
      );
    }
    const SidebarKeys = [
      { key: 'order', label: 'ordersLabel' },
      { key: 'profile', label: 'profileLabel' },
      { key: 'addressBook', label: 'addressBookLabel' },
      { key: 'wishlist', label: 'wishlistLabel' },
      { key: 'payment', label: 'paymentsLabel' }
    ];
    return (
      <div className="col-12 pr-0">
        <Responsive maxWidth={MOBILE_MAX_WIDTH}>
          <React.Fragment>
            {SidebarKeys.map((option, index) => (
              <div className={classNames(myAccountCard, mobileLinkStyle)}>
                {option && (
                  <NavLink to={`/myaccount/${option.key === 'order' ? 'orders' : option.key}`} activeClassName="navActive">
                    {index === 0 ? (
                      <React.Fragment>
                        <div className={classNames('d-flex flex-row', 'justify-content-between')}>
                          <div className={classNames('.o-copy__16reg', 'py-1', 'pl-1')}>{cms[option.key][option.label]} </div>
                          <div className={classNames('academyicon icon-chevron-right', 'pt-1', rightArrow)} />
                        </div>
                      </React.Fragment>
                    ) : (
                      <div className={classNames('d-flex flex-row', 'justify-content-between')}>
                        <div className={classNames('.o-copy__16reg', 'py-1', 'pl-1')}>{cms[option.key][option.label]} </div>
                        <div className={classNames('academyicon icon-chevron-right', 'pt-1', rightArrow)} />
                      </div>
                    )}

                    {/* {index === 0 && <div className={classNames('pb-1', 'pl-1', activeOrder)}> abc </div>} */}
                  </NavLink>
                )}
              </div>
            ))}
          </React.Fragment>
        </Responsive>
        <Responsive minWidth={DESKTOP_MIN_WIDTH}>
          {SidebarKeys.map(option => (
            <div className={classNames('.o-copy__16reg', 'mb-1', desktopLinkStyle)}>
              {option && (
                <NavLink
                  className="py-half pl-1 d-block"
                  to={`/myaccount/${option.key === 'order' ? 'orders' : option.key}`}
                  activeClassName="navActive"
                >
                  {cms[option.key][option.label]}
                </NavLink>
              )}
            </div>
          ))}
        </Responsive>
      </div>
    );
  }
}
Sidebar.propTypes = {
  cms: PropTypes.object.isRequired,
  condition: PropTypes.string
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<Sidebar {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default withRouter(Sidebar);
