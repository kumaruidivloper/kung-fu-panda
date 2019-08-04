/**
 *************************************************************
 * Static assets path.
 * The 'staticAssetsBucketPath' is used in webpack _rules.js
 *************************************************************
 */
const searchdexStorage = 'https://incl-v2.academy.com.searchdex.net';
export const staticAssetsBucketPath = 'http://localhost:9000';
export const staticVendorBucketPath = 'http://localhost:9000/vendor/';
// ***********************************************************

export const footerAPI = '/mockapi';
export const headerAPI = '/mockapi-header';
export const categoriesAPI = '/api/category?categoryIds=';
export const productsAPI = '/api/productinfo?productIds=';
export const facetSearchAPI = '/api/search/';
export const SEARCHTERM_API = '/api/search/sitesearch/';
export const productInfoAPI = '/api/category/';
export const seoCategoryAPI = '/api/variant/seo?categoryId=';
export const seoProductAPI = '/api/variant/seo?productId=';
export const sessionAPI = '/api/session ';
export const productAPI = '/api/product/';
export const wishListAPI = '/api/profile/wishlist';
export const espotAPI = '/api/promotion/espot/';
export const searchDexCat = `${searchdexStorage}/sdl-c`;
export const searchDexFooter = `${searchdexStorage}/sdf-`;
export const headerAutoSuggestAPI = '/api/search/autosuggest/';
export const autoSuggestionsBrandsCategoriesAPI = '/api/search/sitecontent';
export const miniCartAPI = '/api/cart/';
export const getCurrentCartItems = '/api/cart/000000';
export const visualGuidedAutoSuggestAPI = '/api/search/productSuggestions/';
export const findAStoreAPI = '/api/stores';
export const makeMyStoreAPI = `${findAStoreAPI}/makeMyStore`;
export const getSavedCards = profileId => `/api/profile/r2/${profileId}/creditCards`;
export const postPaymentDetails = orderId => `/api/orders/${orderId}/payment`;
// Component Registry
const componentRegistryBase = 'http://localhost:9000';
export const compRegistryAPI = `${componentRegistryBase}/api/platformservice/components`;
// Event bus message
export const evtASOLoadComplete = 'aso:load-complete';
// Checkout variables
export const basenameCheckout = '/checkout';
// Cart variables
export const basenameCart = '/shop/cart';
export const getCartAPI = '/api/cart/';
export const cartIdCookieName = 'WC_CartOrderId_10151';
export const updateShipModeAPI = '/api/cart/updateshippingmode';
export const updateQtyAPI = cartid => `/api/cart/${cartid}/updateItemQuantity`;
export const addToWishListAPI = skuid => `/api/profile/wishlist/${skuid}`;
export const onCheckout = id => `/api/cart/${id}/initiate`;
export const checkoutUrl = '/checkout';
export const addPromoCodeAPI = (cartid, promocode) => `/api/orders/${cartid}/promocode/${promocode}`;
export const removePromoCodeAPI = (cartid, code) => `/api/orders/${cartid}/promocode/${code}`;
export const inventoryCheck = storeId => `/api/inventory/store/${storeId}`;
export const cartZipCodeByGeo = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
// PDP Generic variables
export const basenameProductDetailsGeneric = '/productDetailsGeneric';
// productDetailsMultiSku  variables
export const basenameProductDetailsMultiSku = '/productDetailsMultiSku';
// productDetailsBait variables
export const basenameProductDetailsBait = '/productDetailsBait';
// Logs in a registered user using their user name and password
export const loginIdentity = '/api/profile/identity/login';
// get order details
export const getOrderDetails = orderid => `/api/orders/${orderid}`;
// validate address
export const validateAddress = '/api/address';
// User Wishlist Names
export const userWishListNamesAPI = profileID => `/api/profile/${profileID}/wishlist/`;
// createWishList
export const createNewWishListAPI = profileID => `/api/profile/${profileID}/wishlist/`;
// shareWish List
export const shareWishListAPI = (profileID, wishlistId) => `/api/profile/${profileID}/wishlist/${wishlistId}/share`;
// delete wishList
export const deleteWishListAPI = wishlistID => `/api/profile/wishlist/${wishlistID}`;
// rename wishlist
export const renameWishlistAPI = (profileID, wishlistID) => `/api/profile/${profileID}/wishlist/${wishlistID}/`;
// Wishlist Items
export const getWishlistItem = (profileID, wishlistID) => `/api/profile/${profileID}/wishlist/${wishlistID}`;
// user registration
export const userRegistration = '/api/profile/registration';
// add shipping address
export const addShippingAddress = orderId => `/api/orders/${orderId}/shipping`;
// add shipping address
export const getShippingAddress = profileId => `/api/profiles/${profileId}/shippingAddress`;
// get available shipping methods
export const getShippingModes = orderId => `/api/orders/${orderId}/shipping-modes`;
// add billing address and payment details
export const addPayment = orderId => `/api/orders/${orderId}/payment`;
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
// apply gift card
export const applyGiftCard = orderId => `/api/orders/${orderId}/giftCards`;
export const removeGiftCard = (orderId, giftCardId) => `/api/orders/${orderId}/giftCards/${giftCardId}`;
// Signup Component
export const signUp = '/api/profile/registration';
export const resetPassword = '/api/profile/password';
// Profile
export const profileInfo = profileId => `/api/profile/${profileId}`;
export const updateProfileInfo = profileId => `/api/profile/${profileId}`;
export const updatePassword = '/api/profile/password';
export const deleteAddress = (profileID, addressID) => `/api/profile/${profileID}/address/${addressID}`;
export const getAddress = profileID => `/api/profile/${profileID}/address/`;
export const postAddress = profileID => `/api/profile/${profileID}/address/`;
export const editAddress = (profileID, addressID, makePrimary) => `/api/profile/${profileID}/address/${addressID}/?makePrimary=${makePrimary}`;
// get credit cards api
export const getCreditCardAPI = profileID => `/api/profile/${profileID}/creditCards`;
// get or add gift cards api
export const getPostGiftCardsAPI = profileID => `/api/profile/${profileID}/giftCards`;
// add gift card api
export const addGiftCardAPI = profileID => `/api/profile/${profileID}/giftCard`;
// delete gift card api
export const deleteGiftCardAPI = (profileID, gcID) => `/api/profile/${profileID}/giftCards/${gcID}`;
// delete credit card api
export const deleteCreditCardAPI = (profileId, ccId) => `/api/profile/${profileId}/creditCards/${ccId}`;
// add credit card api
export const addCreditCardAPI = profileID => `/api/profile/${profileID}/creditCard`;
// put credit card api
export const putCreditCardAPI = (profileID, ccId, makePrimary) => `/api/profile/${profileID}/creditCards/${ccId}/?makePrimary=${makePrimary}`;
export const signOut = '/api/profile/logout';
// orders
export const ordersAPI = '/api/orders/';
export const orderAPI = '/api/order/';
// profile
export const profileAPI = '/api/profile/r2/';
// Prod vs Non Prod script URLS
export const envScriptURL = {
  customerPhotos: 'https://static.curations.bazaarvoice.com/gallery/academy/stg/loader.js'
};

export const RETURN_INSTRUCTION = 'https://academy.custhelp.com/app/answers/detail/a_id/203';

// InAuth browser data collector host
export const IN_AUTH_COLLECTOR_HOST = 'staging.cdn-net.com';
export const cartURL = '/api/cart/sku';
export const signOutURL = '/shop/LogonForm?rememberMe=true';
export const akamaiCoordURL = '/api/store/userCoordinates';

// First Data - paymentJS
export const FIRSTDATA_DOMAIN = 'https://qa.paymentjs.firstdata.com';
export const FIRSTDATA_PAYMENTJS = `${FIRSTDATA_DOMAIN}/v1/payment.js`;
export const FIRSTDATA_API_KEY = 'yvmDvaGdgdFLoSrpAW19gIAx6ai2AzTT';
export const FIRSTDATA_JS_SECURITY_TOKEN = 'js-ef191cabf7ef9b9e5b61913e1a2f3145ef191cabf7ef9b9e';
export const FIRSTDATA_TA_TOKEN = 'NOIW';
export const FIRSTDATA_FD_TOKEN = 'FDToken';
export const printPackSlip = (orderId, invNum) => `/api/profileorders/${orderId}/printOrder/${invNum}`;

// PaypPal API
export const PAYPAL_ENV = 'sandbox';
export const PAYPAL_JS = 'https://www.paypalobjects.com/api/checkout.js';
export const PAYPAL_API_KEY = 'AZIoy7wkXiDML9-c9Vz712AghG_XejVMyT0HHrUgxfGIt5Ch-V7i2SuUPiR4Xry-ds9kfsKZPdxDnyFL';

// GOOGLE PAY
export const GOOGLE_PAY_JS = 'https://pay.google.com/gp/p/js/pay.js';

// APPLE PAY
export const APPLE_PAY_MERCHANT_IDENTIFIER = 'merchant.academyuat';
export const APPLE_PAY_MERCHANT_NAME = 'Academy Sports & Outdoors';
export const APPLE_PAY_GET_SESSION = '/auth/apple/getApplePaySession';
export const APPLE_PAY_PROCESS_PAYMENT = '/auth/apple/processApplePayment';
