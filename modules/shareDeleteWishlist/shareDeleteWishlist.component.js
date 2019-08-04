import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
// import { connect } from 'react-redux';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';
import WishlistShareModal from '../wishlistShareModal';
import WishlistDeleteModal from '../wishlistDeleteModal';
// import { shareWishlist } from './actions';

class ShareDeleteWishlist extends React.PureComponent {
  render() {
    const {
      cms,
      checkAlert,
      showWishListItems,
      fnShareWishlist,
      popOverHide,
      mobile,
      wishlistId,
      profileID,
      email,
      firstName,
      deleteWishlist,
      showShare,
      analyticsContent
    } = this.props;
    if (this.props.shareWishListSuccessStatus !== undefined) {
      // TO-DO find its usage
    }
    return (
      <div className={classNames('shareDeleteWishlist', 'd-flex justify-content-between flex-column flex-md-row')}>
        <div className={classNames('mb-0 mb-md-0')}>
          {showShare ? (
            <WishlistShareModal
              cms={cms}
              checkAlert={checkAlert}
              shareWishlist={fnShareWishlist}
              popOverHide={popOverHide}
              mobile={mobile}
              showWishListItems={showWishListItems}
              wishlistId={wishlistId}
              clickedWishListID={wishlistId}
              profileID={profileID}
              email={email}
              firstName={firstName}
              analyticsContent={analyticsContent}
            />
          ) : null}
        </div>
        <div>
          <WishlistDeleteModal
            profileID={profileID}
            wishlistId={wishlistId}
            deleteWishlist={deleteWishlist}
            cms={cms}
            popOverHide={popOverHide}
            mobile={mobile}
            showWishListItems={showWishListItems}
            clickedWishListID={wishlistId}
          />
        </div>
      </div>
    );
  }
}

ShareDeleteWishlist.propTypes = {
  cms: PropTypes.object.isRequired,
  fnShareWishlist: PropTypes.func,
  shareWishListSuccessStatus: PropTypes.bool,
  popOverHide: PropTypes.func,
  mobile: PropTypes.bool,
  deleteWishlist: PropTypes.func,
  wishlistId: PropTypes.string,
  profileID: PropTypes.string,
  showShare: PropTypes.bool,
  showWishListItems: PropTypes.func,
  email: PropTypes.string,
  firstName: PropTypes.string,
  checkAlert: PropTypes.func,
  analyticsContent: PropTypes.func
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<ShareDeleteWishlist {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default ShareDeleteWishlist;
