import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { cx } from 'react-emotion';
import { get } from '@react-nitro/error-boundary';
import { findStoreStyles, disableClicks } from '../header.styles';
import { updateAnalytics } from '../helpers';

/* ******* Display Find A Store ******* */
class FindAStore extends React.PureComponent {
  toggleFindAStore = e => {
    const { gtmDataLayer, breadList } = this.props;
    if (this.props.isMobile) {
      this.props.fnToggleHamburger();
    }
    updateAnalytics(e, gtmDataLayer, 'headerLinks', 'header', 'find a store', breadList, null);
    this.props.fnToggleFindAStore({ status: true, isBopisEligible: false });
  };

  extractStoreName() {
    const { label, findNearestStore = {} } = this.props;
    if (!findNearestStore.isFetching) {
      return get(findNearestStore, 'data[0].properties.neighborhood', label);
    }
    return label;
  }

  renderStoreName = (iconStyle, fontStyle, isMobile, myStoreName, icon) => (
    <Fragment>
      <span className={cx(iconStyle, 'academyicon icon-location-pin align-middle pr-half float-left', icon)} aria-hidden="true" />
      <span className={cx(fontStyle, 'mt-quarter icon-text align-middle float-left', !isMobile && 'find-store-hover')}>{myStoreName}</span>
    </Fragment>
  );

  render() {
    const { label, url, cname, changeStoreLabel, myStoreDetails, isMobile, cssClass, icon, messages = {} } = this.props;
    const myStoreName = myStoreDetails && myStoreDetails.neighborhood ? myStoreDetails.neighborhood : this.extractStoreName();
    const showHover = myStoreDetails && myStoreDetails.storeName;
    const fontStyle = { ['o-copy__14reg']: isMobile, ['o-copy__12reg']: !isMobile }; // eslint-disable-line no-useless-computed-key
    const iconStyle = { ['o-copy__24light']: isMobile, ['o-copy__16reg']: !isMobile }; // eslint-disable-line no-useless-computed-key

    return (
      <Fragment>
        <a
          data-auid={`findAStore${isMobile ? '_m' : ''}`}
          href={url}
          aria-label={label}
          className={`${cssClass} ${cname}  ${findStoreStyles} ${(messages.isStoreLocatorEnabled === 'false' && disableClicks) || ''}`}
          onClick={e => this.toggleFindAStore(e)}
        >
          {this.renderStoreName(iconStyle, fontStyle, isMobile, myStoreName, icon)}
          {!isMobile &&
            showHover && (
              <span className="change-store pl-half float-left mt-quarter">
                <span className={cx(fontStyle, 'academyicon icon-pencil a-v-align-middle')} />
                <span className={cx(fontStyle, 'change-text a-v-align-middle')}>{changeStoreLabel} </span>
              </span>
            )}
        </a>
      </Fragment>
    );
  }
}
FindAStore.propTypes = {
  label: PropTypes.string,
  url: PropTypes.string,
  cname: PropTypes.string,
  icon: PropTypes.string,
  fnToggleFindAStore: PropTypes.func,
  myStoreDetails: PropTypes.object,
  changeStoreLabel: PropTypes.string,
  fnToggleHamburger: PropTypes.func,
  isMobile: PropTypes.bool,
  breadList: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  findNearestStore: PropTypes.object,
  messages: PropTypes.object,
  cssClass: PropTypes.string
};

export default FindAStore;
