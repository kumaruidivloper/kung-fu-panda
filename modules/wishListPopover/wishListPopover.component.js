import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React from 'react';
import { cx } from 'react-emotion';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import { get } from '@react-nitro/error-boundary';
import Popover from './lib/Popover/popover';
import PopoverModalContent from './lib/PopoverModalContent/popoverModalContent';
import * as styles from './wishListPopover.emotion';
import * as wishListAPI from './wishListPopover.API.wishList';
import { viewStates } from './lib/util';
import { isLoggedIn } from '../../utils/UserSession';
import { printBreadCrumbAndName } from '../../utils/breadCrumb';
import { getParamNoCase } from '../../utils/productDetailsUtils';
import { onWishListSuccess } from './action';
import StorageManager from './../../utils/StorageManager';
import { WISHLIST_NAME_CANNOT_BE_EMPTY, DUPLICATE_WISHLIST_NAME, INVALID_WISHLIST_NAME, WISHLIST_ID, WISHLIST_CLOSE } from './constants';
import { getXhrErrorMessageFrom } from '../../utils/xhrError';
import { isMobile } from './../../utils/navigator';

class WishListPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      selectedWishListName: null,
      wishLists: [],
      viewState: viewStates.form,
      newWishListNameValue: null,
      newWishListNameError: null,
      cssTransitionIn: false,
      successScrollIntoView: false,
      errorMessageOnAdd: undefined,
      errorMessageOnCreate: undefined
    };

    this.didOpenWishListOnPageLoad = false;

    this.onLoadWishListsSuccess = this.onLoadWishListsSuccess.bind(this);
    this.onAddItemToWishListSuccess = this.onAddItemToWishListSuccess.bind(this);
    this.onAddItemToWishListFail = this.onAddItemToWishListFail.bind(this);
    this.onCreateWishListSuccess = this.onCreateWishListSuccess.bind(this);
    this.onCreateWishListFail = this.onCreateWishListFail.bind(this);
    this.onCreateWishListSuccessMobile = this.onCreateWishListSuccessMobile.bind(this);
    this.onCreateWishListFailMobile = this.onCreateWishListFailMobile.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onClickRedirectToLogin = this.onClickRedirectToLogin.bind(this);
    this.onSelectWishList = this.onSelectWishList.bind(this);
    this.onClickCreate = this.onClickCreate.bind(this);
    this.OnClickCreateWishListGA = this.OnClickCreateWishListGA.bind(this);
    this.OnClickAddToWishListGA = this.OnClickAddToWishListGA.bind(this);
    this.onNewWishListNameChange = this.onNewWishListNameChange.bind(this);
    this.onEscapeCall = this.onEscapeCall.bind(this);
    this.getEventLabel = this.getEventLabel.bind(this);
    this.onToggleOnFocusOut = this.onToggleOnFocusOut.bind(this);
    this.focusToggleRef = this.focusToggleRef.bind(this);
    this.wishListToggleRef = React.createRef();
  }

  componentDidMount() {
    this.openWishListOnPageLoad();
  }

  onLoadWishListsSuccess(response) {
    const { profile } = response.data;
    this.setState({
      wishLists: profile.wishList.map(list => ({ descriptionName: list.name, uniqueID: list.id }))
    });
    if (!this.state.modalOpen) {
      const delay = Math.max((this.requestLoadTimestamp + 250) - new Date().getTime(), 1); // prettier-ignore
      setTimeout(() => {
        this.setState({ modalOpen: true });
      }, delay);
    }
  }

  /**
   * Method to close the wishlist popover on focus out
   */
  onToggleOnFocusOut() {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }
    const element = document.getElementById(WISHLIST_ID);
    if (!element) {
      return;
    }
    element.addEventListener('focusout', event => {
      if (!isMobile() && !element.contains(event.relatedTarget)) {
        this.onCloseModal();
      }
    });
  }

  onAddItemToWishListSuccess(response) {
    this.setFocusToCloseBtn();
    if (response.status >= 200 && response.status < 300) {
      const data = response.data || {};
      if (this.props.isFromCart) {
        this.dispatchForCartPage(data);
        return;
      }
      this.setState({
        viewState: viewStates.success
      });
    } else {
      this.onAddItemToWishListFail(response);
    }
  }

  onAddItemToWishListFail(response) {
    this.setState({ errorMessageOnAdd: getXhrErrorMessageFrom(response) });
  }

  onCreateWishListSuccess(response) {
    this.setFocusToCloseBtn();
    if (response.status >= 200 && response.status < 300) {
      const data = response.data || {};
      if (this.props.isFromCart) {
        this.dispatchForCartPage(data);
        return;
      }
      const { profile = {} } = data;
      const wishLists = profile.wishList || [];
      const wishList = wishLists[0] || {};
      this.loadWishLists();
      this.setState({
        newWishListNameValue: null,
        newWishListNameError: null,
        selectedWishListName: wishList.name,
        viewState: viewStates.success,
        successScrollIntoView: false
      });
      this.createWishListInProgress = false;
    } else {
      this.onCreateWishListFail(response);
    }
  }

  onCreateWishListFail(response) {
    this.setState({ errorMessageOnCreate: getXhrErrorMessageFrom(response) });
    this.createWishListInProgress = false;
  }

  onCreateWishListSuccessMobile(response) {
    this.setFocusToCloseBtn();
    if (response.status >= 200 && response.status < 300) {
      const data = response.data || {};
      if (this.props.isFromCart) {
        this.dispatchForCartPage(data);
        return;
      }
      const { profile = {} } = data;
      const wishLists = profile.wishList || [];
      const wishList = wishLists[0] || {};
      this.loadWishLists();
      this.setState({
        newWishListNameValue: null,
        newWishListNameError: null,
        selectedWishListName: wishList.name,
        viewState: viewStates.success,
        successScrollIntoView: true
      });
      this.createWishListInProgress = false;
    } else {
      this.onCreateWishListFailMobile(response);
    }
  }

  onCreateWishListFailMobile(response) {
    this.setState({ errorMessageOnCreate: getXhrErrorMessageFrom(response) });
    this.createWishListInProgress = false;
  }

  onOpenModal() {
    this.requestLoadTimestamp = new Date().getTime();
    this.loadWishLists();
    this.setState({ cssTransitionIn: true });
  }

  onCloseModal() {
    this.setState({
      modalOpen: false,
      selectedWishListName: null,
      viewState: viewStates.form,
      newWishListNameValue: null,
      newWishListNameError: null,
      cssTransitionIn: false
    });
    this.clearApiErrorMessages();
    this.removeSessionStorage();
  }

  /**
   * FINAL
   * url1A - https://uat6www.academy.com/shop/LogonForm?myAcctMain=1&storeId=10151&catalogId=10051&langId=&URL= {encodeURIComponent - url2}
   * url1B - &fromPage=pdp&pdpURL= {encodeURIComponent - pdpUrl}
   * url1C - &addList=true&returnPage=responsivePDPWishlist
   * url2 - https://uat6www.academy.com/shop/AYOrderItemMoveCmd?continue=1&createIfEmpty=1&updatePrices=0&deleteIfEmpty=*&fromOrderId=*&toOrderId=.&page=&calculationUsageId=-1&URL= {encodeURIComponent - url3}
   * url3 - https://uat6www.academy.com/shop/OrderCalculate?URL= {encodeURIComponent - url4}
   * url4 - pdpUrl - ?&fromWishlist=y&fromWishListId=&
   * pdpUrl - https://uat6www.academy.com/shop/pdp/magellan-outdoors%E2%84%A2-mens-laguna-madre-solid-short-sleeve-fishing-shirt?defaultSKU=3886615
   */

  onClickRedirectToLogin() {
    const { gtmDataLayer } = this.props;
    gtmDataLayer.push({
      event: 'wishlist',
      eventCategory: 'wish list',
      eventLabel: this.getEventLabel(),
      eventAction: 'add to wish list',
      addtowishlist: 1,
      createwishlist: 0
    });
    if (ExecutionEnvironment.canUseDOM) {
      const { seoURL } = this.props.productItem;
      const moddedSeoURL = this.constructReturnUrlForLogin(seoURL);
      const rootURL = `https://${window.location.host}`;
      const shopURL = `${rootURL}/shop`;
      const pdpURL = encodeURI(`${rootURL}${moddedSeoURL}`);

      const url4 = `${pdpURL}?&fromWishlist=y&fromWishListId=&`;
      const url3 = `${shopURL}/OrderCalculate?URL=${encodeURIComponent(url4)}`;
      const url2 = `${shopURL}/AYOrderItemMoveCmd?continue=1&createIfEmpty=1&updatePrices=0&deleteIfEmpty=*&fromOrderId=*&toOrderId=.&page=&calculationUsageId=-1&URL=${encodeURIComponent(
        url3
      )}`;
      const url1 = `${shopURL}/LogonForm?myAcctMain=1&storeId=10151&catalogId=10051&langId=&URL=${encodeURIComponent(
        url2
      )}&fromPage=pdp&pdpURL=${encodeURIComponent(pdpURL)}&addList=true&returnPage=responsivePDPWishlist`;
      StorageManager.setSessionStorage('isWishlistClickedAsGuestUser', true);
      document.location.href = url1;
    }
  }

  onSelectWishList(wishListId) {
    this.clearApiErrorMessages();
    const wishlistName = this.getWishListById(wishListId).descriptionName;
    this.setState({ selectedWishListName: wishlistName });
    wishListAPI.postSKUToWishList(wishlistName, this.getSkuId(), wishListId, this.onAddItemToWishListSuccess, this.onAddItemToWishListFail);
    this.OnClickAddToWishListGA();
  }

  onClickCreate(isMobileDevice) {
    if (!this.createWishListInProgress) {
      this.clearApiErrorMessages();
      const errorMessage = this.getInvalidMessageForNewWishListName(this.state.newWishListNameValue);
      if (errorMessage) {
        this.setState({ newWishListNameError: errorMessage });
      } else {
        this.createWishListInProgress = true;
        this.OnClickCreateWishListGA();
        const onSuccess = isMobileDevice ? this.onCreateWishListSuccessMobile : this.onCreateWishListSuccess;
        const onFail = isMobileDevice ? this.onCreateWishListFailMobile : this.onCreateWishListFail;
        wishListAPI.postWishList(this.getSkuId(), this.state.newWishListNameValue, onSuccess, onFail);
        this.removeSessionStorage();
      }
    }
  }

  onNewWishListNameChange(e) {
    const newState = { newWishListNameValue: e.target.value };
    const newValueLengthGTZero = e.target.value && e.target.value.length > 0;
    const errorLengthGTZero = this.state.newWishListNameError && this.state.newWishListNameError.length > 0;
    if (newValueLengthGTZero && errorLengthGTZero) {
      newState.newWishListNameError = null;
    }
    this.setState(newState);
    this.clearApiErrorMessages();
  }

  onEscapeCall(e) {
    const ESC_KEYCODE = 27;
    if (e.keyCode === ESC_KEYCODE) {
      this.focusToggleRef();
      this.setState({
        modalOpen: false,
        selectedWishListName: null,
        viewState: viewStates.form,
        newWishListNameValue: null,
        newWishListNameError: null,
        cssTransitionIn: false
      });
    }
  }

  getEventLabel() {
    const { productItem } = this.props;
    let eventLabelToPublish = '';
    if (ExecutionEnvironment.canUseDOM) {
      eventLabelToPublish =
        document.location.pathname.indexOf('cart') !== -1
          ? 'academy > cart'
          : printBreadCrumbAndName(productItem.breadCrumb, productItem.name).toLowerCase();
    }
    return eventLabelToPublish;
  }

  getSkuId() {
    const { productItem } = this.props;
    return productItem && this.isValidSkuId(productItem.skuId) ? productItem.skuId : null;
  }

  getImageURL() {
    const { productItem } = this.props;
    return this.getSkuId() ? (productItem.sKUs.find(sku => sku.skuId === this.getSkuId()) || {}).imageURL : null;
  }

  getWishListById(id) {
    return this.state.wishLists.find(list => list.uniqueID === id);
  }

  /**
   * Method to validate the wishlist name
   * It will validate duplicate name, empty submit
   * @param {string} val User entered value for wishlist name
   */
  getInvalidMessageForNewWishListName(val) {
    const { errorMsg = {} } = this.props;
    if (!val) {
      return errorMsg.WISHLIST_NAME_CANNOT_BE_EMPTY || WISHLIST_NAME_CANNOT_BE_EMPTY;
    }

    if (!this.isValidWishListName(val)) {
      return errorMsg.INVALID_WISHLIST_NAME || INVALID_WISHLIST_NAME;
    }

    if (!this.isUniqueWishListName(val)) {
      return errorMsg.DUPLICATE_WISHLIST_NAME ? `${errorMsg.DUPLICATE_WISHLIST_NAME} '${val}'` : `${DUPLICATE_WISHLIST_NAME} '${val}'`;
    }

    return null;
  }

  /**
   * Method to focus back to close btn of popover
   */
  setFocusToCloseBtn() {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }
    const closeBtn = document.getElementById(WISHLIST_CLOSE);
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  focusToggleRef() {
    const { current } = this.wishListToggleRef || {};
    if (current) {
      current.focus();
    }
  }

  /**
   * removing the storage (We are setting this when click on wishlist link as a guest user in PDP page)
   */
  removeSessionStorage() {
    if (StorageManager.getSessionStorage('isWishlistClickedAsGuestUser')) {
      StorageManager.removeSessionStorage('isWishlistClickedAsGuestUser');
    }
  }

  /**
   * @param  {string} seoURL
   * @returns the product's seoURL with a urlQueryParam injected. - openWishList=true
   */
  constructReturnUrlForLogin(seoURL) {
    let { baseURL, queryURL, hashURL } = {};
    [baseURL, queryURL] = seoURL.split('?');
    if (queryURL) {
      [queryURL, hashURL] = queryURL.split('#');
    } else {
      [baseURL, hashURL] = baseURL.split('#');
    }
    hashURL = hashURL
      ? hashURL
          .split('&')
          .concat('openWishList=true')
          .join('&')
      : 'openWishList=true';
    return `${baseURL}${queryURL ? `?${queryURL}` : ''}${hashURL ? `#${hashURL}` : ''}`;
  }

  openWishListOnPageLoad() {
    if (
      ExecutionEnvironment.canUseDOM &&
      !this.didOpenWishListOnPageLoad &&
      isLoggedIn() &&
      getParamNoCase('openWishList', window.location.hash) === 'true'
    ) {
      this.didOpenWishListOnPageLoad = true;
      this.onOpenModal();
    }
  }

  clearApiErrorMessages = () => {
    this.setState({ errorMessageOnAdd: undefined, errorMessageOnCreate: undefined });
  };

  /**
   * Method will trigger action to close modal and remove item from cart
   * @param {object} data Response
   */
  dispatchForCartPage(data = {}) {
    const giftListItemID = get(data, 'profile.wishList[0].item[0].giftListItemID', '');
    const wishListId = get(data, 'profile.wishList[0].id', '');
    const { product, qty, hideUndo } = this.props.productItem || {};
    this.onCloseModal();
    this.props.fnOnWishListSuccess({ product, qty, hideUndo, giftListItemID, wishListId });
  }

  OnClickAddToWishListGA() {
    const { gtmDataLayer } = this.props;
    return (gtmDataLayer || []).push({
      event: 'wishlist',
      eventCategory: 'wish list',
      eventLabel: this.getEventLabel(),
      eventAction: 'add to wish list',
      addtowishlist: 1,
      createwishlist: 0
    });
  }

  OnClickCreateWishListGA() {
    const { gtmDataLayer } = this.props;
    this.OnClickAddToWishListGA();
    return (gtmDataLayer || []).push({
      event: 'wishlist',
      eventCategory: 'wish list',
      eventLabel: this.getEventLabel(),
      eventAction: 'create wish list',
      addtowishlist: 0,
      createwishlist: 1
    });
  }

  loadWishLists() {
    if (isLoggedIn()) {
      wishListAPI.fetchWishLists(this.onLoadWishListsSuccess, err => {
        console.log('loadWishLists - failed');
        console.log(err);
      });
    }
  }

  isValidWishListName(val) {
    return val && val.trim().length > 0;
  }

  isUniqueWishListName(val = '') {
    const { wishLists = [] } = this.state;
    return !wishLists.find(list => list.descriptionName.trim().toLowerCase() === val.trim().toLowerCase());
  }

  isValidSkuId(val) {
    return /^\d+$/gi.test(val);
  }

  hasProductItem() {
    return this.props.productItem && this.props.productItem.itemId;
  }

  toggleModal() {
    // const { productItem } = this.props;
    if (this.state.modalOpen) {
      this.onCloseModal();
    } else {
      this.onOpenModal();
    }
  }

  computeLoaderStyles() {
    if (!this.state.animate) {
      return null;
    }
    return this.state.killAnimation ? cx(styles.loader, styles.loaderActive, styles.killLoader) : cx(styles.loader, styles.loaderActive);
  }

  populateWishListPopOver = () => (isLoggedIn() ? this.toggleModal() : this.onClickRedirectToLogin());

  renderWishListIcon() {
    const { hideWishListIcon } = this.props;
    return (
      !hideWishListIcon && (
        <div className={cx('academyicon', 'icon-list-view', styles.ctaIcon)}>
          <span className="path1" />
          <span className="path2" />
          <span className="path3" />
          <span className="path4" />
          <span className="path5" />
        </div>
      )
    );
  }

  render() {
    const { direction, mobileTextAlign } = this.props;
    const { modalOpen } = this.state;
    if (!this.hasProductItem()) {
      return null;
    }
    return (
      <div role="presentation" className={`${styles.createWrapperStyle(modalOpen, mobileTextAlign)} wishListWrapper`} onKeyDown={this.onEscapeCall}>
        <Popover
          handleEntered={this.onToggleOnFocusOut}
          onToggleClick={this.populateWishListPopOver}
          onClose={this.onCloseModal}
          direction={direction}
          open={(isLoggedIn() && StorageManager.getSessionStorage('isWishlistClickedAsGuestUser')) || this.state.modalOpen}
          toggleRef={this.wishListToggleRef}
          modalContent={
            <PopoverModalContent
              viewState={this.state.viewState}
              wishLists={this.state.wishLists}
              onSelectWishList={this.onSelectWishList}
              onClickCreate={this.onClickCreate}
              onNewWishListNameChange={this.onNewWishListNameChange}
              newWishListNameValue={this.state.newWishListNameValue}
              newWishListNameError={this.state.newWishListNameError}
              selectedWishListName={this.state.selectedWishListName}
              itemImageUrl={this.getImageURL()}
              successScrollIntoView={this.state.successScrollIntoView}
              errorMessageOnAdd={this.state.errorMessageOnAdd}
              errorMessageOnCreate={this.state.errorMessageOnCreate}
            />
          }
        >
          <CSSTransition classNames="button-loader wishlist" in={this.state.cssTransitionIn} timeout={600}>
            <div className={styles.loaderWrapper}>
              {this.renderWishListIcon()}
              <button className={cx(styles.ctaText, 'o-copy__14reg wishListTitle')} data-auid={this.props.auid || 'PDP_AddToWishList'}>
                Add to Wish List
              </button>
            </div>
          </CSSTransition>
        </Popover>
      </div>
    );
  }
}

WishListPopover.propTypes = {
  productItem: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  fnOnWishListSuccess: PropTypes.func,
  isFromCart: PropTypes.string,
  errorMsg: PropTypes.object,
  auid: PropTypes.string,
  direction: PropTypes.object,
  hideWishListIcon: PropTypes.bool,
  mobileTextAlign: PropTypes.string // used for aligning wish list button text "Add to Wish List" on mobile
};

WishListPopover.defaultProps = {
  direction: { mobile: 'top', desktop: 'left' }
};

const mapStateToProps = (state, ownProps) => ({ ...ownProps, gtmDataLayer: state.gtmDataLayer });

const mapDispatchToProps = dispatch => ({
  fnOnWishListSuccess: data => dispatch(onWishListSuccess(data))
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default withConnect(WishListPopover);
