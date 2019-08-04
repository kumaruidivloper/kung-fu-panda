export const NODE_TO_MOUNT = 'checkout';
export const DATA_COMP_ID = 'data-compId';

export const USERTYPE = 'USERTYPE';
export const PROP65ERRORCODE = '_RESTRICTED_PROP65';
export const errorDefaultKey = '_ERR_DEFAULT_KEY';
export const PICKUP_IN_STORE_CONSTANT = 'PickupInStore';
export const AVAILABLE_CONSTANT = 'AVAILABLE';
export const STATE_RESTRICTION_ERROR = '_ERR_ITEM_STATE_RESTRICTION_ERROR';
export const CART_PAGE_URL_PATHNAME = '/shop/cart';
export const VIEW_CART_LABEL = 'View Cart';

// fetch order details
export const FETCH_PAGE_DATA_REQUEST = 'checkout/fetch page data request';
export const FETCH_PAGE_DATA_SUCCESS = 'checkout/fetch page data success';
export const FETCH_PAGE_DATA_FAILURE = 'checkout/fetch page data failure';
export const INVALIDATE_PAGE_DATA_FAILURE = 'checkout/clear page data';

// manage page state
export const SET_INIT_PAGE_STATE = 'checkout/TRACK_INIT_PAGE_STATE';
export const MARK_SECTION_COMPLETED = 'checkout/mark section completed';
export const MARK_SECTION_EDIT = 'checkout/mark section for edit';
export const PAGE_SECTIONS = ['shippingAddressRequired', 'shippingMethodRequired', 'pickupDrawerRequired', 'specialOrderDrawerRequired', 'paymentRequired'];

// fetch shipping modes
export const SHIPPINGMODES_SUCCESS = 'checkout/shippingModesSuccess';
export const SHIPPINGMODES_ERROR = 'checkout/shippingModesError';
export const SHIPPINGMODES = 'checkout/shippingModes';

// set auth status
export const SET_AUTH_STATUS = 'checkout/set auth status';

// get saved shipping address
export const FETCH_SHIPPING_ADDRESS_REQUEST = 'checkout/fetch saved shipping addresses';
export const FETCH_SHIPPING_ADDRESS_SUCCESS = 'checkout/fetch saved shipping success';
export const FETCH_SHIPPING_ADDRESS_FAILURE = 'checkout/fetch saved shipping failure';
export const INVALIDATE_SHIPPING_ADDRESS = 'checkout/clear saved shipping';

// get saved billing address
export const FETCH_BILLING_ADDRESS_REQUEST = 'checkout/fetch saved billing addresses';
export const FETCH_BILLING_ADDRESS_SUCCESS = 'checkout/fetch saved billing success';
export const FETCH_BILLING_ADDRESS_FAILURE = 'checkout/fetch saved billing failure';
export const INVALIDATE_BILLING_ADDRESS = 'checkout/clear saved billing';

// fetch city/state via zip code
export const LOAD_CITY_STATE_DATA = 'checkout/load city state';
export const CITY_STATE_DATA_LOADED = 'checkout/city state loaded';
export const LOAD_CITY_STATE_FAILURE = 'checkout/city state loading failure';
export const ERASE_CITY_STATE_DATA = 'checkout/erase city state data';

// get saved saved cards
export const FETCH_SAVED_CARDS_REQUEST = 'checkout/fetch saved credit cards';
export const FETCH_SAVED_CARDS_SUCCESS = 'checkout/fetch saved credit cards success';
export const FETCH_SAVED_CARDS_FAILURE = 'checkout/fetch saved credit cards failure';
export const INVALIDATE_SAVED_CARDS = 'checkout/clear saved credit cards';
//
export const CHANGE_BILLING_ADDRESS = 'checkout/CHANGE_BILLING_ADDRESS';
// get Shipping Modes on confirm Shipping Address
export const FETCH_SHIPPINGMODES_REQUEST = 'checkout/fecth shipping modes';
export const FETCH_SHIPPINGMODES_SUCCESS = 'checkout/fetch shipping modes success';
export const FETCH_SHIPPINGMODES_FAILURE = 'checkout/fetch shipping modes failure';

// post shipping address and shipping modes
export const POST_SHIPPINGMODES_REQUEST = 'checkout/post shipping address and modes';
export const POST_SHIPPINGMODES_SUCCESS = 'checkout/post shipping address and modes success';
export const POST_SHIPPINGMODES_FAILURE = 'checkout/post shipping address and modes failure';

// post Payment data
export const POST_PAYMENT_REQUEST = 'checkout/post payment data';
export const POST_PAYMENT_SUCCESS = 'checkout/post payment success';
export const POST_PAYMENT_FAILURE = 'checkout/post payment failure';

// validation rules
export const isValidPhoneNumber = phone => (/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/i.test(phone));
export const isValidEmail = value => (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(value)); // eslint-disable-line
export const isValidCity = name => (/^[a-zA-Z\s]+$/.test(name));
export const isValidZipCode = ZipCode => (/^\d{5}-\d{4}$|^\d{5}$/.test(ZipCode));
export const isValidAddress = AddressOne => (/^[a-zA-Z0-9\-\. ',#&;/\s]+$/i.test(AddressOne)); // eslint-disable-line
export const isValidName = name => (/^[a-zA-Z-']+$/.test(name));
export const isValidPassword = password => (/^.{8,}$/.test(password));
export const isRepeatedChars = password => (/(.)\1\1/g.test(password));
export const numberOnly = '[0-9]*';

// add shipping address on submit
export const ADD_SHIPPING_ADDRESS_REQUEST = 'checkout/add new shipping address';
export const ADD_SHIPPING_ADDRESS_SUCCESS = 'checkout/add new shipping address success';
export const ADD_SHIPPING_ADDRESS_FAILURE = 'checkout/add new shipping address failure';

// place order on submit in review order
export const POST_PLACEORDER_REQUEST = 'checkout/post place order data';
export const POST_PLACEORDER_SUCCESS = 'checkout/post place order success';
export const POST_PLACEORDER_FAILURE = 'checkout/post place failure';

// validate address form values
// common for both shipping and billing address form
export const VALIDATE_ADDRESS_REQUEST = 'checkout/validate new address';
export const VALIDATE_ADDRESS_SUCCESS = 'checkout/validate new success';
export const VALIDATE_ADDRESS_FAILURE = 'checkout/validate new fail';
export const INVALIDATE_ADDRESS_VALIDATION = 'checkout/invalidate address validation';

//  validate zip code
// common for both shipping and billing address
export const ZIPCODE_REQUEST = 'checkout/validate zipcode request';
export const ZIPCODE_SUCCESS = 'checkout/validate zipcode success';

// add remove giftcard constants
export const GIFTCARD_APPLY_REQUEST = 'checkout/ apply giftcard request';
export const GIFTCARD_APPLY_SUCCESS = 'checkout/ apply giftcard success';
export const GIFTCARD_APPLY_FAILURE = 'checkout/ apply giftcard failure';
export const GIFTCARD_REMOVE_REQUEST = 'checkout/ remove giftcard request';
export const GIFTCARD_REMOVE_SUCCESS = 'checkout/ remove giftcard success';
export const GIFTCARD_REMOVE_FAILURE = 'checkout/ remove giftcard failure';
export const GIFTCARD_FETCH_REQUEST = 'checkout/ fetch giftcard request';
export const GIFTCARD_FETCH_SUCCESS = 'checkout/ fetch giftcard success';
export const GIFTCARD_FETCH_FAILURE = 'checkout/ fetch giftcard failure';
export const CLEAR_GIFTCARD_ERRORS = 'checkout/ clear giftcard errors';

// to check api reponse is 200 or not
export const GET_SUCCESS_CODE = 200;
export const POST_SUCCESS_CODE = 201;
export const ERROR_CODE = 400;
export const PUT_SUCCESS_CODE = 204;

// list of US States for state dropdowns.
export const USStates = [{ title: 'Select' }, { title: 'AK' },
{ title: 'AA' },
{ title: 'AE' },
{ title: 'AL' },
{ title: 'AP' },
{ title: 'AR' },
{ title: 'AZ' },
{ title: 'CA' },
{ title: 'CO' },
{ title: 'CT' },
{ title: 'DC' },
{ title: 'DE' },
{ title: 'FL' },
{ title: 'GA' },
{ title: 'HI' },
{ title: 'IA' },
{ title: 'ID' },
{ title: 'IL' },
{ title: 'IN' },
{ title: 'KS' },
{ title: 'KY' },
{ title: 'LA' },
{ title: 'MA' },
{ title: 'MD' },
{ title: 'ME' },
{ title: 'MI' },
{ title: 'MN' },
{ title: 'MO' },
{ title: 'MS' },
{ title: 'MT' },
{ title: 'NC' },
{ title: 'ND' },
{ title: 'NE' },
{ title: 'NH' },
{ title: 'NJ' },
{ title: 'NM' },
{ title: 'NV' },
{ title: 'NY' },
{ title: 'OH' },
{ title: 'OK' },
{ title: 'OR' },
{ title: 'PA' },
{ title: 'PR' },
{ title: 'RI' },
{ title: 'SC' },
{ title: 'SD' },
{ title: 'TN' },
{ title: 'TX' },
{ title: 'UT' },
{ title: 'VA' },
{ title: 'VT' },
{ title: 'WA' },
{ title: 'WI' },
{ title: 'WV' },
{ title: 'WY' }];

export const LOADING_TRUE = 'checkout/loading data';
export const LOADING_FALSE = 'checkout/loaded data';

// post pickupInStore details
export const POST_PICKUPINSTORE_REQUEST = 'checkout/post pickup in store details';
export const POST_PICKUPINSTORE_SUCCESS = 'checkout/post pickup in store details success';
export const POST_PICKUPINSTORE_FAILURE = 'checkout/post pickup in store details failure';

// post shipToStore details
export const POST_SHIPTOSTORE_REQUEST = 'checkout/post ship to store details';
export const POST_SHIPTOSTORE_SUCCESS = 'checkout/post ship to store details success';
export const POST_SHIPTOSTORE_FAILURE = 'checkout/post ship to store details failure';

// get store address
export const FETCH_STORE_ADDRESS_REQUEST = 'checkout/fecth store address';
export const FETCH_STORE_ADDRESS_SUCCESS = 'checkout/fetch store address success';
export const FETCH_STORE_ADDRESS_FAILURE = 'checkout/fetch store address failure';

// paypal data
export const POST_PAYPAL_REQUEST = 'checkout/post paypal request';
export const POST_PAYPAL_SUCCESS = 'checkout/post paypal success';
export const POST_PAYPAL_FAILURE = 'checkout/post paypal failure';

// remove order item form checkout page
export const REMOVE_ORDER_ITEM_REQUEST = 'checkout/post remove item request';
export const REMOVE_ORDER_ITEM_SUCCESS = 'chekcout/post remove item success';
export const REMOVE_ORDER_ITEM_FAILURE = 'chekcout/post remove item failure';

// set payment method selected
export const SET_PAYMENT_METHOD = 'checkout/ set payment method';

// checkout inventory request
export const CHECKOUT_INVENTORY_REQUEST = 'checkout/post inventory request';
export const CHECKOUT_INVENTORY_SUCCESS = 'checkout/post inventory success';
export const CHECKOUT_INVENTORY_FAILURE = 'checkout/post inventory failure';

export const STORE_ZIP_CODE = 'WC_StZip_Selected';

// gift card analytics data
export const GIFT_CARD_EVENT_NAME = 'checkoutsteps';
export const GIFT_CARD_EVENT_CATEGORY = 'checkout';
export const GIFT_CARD_EVENT_ACTION = 'payment';
export const APPLY_GIFT_CARD_EVENT_LABEL = 'gift card applied';
export const REMOVE_GIFT_CARD_EVENT_LABEL = 'gift card removed';

// constant for landing drawer
export const LANDING_DRAWER = 'landingDrawer';
export const LANDING_DRAWER_LOGIN = 'landingDrawerLogin';
