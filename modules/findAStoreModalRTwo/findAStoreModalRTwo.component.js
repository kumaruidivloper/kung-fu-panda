import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import axios from 'axios';
import { profileAPI } from '@academysports/aso-env';
import { css } from 'react-emotion';
import { cx } from 'emotion';
import classNames from 'classnames';
import Button from '@academysports/fusion-components/dist/Button';
import Drawer from '@academysports/fusion-components/dist/Drawer';
import Spinner from '@academysports/fusion-components/dist/Spinner';
import { get } from '@react-nitro/error-boundary';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import reducer from './reducer';
import { appendStoreName, getStockAvailabilityStatus, findFavStoreInventory, checkNullObject } from './helpers';
import * as actions from './actions';
import saga from './saga';
import Storage from '../../utils/StorageManager';
import * as styles from './styles';
import { disableBodyScroll, enableBodyScroll } from '../../utils/BodyScrollLock';
import {
  NODE_TO_MOUNT,
  DATA_COMP_ID,
  COOKIE_STORE_ID,
  COKIE_SELECTED_ZIPCODE,
  GOOGLE_MAP_DIRECTIONS_URL,
  USERACTIVITY,
  USERTYPE,
  SAVED_FAVOURITE_STORE,
  GEO_LOCATED_ZIP_CODE,
  SOURCE_REALTIME,
  STORE_LOCATOR_LINK,
  LABEL_TRUE,
  SEARCH_LABEL,
  TRUE,
  FALSE,
  NULL,
  EMPTY_VAL,
  ANALYTICS_EVENT_IN,
  ANALYTICS_EVENT_CATEGORY,
  ANALYTICS_EVENT_ACTION,
  analyticsLabelSuccessfulStoreSearch,
  analyticsLabelUnsuccessfulStoreSearch,
  analyticsLabelViewMoreStores
} from './constants';
import { setSelectedStoreCookies, getSelectedStoreFromCookies } from '../../utils/cookies/SelectedStore';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import { isMobile } from '../../utils/userAgent';
import GoogleMaps from '../googleMaps/googleMaps.component';
import { FAM_PAGE_TYPE_ALL, FAM_PAGE_TYPE_PDP } from '../../utils/constants';
import { getCookieValues, getStoreInfo } from './utils';
import { scrollIntoView } from '../../utils/scroll';
import AnalyticsWrapper from '../../modules/analyticsWrapper/analyticsWrapper.component';
import { ANALYTICS_SUB_EVENT_IN } from './../checkoutPaymentOptions/constants';
class FindAStoreModalRTwo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      zipcode: '',
      inputFocused: false,
      selectedStoreNo: '',
      // errorDetail: '0 Stores were found within 250 miles of your search',
      showLimit: 5,
      // dirtySearchField: false,
      clickedStoreId: '',
      initialMyStoreDetails: {}
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.modalContent = this.modalContent.bind(this);
    this.storeRender = this.storeRender.bind(this);
    this.makeMyStore = this.makeMyStore.bind(this);
    this.onChangeinput = this.onChangeinput.bind(this);
    this.clearZipcode = this.clearZipcode.bind(this);
    this.getStoreDetails = this.getStoreDetails.bind(this);
    this.displayStoreHours = this.displayStoreHours.bind(this);
    this.searchInputRef = React.createRef();
    this.submitBtnRef = React.createRef();
    this.updateOnToggle = this.updateOnToggle.bind(this);
    this.showPositionAccessed = this.showPositionAccessed.bind(this);
    this.showPositionBlocked = this.showPositionBlocked.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.myStoreCookieDetails = this.myStoreCookieDetails.bind(this);
    // this.VIEWER_REF = 'VIEWER';

    this.storeWrapperRefs = {};
  }

  componentDidMount() {
    const { cms } = this.props;
    if (Storage.getSessionStorage('storeId')) {
      const cookieStoreId = Storage.getSessionStorage('storeId');
      /**
       *  Once you are opening into Sign in page store id
       *  in cookie is coming as undefined, handled
       *  condition as it is breaking store locator code
       */
      if (cookieStoreId !== 'undefined') {
        Storage.setCookie(COOKIE_STORE_ID, cookieStoreId);
      }
    }
    if (cms.radiusLabel) {
      this.props.fnsetCMS({ radius: cms.radiusLabel, openhourlabel: cms.timeLabel });
    }
    this.myStoreCookieDetails();
    if (!Storage.getSessionStorage(GEO_LOCATED_ZIP_CODE)) {
      navigator.geolocation.getCurrentPosition(this.showPositionAccessed, this.showPositionBlocked);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      findAStoreModalIsOpen,
      analyticsContent,
      data: { getMystoreDetails }
    } = this.props;
    const nextModalState = nextProps.findAStoreModalIsOpen;
    const nextMyStoreDetails = nextProps.data && nextProps.getMystoreDetails;
    // sets the initial values of my store in state for further comparisons.
    if (!findAStoreModalIsOpen.status && nextModalState.status) {
      this.setState({ initialMyStoreDetails: getMystoreDetails });
    }
    const { initialMyStoreDetails } = this.state;
    // if initially set state is different from one set at the time of closing modal, fire analytics event.
    if (
      this.isModalClosedFromSOFDrawer(findAStoreModalIsOpen, nextModalState) &&
      this.successfulMyStoreChange(initialMyStoreDetails, nextMyStoreDetails)
    ) {
      analyticsContent({
        event: ANALYTICS_SUB_EVENT_IN,
        eventCategory: 'checkout',
        eventAction: 'special order ship to store|change location completed',
        eventLabel: '/checkout',
        customerleadlevel: null,
        customerleadtype: null,
        leadsubmitted: 0,
        newslettersignupcompleted: 0
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      data: { storeDetails, getMystoreDetails },
      findAStoreModalIsOpen
    } = this.props;
    const { showLimit, clickedStoreId, zipcode } = this.state;
    const previousStoreDetails = prevProps && prevProps.data && prevProps.storeDetails;
    const previousMyStoreDetails = prevProps && prevProps.data && prevProps.getMystoreDetails;
    const limit = this.getLimit(this.getGxId());
    const prevLimit = this.getLimit(this.getGxId(), prevState);
    if (limit !== prevLimit) {
      this.focusAndScrollToRecentlyLoadedStores();
    }
    /* analytics code */
    // 1. on successful store search.
    if (zipcode && zipcode !== '' && findAStoreModalIsOpen.status && this.successfulStoreSearch(previousStoreDetails, storeDetails)) {
      if (this.checkForSingleStore()) {
        this.pushStoreSearchAnalyticsData(ANALYTICS_EVENT_ACTION.SEARCH, analyticsLabelSuccessfulStoreSearch);
      } else {
        this.pushStoreSearchAnalyticsData(ANALYTICS_EVENT_ACTION.SEARCH, analyticsLabelUnsuccessfulStoreSearch, {
          storeId: null,
          successfulstorefinder: 0,
          unsuccessfullstorefinder: 1
        });
      }
    } else if (zipcode && zipcode !== '' && findAStoreModalIsOpen.status && this.unsuccessfulStoreSearch(previousStoreDetails, storeDetails)) {
      // 2. on unsuccessful store search.
      this.pushStoreSearchAnalyticsData(ANALYTICS_EVENT_ACTION.SEARCH, analyticsLabelUnsuccessfulStoreSearch, { storeId: null });
    }
    // 3. On successful click of view more stores
    if (prevState && prevState.showLimit && findAStoreModalIsOpen.status && prevState.showLimit < showLimit) {
      this.pushStoreSearchAnalyticsData(ANALYTICS_EVENT_ACTION.SEARCH, analyticsLabelViewMoreStores, { viewstoredetails: 0 }, prevState.showLimit);
    }
    // 4. on successful set of my store.
    if (this.successfulMyStoreChange(previousMyStoreDetails, getMystoreDetails) && findAStoreModalIsOpen.status) {
      this.pushStoreSearchAnalyticsData(ANALYTICS_EVENT_ACTION.MAKE_MY_STORE, clickedStoreId, {
        searchresultscount: NULL,
        storeid: clickedStoreId,
        storesearchkeyword: zipcode,
        itemavailabilitycount: `${clickedStoreId}|${this.getCountOfItems().avl} items available;${this.getCountOfItems().unAvl} items unavailable`,
        successfulstorefinder: FALSE,
        unsuccessfullstorefinder: FALSE,
        viewstoredetails: TRUE
      });
    }

    this.resetStoreCookies(prevProps);
  }

  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM && isMobile()) {
      const elem = document.querySelector('.fas-scroll-container');
      enableBodyScroll(elem);
    }
  }

  /**
   * @param {*} e
   * For handling Input Field on Manual Search of Zip Code/City
   */
  onChangeinput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  /**
   * common function for getting store ID from cookie
   */
  getStoreId() {
    const storeId = Storage.getCookie(COOKIE_STORE_ID);
    return storeId;
  }

  /**
   * @param {*} e
   * Get store details list when Manual Searh is performed
   */
  getStoreDetails(e) {
    e.preventDefault();
    this.setState(() => ({
      showLimit: 5
    }));
    let storeId = null;
    let skus = null;
    let gxId = null;
    let isBopisEligible = false;
    this.searchInputRef.current.blur();
    this.submitBtnRef.current.focus();
    const { labels: { bopisEnabled: globalBopisEnabled } = {} } = this.props;
    const storeEligibility = globalBopisEnabled === LABEL_TRUE ? 1 : 0;

    if (this.props.findAStoreModalIsOpen) {
      ({ isBopisEligible } = this.props.findAStoreModalIsOpen);
    }
    const { pdpProductItemId, getCartDetails, cms, getMystoreDetails, findAStoreModalIsOpen = {} } = this.props;
    const { source } = findAStoreModalIsOpen;
    if (getMystoreDetails && getMystoreDetails.neighborhood) {
      gxId = getMystoreDetails.gx_id || null;
    }
    if (gxId) {
      storeId = appendStoreName(gxId, true);
    }
    if (getCartDetails && getCartDetails.data && getCartDetails.data.skus) {
      ({ skus } = getCartDetails.data);
    } else if (pdpProductItemId) {
      isBopisEligible = false;
      skus = this.getSkusBySource(source, pdpProductItemId);
    }
    const locDetails = { zipcode: this.state.zipcode, radius: cms.radiusLabel, storeId, skus, isBopisEligible, source, storeEligibility };
    this.props.fnFindLatLangZipCodeRequest(locDetails);
  }
  /**
   *
   * @param {*} avl Array
   * Need to check if there is Inventory in cart or not
   * based on that need to show available item or not in store list drawer
   */
  getInventoryInfo(avl = []) {
    let allItems = [];
    const { cms, pdpProductItemId, getCartDetails } = this.props;
    if (pdpProductItemId) {
      allItems.push(pdpProductItemId);
    } else if (getCartDetails && getCartDetails.data && getCartDetails.data.allItems) {
      ({ allItems } = getCartDetails.data);
    }
    return (
      <span className={`o-copy__12reg mr-1 pr-half ${avl.length === 0 ? styles.NotAvailableItem : styles.storeAvailibility}`}>
        {avl.length ? `${avl.length} of ${allItems.length} ${cms.itemsAvailableForPickUpLabel}` : `${cms.notAvailableLabel}`}
      </span>
    );
  }
  /**
   * @param {Number} storeId
   * @param {object} stateObject - optional - allows for the passing of previous state.  If no state is passed, uses this.state
   * For getting the value of show more counter and number of item to display
   */
  getLimit(storeId, stateObject) {
    const state = stateObject || this.state;
    // const intitalLimit = 5;
    // return storeId && this.state.showLimit <= intitalLimit ? this.state.showLimit - 1 : this.state.showLimit;
    return storeId ? state.showLimit - 1 : state.showLimit;
  }

  getInventoryStatus = myStoreDetails => {
    const { data, pdpProductItemId, getCartDetails, findAStoreModalIsOpen } = this.props;
    let inventory = [];
    let avl = [];
    let unAvl = [];
    if (data.storeDetails && data.storeDetails.data && !data.storeDetails.isFetching) {
      ({ inventory } = findFavStoreInventory(data.storeDetails.data, myStoreDetails && myStoreDetails.gx_id));
      const stockData = this.getStockData(getCartDetails, pdpProductItemId, findAStoreModalIsOpen);
      if (stockData.length) {
        ({ avl, unAvl } = getStockAvailabilityStatus(stockData, inventory));
      }
      return { inventory, avl, unAvl };
    }
    return {};
  };

  getSkusBySource = (source, pdpProductItemId) => {
    const { skuItemId, quantity, skuId } = pdpProductItemId;
    let skus = '';
    if (!source || source !== SOURCE_REALTIME) {
      skus = `${skuId}:${quantity}`;
    } else {
      skus = `${skuItemId}:${quantity}`;
    }
    return skus;
  };

  /**
   * Helper method to get stock data based on source either from cart or pdp data
   */
  getStockData = (getCartDetails, pdpProductItemId, findAStoreModalIsOpen = {}) => {
    const { pageType } = findAStoreModalIsOpen;
    const stockData = [];
    if (pageType !== FAM_PAGE_TYPE_PDP) {
      const { data: { allItems = [] } = {} } = getCartDetails;
      stockData.push(...allItems);
    } else {
      stockData.push(pdpProductItemId);
    }
    return stockData;
  };

  setFavouriteStore(userId, cms, fnUpdateMyStoreDetails) {
    let store = null;
    axios
      .get(`${profileAPI}${userId}`)
      .then(r => {
        if (r.status === 200) {
          if (r.data.profile && r.data.profile.store && r.data.profile.store.stores && r.data.profile.store.stores.length) {
            store = getStoreInfo(r.data.profile.store.stores[0], cms);
            store.bopisEligible = store.bopisEligible || '0';
            store.userId = userId;
            setSelectedStoreCookies(store);
            fnUpdateMyStoreDetails(store);
            this.updateLatLangOnMount(store);
          }
        }
      })
      .catch(r => {
        console.error(r);
      });
  }

  /**
   * @description Attempts to pull the GxId from getMyStoreDetails
   */
  getGxId() {
    const { getMystoreDetails } = this.props;
    const { neighborhood } = getMystoreDetails || {};

    const gxId = (neighborhood ? getMystoreDetails.gx_id : null) || null;
    return gxId;
  }

  /**
   * @description Attempts to return stores array from props.
   * @returns {Array} of stores
   */
  getStores() {
    const { data } = this.props;
    const { storeDetails } = data || {};
    const { data: stores } = storeDetails || {};
    return stores || [];
  }

  /**
   * @description returns the store line item's wrapperRef which is mapped via store index in stores array.
   * @param  {number} idx - index of store in stores array
   * @returns
   */
  getStoreWrapperRefByIndex(idx) {
    this.storeWrapperRefs[idx] = this.storeWrapperRefs[idx] || React.createRef();
    return this.storeWrapperRefs[idx];
  }
  /**
   * Utility for getting visible store ids delimited by commas.
   */
  getDelimitedStoreIds(previousLimit = 0) {
    const {
      data: { storeDetails }
    } = this.props;
    const { showLimit } = this.state;
    const visibleStoresList = storeDetails && storeDetails.data && storeDetails.data.slice(previousLimit, showLimit);
    const result =
      visibleStoresList &&
      visibleStoresList.length > 0 &&
      Object.keys(visibleStoresList)
        .map(store => visibleStoresList[store].storeId)
        .toString()
        .replace(/,/g, ',')
        .toLowerCase()
        .replace(/(store-(0)*)/g, '');
    return result;
  }

  /* Returns count of available and unavailable items at currently selected 'make my store' */
  getCountOfItems() {
    const { getMystoreDetails } = this.props;
    const inventoryStatus = this.getInventoryStatus(getMystoreDetails);
    const { avl = [], unAvl = [] } = inventoryStatus;
    return { avl: avl.length || '0', unAvl: unAvl.length || '0' };
  }
  /**
   * Utility function to determine if Modal was closed from SOF Drawer.
   */
  isModalClosedFromSOFDrawer = (previousModalState, findAStoreModalIsOpen) =>
    previousModalState.status && !findAStoreModalIsOpen.status && previousModalState.isBopisEligible;

  resetStoreCookies(prevProps) {
    const { getMystoreDetails: prevStoreDetails } = prevProps;
    const { getMystoreDetails: storeDetails } = this.props;
    const { neighborhood: prevNeighborhood } = prevStoreDetails || {};
    const { neighborhood } = storeDetails || {};
    if (neighborhood && neighborhood !== prevNeighborhood) {
      const gxId = storeDetails.gx_id || null;
      Storage.setCookie(COOKIE_STORE_ID, gxId);
      setSelectedStoreCookies(storeDetails);
      Storage.setCookie(COKIE_SELECTED_ZIPCODE, storeDetails.zipCode);
      const loggedInState = Storage.getCookie(USERTYPE);
      if (loggedInState === 'R') {
        Storage.setSessionStorage('storeId', appendStoreName(gxId, false));
      }
    }
  }

  /**
   * Utility function for checking if single store in API response is same as saved store.
   */
  checkForSingleStore() {
    const {
      data: { storeDetails, getMystoreDetails }
    } = this.props;
    if (storeDetails && storeDetails.data && storeDetails.data.length === 1) {
      const firstStoreID = storeDetails.data[0].storeId.replace(/(store-(0)*)/g, '');
      const myStoreID = (Object.keys(getMystoreDetails).length > 0 && getMystoreDetails.gx_id) || '';
      return firstStoreID !== myStoreID;
    }
    return true;
  }
  /**
   * @param {string} label to be passed to GTM layer for different search result scenarios.
   */
  pushStoreSearchAnalyticsData(action, label, additionalAttributes = {}, prevStoreLimit = 0) {
    const {
      analyticsContent,
      data: { storeDetails }
    } = this.props;
    const { zipcode, showLimit } = this.state;
    const storesList = storeDetails && storeDetails.data;
    const successfulStoreSearch = storeDetails && storesList && !storeDetails.isFetching && storesList.length > 0;
    const analyticsData = {
      event: ANALYTICS_EVENT_IN,
      eventCategory: ANALYTICS_EVENT_CATEGORY,
      eventAction: action,
      eventLabel: label,
      searchresultscount: storesList && parseInt(storesList.length, 10),
      storeid: this.getDelimitedStoreIds(prevStoreLimit) || EMPTY_VAL,
      storesearchkeyword: zipcode || EMPTY_VAL,
      successfulstorefinder: successfulStoreSearch ? TRUE : FALSE,
      unsuccessfullstorefinder: successfulStoreSearch ? FALSE : TRUE,
      viewstoredetails: showLimit > 5 ? TRUE : FALSE,
      ...additionalAttributes
    };
    analyticsContent(analyticsData);
  }

  successfulStoreSearch(previousStoreDetails, storeDetails) {
    return (
      storeDetails &&
      previousStoreDetails &&
      previousStoreDetails.isFetching &&
      !storeDetails.isFetching &&
      storeDetails.data &&
      storeDetails.data.length > 0
    );
  }
  unsuccessfulStoreSearch(previousStoreDetails, storeDetails) {
    return (
      storeDetails &&
      previousStoreDetails &&
      previousStoreDetails.isFetching &&
      !storeDetails.isFetching &&
      storeDetails.data &&
      storeDetails.data.length === 0
    );
  }
  successfulMyStoreChange(previousMyStoreDetails, myStoreDetails) {
    const { status } = this.props.findAStoreModalIsOpen;
    return status && previousMyStoreDetails && myStoreDetails && previousMyStoreDetails.gx_id !== myStoreDetails.gx_id;
  }

  /**
   * @param {*} position Object
   * Fetch store details when user allow geo location
   */
  showPositionAccessed(position) {
    let storeId = null;
    const { cms, labels: { bopisEnabled: globalBopisEnabled } = {} } = this.props;
    const selectedStoreNo = this.getStoreId();
    const storeEligibility = globalBopisEnabled === LABEL_TRUE ? 1 : 0;
    this.props.fnlatLangDetailsForMap({ lat: position.coords.latitude, lang: position.coords.longitude });
    if (selectedStoreNo) {
      storeId = appendStoreName(selectedStoreNo, true);
    }
    this.props.fnloadStoreDetails({
      lat: position.coords.latitude,
      lang: position.coords.longitude,
      radius: cms.radiusLabel,
      storeId,
      storeEligibility
    });
  }

  /**
   * When geo location is blocked, fetch geo from IP
   * Has to be changed to get lat/lang from Akamai
   */
  showPositionBlocked() {
    const { labels: { bopisEnabled: globalBopisEnabled } = {} } = this.props;
    let storeId = null;
    const storeEligibility = globalBopisEnabled === LABEL_TRUE ? 1 : 0;
    const selectedStoreNo = this.getStoreId();
    const mySelectedStore = getSelectedStoreFromCookies();
    const cookieInStore = Storage.getCookie(COOKIE_STORE_ID);
    if (selectedStoreNo) {
      storeId = appendStoreName(selectedStoreNo, true);
    }
    const radius = this.props.cms.radiusLabel;
    this.props.fnfetchFromAkamai({ storeId, radius, mySelectedStore, cookieInStore, storeEligibility });
    // this.props.fnfetchFromIpRequest({ radius: this.props.cms.radiusLabel, storeId });
  }

  /**
   * Common function for getting mystore cookie data
   */

  myStoreCookieDetails() {
    const c = getCookieValues();
    const { cms, fnUpdateMyStoreDetails } = this.props;
    let myStoreData;

    if (c.selectedStore) {
      try {
        myStoreData = c.selectedStore;
      } catch (e) {
        myStoreData = {};
      }

      if (c.userId && c.userId !== myStoreData.userId && c.userType === 'R' && c.userId > 0) {
        this.setFavouriteStore(c.userId, cms, fnUpdateMyStoreDetails);
      }
      fnUpdateMyStoreDetails(myStoreData);
      this.updateLatLangOnMount(myStoreData);
    } else if (c.userId && c.userType === 'R' && c.userId > 0) {
      this.setFavouriteStore(c.userId, cms, fnUpdateMyStoreDetails);
    }

    return myStoreData;
  }

  updateLatLangOnMount(mystoreData) {
    const { geometry } = mystoreData;
    const { fnlatLangDetailsForMap } = this.props;

    if (!geometry) {
      fnlatLangDetailsForMap({ lat: 0, lang: 0 });
    } else {
      const [lat, lang] = geometry.coordinates;
      fnlatLangDetailsForMap({ lat, lang });
    }
  }

  focusEle(e) {
    e.preventDefault();
    this.setState({ inputFocused: true });
  }
  blurEle(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ inputFocused: false });
  }
  handleKeyDown(e) {
    if (e.keyCode === 13 || e.which === 13) {
      this.getStoreDetails(e);
    }
  }
  /**
   * @description Attempts to set focus on the first store of most recently loaded stores
   */
  focusAndScrollToRecentlyLoadedStores() {
    const limit = this.getLimit(this.getGxId()) || (this.getStores() || []).length;
    const expectedFocusIndex = limit - 5;
    const ref = this.getStoreWrapperRefByIndex(expectedFocusIndex);
    if (ref && ref.current) {
      ref.current.focus();
      setTimeout(() => {
        scrollIntoView(ref.current, { offset: -20, duration: 150 }, this.overlayEl);
      }, 200);
    }
  }

  /**
   *
   * @param {Object} e
   * Method for cancelling blur event of input field
   */
  handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  /**
   * For retriving if user is Logged in or not
   */
  isLoggedIn() {
    const loggedInState = Storage.getCookie(USERTYPE);
    if (loggedInState === 'R') {
      return true;
    }
    return false;
  }
  /**
   * For Closing the FASM modal
   */
  toggleModal() {
    this.setState(() => ({
      showLimit: 5,
      dirtySearchField: false,
      clickedStoreId: ''
    }));
    this.props.fnToggleFindAStore({ origin: 'header', status: false });
    if (ExecutionEnvironment.canUseDOM && isMobile()) {
      const elem = document.querySelector('.fas-scroll-container');
      enableBodyScroll(elem);
    }
  }
  /**
   * @param {*} e eventAction
   * @param {*} counter Number
   * Logic for setting value of View Next 5 store CTA
   */
  seeMoreStores(e, counter) {
    e.preventDefault();
    this.setState(previousState => ({
      showLimit: previousState.showLimit + counter
    }));
  }
  /**
   * @param {*} todayHours
   * For displaying today open hours in proper format
   */
  displayStoreHours({ todayTiming }) {
    return (
      <Fragment>
        <p className={`${styles.Days} p-0 m-0`}>{todayTiming}</p>
      </Fragment>
    );
  }
  /**
   * @param {*} storeDetails Array
   * @param {*} storeNo String
   * @param {*} storeGeo Object
   * @param {*} e event
   * @param {*} avl Array
   * Handles make my store CTA from store details accordion
   */
  makeMyStore(storeDetails, storeNo, storeGeo, e) {
    e.preventDefault();
    const { pdpProductItemId, getCartDetails } = this.props;
    const openhours = storeDetails.todayTiming;
    const sessionToStore = {
      openhours,
      streetAddress: storeDetails.streetAddress,
      todayHours: storeDetails.todayHours,
      neighborhood: storeDetails.neighborhood,
      phone: storeDetails.phone,
      state: storeDetails.state,
      zipCode: storeDetails.zipCode,
      city: storeDetails.city,
      gx_id: storeDetails.gx_id,
      storeId: storeDetails.gx_id,
      storeName: storeDetails.storeName,
      geometry: storeGeo,
      bopisEligible: storeDetails.bopisEligible,
      isFav: storeDetails.isFavStore,
      distance: storeDetails.distance,
      manualSearch: false,
      weekHours: storeDetails.weekHours,
      todayTiming: storeDetails.todayTiming
    };
    Storage.setCookie(SAVED_FAVOURITE_STORE, storeDetails.gx_id);
    const fourDigitStoreName = appendStoreName(storeNo, false);
    const userId = Storage.getCookie(USERACTIVITY);
    const loggedInState = Storage.getCookie(USERTYPE);

    const makeMyStoreBody = {
      storeInfo: sessionToStore,
      userId,
      stLocId: fourDigitStoreName
    };

    /**
     * Check Cart, if there are no data then, fine to proceed with Updating Store.
     * If data in cart call Order Id API to check.
     * If it fails don't update then update make my store.
     * */
    if (getCartDetails && getCartDetails.data && !checkNullObject(getCartDetails.data) && !pdpProductItemId) {
      this.props.fnupdateOrderIdRequest({ storeId: storeNo, sessionToStore, loggedInState, makeMyStoreBody });
    } else {
      Storage.setCookie(COOKIE_STORE_ID, storeDetails.gx_id);
      Storage.setCookie(COKIE_SELECTED_ZIPCODE, storeDetails.zipCode);
      setSelectedStoreCookies(sessionToStore);
      if (loggedInState === 'R') {
        this.props.fnMakeMyStore({ makeMyStoreBody });
        Storage.setSessionStorage('storeId', appendStoreName(storeDetails.gx_id));
      }
      this.props.fnUpdateMyStoreDetails(sessionToStore);
      this.props.fnmakeMyStoreDetailsUpdated();
    }
    // Scroll to top whenever store selection happens
    if (ExecutionEnvironment.canUseDOM) {
      document.querySelector('.fas-scroll-container').scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  /**
   * @param {*} accordionValue Object
   * @param {*} showMoreCounter Number
   * Renders store details in accordion in FASM
   */
  accordionRender(accordionValue, showMoreCounter) {
    const { cms, getMystoreDetails, getCartDetails = {}, data, pdpProductItemId = null, findAStoreModalIsOpen } = this.props;
    let avl = [];
    let unAvl = [];
    let gxId = null;
    const { selectedStoreNo } = this.state;
    if (getMystoreDetails && getMystoreDetails.neighborhood) {
      gxId = getMystoreDetails.gx_id || null;
    }
    const totalStoreList = this.getLimit(gxId);
    const stockData = this.getStockData(getCartDetails, pdpProductItemId, findAStoreModalIsOpen);
    return (
      <div>
        {accordionValue && accordionValue.length ? (
          <Fragment>
            {accordionValue.slice(0, totalStoreList).map((item, storeIdx) => {
              const { properties, inventory, storeId } = item;
              const wrapperRef = this.getStoreWrapperRefByIndex(storeIdx);
              if (stockData.length > 0) {
                ({ avl, unAvl } = getStockAvailabilityStatus(stockData, inventory));
              }
              return (
                <Fragment>
                  {!properties ? null : (
                    <div
                      key={item.storeId}
                      tabIndex={0} // eslint-disable-line
                      className={`${styles.accordWrapper} o-copy__14reg ${selectedStoreNo === properties.gx_id ? 'pt-0' : ''}`}
                      ref={wrapperRef}
                    >
                      <Drawer
                        isOpen={this.state.clickedStoreId === properties.gx_id}
                        className={styles.drawerFocus}
                        expandBelow={false}
                        title={this.renderTitleForItems(properties.neighborhood, properties.distance, properties.gx_id, properties, avl)}
                        closeIcon="academyicon icon-plus "
                        openIcon="academyicon icon-minus"
                        // ref={this.VIEWER_REF}
                        key={properties.storeName}
                        titleStyle={styles.accordPanel}
                        bodyStyle={styles.detailsPanel}
                        selectedStore={gxId === properties.gx_id}
                        onToggle={() => this.updateOnToggle(properties.gx_id)}
                      >
                        {this.renderFindAStoreBody(properties, item.geometry, avl, unAvl, storeId)}
                      </Drawer>
                    </div>
                  )}
                </Fragment>
              );
            })}
          </Fragment>
        ) : null}
        <div className={classNames('d-flex justify-content-center')}>
          {showMoreCounter > 0 && data.storeDetails.data.length > this.state.showLimit ? (
            <Button
              auid="find-a-store-see-more-button"
              aria-label={cms.viewNextStoreLabel}
              type="button"
              className={classNames(`${styles.storeBtn}`, 'mb-half')}
              onClick={e => {
                this.seeMoreStores(e, showMoreCounter);
              }}
            >
              {this.renderInterpolation(cms.viewNextStoreLabel, showMoreCounter)}
            </Button>
          ) : null}
        </div>
      </div>
    );
  }
  /**
   * For displaying no store found message
   */
  noStore() {
    const { cms } = this.props;
    return (
      <div className="noStore o-copy__16reg offset-md-2 col-md-8 text-center mt-1">
        {this.renderInterpolation(cms.sorryMessageLabel, cms.radiusLabel)}
      </div>
    );
  }
  /**
   * Filters out the fav store and pass other store to Accordion
   */
  storeRender() {
    let { data } = this.props.data.storeDetails;
    const { getMystoreDetails } = this.props;
    let showMoreCounter = 0;
    const limitRange = 5;
    const { isFetching } = this.props.data.storeDetails;
    let gxId = null;
    if (getMystoreDetails && getMystoreDetails.neighborhood) {
      gxId = getMystoreDetails.gx_id || null;
    }
    if (gxId) {
      data = data.filter(item => {
        if (gxId === item.properties.gx_id || item.properties.isFavStore) {
          return false;
        }
        return true;
      });
    }
    if (data && !isFetching) {
      if (data.length !== 0) {
        const limit = this.getLimit(gxId);
        showMoreCounter = data.length - limit >= limitRange ? limitRange : data.length - limit;
      }
      return this.accordionRender(data, showMoreCounter);
    }
    return null;
  }
  existScript() {
    if (!ExecutionEnvironment.canUseDOM) return null;
    return document.getElementById('aso-googlemap');
  }
  /**
   * Renders Favstore in accordion
   */
  myStoreAccordian() {
    const { cms, getMystoreDetails } = this.props;
    let myStoreDetails;
    if (getMystoreDetails && getMystoreDetails.isCompleted) {
      myStoreDetails = getMystoreDetails;
    }
    const invStatus = this.getInventoryStatus(myStoreDetails);
    const { avl, unAvl } = invStatus;
    if (myStoreDetails && myStoreDetails.neighborhood && !checkNullObject(myStoreDetails)) {
      return (
        <div className={`${styles.accordWrapper} ${styles.yourStoreWrapper} o-copy__14reg`}>
          <span className={`${styles.storeTag} text-uppercase d-s-block ml-2`}>{cms.yourStoreLabel}</span>
          <Drawer
            isOpen={this.state.clickedStoreId === myStoreDetails.gx_id}
            className={styles.drawerFocus}
            title={this.renderTitleForItems(myStoreDetails.neighborhood, myStoreDetails.distance, myStoreDetails.gx_id, myStoreDetails, avl)}
            closeIcon="academyicon icon-plus "
            openIcon="academyicon icon-minus"
            tabIndex="0"
            key={myStoreDetails.storeName}
            onToggle={() => this.updateOnToggle(myStoreDetails.gx_id)}
            titleStyle={styles.accordPanel}
            bodyStyle={styles.detailsPanel}
          >
            {this.renderFindAStoreBody(myStoreDetails, myStoreDetails.geometry, avl, unAvl, this.formatStoreId(myStoreDetails.gx_id))}
          </Drawer>
        </div>
      );
    }
    return null;
  }

  formatStoreId = (storeId = '') => {
    switch (storeId.length) {
      case 1:
        return `store-000${storeId}`;
      case 2:
        return `store-00${storeId}`;
      case 3:
        return `store-0${storeId}`;
      default:
        return `store-${storeId}`;
    }
  };

  /**
   * Renders the main modal content, Map, Input Box and Accordion
   */
  modalContent() {
    const { cms, getMystoreDetails } = this.props;
    let gxId = null;
    if (getMystoreDetails && getMystoreDetails.neighborhood) {
      gxId = getMystoreDetails.gx_id || null;
    }
    return (
      <div className={`o-copy__16reg ${styles.container} `} data-auid="find-a-store-modal">
        <button
          onClick={this.toggleModal}
          className={`${styles.closebtn} p-1`}
          tabIndex={0}
          aria-label="find a store close button"
          data-auid="find-a-store-modal-close"
        >
          <span className="academyicon icon-close icon a-close-icon" aria-hidden="true" />
        </button>
        <div className="col-12 flex-row mb-2 p-0">
          <h2 className={`text-uppercase ${styles.headerStyle} `}>{cms.findStoreHeading ? cms.findStoreHeading : 'Find A Store'}</h2>
          <div className={styles.mapContainer}>
            <div className={styles.mainGoogleMap}>{this.renderGoogleMap()}</div>
            <div className={`position-absolute p-md-2 p-1 ${styles.searchContainer}`}>
              <form
                action="."
                data-auid="find-a-store"
                noValidate
                className={`position-relative d-flex o-copy__14reg ${this.state.inputFocused && 'focused'}`}
                onSubmit={e => this.getStoreDetails(e)}
              >
                <input
                  placeholder={cms.searchLabel ? cms.searchLabel : SEARCH_LABEL}
                  aria-label={cms.searchLabel}
                  name="zipcode"
                  type="search"
                  title="search"
                  autoComplete="off"
                  autoFocus={isMobile() ? false : true} // eslint-disable-line
                  tabIndex={0}
                  onFocus={e => this.focusEle(e)}
                  onBlur={e => this.blurEle(e)}
                  ref={this.searchInputRef}
                  onKeyDown={this.handleKeyDown}
                  onChange={e => {
                    this.onChangeinput(e);
                  }}
                  value={this.state.zipcode}
                  className={styles.inputclass}
                />
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a
                  href="#"
                  aria-label="search"
                  ref={this.submitBtnRef}
                  tabIndex={0}
                  onClick={e => this.getStoreDetails(e)}
                  data-auid="submit-zip-code"
                >
                  <span className={`${styles.iconclass} academyicon icon-search`} />
                </a>
                {this.renderClearZipCode()}
              </form>
            </div>
          </div>
        </div>
        {this.renderStoreAvailability(gxId)}
      </div>
    );
  }

  /**
   * For clear zip code when user click on X icon in input field
   */
  clearZipcode() {
    this.searchInputRef.current.value = '';
    this.setState({ zipcode: '' });
  }

  loadFASModal = (isBopisEligible, source, pageType, storeEligibility) => {
    const { pdpProductItemId, latLangDetailsForMap: { data = {} } = {}, getMystoreDetails = {}, cms } = this.props;
    const selectedStoreNo = this.getStoreId();
    const { lat, lang } = data;
    const radius = cms.radiusLabel;
    const storeId = appendStoreName((getMystoreDetails.isCompleted && getMystoreDetails.gx_id) || selectedStoreNo, true);
    if (pageType === FAM_PAGE_TYPE_PDP) {
      const skus = this.getSkusBySource(source, pdpProductItemId);
      this.props.fnloadStoreDetails({ lat, lang, radius, storeId, skus, pdp: true, isBopisEligible, storeEligibility });
    } else {
      // Call Cart API
      this.props.fngetCartDetails({ isBopisEligible, source, storeEligibility });
    }
  };
  /**
   * Once user is in PDP page, on click of change location
   * it will provide PDP page product info to the Store locator
   * Need to pass PDP page sku id to get product inventory
   */
  afterOpenModal() {
    /**
     * Once user is in PDP page, on click of change location
     * it will provide PDP page product info to the Store locator
     * Need to pass PDP page sku id to get product inventory
     */
    const { getMystoreDetails, findAStoreModalIsOpen = {}, labels: { bopisEnabled: globalBopisEnabled } = {} } = this.props;
    const storeEligibility = globalBopisEnabled === LABEL_TRUE ? 1 : 0;
    this.setState(() => ({ zipcode: '' }));
    if (ExecutionEnvironment.canUseDOM && isMobile()) {
      const elem = document.querySelector('.fas-scroll-container');
      disableBodyScroll(elem);
    }
    if (getMystoreDetails && getMystoreDetails.isCompleted) {
      this.setState(() => ({ clickedStoreId: getMystoreDetails.gx_id }));
    }
    const { isBopisEligible = false, source = '', pageType = FAM_PAGE_TYPE_ALL } = findAStoreModalIsOpen;
    this.loadFASModal(isBopisEligible, source, pageType, storeEligibility);
  }

  /**
   * @param {*} storeId
   * Changing drawer status closed/open
   */
  checkCallStoreAPI(myStore, storeId) {
    let shouldCall = false;
    if (myStore && storeId) {
      try {
        const cookieData = JSON.parse(myStore);
        const zeroPrefixedMyStoreId = appendStoreName(cookieData.gx_id, false);
        const zeroPrefixedStoreId = appendStoreName(storeId, false);
        if (zeroPrefixedStoreId !== zeroPrefixedMyStoreId) {
          shouldCall = true;
        } else {
          shouldCall = false;
        }
      } catch (e) {
        shouldCall = false;
      }
    } else if (myStore) {
      shouldCall = false;
    } else {
      shouldCall = true;
    }
    return shouldCall;
  }
  updateOnToggle(storeId) {
    this.setState(
      prevState => {
        if (prevState.clickedStoreId === storeId) {
          return { clickedStoreId: '' };
        }
        return { clickedStoreId: storeId };
      },
      () => {
        if (storeId === this.state.clickedStoreId) {
          this.pushStoreSearchAnalyticsData(ANALYTICS_EVENT_ACTION.VIEW, storeId, {
            searchresultscount: NULL,
            storeid: storeId,
            storesearchkeyword: NULL,
            successfulstorefinder: FALSE,
            unsuccessfullstorefinder: FALSE,
            viewstoredetails: TRUE
          });
        }
      }
    );
  }

  showClosedStores = () => {
    const { cms, storeDetails } = this.props;
    const { data } = storeDetails;
    const noStoreShow = 5;
    return (
      <Fragment>
        {data && data.length >= noStoreShow ? (
          <h4 className={`${styles.clostestStoreText} text-center o-copy__16reg`}>
            {this.state.showLimit} {cms.closestStoresLabel}
          </h4>
        ) : null}
      </Fragment>
    );
  };
  /*
   * @param {object} store
   * Check if particular store is BOPIS or not
   */
  checkIsBopisStore(store) {
    const { bopisEligible } = store;
    return bopisEligible && bopisEligible === '1';
  }
  /**
  noDisplay() {
    const { storeDetails } = this.props;
    const { data, isFetching } = storeDetails;
    return !(!isFetching && data && data.length === 1);
  }
  */
  renderMyStoreAccordion = () => {
    const { getMystoreDetails } = this.props;
    return <Fragment>{getMystoreDetails && getMystoreDetails.isCompleted && getMystoreDetails.gx_id && this.myStoreAccordian()}</Fragment>;
  };

  renderStoreAvailability(gxId) {
    const { storeDetails, getCartDetails: { isFetching: isCartFetching } = {} } = this.props;
    const { data, isFetching } = storeDetails;
    // Show spinner while API call is in progress
    if (isFetching || isCartFetching) {
      return <Spinner />;
    }
    return (
      <Fragment>
        {this.showClosedStores()}
        {this.renderMyStoreAccordion()}
        {data && data.length > 0 && this.storeRender()}
        {!data || data.length === 0 || (data && gxId && data.length === 1) ? this.noStore() : null}
      </Fragment>
    );
  }

  renderClearZipCode() {
    return (
      <Fragment>
        {this.searchInputRef &&
          this.searchInputRef.current &&
          this.searchInputRef.current.value !== '' &&
          this.state.inputFocused && (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              href="#"
              role="button"
              data-auid="clear-zip-code"
              onClick={() => {
                this.clearZipcode();
              }}
              onMouseDown={e => this.handleMouseDown(e)}
              aria-label="clear zip code"
              className={styles.closeSearchBtn}
            >
              <span className="hidden academyicon icon-close" aria-hidden="true" />
            </a>
          )}
      </Fragment>
    );
  }
  /**
   * @param {*} name
   * @param {*} distance
   * @param {*} gxId
   * @param {*} avl
   * Show title for accordion when in collapsed state
   */
  renderTitleForItems(name, distance, gxId, properties, avl) {
    /**
     * Change the parameters of renderTitleForItems
     * Previous params where name, distance,, isDrawerOpen, avl
     * Handled that from different way
     */
    const { clickedStoreId } = this.state;
    const { pdpProductItemId, getCartDetails, findAStoreModalIsOpen, labels: { bopisEnabled: globalBopisEnabled } = {} } = this.props;
    const stockData = this.getStockData(getCartDetails, pdpProductItemId, findAStoreModalIsOpen);
    const storeEligibility = globalBopisEnabled === LABEL_TRUE ? 1 : 0;
    return (
      <div className="d-md-flex w-100">
        <div className={`${styles.storeTitle ? styles.storeTitle : ''} o-copy__14bold mr-auto`}>{name}</div>
        <div className={styles.inventoryLabels}>
          {this.checkIsBopisStore(properties) && storeEligibility && stockData.length && clickedStoreId !== gxId ? (
            <div className="float-md-none float-right">{this.getInventoryInfo(avl)}</div>
          ) : null}
          <div className={cx('float-md-none float-left', styles.distanceDiv)}>
            <span className="o-copy__12reg mr-1 pr-half">{`${distance} mi`}</span>
          </div>
        </div>
      </div>
    );
  }
  /**
   * google map implemention in Modal Content
   */
  renderGoogleMap() {
    const markers = [];
    const { latLangDetailsForMap, data } = this.props;
    const centerPoint = {
      lat: latLangDetailsForMap.isCompleted && !latLangDetailsForMap.error ? latLangDetailsForMap.data.lat : 0,
      lng: latLangDetailsForMap.isCompleted && !latLangDetailsForMap.error ? latLangDetailsForMap.data.lang : 0
    };

    if (data.storeDetails && data.storeDetails.data && data.storeDetails.data.length) {
      data.storeDetails.data.some((store, idx) => {
        if (idx >= this.state.showLimit) {
          return true;
        }
        const { geometry } = store;
        if (geometry && geometry.coordinates && geometry.coordinates.length) {
          markers.push({
            position: {
              lat: geometry.coordinates[0] || 0,
              lng: geometry.coordinates[1] || 0
            }
          });
        }

        return false;
      });
    }

    return <GoogleMaps markers={markers} centerPoint={centerPoint} draggable="true" />;
  }
  /**
   *
   * @param {*} storeValue
   * @param {*} storeGeo
   * @param {*} avl
   * @param {*} unAvl
   * Renders the store detail list
   */
  renderFindAStoreBody(storeValue, storeGeo, avl = [], unAvl = [], storeId) {
    const { cms, getMystoreDetails, latLangDetailsForMap, labels: { bopisEnabled: globalBopisEnabled } = {} } = this.props;
    const { clickedStoreId } = this.state;
    const data = storeValue;
    const storeEligibility = globalBopisEnabled === LABEL_TRUE ? 1 : 0;
    let gxId = null;
    let drivingDirectionsUrl = '';
    if (getMystoreDetails && getMystoreDetails.neighborhood) {
      gxId = getMystoreDetails.gx_id || null;
    }
    if (!latLangDetailsForMap.error) {
      drivingDirectionsUrl = `${GOOGLE_MAP_DIRECTIONS_URL}origin=${latLangDetailsForMap.data.lat},${latLangDetailsForMap.data.lang}&destination=${
        storeGeo.coordinates[0]
      },${storeGeo.coordinates[1]}`;
    }
    const overlayImage = css`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url(${cms.commonLabels.outOfStockImageURL});
      background-position: 50% 50%;
      z-index: 1;
    `;
    return (
      <div className={`${styles.storeBodyStyle} StoreBody`}>
        <div className="row">
          <div className="col-md-7 col-sm-12 1mt-">
            <div className={styles.StoreAddress}>
              <a
                className="o-copy__14reg"
                target="_blank"
                rel="noopener noreferrer"
                href={`${cms.storeDetailLink || STORE_LOCATOR_LINK}/${decodeURIComponent(
                  data.state.toUpperCase().replace(/\s/g, '')
                )}/${decodeURIComponent(data.city.replace(/\s/g, ''))}/${storeId}`}
              >
                <p className="mb-0">{data.streetAddress}</p>
                <p className="mb-0">
                  {data.city}, {data.state.toUpperCase()} {data.zipCode}
                </p>
              </a>
            </div>
            <div className="pt-half">{this.displayStoreHours(data)}</div>
          </div>
          <div className="col-md-5 col-sm-12">
            <div className="mb-md-quarter pt-md-quarter pt-1 mb-half">
              <span className={`${styles.iconChat} academyicon icon-phone`} />
              <a
                href={`tel:${data.phone}`}
                className={styles.drivingDir}
                onClick={() =>
                  this.pushStoreSearchAnalyticsData(ANALYTICS_EVENT_ACTION.DIRECTIONS, clickedStoreId, {
                    searchresultscount: NULL,
                    storeid: clickedStoreId,
                    storesearchkeyword: NULL,
                    successfulstorefinder: FALSE,
                    unsuccessfullstorefinder: FALSE,
                    viewstoredetails: FALSE
                  })
                }
              >
                {data.phone}
              </a>
            </div>
            <div className="mb-quarter">
              <span className={`${styles.iconNav} academyicon icon-location-pin`} />
              <a
                href={drivingDirectionsUrl}
                target="_blank"
                className={styles.drivingDir}
                rel="noopener noreferrer"
                onClick={() =>
                  this.pushStoreSearchAnalyticsData(ANALYTICS_EVENT_ACTION.DIRECTIONS, clickedStoreId, {
                    searchresultscount: NULL,
                    storeid: clickedStoreId,
                    storesearchkeyword: NULL,
                    successfulstorefinder: FALSE,
                    unsuccessfullstorefinder: FALSE,
                    viewstoredetails: FALSE
                  })
                }
              >
                {cms.drivingDirectionLabel}
              </a>
            </div>
          </div>
        </div>
        {this.checkIsBopisStore(storeValue) && storeEligibility ? (
          <div className="row">
            {avl.length ? (
              <div className="col-md-6">
                <div className={`${styles.AvailableItem} d-inline-block pt-2`}>
                  {avl.length === 1 ? cms.itemsAvailableForPickUpLabelSingle : cms.itemsAvailableForPickUpLabel}
                  <div className={styles.inventroyRow}>{this.renderInventory(avl)}</div>
                </div>
              </div>
            ) : null}
            {unAvl.length ? (
              <div className="col-md-6">
                <div className={`${styles.NotAvailableItem} d-inline-block pt-2`}>
                  <div className={styles.inventroyRpw}>
                    {unAvl.length === 1 ? cms.itemNotAvailableForPickUpLabelSingle : cms.itemsNotAvailableForPickUpLabel}
                    <div className={`${styles.inventroyRow} d-flex align-items-center`}>{this.renderInventory(unAvl, overlayImage)}</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        {gxId !== storeValue.gx_id ? (
          <Button
            auid="find-a-store-mystore-button"
            type="button"
            className={styles.myStoreBtn}
            aria-label={cms.makeMyStoreLabel}
            // onClick={e => this.makeMyStore(storeId, singleStoreData, singleStoreData.gx_id, e)}
            onClick={e => this.makeMyStore(storeValue, storeValue.gx_id, storeGeo, e)}
          >
            {cms.makeMyStoreLabel}
          </Button>
        ) : null}
      </div>
    );
  }
  /**
   * @param {*} value
   * @param {*} rpt
   * Parses the cms content and replace it with actual value
   */
  renderInterpolation(value, rpt) {
    if (value) {
      return value.replace(/{{\s*\w*\s*}}/, rpt);
    }
    return value;
  }
  /**
   * @param {*} inventoryItem
   * @param {*} overlayImage
   * For displaying inventory in accordion
   */
  renderInventory(inventoryItem, overlayImage = {}) {
    return inventoryItem.map(item => (
      <div className={styles.inventroyThumb}>
        {item && item.thumbnail && <img src={item.thumbnail.concat('?wid=100&hei=100')} alt={item.imageAltDescription} />}
        <div className={`${overlayImage}`} />
      </div>
    ));
  }

  render() {
    const { status } = this.props.findAStoreModalIsOpen;
    if (ExecutionEnvironment.canUseDOM && this.props.findAStoreModalIsOpen && !this.existScript()) {
      // this.addScript();
    }
    // Update fetched data in Session
    return (
      <div className="findAStoreModal" data-auid="find-a-store-modal">
        {/* <span role="button" tabIndex="0" onKeyDown={this.toggleModal} onClick={this.toggleModal}>
          open find a store
        </span> */}
        <Modal
          ariaHideApp={false}
          overlayClassName={`fas-scroll-container ${styles.OverLay}`}
          className={`col-lg-8 col-md-9 col-xl-6 ${styles.Modal}`}
          // isOpen={this.state.modalIsOpen}
          isOpen={status}
          onRequestClose={this.toggleModal}
          onAfterOpen={this.afterOpenModal}
          shouldCloseOnOverlayClick
          overlayRef={node => {
            this.overlayEl = node;
          }}
        >
          {this.modalContent()}
        </Modal>
      </div>
    );
  }
}

FindAStoreModalRTwo.propTypes = {
  cms: PropTypes.object.isRequired,
  fnMakeMyStore: PropTypes.func,
  fnUpdateMyStoreDetails: PropTypes.func,
  findAStoreModalIsOpen: PropTypes.bool,
  fnToggleFindAStore: PropTypes.func,
  fnFindLatLangZipCodeRequest: PropTypes.func,
  // fnfindZipCodeGapiRequest: PropTypes.func,
  // zipCodeFromIp: PropTypes.any,
  // zipCodeFromGApi: PropTypes.any,
  data: PropTypes.object,
  storeDetails: PropTypes.object,
  latLangDetailsForMap: PropTypes.object,
  fnmakeMyStoreDetailsUpdated: PropTypes.func,
  getMystoreDetails: PropTypes.object,
  fngetCartDetails: PropTypes.func,
  getCartDetails: PropTypes.object,
  fnupdateOrderIdRequest: PropTypes.func,
  pdpProductItemId: PropTypes.object,
  fnsetCMS: PropTypes.func,
  fnloadStoreDetails: PropTypes.func,
  fnlatLangDetailsForMap: PropTypes.func,
  fnfetchFromAkamai: PropTypes.func,
  labels: PropTypes.object,
  analyticsContent: PropTypes.func
};
/* istanbul ignore next */
const mapStateToProps = state => ({
  ...state,
  data: get(state, 'findAStoreModalRTwo', { storeDetails: { data: [], error: false, isFetching: false } }),
  findAStoreModalIsOpen: get(state, 'findAStoreModalRTwo.findAStoreModalIsOpen', { status: false, isBopisEligible: false }),
  latLangDetailsForMap: get(state, 'findAStoreModalRTwo.latLangDetailsForMap', { isCompleted: false, data: null }),
  getMystoreDetails: get(state, 'findAStoreModalRTwo.getMystoreDetails', { isCompleted: false }),
  pdpProductItemId: get(state, 'findAStoreModalRTwo.pdpProductItemId', null),
  getCartDetails: get(state, 'findAStoreModalRTwo.getCartData', { error: false, isFetching: false, data: null }),
  updateOrderId: get(state, 'findAStoreModalRTwo.updateOrderId', { error: false, isFetching: false, data: null }),
  storeDetails: get(state, 'findAStoreModalRTwo.storeDetails', { error: false, isFetching: false, data: null })
});
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  fnMakeMyStore: data => dispatch(actions.makeMyStore(data)),
  fnUpdateMyStoreDetails: data => dispatch(actions.myStoreDetails(data)),
  fnHideModal: data => dispatch(actions.hideModal(data)),
  fnToggleFindAStore: data => dispatch(actions.toggleFindAStore(data)),
  fnFindLatLangZipCodeRequest: data => dispatch(actions.findLatLangZipCodeRequest(data)),
  fnfindZipCodeGapiRequest: data => dispatch(actions.findZipCodeGapiRequest(data)),
  fnStoreLoadingError: data => dispatch(actions.storeLoadingError(data)),
  fnGetProductItemID: data => dispatch(actions.getProductItemID(data)),
  fnmakeMyStoreDetailsUpdated: () => dispatch(actions.makeMyStoreDetailsUpdated()),
  fngetCartDetails: data => dispatch(actions.getCartDetails(data)),
  fnsetCMS: data => dispatch(actions.setCMS(data)),
  fnupdateOrderIdRequest: data => dispatch(actions.updateOrderIdRequest(data)),
  fnloadStoreDetails: data => dispatch(actions.loadStoreDetails(data)),
  fnlatLangDetailsForMap: data => dispatch(actions.latLangDetailsForMap(data)),
  fnfetchFromAkamai: data => dispatch(actions.fetchFromAkamai(data))
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const FindAStoreModalRTwoContainer = compose(
    withReducer,
    withSaga,
    withConnect
  )(FindAStoreModalRTwo);
  const FindAStoreModalAnalyticsWrapper = AnalyticsWrapper(FindAStoreModalRTwoContainer);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <FindAStoreModalAnalyticsWrapper {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(AnalyticsWrapper(FindAStoreModalRTwo));
export { FindAStoreModalRTwo as FindAStoreModalRTwoVanilla };
