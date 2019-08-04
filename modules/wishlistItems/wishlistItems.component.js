import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { cx } from 'react-emotion';
import Responsive from 'react-responsive';
import ProductCardComponent from '@academysports/fusion-components/dist/ProductCardComponent';
import PopoverStateless from '@academysports/fusion-components/dist/PopoverStateless';
import WishListAlert from '../wishListAlert';
import ShareDeleteWishlist from '../shareDeleteWishlist/shareDeleteWishlist.component';
import WishlistEmptyState from '../wishlistEmptyState/wishlistEmptyState.component';
import { backButton, popOverAlign, Btn, closeButton, deletePopover, errorWrapper, priceInCartPadding, iconSize } from './style';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  RENAME_LIST,
  REMOVE_TEXT,
  SHARE_ITEM,
  ANALYTICS_EVENT_IN,
  ANALYTICS_EVENT_CATEGORY,
  analyticsEventAction,
  AVAILABLE
} from './constants';
import PopOverWishList from '../popOverWishList/popOverWishList.component';
import { collateWishlistProductsData } from './../../utils/analyticsUtils';
import { sizes as mediaSizes } from '../../utils/media';
import { isMobile } from '../../utils/navigator';

const selectWishListFromProps = props => {
  const { selectedWishlistDetails } = props || {};
  const { profile } = selectedWishlistDetails || {};
  const { wishList } = profile || {};
  return (wishList || [])[0];
};

const selectWishListItemsFromProps = props => (selectWishListFromProps(props) || {}).item;

class SelectedWishlistItems extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showRemoveAlert: false,
      isPopOverOpen: false,
      removeItemID: '',
      itemId: '',
      shareAlert: false,
      wishListItems: [],
      movedItemId: ''
    };
    this.renderWishListitemsCard = this.renderWishListitemsCard.bind(this);
    this.handleBackToWishlist = this.handleBackToWishlist.bind(this);
    this.handlePopOverClick = this.handlePopOverClick.bind(this);
    this.handleMoveToCart = this.handleMoveToCart.bind(this);
    this.handleRemoveCard = this.handleRemoveCard.bind(this);
    this.checkAlert = this.checkAlert.bind(this);
    this.shareWishlistAnalyticsData = this.shareWishlistAnalyticsData.bind(this);
    this.viewWishlistAnalyticsData = this.viewWishlistAnalyticsData.bind(this);
    this.getColorOfProduct = this.getColorOfProduct.bind(this);
    this.getTeamName = this.getTeamName.bind(this);
  }
  componentWillMount() {
    this.props.fetchSelectedWishlistItems(this.props.profileID, this.props.wishlistId);
  }
  componentDidMount() {
    this.viewWishlistAnalyticsData();
  }
  componentWillReceiveProps(nextProps) {
    const { shareWishlistData } = this.props;
    const { wishListItems } = this.state;
    const nextWishList = selectWishListFromProps(nextProps);
    if (!shareWishlistData.error && Object.keys(shareWishlistData.data).length > 0 && shareWishlistData !== nextProps.shareWishlistData) {
      this.shareWishlistAnalyticsData();
    }
    /* using derived state to preserve previous props and prevent cycles of unnecessary updates. */
    // TODO :- Derived State is not a great practice, prevent use if possible.
    if (nextWishList && wishListItems && nextWishList.item && wishListItems.length !== nextWishList.item.length) {
      // if item count is different, wishlist will reload hence pushing product impressions.
      this.setState({ wishListItems: nextWishList.item });
      this.pushWishlistProductImpressions(nextWishList);
    }
  }
  componentDidUpdate(prevProps) {
    const {
      addItemToCartSuccess,
      addItemToCartSuccess: { data },
      selectedWishlistDetails,
      removeItemWishlistData
    } = this.props;
    const { movedItemId } = this.state;
    const itemCount = (addItemToCartSuccess && addItemToCartSuccess.data && addItemToCartSuccess.data.totalCartQuantity) || '0';
    const prevCartValues = prevProps && prevProps.addItemToCartSuccess;
    const prevCartItemCount = (prevCartValues && prevCartValues.data && prevCartValues.data.totalCartQuantity) || '0';
    if (prevCartItemCount && itemCount && parseInt(itemCount, 10) > parseInt(prevCartItemCount, 10)) {
      this.pushMoveToCartImpressions(movedItemId, data);
    }
    this.scrollToTopOnItemRemove(prevProps);
    const wishList = selectedWishlistDetails.profile && selectedWishlistDetails.profile.wishList;
    const previousWishList = prevProps.selectedWishlistDetails.profile && prevProps.selectedWishlistDetails.profile.wishList;
    const previousRemovedItemData = prevProps.removeItemWishlistData.data;
    if (
      this.isItemRemovedFromWishList(previousRemovedItemData, removeItemWishlistData.data) &&
      this.isWishlistItemCountLess(previousWishList, wishList)
    ) {
      // if props has a wishlist array of greater length and cart quantity has not changed then an item from wishlist has been deleted successfully.
      this.postDeleteFromWishListItemAnalyticsData();
    }
    this.onRenameWishListLogAnalytics(prevProps);
  }

  onRenameWishListLogAnalytics(prevProps) {
    const prevWishList = selectWishListFromProps(prevProps) || {};
    const wishList = selectWishListFromProps(this.props) || {};

    if (wishList.id && wishList.id === prevWishList.id && wishList.name !== prevWishList.name) {
      this.postRenameWishlistAnalyticsData();
    }
  }

  getColorOfProduct(attributes = []) {
    const color = attributes.find(attr => attr.key === 'Color');
    return color ? color.value : 'n/a';
  }
  getTeamName(productData = []) {
    const teamName = productData.find(attr => attr.name === 'Team');
    return teamName && teamName.values ? teamName.values : 'n/a';
  }
  /* Utility function for checking if the count of items in wishlist has decreased. */
  isWishlistItemCountLess(previousWishList, wishList) {
    const result = wishList && previousWishList && parseInt(wishList[0].itemCount, 10) < parseInt(previousWishList[0].itemCount, 10);
    return result;
  }
  /* Utility function for checking if removal of item is successful or not */
  isItemRemovedFromWishList(previousRemovedItemId, removedItemId) {
    return Object.keys(previousRemovedItemId) > 0 ? previousRemovedItemId !== removedItemId : removedItemId !== '';
  }

  /**
   * Helper method for component did update.  If user is on mobile device, and removed an item from wish list, scroll to page top.
   * @param  {object} prevProps
   */
  scrollToTopOnItemRemove(prevProps) {
    if (isMobile()) {
      const prevItems = selectWishListItemsFromProps(prevProps) || [];
      const items = selectWishListItemsFromProps(this.props) || [];
      if (prevItems.length > items.length) {
        this.props.scrollPageToTop();
      }
    }
  }

  /**
   * collects and pushes analytics data for renaming wishlist action.
   */
  postRenameWishlistAnalyticsData() {
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventAction.RENAME,
      eventLabel: 'myaccount > wishlist',
      viewwishlist: '0',
      createwishlist: '0',
      deletewishlist: '0',
      emailwishlist: '0',
      removefromwishlist: '0'
    };
    analyticsContent(analyticsData);
  }
  /**
   * collects and pushes analytics data for deleting item from wishlist event.
   */
  postDeleteFromWishListItemAnalyticsData() {
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventAction.REMOVE_FROM_WISHLIST,
      eventLabel: 'myaccount > wishlist',
      viewwishlist: 0,
      createwishlist: 0,
      deletewishlist: 0,
      emailwishlist: 0,
      removefromwishlist: 1
    };
    analyticsContent(analyticsData);
  }
  /* collects analytics data on load of wish list */
  viewWishlistAnalyticsData() {
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventAction.VIEW,
      eventLabel: 'myaccount > wishlist',
      viewwishlist: '1',
      createwishlist: '0',
      deletewishlist: '0',
      emailwishlist: '0',
      removefromwishlist: '0'
    };
    analyticsContent(analyticsData);
  }
  /**
   * collates and pushes analytics data for wishlist product impressions.
   */
  pushWishlistProductImpressions(wishList) {
    const { analyticsContent } = this.props;
    const analyticsData = {
      ecommerce: {
        currencyCode: 'USD',
        impressions: wishList && collateWishlistProductsData(wishList.item)
      }
    };
    analyticsContent(analyticsData);
  }
  /**
   * collect analytics data on success of email share
   */
  shareWishlistAnalyticsData() {
    const { analyticsContent } = this.props;
    const analyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: analyticsEventAction.EMAIL,
      eventLabel: 'myaccount > wishlist',
      viewwishlist: '0',
      createwishlist: '0',
      deletewishlist: '0',
      emailwishlist: '1',
      removefromwishlist: '0'
    };
    analyticsContent(analyticsData);
  }
  /**
   * pushes product impressions on move to cart click for any product.
   * @param {string} itemId of the product moved to cart.
   */
  pushMoveToCartImpressions(itemId, data) {
    const {
      analyticsContent,
      selectedWishlistDetails: { profile },
      cms: { moveToCartLabel }
    } = this.props;
    const item = profile && Object.keys(profile.wishList).length > 0 && profile.wishList[0].item;
    const productMoved = (item && item.find(product => itemId === product.id)) || {};
    const itemInformation = (data && data.items) || [];
    const {
      name = '',
      price = {},
      manufacturer = '',
      categoryName = '',
      adBug = [],
      partNumber = '',
      attributes = '',
      isSOFItem = false,
      inventory = {}
    } = productMoved;
    const analyticsData = {
      event: 'shoppingcart',
      eventCategory: 'shopping cart',
      eventAction: moveToCartLabel,
      eventLabel: 'myaccount > wishlist',
      ecommerce: {
        currencyCode: 'USD',
        add: {
          products: [
            {
              name, // Name (in sentence case) or ID is required.
              id: partNumber, // ID will be the parent SKU of the product
              price: price.salePrice && price.salePrice < price.listPrice ? price.salePrice : price.listPrice,
              brand: manufacturer,
              category: categoryName,
              variant: itemInformation && itemInformation[0] && itemInformation[0].skuId, // Variant will be the child SKU of the product
              quantity: 1,
              dimension4: inventory.inventoryStatus === AVAILABLE,
              dimension5: data.orderId[0], // the id must be unique for cart in a single purchase
              dimension25: adBug && adBug.length > 0 ? adBug[0] : 'regular',
              dimension29: 'in page browse',
              dimension72: itemInformation && itemInformation[0] && itemInformation[0].skuId,
              dimension74: `${partNumber} – ${name}`,
              dimension70: this.getTeamName(attributes), // sports team if product belongs to a particular team or sporting event:NA if not applicable,
              dimension77: isSOFItem, // special order firearm - true or false,
              dimension68: this.getColorOfProduct(itemInformation && itemInformation[0] && itemInformation[0].diff), // color of the product, if not applicable send NA,
              metric22: price.listPrice,
              metric46: data.totalCartQuantity === '1' ? '1' : '0'
            }
          ]
        }
      },
      dimension24: adBug && adBug.length > 0 ? adBug[0] : 'regular',
      dimension76: isSOFItem, // special order firearm - true or false,
      dimension28: 'in page browse',
      metric21: price.listPrice,
      metric45: document.querySelectorAll('.mini-cart-count').length > 0 ? '0' : '1'
    };
    analyticsContent(analyticsData);
  }
  checkAlert() {
    this.setState({ shareAlert: true });
  }
  handlePopOverClick() {
    this.setState({ isPopOverOpen: !this.state.isPopOverOpen });
  }
  handleBackToWishlist() {
    this.props.showWishListItems('');
  }
  handleMoveToCart(id, itemID) {
    const data = {
      skus: [
        {
          id,
          quantity: '1',
          type: 'REGULAR'
        }
      ],
      giftAmout: '',
      inventoryCheck: true,
      calculationUsages: [-1],
      isGCItem: false,
      isBundle: false,
      itemDetails: true
    };
    const postdata = { profileID: this.props.profileID, wishlistId: this.props.wishlistId, itemId: itemID, data };
    this.setState({ movedItemId: id });
    this.props.fnAddItemToCart(postdata);
  }
  /**
   * Handling remove item from wishlist
   * @param {*} itemDescription
   * @param {*} id
   */
  handleRemoveCard(itemDescription, id) {
    this.setState({
      showRemoveAlert: !this.state.showRemoveAlert,
      removeItemID: itemDescription,
      itemId: id
    });
  }
  /**
   * undo alert function
   */
  undoDelete = event => {
    if (event && this.state.removeItemID !== '') {
      this.props.removeWishlistItem(this.props.profileID, this.props.wishlistId, this.state.itemId);
      this.setState({
        showRemoveAlert: false,
        removeItemID: '',
        itemId: ''
      });
    } else {
      this.setState({
        showRemoveAlert: false,
        removeItemID: '',
        itemId: ''
      });
    }
  };
  renderWishListitemsCard(item) {
    const { cms } = this.props;
    const { imageURL, manufacturer, name, rating, price, adBug, giftListItemID, inventory = {}, seoURL } = item;
    const { removeLabel } = cms.commonLabels;
    const { moveToCartLabel } = cms;
    const showPriceInCartLabel = price && price.priceMessage === 'priceInCart';
    if (showPriceInCartLabel) {
      price.priceType = 'priceincart';
    }
    const { inventoryStatus = '' } = inventory;
    return (
      <div className={cx('col-12 col-md-6 col-lg-4', closeButton, showPriceInCartLabel && priceInCartPadding)}>
        <ProductCardComponent
          image={`${imageURL}?wid=250&hei=250`}
          imageSmall
          isOOS={inventoryStatus === 'OUT_OF_STOCK'}
          title={manufacturer}
          description={name}
          rating={rating}
          priceObject={price}
          badge={adBug ? adBug[0] : ''}
          horizontalMobile
          isRemovable
          isMoveToCart
          borderStyle
          removeCardFunc={() => this.handleRemoveCard(name, giftListItemID)}
          moveToCartFunc={() => this.handleMoveToCart(item.id, giftListItemID)}
          removeLabel={removeLabel}
          moveToCartLabel={moveToCartLabel}
          productItemLink={seoURL}
        />
      </div>
    );
  }
  /**
   * func to render error message
   * @param {bool} error
   * @param {string} key
   */
  renderError(error, key) {
    const { errorMsg, cms } = this.props;
    return error ? (
      <div>
        <section className={`${errorWrapper} d-flex flex-column p-1 mb-2`}>
          <p className="o-copy__14reg mb-0">{errorMsg[key] || cms.errorMsg[key]}</p>
        </section>
      </div>
    ) : null;
  }
  /**
   * render API side error messsages
   */
  renderRenameWishListError() {
    const { userRenameWishListErrorKey, userRenameWishListError } = this.props;
    if (userRenameWishListError) {
      return this.renderError(userRenameWishListError, userRenameWishListErrorKey);
    }
    return null;
  }
  /**
   * func to wrap error and render error message
   * @param {object} data
   */
  renderErrorWrapper(data) {
    const { error, errorKey } = data;
    if (error) {
      return this.renderError(error, errorKey);
    }
    return null;
  }

  /**
   * @description Renders page level Flash Errors for Wish List editor.
   * @returns {JSX}
   */
  renderFlashErrorsAtPageLevel() {
    const { selectedWishlistData, selectedWishlistMoveToCartData, removeItemWishlistData, deleteWishlistData, shareWishlistData } = this.props;
    return (
      <Fragment>
        {this.renderRenameWishListError()}
        {this.renderErrorWrapper(shareWishlistData)}
        {this.renderErrorWrapper(deleteWishlistData)}
        {this.renderErrorWrapper(removeItemWishlistData)}
        {this.renderErrorWrapper(selectedWishlistMoveToCartData)}
        {this.renderErrorWrapper(selectedWishlistData)}
      </Fragment>
    );
  }

  /**
   * @description Renders the back button on desktop, taking user from viewing/editing items in a list, to the list of wish lists.
   * @returns {JSX}
   */
  renderButtonDesktopBackToWishLists(wrapperClassName) {
    const { cms } = this.props;
    return (
      <Responsive minWidth={mediaSizes.md}>
        <div className={cx('d-flex flex-row', wrapperClassName)}>
          <button
            data-auid="back_to_wish_list_btn"
            className={cx('d-flex flex-row align-items-center', backButton)}
            onClick={this.handleBackToWishlist}
          >
            <span className="academyicon icon-chevron-left pr-half pr-md-half" />
            <span className="o-copy__14reg d-none d-sm-block wishlistLabel"> {cms.backToWishlistLabel} </span>
            <span className="o-copy__14reg d-block d-sm-none wishlistLabel"> {cms.wishlistLabel} </span>
          </button>
        </div>
      </Responsive>
    );
  }

  /**
   * @description Renders the Title and CTA to rename, share and delete the currently selected Wish List .
   * @returns {JSX}
   */
  renderWishlistHeader() {
    return (
      <Fragment>
        {this.renderTitle()}
        {this.renderMobileEditorActions()}
        {this.renderDesktopEditorActions()}
      </Fragment>
    );
  }

  /**
   * @description Renders the Title of the currently selected Wish List .
   * @returns {JSX}
   */
  renderTitle() {
    const wishList = selectWishListFromProps(this.props);
    return <h5 className="text-uppercase"> {wishList.name} </h5>;
  }

  /**
   * @description Renders editor actions for mobile. Rename, Share & Delete.
   * @returns {JSX}
   */
  renderMobileEditorActions() {
    const { cms, profileID, fnRenameWishList, wishlistId, deleteWishlist, fnShareWishlist, email, firstName, analyticsContent } = this.props;
    const wishList = selectWishListFromProps(this.props);
    return (
      <div className={cx('d-flex d-sm-none justify-content-between', popOverAlign)}>
        <div className="pb-half pb-md-0">
          <PopOverWishList
            profileID={profileID}
            fnRenameWishList={fnRenameWishList}
            cms={cms}
            popoverType={RENAME_LIST}
            wishlistId={wishList.id}
            analyticsContent={analyticsContent}
          />
        </div>
        <PopoverStateless.Wrapper>
          <button data-auid="pop_over_btn" onClick={this.handlePopOverClick} className={cx('mr-half', Btn)}>
            <span className={cx('academyicon icon-list-view', iconSize)} />
          </button>
          <div className={`${deletePopover}`}>
            <PopoverStateless.Modal direction={{ mobile: 'bottom', desktop: 'right' }} open={this.state.isPopOverOpen} lineHeightFix={1.5}>
              <div>
                <ShareDeleteWishlist
                  profileID={profileID}
                  wishlistId={wishlistId}
                  deleteWishlist={deleteWishlist}
                  fnShareWishlist={fnShareWishlist}
                  cms={cms}
                  popOverHide={this.handlePopOverClick}
                  mobile
                  clickedWishListID={wishList.id}
                  email={email}
                  firstName={firstName}
                  checkAlert={this.checkAlert}
                  analyticsContent={analyticsContent}
                  showShare={wishList.item}
                />
              </div>
            </PopoverStateless.Modal>
          </div>
        </PopoverStateless.Wrapper>
      </div>
    );
  }

  /**
   * @description Renders editor actions for desktop. Rename, Share & Delete.
   * @returns {JSX}
   */
  renderDesktopEditorActions() {
    const wishListItems = selectWishListItemsFromProps(this.props);
    const wishList = selectWishListFromProps(this.props);
    const {
      selectedWishlistDetails,
      cms,
      profileID,
      fnRenameWishList,
      wishlistId,
      deleteWishlist,
      fnShareWishlist,
      email,
      firstName,
      showWishListItems,
      analyticsContent
    } = this.props;
    return (
      <div className={cx('d-none d-sm-flex justify-content-between align-items-center')}>
        <div className="pb-half pb-md-0">
          <PopOverWishList
            profileID={profileID}
            fnRenameWishList={fnRenameWishList}
            cms={cms}
            popoverType={RENAME_LIST}
            wishlistId={wishList.id}
            analyticsContent={analyticsContent}
          />
        </div>
        <ShareDeleteWishlist
          profileID={profileID}
          wishlistId={wishlistId}
          showWishListItems={showWishListItems}
          deleteWishlist={deleteWishlist}
          fnShareWishlist={fnShareWishlist}
          cms={cms}
          mobile={false}
          showShare={wishListItems}
          clickedWishListID={selectedWishlistDetails.uniqueID}
          email={email}
          firstName={firstName}
          checkAlert={this.checkAlert}
          analyticsContent={analyticsContent}
        />
      </div>
    );
  }

  /**
   * @description Renders the header summary (item count) of the number of items in selected wish list.
   * @returns {JSX}
   */
  renderItemCount(wrapperClassName) {
    const { cms } = this.props;
    const wishListItems = selectWishListItemsFromProps(this.props);
    return (
      (wishListItems || []).length > 0 && (
        <span className={cx('o-copy__16bold', wrapperClassName)}>
          {wishListItems.length} {cms.commonLabels.itemsLabel}
        </span>
      )
    );
  }

  /**
   * @description Shows Flash Alert informing user that the item was removed successfully
   * @returns {JSX}
   */
  renderAlertItemRemoved(wrapperClassName) {
    const { showRemoveAlert, removeItemID } = this.state;
    const { cms } = this.props;
    return (
      showRemoveAlert && (
        <div className={wrapperClassName}>
          <WishListAlert cms={cms} removedItem={removeItemID} showRemoveAlert={showRemoveAlert} callback={this.undoDelete} alertType={REMOVE_TEXT} />
        </div>
      )
    );
  }

  /**
   * @description Shows Flash Alert informing user that wish list has been shared successfully
   * @returns {JSX}
   */
  renderAlertWishListShared(wrapperClassName) {
    const { cms } = this.props;
    return (
      this.state.shareAlert && (
        <div className={wrapperClassName}>
          <WishListAlert cms={cms} alertType={SHARE_ITEM} />
        </div>
      )
    );
  }

  /**
   * @description Renders all items that belong to the current wish list
   * @returns {JSX}
   */
  renderItemCards() {
    const wishListItems = selectWishListItemsFromProps(this.props) || [];
    return wishListItems.length > 0 && <div className="row">{wishListItems.map(item => this.renderWishListitemsCard(item))}</div>;
  }

  /**
   * @description Renders the empty view if current wish list has zero items
   * @returns {JSX}
   */
  renderEmptyList() {
    const { cms } = this.props;
    const wishListItems = selectWishListItemsFromProps(this.props) || [];
    return wishListItems.length === 0 && <WishlistEmptyState cms={cms} />;
  }

  render() {
    const { selectedWishlistDetails } = this.props;
    return (
      <Fragment>
        {selectedWishlistDetails.profile && (
          <div className="container-fluid">
            {this.renderFlashErrorsAtPageLevel()}
            {this.renderButtonDesktopBackToWishLists('mb-2 mb-md-3')}
            {this.renderWishlistHeader()}
            {this.renderItemCount('my-2')}
            {this.renderAlertItemRemoved('mb-2 mt-half')}
            {this.renderAlertWishListShared('mb-2 mt-half')}
            {this.renderItemCards()}
            {this.renderEmptyList()}
          </div>
        )}
        <div />
      </Fragment>
    );
  }
}

SelectedWishlistItems.propTypes = {
  cms: PropTypes.object.isRequired,
  showWishListItems: PropTypes.func,
  fetchSelectedWishlistItems: PropTypes.func,
  wishlistId: PropTypes.string,
  selectedWishlistDetails: PropTypes.object,
  fnAddItemToCart: PropTypes.func,
  fnRenameWishList: PropTypes.func,
  removeWishlistItem: PropTypes.func,
  deleteWishlist: PropTypes.func,
  profileID: PropTypes.string,
  fnShareWishlist: PropTypes.func,
  email: PropTypes.string,
  firstName: PropTypes.string,
  analyticsContent: PropTypes.func,
  shareWishlistData: PropTypes.object,
  userRenameWishListError: PropTypes.bool,
  userRenameWishListErrorKey: PropTypes.string,
  errorMsg: PropTypes.object,
  deleteWishlistData: PropTypes.object,
  selectedWishlistData: PropTypes.object,
  selectedWishlistMoveToCartData: PropTypes.object,
  removeItemWishlistData: PropTypes.object,
  addItemToCartSuccess: PropTypes.func,
  scrollPageToTop: PropTypes.func
};

if (ExecutionEnvironment.canUseDOM) {
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(<SelectedWishlistItems {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />, el);
  });
}

export default SelectedWishlistItems;
