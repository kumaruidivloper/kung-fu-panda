import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Provider, connect } from 'react-redux';
import { compose } from 'redux';
import Button from '@academysports/fusion-components/dist/Button';
import injectReducer from '../../utils/injectReducer';
import injectSaga from '../../utils/injectSaga';
import { NODE_TO_MOUNT, DATA_COMP_ID, COOKIE_SELECTED_STORE, COOKIE_STORE_ID } from './constants';
import reducer from './reducer';
import * as actions from './actions';
import saga from './saga';
import { fasStyles, ModalStyles } from './styles';
import { openingHours, formatString, updateAnalytics, getStoreIds } from './helpers';
import Storage from '../../utils/StorageManager';
import { isLoggedIn } from '../../utils/UserSession';

let previousSkuId;
let errorMsg = '0 Stores were found within 250 miles of your search';


class FindAStoreModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFocused: false,
      searchTerm: '',
      showLimit: 10,
      limitRange: 10
    };
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);
    this.clear = this.clear.bind(this);
    this.submit = this.submit.bind(this);
    this.performSearch = this.performSearch.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.seeMoreStores = this.seeMoreStores.bind(this);
    this.fasInputRef = React.createRef();
    this.submitBtnRef = React.createRef();
  }

  componentDidMount() {
    if (Storage.getCookie(`${COOKIE_SELECTED_STORE}`)) {
      this.getMyStoreFromCookie();
    }
  }

  getMyStoreFromCookie = () => {
    const { cms = {}, fnFetchStoreDetailsSuccess, fnMyStoreDetails } = this.props;
    const myCookie = Storage.getCookie(`${COOKIE_SELECTED_STORE}`).split('*');
    let newStoreId = Storage.getCookie(`${COOKIE_STORE_ID}`);
    newStoreId = this.getUpdatedStoreId(newStoreId);
    const city = formatString(myCookie[6]);
    const gx_id = Storage.getCookie(`${COOKIE_STORE_ID}`); // eslint-disable-line
    const distance = myCookie[8];
    const todayHours = formatString(myCookie[1]);
    const zipCode = myCookie[3];
    const streetAddress = formatString(myCookie[0]);
    const state = formatString(myCookie[7]);
    const phone = formatString(myCookie[5]);
    const neighborhood = formatString(myCookie[4]);
    const storeId = newStoreId;
    const storeDetails = [{ properties: { city, gx_id, distance, todayHours, zipCode, streetAddress, state, phone, neighborhood }, storeId }];
    const openHours = `${openingHours(todayHours, cms.timeLabel)}`;
    const myStoreList = { storeName: neighborhood, openhours: openHours };
    fnFetchStoreDetailsSuccess(storeDetails);
    fnMyStoreDetails(myStoreList);
  };

  getStoreInventory(inventory) {
    const { pdpInventoryMsgs } = this.props;
    if (pdpInventoryMsgs) {
      const { productId, skuId } = pdpInventoryMsgs;
      if (productId && inventory[productId]) {
        const inputProductId = inventory[productId];
        if (inputProductId[skuId]) {
          return inputProductId[skuId];
        }
        return { key: 'STLOC_NOT_AVAILABLE_TODAY', value: 'Not Available' };
      }
    }
    return {};
  }

  getUpdatedStoreId = (storeId = '') => {
    const newStoreId = storeId.match(/\d+/g) || [];
    switch (newStoreId[0] && newStoreId[0].length) {
      case 1:
        return `store-000${newStoreId[0]}`;
      case 2:
        return `store-00${newStoreId[0]}`;
      case 3:
        return `store-0${newStoreId[0]}`;
      default:
        return storeId;
    }
  };

  afterOpenModal = () => {
    const { pdpInventoryMsgs } = this.props;
    if (pdpInventoryMsgs) {
      const { skuItemId } = pdpInventoryMsgs;
      if (skuItemId !== previousSkuId) {
        previousSkuId = skuItemId;
        const hasCookie = Storage.getCookie(`${COOKIE_SELECTED_STORE}`);
        if (hasCookie) {
          const zipCode = hasCookie.split('*')[3];
          this.setState(
            {
              searchTerm: zipCode
            },
            () => {
              this.performSearch();
            }
          );
        } else {
          this.performSearch();
        }
      } else {
        this.setState({
          searchTerm: this.state.searchTerm
        });
      }
    }
  };

  handleFocus = e => {
    e.preventDefault();
    const { current = {} } = this.fasInputRef;
    this.setState({
      isFocused: true,
      searchTerm: (current && current.value) || ''
    });
  };

  handleBlur = e => {
    e.preventDefault();
    setTimeout(() => this.setState({ isFocused: false }), 200);
  };

  handleChange = e => {
    e.preventDefault();
    const { current = {} } = this.fasInputRef;
    this.setState({ searchTerm: current.value });
  };

  close = e => {
    e.preventDefault();
    const { fnToggleFindAStore, fnGetProductItemID, fnFetchStoreDetailsError } = this.props;
    fnToggleFindAStore(false);
    fnGetProductItemID(null);
    fnFetchStoreDetailsError(true);
  };

  clear = e => {
    e.preventDefault();
    const { current = {} } = this.fasInputRef;
    current.value = '';
    this.setState({ searchTerm: '' });
  };

  submit = e => {
    e.preventDefault();
    const { searchTerm } = this.state;
    if (searchTerm) {
      this.setState({
        showLimit: 10,
        limitRange: 10
      });
      this.performSearch();
    }
  };

  hasLimitedInventory = (inventory = {}) => {
    const { messages } = this.props;
    const additionalInfoValue = messages[inventory.additionalInfoKey] || inventory.additionalInfoValue;
    return (additionalInfoValue && additionalInfoValue.replace(/\{0\}/g, parseInt(inventory.upperBound || inventory.quantity, 10))) || '';
  };

  performSearch = () => {
    const { gtmDataLayer, fnFetchStoreDetails, pdpInventoryMsgs, storeDetails, fnFetchStoreDetailsError } = this.props;
    const { searchTerm } = this.state;
    const geocoder = new google.maps.Geocoder(); // eslint-disable-line
    this.fasInputRef.current.blur();
    this.submitBtnRef.current.focus();
    if (searchTerm) {
      geocoder.geocode({ address: searchTerm }, (results, status = '') => {
        if (status.toLowerCase() === 'ok') {
          const lat = results[0].geometry.location.lat();
          const long = results[0].geometry.location.lng();
          const params = { lat, long, pdpInventoryMsgs, storeDetails, gtmDataLayer, searchTerm };
          errorMsg = '0 Stores were found within 250 miles of your search';
          fnFetchStoreDetailsError(true);
          fnFetchStoreDetails(params);
        } else {
          errorMsg = 'Please enter a valid State/City/ZipCode';
          fnFetchStoreDetailsError(false);
          this.triggerAnalytics();
        }
      });
    }
  };

  seeMoreStores = e => {
    e.preventDefault();
    const { limitRange, showLimit } = this.state;
    this.setState(
      previousState => ({
        showLimit: previousState.showLimit + limitRange
      }),
      () => {
        this.triggerAnalytics(null, true, showLimit, this.state.limitRange);
      }
    );
  };

  constructMyStoreCookie = (myStore = {}) => {
    const { cms, fnMyStoreDetails } = this.props;
    const {
      formattedStoreId = '',
      formattedName,
      formattedAddress,
      formattedCity,
      formattedState = '',
      zipCode,
      todayHours,
      formattedPhone,
      gxId,
      distance
    } = myStore;
    const url = `/shop/storelocator/${formattedState.toUpperCase()}/${formattedCity}/${formattedStoreId}`;
    const cookieToStore = `${formattedAddress}*${todayHours}*${url}*${zipCode}*${formattedName}*${formattedPhone}*${formattedCity}*${formattedState.toUpperCase()}*${distance}`;
    Storage.setCookie(`${COOKIE_SELECTED_STORE}`, cookieToStore);
    Storage.setCookie(`${COOKIE_STORE_ID}`, gxId);
    const openHours = `${openingHours(todayHours, cms.timeLabel)}`;
    const myStoreList = { storeName: formattedName, openhours: openHours };
    fnMyStoreDetails(myStoreList);
  };

  updateMyStore = idx => {
    const { cms, storeDetails, fnFetchStoreDetailsSuccess, fnMyStoreDetails, fnPostMyStoreDetails, fnSaveStoreId } = this.props;
    const updatedStoreDetails = [...storeDetails];
    updatedStoreDetails.splice(0, 0, updatedStoreDetails.splice(idx, 1)[0]);
    fnFetchStoreDetailsSuccess(updatedStoreDetails);
    const { properties = {}, storeId = '' } = updatedStoreDetails[0];
    const { gx_id: stLocId, neighborhood, todayHours, zipCode, phone, state, city, streetAddress } = properties;
    const openHours = `${openingHours(todayHours, cms.timeLabel)}`;
    const myStoreList = { storeName: formatString(neighborhood), openhours: openHours };
    fnMyStoreDetails(myStoreList);
    fnSaveStoreId(stLocId);
    this.triggerAnalytics(stLocId, null, null, null, 'make my store');
    if (ExecutionEnvironment.canUseDOM) {
      document.querySelector('.fas-scroll-container').scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    if (isLoggedIn) {
      const newStoreId = this.getUpdatedStoreId(storeId);
      const url = `/shop/storelocator/${state}/${city}/${newStoreId}`;
      const storeInfo = `${streetAddress}*${todayHours}*${url}*${zipCode}*${neighborhood}*${phone}*${city}*${state}`;
      const userId = Storage.getCookie('USERACTIVITY');
      fnPostMyStoreDetails({ storeInfo, userId, stLocId });
    }
  };

  triggerAnalytics = (selectedStoreId = '', fromSeeMoreStores, start, end, makeMyStore) => {
    const { gtmDataLayer, storeDetails = [], isApiSuccess } = this.props;
    const { searchTerm = '' } = this.state;
    const apiSuccess = isApiSuccess ? 'successful store search' : 'unsuccessful store search';
    updateAnalytics(
      gtmDataLayer,
      'search',
      'store locator',
      `${makeMyStore || 'store search'}`,
      `${makeMyStore ? selectedStoreId.toLowerCase() : apiSuccess}`,
      !selectedStoreId ? storeDetails.length : null,
      fromSeeMoreStores ? getStoreIds(storeDetails, start, end) : selectedStoreId.toLowerCase(),
      `${searchTerm.toLowerCase()}`,
      `${isApiSuccess && !makeMyStore ? 1 : 0}`,
      `${!isApiSuccess && !makeMyStore ? 1 : 0}`,
      0
    );
  };

  renderInventoryTpl(inventory = {}) {
    const { messages } = this.props;
    const filteredInventory = this.getStoreInventory(inventory);
    const inventoryQty = this.hasLimitedInventory(filteredInventory);
    const isAvailable = filteredInventory.showTick && filteredInventory.showTick === 'true';
    const displayValue = messages[filteredInventory.key] || filteredInventory.value;
    return (
      <Fragment>
        {displayValue && (
          <div className="o-copy__14bold mb-half">
            {isAvailable ? (
              <span className="academyicon icon-check-mark selected-icon mini-icon" />
            ) : (
              <span className="academyicon icon-close bg-red selected-icon mini-icon" />
            )}
            <span className="align-middle">{displayValue}</span>
          </div>
        )}
        {inventoryQty && (
          <div className="o-copy__14reg pb-half">
            <em>{inventoryQty}</em>
          </div>
        )}
      </Fragment>
    );
  }

  renderCloseButton() {
    return (
      <div className="d-flex px-2 bg-white">
        <div className="ml-auto bg-white">
          <button className="bg-white" onClick={this.close} aria-label="close find a store modal" data-auid="find-a-store-modal-close">
            <span className="bg-white academyicon icon-close icon a-close-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  renderForm() {
    const { cms } = this.props;
    const { isFocused, searchTerm } = this.state;
    return (
      <div className={`w-100 text-center fas-form-container ${isFocused ? 'focused' : ''}`}>
        <form action="." data-auid="find-a-store" noValidate className="d-flex fas-form w-100 position-relative" onSubmit={this.submit}>
          <input
            id="fas-search"
            className="o-copy__14reg"
            autoComplete="off"
            type="search"
            placeholder={cms.searchLabel}
            title="fas-search"
            aria-label="Please enter location name or zipcode"
            autoFocus // eslint-disable-line jsx-a11y/no-autofocus
            value={searchTerm}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={this.handleChange}
            ref={this.fasInputRef}
          />
          {searchTerm.length > 0 && (
            <button
              onClick={this.clear}
              data-auid="clear-zip-code"
              type="button"
              className="fas-search-button fas-search-clear"
              aria-label="clear search"
            >
              <span className="academyicon icon-close" aria-hidden="true" />
            </button>
          )}
          <button ref={this.submitBtnRef} data-auid="submit-zip-code" className="fas-search-button fas-search-submit" aria-label="click to search">
            <span className="academyicon icon-search" aria-hidden="true" />
          </button>
        </form>
      </div>
    );
  }

  renderStoreDetailsCards() {
    const { cms, storeDetails, pdpInventoryMsgs, fnStoreURL } = this.props;
    const { showLimit } = this.state;
    const card = storeDetails.slice(0, showLimit).map((store = {}, idx) => {
      const { properties = {}, storeId, inventory } = store;
      const { distance, neighborhood, streetAddress, city, state, zipCode, todayHours, phone, gx_id: gxId } = properties;
      const formattedCity = formatString(city);
      const formattedAddress = formatString(streetAddress);
      const formattedName = formatString(neighborhood);
      const formattedTodayHours = openingHours(todayHours, cms.timeLabel);
      const formattedState = formatString(state);
      const formattedPhone = formatString(phone);
      const formattedStoreId = this.getUpdatedStoreId(storeId);
      const storeURL = `${cms.storeDetailLink}/${decodeURIComponent(formattedState.replace(/\s/g, ''))}/${decodeURIComponent(
        formattedCity.replace(/\s/g, '')
      )}/${formattedStoreId}`;
      if (idx === 0) {
        const cookieVal = {
          formattedStoreId,
          formattedName,
          formattedAddress,
          formattedCity,
          formattedState,
          zipCode,
          todayHours,
          formattedPhone,
          gxId,
          distance
        };
        this.constructMyStoreCookie(cookieVal);
        fnStoreURL(storeURL);
      }
      return (
        <Fragment key={idx.toString()}>
          <div className="px-1 pt-1 bg-grey">
            <div className="d-flex justify-content-center w-100">
              <div className="w-100 bg-white p-1">
                <h6 aria-level="6" className="o-copy__16bold mt-quarter">
                  {formattedName}
                  {distance && <span className="ml-half o-copy__12reg">{`${distance} miles`}</span>}
                </h6>
                {pdpInventoryMsgs && inventory && this.renderInventoryTpl(inventory)}
                <div className="mb-half">
                  <a className="o-copy__14reg" href={storeURL}>
                    {formattedAddress} {formattedCity}
                    {formattedState && <Fragment>{`, ${formattedState.toUpperCase()}`}</Fragment>}
                    &nbsp;
                    {zipCode}
                  </a>
                </div>
                <div className="o-copy__14reg mb-half">{formattedTodayHours}</div>
                <div className="mb-half">
                  <a className="o-copy__14reg" href={`tel: ${phone}`}>
                    {formattedPhone}
                  </a>
                </div>
                <div className="mb-half">
                  <a className="o-copy__14reg c-0556a4" href={storeURL}>
                    {cms.storeDetailText}
                  </a>
                </div>
                {idx === 0 && (
                  <div className="my-half">
                    <span className="academyicon icon-check-mark selected-icon mr-half" />
                    <span className="o-copy__14reg align-middle d-inline-block">MY STORE</span>
                  </div>
                )}
                {idx > 0 && (
                  <div className="make-store-btn mt-1">
                    <Button
                      onClick={() => this.updateMyStore(idx)}
                      auid="find-a-store-mystore-button"
                      type="button"
                      aria-label={cms.makeMyStoreLabel}
                    >
                      {cms.makeMyStoreLabel}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {storeDetails.length > 1 && idx === 0 && <div className="o-copy__20reg pt-1 px-1 bg-grey">Nearby stores</div>}
        </Fragment>
      );
    });
    return card;
  }

  renderSeeMoreDetails(storesLen) {
    const { cms } = this.props;
    const { showLimit } = this.state;
    return (
      <Fragment>
        {storesLen > showLimit && (
          <div className="d-flex justify-content-center">
            <div className="make-store-btn mt-1 px-1 see-more-stores w-100 bg-white py-1">
              <Button
                secondary
                auid="find-a-store-see-more-button"
                aria-label={cms.seeMoreText}
                type="button"
                btnvariant="tertiary"
                className=""
                onClick={this.seeMoreStores}
              >
                {cms.seeMoreText}
              </Button>
            </div>
          </div>
        )}
      </Fragment>
    );
  }

  renderModalContent() {
    const { cms, storeDetails = [], isApiSuccess = true } = this.props;
    const { limitRange } = this.state;
    return (
      <div className={`pt-2 ${fasStyles}`} data-auid="find-a-store-modal">
        <div className={`bg-grey ${storeDetails.length > 0 && isApiSuccess ? 'pb-1' : ''}`}>
          {this.renderCloseButton()}
          <div className="px-2 d-flex bg-white pb-2 justify-content-center flex-direction-row flex-wrap">
            <h4 className="w-100 text-center text-uppercase pb-2">{cms.findStoreHeading}</h4>
            {this.renderForm()}
            {!isApiSuccess && <div className="d-flex justify-content-center mt-2 bg-white o-copy__14reg">{errorMsg}</div>}
          </div>
          {storeDetails.length > 0 && isApiSuccess && this.renderStoreDetailsCards()}
          {storeDetails.length >= limitRange && isApiSuccess && this.renderSeeMoreDetails(storeDetails.length)}
        </div>
      </div>
    );
  }

  render() {
    const { findAStoreModalIsOpen } = this.props;
    return (
      <div className="findAStoreModal" data-auid="find-a-store-modal">
        <Modal
          ariaHideApp={false}
          isOpen={findAStoreModalIsOpen}
          onRequestClose={this.close}
          overlayClassName={`fas-scroll-container ${ModalStyles.backdrop}`}
          className={`fas-modal-container ${ModalStyles.container}`}
          onAfterOpen={this.afterOpenModal}
          shouldFocusAfterRender
          shouldCloseOnOverlayClick
          shouldCloseOnEsc
          shouldReturnFocusAfterClose
        >
          {this.renderModalContent()}
        </Modal>
      </div>
    );
  }
}

FindAStoreModal.propTypes = {
  cms: PropTypes.object,
  messages: PropTypes.object,
  gtmDataLayer: PropTypes.array,
  findAStoreModalIsOpen: PropTypes.bool,
  storeDetails: PropTypes.array,
  pdpInventoryMsgs: PropTypes.object,
  isApiSuccess: PropTypes.bool,
  fnToggleFindAStore: PropTypes.func,
  fnFetchStoreDetails: PropTypes.func,
  fnFetchStoreDetailsSuccess: PropTypes.func,
  fnMyStoreDetails: PropTypes.func,
  fnPostMyStoreDetails: PropTypes.func,
  fnGetProductItemID: PropTypes.func,
  fnFetchStoreDetailsError: PropTypes.func,
  fnSaveStoreId: PropTypes.func,
  fnStoreURL: PropTypes.func
};
/* istanbul ignore next */
const mapStateToProps = state => ({
  findAStoreModalIsOpen: state.header ? state.header.findAStoreModalIsOpen : false,
  storeDetails: state.findAStoreModal && state.findAStoreModal.storeDetails && state.findAStoreModal.storeDetails.storesList,
  getStoreURL: state.findAStoreModal && state.findAStoreModal.getStoreURL,
  isApiSuccess: state.findAStoreModal && state.findAStoreModal.storeDetails && state.findAStoreModal.storeDetails.isSuccess,
  pdpInventoryMsgs: state.findAStoreModal && state.findAStoreModal.pdpInventoryMsgs,
  gtmDataLayer: state.gtmDataLayer
});
/* istanbul ignore next */
const mapDispatchToProps = dispatch => ({
  fnToggleFindAStore: data => dispatch(actions.toggleFindAStore(data)),
  fnFetchStoreDetails: params => dispatch(actions.fetchStoreDetails(params)),
  fnFetchStoreDetailsSuccess: data => dispatch(actions.fetchStoreDetailsSuccess(data)),
  fnMyStoreDetails: data => dispatch(actions.myStoreDetails(data)),
  fnPostMyStoreDetails: data => dispatch(actions.postMyStoreDetails(data)),
  fnGetProductItemID: data => dispatch(actions.getProductItemID(data)),
  fnFetchStoreDetailsError: data => dispatch(actions.fetchStoreDetailsError(data)),
  fnSaveStoreId: data => dispatch(actions.saveStoreId(data)),
  fnStoreURL: url => dispatch(actions.saveStoreURL(url))
});
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);
if (ExecutionEnvironment.canUseDOM) {
  const withReducer = injectReducer({ key: NODE_TO_MOUNT, reducer });
  const withSaga = injectSaga({ key: NODE_TO_MOUNT, saga });
  const FindAStoreModalContainer = compose(
    withReducer,
    withSaga,
    withConnect
  )(FindAStoreModal);
  [...document.querySelectorAll(`[data-component="${NODE_TO_MOUNT}"]`)].forEach(el => {
    ReactDOM.hydrate(
      <Provider store={window.store}>
        <FindAStoreModalContainer {...window.ASOData[el.getAttribute(`${DATA_COMP_ID}`)]} />
      </Provider>,
      el
    );
  });
}

export default withConnect(FindAStoreModal);
export { FindAStoreModal as FindAStoreModalVanilla };
