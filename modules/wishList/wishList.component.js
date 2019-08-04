import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import WishlistLanding from '../wishlistLanding';
import CreateWishList from '../createWishList';
import SelectedWishlistItems from '../wishlistItems';
import withScroll from '../../hoc/withScroll';
import { NODE_TO_MOUNT, DATA_COMP_ID, ANALYTICS_EVENT_IN, ANALYTICS_EVENT_CATEGORY, analyticsEventActions, ANALYTICS_EVENT_LABEL } from './constants';
import { errorWrapper } from './wishlist.styles';
import { myAccountClicksAnalyticsData } from '../../utils/analyticsUtils';
class WishList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showWishListItems: false,
      wishlistId: '',
      itemId: ''
    };
    this.handleWishListClick = this.handleWishListClick.bind(this);
    this.deleteWishListAnalyticsData = this.deleteWishListAnalyticsData.bind(this);
  }

  componentDidMount() {
    const { profileID, redirectLogin, fnGetUserWishList, breadCrumbAction, cms, scrollPageToTop, fnshowloader, analyticsContent } = this.props;
    breadCrumbAction(cms.wishlistLabel);
    if (profileID === null) {
      fnshowloader();
      redirectLogin();
    } else {
      fnGetUserWishList(profileID);
      scrollPageToTop();
    }
    myAccountClicksAnalyticsData(cms.wishlistLabel, analyticsContent);
  }

  componentWillReceiveProps(nextProps) {
    const {
      userWishList: { wishList }
    } = this.props;
    const newWishLists = nextProps.userWishList.wishList;
    if (wishList && newWishLists && wishList.length < newWishLists.length) {
      // if new props has a wishlist array of greater length, then a wishlist has been added successfully.
      this.postAnalyticsData();
    } else if (wishList && newWishLists && wishList.length > newWishLists.length) {
      this.deleteWishListAnalyticsData();
    }
  }

  // componentDidUpdate(prevProps) {
  //   const prevCartQuantity = (prevProps.addItemToCartSuccess && prevProps.addItemToCartSuccess.data && prevProps.addItemToCartSuccess.data.totalCartQuantity) || '0';
  //   const { addItemToCartSuccess, userWishList: { wishList } } = this.props;
  //   const presentCartQuantity = (addItemToCartSuccess && addItemToCartSuccess.data && addItemToCartSuccess.data.totalCartQuantity) || '0';
  //   const previousWishList = prevProps.userWishList && prevProps.userWishList.wishList;
  //   if (this.isCartQuantitySame(prevCartQuantity, presentCartQuantity) && this.isWishlistItemCountLess(previousWishList, wishList)) {
  //     // if props has a wishlist array of greater length and cart quantity has not changed then an item from wishlist has been deleted successfully.
  //     this.deleteWishListAnalyticsData();
  //   }
  // }

  // isCartQuantitySame(prevCartQuantity, presentCartQuantity) {
  //   return (prevCartQuantity && presentCartQuantity && parseInt(prevCartQuantity, 10) === parseInt(presentCartQuantity, 10))
  // }
  // isWishlistItemCountLess(previousWishList, wishList) {
  //   return (wishList && previousWishList && parseInt(wishList.itemCount, 10) < parseInt(previousWishList.itemCount, 10))
  // }
  /**
   * consolidates delete wish list post analytics data.
   */
  deleteWishListAnalyticsData() {
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventActions.DELETE,
      eventLabel: ANALYTICS_EVENT_LABEL,
      viewwishlist: '0',
      createwishlist: '0',
      deletewishlist: '1',
      emailwishlist: '0',
      removefromwishlist: '0'
    };
    analyticsContent(analyticsData);
  }
  /**
   * consolidates post analytics data.
   */
  postAnalyticsData() {
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventActions.CREATE,
      eventLabel: ANALYTICS_EVENT_LABEL,
      viewwishlist: '0',
      createwishlist: '1',
      deletewishlist: '0',
      emailwishlist: '0',
      removefromwishlist: '0'
    };
    analyticsContent(analyticsData);
  }
  handleWishListClick(wishlistId, itemId) {
    this.setState({ showWishListItems: !this.state.showWishListItems, wishlistId, itemId });
  }
  /**
   * render API side error messsages
   */
  renderError() {
    const { errorMsg, error, errorKey, cms } = this.props;
    const errorMessage = errorKey;
    return error ? (
      <div>
        <section className={`${errorWrapper} d-flex flex-column p-1 mb-2`}>
          <p className="o-copy__14reg mb-0">{errorMsg[errorMessage] || cms.errorMsg[errorMessage]}</p>
        </section>
      </div>
    ) : null;
  }
  render() {
    const {
      cms,
      product,
      fnGetUserWishList,
      fnCreateWishList,
      profileID,
      deleteWishlist,
      fnRenameWishList,
      fnAddItemToCart,
      removeWishlistItem,
      selectedWishlistDetails,
      userWishList,
      fetchSelectedWishlistItems,
      fnShareWishlist,
      email,
      firstName,
      analyticsContent,
      shareWishlistData,
      userCreateWishListErrorKey,
      userCreateWishListError,
      userRenameWishListError,
      userRenameWishListErrorKey,
      errorMsg,
      deleteWishlistData,
      selectedWishlistData,
      selectedWishlistMoveToCartData,
      removeItemWishlistData,
      addItemToCartSuccess,
      scrollPageToTop
    } = this.props;
    const { itemId, wishlistId } = this.state;
    if (profileID) {
      return (
        <React.Fragment>
          {this.renderError()}
          {userWishList.wishList && userWishList.wishList.length < 1 ? (
            <CreateWishList
              cms={cms}
              fnCreateWishList={fnCreateWishList}
              profileID={profileID}
              analyticsContent={analyticsContent}
              userWishList={userWishList}
              userCreateWishListErrorKey={userCreateWishListErrorKey}
              userCreateWishListError={userCreateWishListError}
              errorMsg={errorMsg}
            />
          ) : (
            <React.Fragment>
              {this.state.showWishListItems ? (
                <SelectedWishlistItems
                  profileID={profileID}
                  deleteWishlist={deleteWishlist}
                  fnRenameWishList={fnRenameWishList}
                  fnAddItemToCart={fnAddItemToCart}
                  removeWishlistItem={removeWishlistItem}
                  selectedWishlistDetails={selectedWishlistDetails}
                  userWishList={userWishList.wishList}
                  wishlistId={wishlistId}
                  itemId={itemId}
                  cms={cms}
                  product={product}
                  showWishListItems={this.handleWishListClick}
                  fetchSelectedWishlistItems={fetchSelectedWishlistItems}
                  fnShareWishlist={fnShareWishlist}
                  email={email}
                  firstName={firstName}
                  analyticsContent={analyticsContent}
                  shareWishlistData={shareWishlistData}
                  deleteWishlistData={deleteWishlistData}
                  selectedWishlistData={selectedWishlistData}
                  selectedWishlistMoveToCartData={selectedWishlistMoveToCartData}
                  removeItemWishlistData={removeItemWishlistData}
                  userRenameWishListError={userRenameWishListError}
                  userRenameWishListErrorKey={userRenameWishListErrorKey}
                  errorMsg={errorMsg}
                  addItemToCartSuccess={addItemToCartSuccess}
                  scrollPageToTop={scrollPageToTop}
                />
              ) : (
                <WishlistLanding
                  getWishlist={fnGetUserWishList}
                  profileID={profileID}
                  fnCreateWishList={fnCreateWishList}
                  cms={cms}
                  showWishListItems={this.handleWishListClick}
                  userWishList={userWishList.wishList}
                  selectedWishlistDetails={selectedWishlistDetails}
                  userCreateWishListErrorKey={userCreateWishListErrorKey}
                  userCreateWishListError={userCreateWishListError}
                  errorMsg={errorMsg}
                />
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }
    return null;
  }
}

WishList.propTypes = {
  cms: PropTypes.object.isRequired,
  product: PropTypes.array.isRequired,
  fnGetUserWishList: PropTypes.func,
  userWishList: PropTypes.object,
  fetchSelectedWishlistItems: PropTypes.func,
  selectedWishlistDetails: PropTypes.object,
  fnCreateWishList: PropTypes.func,
  fnRenameWishList: PropTypes.func,
  fnAddItemToCart: PropTypes.func,
  removeWishlistItem: PropTypes.func,
  deleteWishlist: PropTypes.func,
  profileID: PropTypes.string,
  fnShareWishlist: PropTypes.func,
  email: PropTypes.string,
  firstName: PropTypes.string,
  redirectLogin: PropTypes.func,
  breadCrumbAction: PropTypes.func,
  analyticsContent: PropTypes.func,
  scrollPageToTop: PropTypes.func,
  fnshowloader: PropTypes.func,
  shareWishlistData: PropTypes.object,
  error: PropTypes.bool,
  errorKey: PropTypes.string,
  errorMsg: PropTypes.string,
  userCreateWishListErrorKey: PropTypes.string,
  userCreateWishListError: PropTypes.bool,
  userRenameWishListError: PropTypes.bool,
  userRenameWishListErrorKey: PropTypes.string,
  deleteWishlistData: PropTypes.object,
  selectedWishlistData: PropTypes.object,
  selectedWishlistMoveToCartData: PropTypes.object,
  removeItemWishlistData: PropTypes.object,
  addItemToCartSuccess: PropTypes.func
};

const WrappedWishList = withScroll(WishList);

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<WrappedWishList {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default WrappedWishList;
