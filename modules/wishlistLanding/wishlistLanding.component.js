import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PopOverWishList from '../popOverWishList';
import { wishlistBox, iconStyle, Btn, focusText, errorWrapper } from './style';
import { NODE_TO_MOUNT, DATA_COMP_ID } from './constants';

class WishlistLanding extends React.Component {
  componentDidMount() {
    /* get wishlist data again every time */
    this.props.getWishlist();
  }
    /**
   * render API side error messsages
   */
  renderCreateWishListError() {
    const { errorMsg, userCreateWishListErrorKey, userCreateWishListError, cms } = this.props;
    const errorMessage = userCreateWishListErrorKey;
    return userCreateWishListError ? (
      <div>
        <section className={`${errorWrapper} d-flex flex-column p-1 mb-2`}>
          <p className="o-copy__14reg mb-0">{errorMsg[errorMessage] || cms.errorMsg[errorMessage]}</p>
        </section>
      </div>
    ) : null;
  }
  render() {
    const { cms, profileID, fnCreateWishList, userWishList, showWishListItems } = this.props;
    const pop = 'createList';
    return (
      <div className="col-12">
        {this.renderCreateWishListError()}
        <div className="d-flex flex-row justify-content-between">
          <h5 className="mb-2">{cms.wishlistLabel}</h5>
          <PopOverWishList profileID={profileID} cms={cms} popoverType={pop} fnCreateWishList={fnCreateWishList} />
        </div>
        {userWishList !== undefined &&
          userWishList.map(wishlist => (
            <div className={classNames('mb-quarter', wishlistBox)}>
              <button
                data-auid="show_wish_list_btn"
                tabIndex="0"
                className={classNames('w-100', Btn)}
                onClick={() => {
                  showWishListItems(wishlist.id);
                }}
              >
                <div className={classNames('d-flex flex-row', 'justify-content-between', 'py-2', focusText)}>
                  <div>
                    <span className="o-copy__16bold pl-half pl-md-2 pr-half"> {wishlist.name} </span>
                    <span className="o-copy__14reg">
                      {wishlist.itemCount || '0'} {cms.commonLabels.itemsLabel}
                    </span>
                  </div>
                  <div className={classNames('academyicon icon-chevron-right', 'pr-1', iconStyle)} />
                </div>
              </button>
            </div>
          ))}
      </div>
    );
  }
}

WishlistLanding.propTypes = {
  cms: PropTypes.object.isRequired,
  showWishListItems: PropTypes.bool.isRequired,
  userWishList: PropTypes.array,
  fnCreateWishList: PropTypes.func,
  profileID: PropTypes.string,
  getWishlist: PropTypes.func,
  userCreateWishListError: PropTypes.bool,
  userCreateWishListErrorKey: PropTypes.string,
  errorMsg: PropTypes.object
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<WishlistLanding {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default WishlistLanding;
