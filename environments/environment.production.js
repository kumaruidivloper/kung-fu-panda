/**
 *************************************************************
 * Static assets path.
 * The 'staticAssetsBucketPath' is used in webpack _rules.js
 *************************************************************
 */
const searchdexStorage = 'https://incl-v2.academy.com.searchdex.net';
const staticAssetsDomain = 'https://storage.googleapis.com/';
export const staticAssetsBucketPath = `${staticAssetsDomain}prod2_component_registry_vol`;
export const staticVendorBucketPath = `${staticAssetsBucketPath}/vendor/`;
export const staticPublisherPath = '/shop/browse/aem-api/content/academy/includes/globalcomponentspage.fragment';
// ***********************************************************
// value set to true to enable redux dev tool in dev2 environment
export const ENABLE_REDUX_DEV_TOOL = false;
// ***********************************************************
export const inventoryApi = '/api/inventory';
export const apporigin = 'https://www.academy.com';
export const footerAPI = '/mockapi';
export const headerAPI = '/mockapi-header';
export const categoriesAPI = '/api/category?categoryIds=';
export const productsAPI = '/api/productinfo?productIds=';
export const facetSearchAPI = '/api/search/';
export const SEARCHTERM_API = '/api/search/sitesearch?searchTerm=';
export const productInfoAPI = '/api/category/';
export const breadCrumbAPI = '/api/category/breadcrumb/';
export const seoCategoryAPI = '/api/variant/seo?categoryId=';
export const seoProductAPI = '/api/variant/seo?productId=';
export const sessionAPI = '/api/session ';
export const productAPI = '/api/product/';
export const wishListAPI = userId => `/api/profile/r2/${userId}/wishlist`;
export const espotAPI = '/api/promotion/espot/';
export const searchDexCat = `${searchdexStorage}/sdl-c`;
export const searchDexFooter = `${searchdexStorage}/sdf-`;
export const searchDexCanonical = `${searchdexStorage}/sdm-c`;
export const headerAutoSuggestAPI = '/api/search/autosuggest/';
export const visualGuidedCategoriesBrandsAPI = '/api/search/productSuggestions/';
export const miniCartAPI = '/api/cart/';
export const getCurrentCartItems = '/api/cart/000000';
export const findAStoreAPI = '/api/stores';
export const makeMyStoreAPI = `${findAStoreAPI}/makeMyStore`;
export const getSavedCards = profileId => `/api/profile/r2/${profileId}/creditCards`;
export const postCreditCardBillingAddress = orderId => `/api/orders/${orderId}/creditCard`;
// Component Registry
const componentRegistryBase = 'http://localhost:9000';
export const compRegistryAPI = `${componentRegistryBase}/api/platformservice/components`;
// Event bus message
export const evtASOLoadComplete = 'aso:load-complete';
// Checkout variables
export const basenameCheckout = '/checkout';
// Cart variables
export const onlineStoreId = '10151';
export const basenameCart = '/shop/cart';
export const getCartAPI = '/api/cart/';
export const addItemBackToCart = '/api/cart/sku';
export const cartIdCookieName = 'WC_CartOrderId_10151';
export const updateShipModeAPI = '/api/cart/PUT/updateshippingmode';
export const updateQtyAPI = cartid => `/api/cart/PUT/${cartid}/updateItemQuantity`;
export const addToWishListAPI = skuid => `/api/profile/r2/wishlist/${skuid}`;
export const onCheckout = id => `/api/cart/PUT/${id || '00000'}/initiate`;
export const taxService = id => `/api/taxes/order/${id || '00000'}/tax`;
export const checkoutUrl = '/checkout';
export const addPromoCodeAPI = (cartid, promocode) => `/api/orders/${cartid}/promocode/${promocode}`;
export const removePromoCodeAPI = (cartid, code) => `/api/orders/DELETE/${cartid}/promocode/${code}`;
export const inventoryCheck = storeId => `/api/inventory/store/${storeId}`;
export const cartZipCodeByGeo = key => `https://maps.googleapis.com/maps/api/geocode/json?key=${key}&latlng=`;
export const updateSOFOrderItems = '/api/cart/PUT/000000/updateOrderItem';
// PDP Generic variables
export const basenameProductDetailsGeneric = '/productDetailsGeneric';
// productDetailsMultiSku  variables
export const basenameProductDetailsMultiSku = '/productDetailsMultiSku';
// productDetailsBait variables
export const basenameProductDetailsBait = '/productDetailsBait';
// Logs in a registered user using their user name and password
export const loginIdentity = '/api/identity/login';
// get order details
export const getOrderDetails = orderid => `/api/orders/${orderid}`;
// validate address
export const validateAddress = '/api/address';
// User Wishlist Names
export const userWishListNamesAPI = profileID => `/api/profile/r2/${profileID}/wishlist/`;
// createWishList
export const createNewWishListAPI = profileID => `/api/profile/r2/${profileID}/wishlist/`;
// shareWish List
export const shareWishListAPI = (profileID, wishlistId) => `/api/profile/r2/${profileID}/wishlist/${wishlistId}/share`;
// delete wishList
export const deleteWishListAPI = (wishlistID, profileID) => `/api/profile/r2/${profileID}/wishlist/DELETE/${wishlistID}`;
// rename wishlist
export const renameWishlistAPI = (profileID, wishlistID) => `/api/profile/r2/${profileID}/wishlist/PUT/${wishlistID}/`;
// Wishlist Items
export const getWishlistItem = (profileID, wishlistID) => `/api/profile/r2/${profileID}/wishlist/${wishlistID}`;
// remove item from wishlist
export const removeWishlistItemAPI = (profileID, wishlistId, itemId) => `/api/profile/r2/${profileID}/wishlist/${wishlistId}/items/DELETE/${itemId}`;
export const addToCartItems = '/api/cart/sku';
// user registration
export const userRegistration = '/api/profile/registration';
// add shipping address
export const addShippingAddress = orderId => `/api/orders/PUT/${orderId}/shipping`;
// add shipping address
// TODO
export const getShippingAddress = profileId => `/api/profile/r2/${profileId}/address/`;
// get available shipping methods
export const getShippingModes = orderId => `/api/orders/${orderId}/shipping-modes`;
// add billing address and payment details
export const addPayment = orderId => `/api/orders/PUT/${orderId}/payment`;
// place order
export const placeOrder = orderId => `/api/orders/${orderId}`;
// createNewPassword
export const createNewPasswordAPI = '/api/profile/changePassword';
// get city state from Zipcode
export const getCityState = zipCode => `/api/address/city/${zipCode}`;
// Public path needed for chunks to resolve specially for the SPA's
export const publicPaths = {
  cart: `${staticAssetsBucketPath}/components/cart/1.0.0/`,
  checkout: `${staticAssetsBucketPath}/components/checkout/1.0.0/`,
  myaccount: `${staticAssetsBucketPath}/components/myaccount/1.0.0/`,
  productDetailsGeneric: `${staticAssetsBucketPath}/components/productDetailsGeneric/1.0.0/`,
  productDetailsMultiSku: `${staticAssetsBucketPath}/components/productDetailsMultiSku/1.0.0/`,
  productDetailsBait: `${staticAssetsBucketPath}/components/productDetailsBait/1.0.0/`,
  productDetailsNoDifferentSelection: `${staticAssetsBucketPath}/components/productDetailsNoDifferentSelection/1.0.0/`,
  productDetailsMultiSkuPackage: `${staticAssetsBucketPath}/components/productDetailsMultiSkuPackage/1.0.0/`,
  signInSignUp: `${staticAssetsBucketPath}/components/signInSignUp/1.0.0/`,
  createPassword: `${staticAssetsBucketPath}/components/createPassword/1.0.0/`,
  productGrid: `${staticAssetsBucketPath}/components/productGrid/1.0.0/`,
  createAccount: `${staticAssetsBucketPath}/components/createAccount/1.0.0/`
};

export const siteMapAPI = '/api/category/sitemap';
// bazaarVoice environment variables
export const bvEnvironment = 'staging';
// trueFit environment variables
export const trueFitEnvironment = 'staging';
// apply gift card
export const applyGiftCard = orderId => `/api/orders/${orderId}/giftCards`;
// remove gift card
export const removeGiftCard = (orderId, giftCardId) => `/api/orders/DELETE/${orderId}/giftCards/${giftCardId}`;
// fetch saved gift cards
export const fetchGiftCard = profileId => `api/profile/r2/${profileId}/giftCards/`;
// Signup Component
export const signUp = '/api/identity/profile';
export const resetPassword = '/api/identity/password';
// Profile
export const profileInfo = profileId => `/api/profile/r2/${profileId}`;
export const updateProfileInfo = profileId => `/api/profile/${profileId}`;
export const updateProfileInfoPUT = profileId => `/api/profile/PUT/r2/${profileId}`;
export const updatePassword = '/api/identity/password';
export const updatePasswordPUT = '/api/identity/password/PUT';
export const deleteAddress = (profileID, addressID) => `/api/profile/r2/${profileID}/address/DELETE/${addressID}`;
export const getAddress = profileID => `/api/profile/r2/${profileID}/address/`;
export const postAddress = profileID => `/api/profile/r2/${profileID}/address/`;
export const editAddress = (profileID, addressID, makePrimary) => `/api/profile/r2/${profileID}/address/PUT/${addressID}/?makePrimary=${makePrimary}`;
// get credit cards api
export const getCreditCardAPI = profileID => `/api/profile/r2/${profileID}/creditCards`;
// get or add gift cards api
export const getPostGiftCardsAPI = profileID => `/api/profile/r2/${profileID}/giftCards`;
// add gift card api
export const addGiftCardAPI = profileID => `/api/profile/r2/${profileID}/giftCard`;
// delete gift card api
export const deleteGiftCardAPI = (profileID, gcID) => `/api/profile/r2/${profileID}/giftCards/DELETE/${gcID}`;
// delete credit card api
export const deleteCreditCardAPI = (profileId, ccId) => `/api/profile/r2/${profileId}/creditCards/DELETE/${ccId}`;
// add credit card api
export const addCreditCardAPI = profileID => `/api/profile/r2/${profileID}/creditCard`;
// put credit card api
export const putCreditCardAPI = (profileID, ccId, makePrimary) => `/api/profile/r2/${profileID}/creditCards/PUT/${ccId}?makePrimary=${makePrimary}`;
export const signOut = '/api/identity/logout';
// orders
export const orderList = (pageSize, sortBy, pageNumber) => `/api/profileorders/?pageSize=${pageSize}&sortBy=${sortBy}&pageNumber=${pageNumber}`;
export const orderDetailsById = orderId => `/api/profileorders/${orderId}`;
export const cancelOrderAPI = (orderId, zipCode) => `/api/profileorders/${orderId}/cancel/?zipCode=${zipCode}`;
export const initiateReturnAPI = orderId => `/api/profileorders/${orderId}/return`;
export const printLabel = orderId => `/api/profileorders/${orderId}/returnReceipt`;
export const printPackSlip = (orderId, invNum) => `/api/profileorders/${orderId}/printOrder/${invNum}`;
export const storeLink = '/shop/en/store/instore-services';
// get account details for order confirmation
export const getAccountOrderConfirmation = orderID => `/api/orders/${orderID}/confirmedOrder`;
export const ordersAPI = '/api/orders/';
export const orderAPI = '/api/order/';
// for get store address
export const getStoreAddressUrl = storeId => `/api/stores/${storeId}`;
// Google API Key
export const GOOGLE_APIKEY = 'AIzaSyCjnO9r3I7rrzuGYgibzLQ2LF8epfOnwQA';
// paypal API
export const postPayPalAPI = orderId => `/api/orders/${orderId}/payments/paypal`;

export const orderUpdateAPI = storeId => `/api/orders/00000/store/${storeId}`;
// profile
export const profileAPI = '/api/profile/r2/';
// Prod vs Non Prod script URLS
export const envScriptURL = {
  customerPhotos: 'https://static.curations.bazaarvoice.com/gallery/academy/prod/loader.js'
};
export const RETURN_INSTRUCTION = 'https://academy.custhelp.com/app/answers/detail/a_id/203';

// InAuth browser data collector host
export const IN_AUTH_COLLECTOR_HOST = 'www.cdn-net.com';
export const FIRSTDATA_SID = 'a150ad44e9299995';
export const cartURL = '/api/cart/sku';
export const signOutURL = '/shop/LogonForm?rememberMe=true';
export const akamaiCoordURL = '/api/store/userCoordinates';

// First Data - paymentJS
export const FIRSTDATA_DOMAIN = 'https://www.paymentjs.firstdata.com';
export const FIRSTDATA_PAYMENTJS = `${FIRSTDATA_DOMAIN}/v1/payment.js`;
export const FIRSTDATA_API_KEY = 'CTcGppPnSNUaGeMueJR1OGPfj7jGjFAL';
export const FIRSTDATA_JS_SECURITY_TOKEN = 'js-cbec52e934981f641389f8fba72a8f6ecbec52e934981f64';
export const FIRSTDATA_TA_TOKEN = 'EAI0';
export const FIRSTDATA_FD_TOKEN = 'FDToken';

// PaypPal API
export const PAYPAL_ENV = 'production';
export const PAYPAL_JS = 'https://www.paypalobjects.com/api/checkout.js';
export const PAYPAL_API_KEY = 'AcVhcz23aBEqOmcTjSixX7Ut1lIVaD2s79zsWsHPM5uZJVmgr63SKWLNDhZV9nDoBbsUZ-rkQraoCFoj';

// GOOGLE PAY
export const GOOGLE_PAY_JS = 'https://pay.google.com/gp/p/js/pay.js';

// APPLE PAY
export const APPLE_PAY_MERCHANT_IDENTIFIER = 'merchant.academyuat';
export const APPLE_PAY_MERCHANT_NAME = 'Academy Sports & Outdoors';
export const APPLE_PAY_GET_SESSION = '/auth/apple/getApplePaySession';
export const APPLE_PAY_PROCESS_PAYMENT = '/auth/apple/processApplePayment';
