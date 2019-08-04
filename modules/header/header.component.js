import { categoriesAPI, productsAPI } from '@academysports/aso-env';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { connect, Provider } from 'react-redux';
import { compose } from 'redux';

import axiosSsr from '../../../axios-ssr';
import AnimationWrapper from '../../apps/productDetailsGeneric/animationWrapper';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import loadScriptTag from '../../utils/loadScriptTag';
import { hasItemsInCart } from '../../utils/UserSession';
import { toggleFindAStore } from '../findAStoreModalRTwo/actions';
import * as actions from './actions';
import { AccountInfo, Brand, FindAStore, MiniCart, Search, WeeklyAds } from './common';
import MegaMenu from './components/desktop';
import MobileMenu from './components/mobile';
import { DATA_COMP_ID, HEADER_CONTAINER_ID, NODE_TO_MOUNT } from './constants';
import { ModalStyles, normalizeStyles, screenReaderStyles, Styles } from './header.styles';
import { updateMenuList } from './helpers';
import reducer from './reducer';
import saga from './saga';
import Loader from './../loader';
const CLOSE_TIMEOUT = 500;
let toggleSearchBarFlag = false;
/**
 * This is to render the main content area which will be hidden to user and
 * is being used for skip to content purpose.
 * @returns {*}
 * @constructor
 */
const MainContent = () => (
  <span id="main-content" className={screenReaderStyles.hidden} tabIndex="-1">
    Main content starts here.
  </span>
);

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    let showIcon = false;
    let showSearch = false;
    if (props.pageInfo && props.pageInfo.page && props.pageInfo.page.toLowerCase() === 'homepage') {
      showSearch = true;
    } else {
      showIcon = true;
    }
    this.state = {
      showIcon,
      showSearch
    };
    this.headerRef = React.createRef();
    this.toggleSearch = this.toggleSearch.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.filterDataList = this.filterDataList.bind(this);
  }
  componentDidMount() {
    if (ExecutionEnvironment.canUseDOM) {
      window.addEventListener('scroll', this.handleScroll);
      /**
       * Reskin header to use CSR
       * isCSR is modified in vendor_reskin js file
       * env is set from espots
       * ASOData namespace is injected with 'header' object
       */
      if (window.ASOData && window.ASOData.header && window.ASOData.header.isCSR) {
        this.constructor
          .getInitialProps({
            env: window.HEADER_PARAMS.env,
            cms: window.ASOData.header.cms
          })
          .then((results = []) => {
            window.INITIAL_STATE = window.INITIAL_STATE || {};
            if (results.length > 0) {
              window.INITIAL_STATE.header = results.map(result => result && result.data);
              this.filterDataList();
            }
            if (typeof google === 'undefined') {
              loadScriptTag('https://maps.googleapis.com/maps/api/js?client=gme-academysportsand', true, 'aso-googlemap');
            }
          });
      }
    }
    // call the cartAPI if you have 'USERACTIVITY' cookie and it's value is not -1002
    const { fnFetchMiniCart, fnGetBreadCrumb } = this.props;
    if (hasItemsInCart()) {
      fnFetchMiniCart();
    }
    fnGetBreadCrumb();
    Modal.setAppElement(this.headerRef && this.headerRef.current);
  }
  componentWillUnmount() {
    if (ExecutionEnvironment.canUseDOM) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }
  /*
  * Get all the L1, L2, L3 Categories and SEO URL's and Category Deals and Daily Deals
  */
  static getInitialProps(params) {
    const {
      env: { API_HOSTNAME }
    } = params;
    const catIds = [];
    const { cms } = params;
    const ids = {};
    const correlationIdParams = {
      params: {
        correlationId: params.correlationId,
        trueClientIp: params.trueClientIp,
        userAgent: params.userAgent
      }
    };
    cms.navDetails.forEach(l0 => {
      if (l0.dealsCategoryID || l0.productID) {
        ids.catID = l0.dealsCategoryID;
        ids.productIDList = l0.productID;
      }
      if (l0 && l0.menuItems && l0.menuItems.length > 0) {
        l0.menuItems.forEach(l1 => {
          if (l1 && l1.categoryID && l1.categoryID !== '') {
            catIds.push(l1.categoryID);
          }
          if (l1 && l1.brandLandingCategoryId && l1.brandLandingCategoryId !== '') {
            catIds.push(l1.brandLandingCategoryId);
          }
          if (l1 && l1.subMenuItems && l1.subMenuItems.length > 0) {
            l1.subMenuItems.forEach(l2 => {
              if (l2 && l2.categoryID && l2.categoryID !== '') {
                catIds.push(l2.categoryID);
              }
            });
          }
        });
      }
    });
    return axiosSsr.all([
      catIds.length > 0 ? axiosSsr.get(`${API_HOSTNAME}${categoriesAPI}${catIds.join(',')}&summary=true`, correlationIdParams).catch(() => {}) : null,
      ids.catID ? axiosSsr.get(`${API_HOSTNAME}${categoriesAPI}${ids.catID}&summary=true`, correlationIdParams).catch(() => {}) : null,
      ids.productIDList && ids.productIDList.length > 0
        ? axiosSsr.get(`${API_HOSTNAME}${productsAPI}${ids.productIDList.join(',')}&summary=true`, correlationIdParams).catch(() => {})
        : null
    ]);
  }
  /* ***** Toggle States based on scenarios for home page ony ***** */
  setStatesForHomePageScenarios() {
    setTimeout(() => {
      if (window.scrollY > 40) {
        this.setState({ showIcon: true, showSearch: false });
      } else if (window.scrollY === 0) {
        this.setState({ showIcon: false, showSearch: true });
      }
    }, 0);
  }
  /* ***** For Screen Readers Only ****** */
  skipNavigation = e => {
    e.preventDefault();
    if (ExecutionEnvironment.canUseDOM) {
      document.getElementById('main-content').focus();
    }
  };
  /* ***** Handle Search Expand/Collapse based on HomePage vs Other Pages scenarios */
  handleScroll(e, isFromToggle) {
    if (e) {
      e.preventDefault();
    }
    const { showSearch } = this.state;
    const { pageInfo, fnSetSearchInputFocus } = this.props;
    const isHomePage = pageInfo && pageInfo.page && pageInfo.page.toLowerCase() && pageInfo.page.toLowerCase() === 'homepage';
    if (isHomePage && !isFromToggle && !toggleSearchBarFlag) {
      this.setStatesForHomePageScenarios();
    } else if (isFromToggle) {
      fnSetSearchInputFocus({ searchShouldBeFocused: !showSearch });
      this.setState(
        {
          showSearch: !showSearch
        },
        () => {
          toggleSearchBarFlag = this.state.showSearch;
        }
      );
    }
  }
  filterDataList() {
    const { cms, api } = this.props;
    if (ExecutionEnvironment.canUseDOM) {
      return updateMenuList(cms.navDetails, api && Object.keys(api).length > 0 ? api : window.INITIAL_STATE && window.INITIAL_STATE.header);
    }
    return cms.navDetails;
  }
  /* ***** Toggle Search Based on HomePage vs Other Pages scenarios */
  toggleSearch(e) {
    e.preventDefault();
    this.handleScroll(e, true);
  }
  render() {
    const {
      cms,
      searchResults,
      fnFetchAutoSuggestions,
      miniCartResults,
      fnToggleHamburger,
      isHamburgerActive,
      myStoreDetails,
      fnToggleFindAStore,
      fnGetMobileMenuItems,
      mobileMenu,
      gtmDataLayer,
      fnSetSearchInputFocus,
      fnSaveAutoSuggestions,
      fnSaveVisualGuidedCategoriesBrands,
      breadList,
      showLoader,
      toggleLoader,
      messages = {}
    } = this.props;
    const { showIcon, showSearch } = this.state;
    const updatedList = this.filterDataList();
    return (
      <Fragment>
        {showLoader && <Loader overlay />}
        {/* eslint-disable */}
        <a href="#main-content" className={`${screenReaderStyles.default} skip`}>
          Skip to content
        </a>
        <div ref={this.headerRef && this.headerRef.current} className={`header ${Styles}`} id={`${HEADER_CONTAINER_ID}`}>
          {/* ********* Desktop Layout Starts ********* */}
          <nav className="desktop-layout position-relative">
            <div className="container-1052">
              <div className="flex-row align-items-center d-flex">
                <div className="column-left">
                  <div key="d-0" data-auid="logo">
                    <Brand breadList={breadList} gtmDataLayer={gtmDataLayer} src={cms.logo} alt={cms.logoAltText} url={cms.logoTargetURL} />
                  </div>
                </div>
                <div className="column-right d-flex flex-column w-100">
                  <div className="top-nav pb-1">
                    <ul className="d-flex flex-row align-items-center">
                      <li className="mr-auto" key="d-1" data-auid="findAStore">
                        <FindAStore
                          breadList={breadList}
                          gtmDataLayer={gtmDataLayer}
                          cssClass="linkClass"
                          label={cms.findStoreLabel}
                          changeStoreLabel={cms.changeStoreLabel}
                          url="#"
                          myStoreDetails={myStoreDetails}
                          fnToggleFindAStore={fnToggleFindAStore}
                          messages={messages}
                        />
                      </li>
                      <li className="mr-half" key="d-2" data-auid="WeeklyAds">
                        <WeeklyAds
                          breadList={breadList}
                          gtmDataLayer={gtmDataLayer}
                          cssClass="linkClass"
                          label={cms.weeklyAdsLabel}
                          url={cms.weeklyAdsLink}
                        />
                      </li>
                      <li className="ml-3 sign-in-link position-relative" key="d-3" data-auid="MyAccount">
                        <AccountInfo
                          breadList={breadList}
                          gtmDataLayer={gtmDataLayer}
                          cssClass="linkClass"
                          label={cms.myAccountLabel}
                          url={cms.signInLink}
                          myAccDropDown={cms.myAccDropDown}
                          toggleLoader={toggleLoader}
                        />
                      </li>
                    </ul>
                  </div>
                  <div className="bottom-nav">
                    <ul className="d-flex align-items-center menu-items">
                      <MegaMenu breadList={breadList} list={updatedList} gtmDataLayer={gtmDataLayer} />
                      <li key="d-7" className="search-container" data-auid="search-container">
                        <Search
                          placeholder={cms.searchLabel}
                          limit={cms.searchAutoSuggestLimit}
                          searchResults={searchResults}
                          fnFetchAutoSuggestions={fnFetchAutoSuggestions}
                          gtmDataLayer={gtmDataLayer}
                          breadList={breadList}
                          auid=""
                          fnSaveAutoSuggestions={fnSaveAutoSuggestions}
                          fnSaveVisualGuidedCategoriesBrands={fnSaveVisualGuidedCategoriesBrands}
                        />
                      </li>
                      <li key="d-8" className="mini-cart ml-auto" data-auid="miniCart">
                        <MiniCart breadList={breadList} gtmDataLayer={gtmDataLayer} url={cms.cartLink} miniCartResults={miniCartResults} />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          {/* ********* Mobile Layout Starts ********* */}
          <nav className={`bg-none mobile-layout position-relative ${!showIcon || showSearch ? 'pt-135' : 'pt-82'}`}>
            <div className="bg-none fixed-container">
              <div className="bg-none toolbar-container">
                <ul className="bg-white h-100 px-1 mh-82 d-flex border-bottom flex-row align-items-center justify-content-between">
                  <li key="m-0" data-auid="hamburgerMenuToggleBtn_m" className="menu-icon">
                    <button aria-label={`${isHamburgerActive ? 'menu-expanded' : 'menu-collapsed'}`} onClick={() => fnToggleHamburger()}>
                      <span className="academyicon icon-menu" aria-hidden="true" />
                    </button>
                    {isHamburgerActive && (
                      <Modal
                        ariaHideApp={false}
                        closeTimeoutMS={CLOSE_TIMEOUT}
                        className={`l0-modal ${ModalStyles.mobileContainer} ${normalizeStyles}`}
                        onRequestClose={() => fnToggleHamburger()}
                        overlayClassName={`${ModalStyles.backdrop}`}
                        isOpen={isHamburgerActive}
                        htmlOpenClassName="ReactModal__Html--open"
                        shouldFocusAfterRender
                        shouldCloseOnOverlayClick
                        shouldCloseOnEsc
                        shouldReturnFocusAfterClose
                      >
                        <MobileMenu
                          cms={cms}
                          list={updatedList}
                          mobileMenu={mobileMenu}
                          fnGetMobileMenuItems={fnGetMobileMenuItems}
                          fnToggleHamburger={fnToggleHamburger}
                          isHamburgerActive={isHamburgerActive}
                          myStoreDetails={myStoreDetails}
                          fnToggleFindAStore={fnToggleFindAStore}
                          isMobile
                          fnSetSearchInputFocus={fnSetSearchInputFocus}
                          gtmDataLayer={gtmDataLayer}
                          breadList={breadList}
                          toggleLoader={toggleLoader}
                        />
                      </Modal>
                    )}
                  </li>
                  <li key="m-1" data-auid="logo_m" className="brand-logo mr-auto ml-1">
                    <Brand breadList={breadList} gtmDataLayer={gtmDataLayer} src={cms.logo} alt={cms.logoAltText} url={cms.logoTargetURL} />
                  </li>
                  {showIcon && (
                    <li key="m-2" data-auid="search_m" className="search-wrapper">
                      <button
                        type="button"
                        className="expand-search-button"
                        data-auid="expand-search_m"
                        aria-label="click to expand search"
                        onClick={e => this.toggleSearch(e)}
                      >
                        <span className="academyicon icon-search" aria-hidden="true" />
                      </button>
                    </li>
                  )}
                  <li key="m-3" data-auid="miniCart_m" className="mini-cart">
                    <MiniCart breadList={breadList} gtmDataLayer={gtmDataLayer} url={cms.cartLink} miniCartResults={miniCartResults} />
                  </li>
                </ul>
                <AnimationWrapper show={!showIcon || showSearch} classNames="fade-grow" timeout={400}>
                  <ul className="bg-white border-bottom p-half d-flex flex-row align-items-center justify-content-between">
                    <li key="m-4" className="w-100 search-container" data-auid="search-container_m">
                      <Search
                        placeholder={cms.searchLabel}
                        limit={cms.searchAutoSuggestLimit}
                        searchResults={searchResults}
                        fnFetchAutoSuggestions={fnFetchAutoSuggestions}
                        gtmDataLayer={gtmDataLayer}
                        breadList={breadList}
                        fnSetSearchInputFocus={fnSetSearchInputFocus}
                        mobileMenu={mobileMenu}
                        auid="_m"
                        fnSaveAutoSuggestions={fnSaveAutoSuggestions}
                        fnSaveVisualGuidedCategoriesBrands={fnSaveVisualGuidedCategoriesBrands}
                        isMobile
                        searchBarToggled={!showIcon || showSearch}
                      />
                    </li>
                  </ul>
                </AnimationWrapper>
              </div>
            </div>
          </nav>
        </div>
        <MainContent />
      </Fragment>
    );
  }
}

Header.propTypes = {
  cms: PropTypes.object.isRequired,
  api: PropTypes.array,
  pageInfo: PropTypes.object,
  searchResults: PropTypes.object,
  miniCartResults: PropTypes.object,
  isHamburgerActive: PropTypes.bool,
  myStoreDetails: PropTypes.object,
  mobileMenu: PropTypes.object,
  fnFetchAutoSuggestions: PropTypes.func,
  fnFetchMiniCart: PropTypes.func,
  fnToggleHamburger: PropTypes.func,
  fnToggleFindAStore: PropTypes.func,
  fnGetMobileMenuItems: PropTypes.func,
  fnSetSearchInputFocus: PropTypes.func,
  gtmDataLayer: PropTypes.array,
  fnSaveAutoSuggestions: PropTypes.func,
  fnSaveVisualGuidedCategoriesBrands: PropTypes.func,
  breadList: PropTypes.string,
  fnGetBreadCrumb: PropTypes.func,
  showLoader: PropTypes.bool,
  toggleLoader: PropTypes.func,
  messages: PropTypes.object
};

const mapDispatchToProps = dispatch => ({
  fnFetchAutoSuggestions: params => dispatch(actions.fetchAutoSuggestions(params)),
  fnFetchMiniCart: () => dispatch(actions.fetchMiniCart()),
  fnToggleHamburger: () => dispatch(actions.toggleHamburger()),
  fnToggleFindAStore: item => dispatch(toggleFindAStore(item)),
  fnGetMobileMenuItems: params => dispatch(actions.getMobileMenuItems(params)),
  fnSetSearchInputFocus: params => dispatch(actions.setSearchInputFocus(params)),
  fnSaveAutoSuggestions: params => dispatch(actions.saveAutoSuggestions(params)),
  fnSaveVisualGuidedCategoriesBrands: params => dispatch(actions.saveVisualGuidedCategoriesBrands(params)),
  fnGetBreadCrumb: () => dispatch(actions.getBreadCrumb()),
  toggleLoader: flag => dispatch(actions.toggleLoder(flag))
});
const mapStateToProps = state => ({
  searchResults: state.header && state.header.search,
  gtmDataLayer: state.gtmDataLayer,
  miniCartResults: state.header && state.header.miniCart,
  isHamburgerActive: state.header && state.header.isHamburgerActive && state.header.isHamburgerActive.active,
  myStoreDetails: state.findAStoreModalRTwo && state.findAStoreModalRTwo.getMystoreDetails,
  myAccountPopOver: state.header && state.header.myAccountPopOver,
  findNearestStore: state.findAStoreModalRTwo && state.findAStoreModalRTwo.storeDetails,
  mobileMenu: state.header && state.header.mobileMenu,
  breadList: state.header && state.header.breadCrumb,
  showLoader: state.header.showLoader
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const HeaderContainer = compose(
    withReducer,
    withSaga,
    withConnect
  )(Header);

  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <HeaderContainer
          ua={navigator.userAgent.toLowerCase().match(/android|blackberry|tablet|mobile|iphone|ipad|ipod|opera mini|iemobile/i)}
          {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]}
        />
      </Provider>,
      el
    );
  });
}

export default withConnect(Header);
