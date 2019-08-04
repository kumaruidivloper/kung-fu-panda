export const NODE_TO_MOUNT = 'myAccountPayment';
export const DATA_COMP_ID = 'data-compid';
// PaymentJS constants
export const FIRST_DATA_DOMAIN = 'https://qa.paymentjs.firstdata.com';
export const FIRST_DATA_API = 'https://qa.paymentjs.firstdata.com/v1/payment.js';
export const API_KEY = 'yvmDvaGdgdFLoSrpAW19gIAx6ai2AzTT';
export const JS_SECURITY_TOKEN = 'js-23e091f786c7f732df581967619eceb523e091f786c7f732';
export const TA_TOKEN = 'fdoa-386edacba13e160231431f62136eae13386edacba13e1602';
export const FD_TOKEN = 'FDToken';
export const PAYMENT_SUCCESS_STATUS = 201;

export const GET_CREDIT_CARDS = 'get-credit-cards';
export const GET_CREDIT_CARDS_SUCCESS = 'get-credit-cards-success';
export const GET_CREDIT_CARD_ERROR = 'get-credit-card-error';

export const GET_GIFT_CARDS = 'get-gift-cards';
export const GET_GIFT_CARDS_SUCCESS = 'get-gift-cards-success';
export const ADD_GIFT_CARDS_ERROR = 'add-gift-cards-error';
export const GET_GIFT_CARDS_ERROR = 'get-gift-cards-error';

export const ADD_GIFT_CARD = 'add-gift-card';
export const ADD_CREDIT_CARD = 'add-credit-card';
export const ADD_GIFT_CARD_SUCCESS = 'add-gift-card-success';
export const ADD_CREDIT_CARD_ERROR = 'add-credit-card-error';

export const DELETE_GIFT_CARD = 'delete-gift-card';
export const DELETE_GIFT_CARD_SUCCESS = 'delete-gift-card-success';
export const DELETE_GIFT_CARD_ERROR = 'delete-gift-card-error';
export const DELETE_CREDIT_CARD = 'delete-credit-card';
export const DELETE_CREDIT_CARD_ERROR = 'delete-credit-card-error';

export const PUT_CREDIT_CARD = 'pu-credit-card';
export const PUT_CREDIT_CARD_ERROR = 'put-credit-card-error';
export const API_SUCCESS_CODE = 200;
export const POST_API_SUCCESS_CODE = 201;
export const DELETE_API_SUCCESS_CODE = 204;

// constants fro credit card image icon
export const AMEX = 'amex';
export const VISA = 'visa';
export const DISC = 'disc';
export const MAST = 'mast';
export const AMERICAN_EXPRESS = 'americanexpress';
export const MASTER_CARD = 'mastercard';

// Gift Card
export const GCNUMBER_13_WITH_DASHES = 22;
export const GCNUMBER_16_WITH_DASHES = 25;
export const GCPIN_4 = 4;
export const GCPIN_8 = 8;
// address form
export const NAME_ADDRESS_MAX_LEN = 50;
export const ZIP_CODE_MAX_LEN = 5;
export const PHONE_NUM_MAX_LEN = 10;

export const FORM_NAME = 'addNewGiftCardForm';
export const LIVE_CHAT = '{{liveChat}}';
export const CUSTOMER_CARE_NO = '{{customercareNo}}';
export const SOMETHING_WENT_WRONG = 'Something went wrong';

export const MASTER_CARD_ITEM_TYPE = 'mastercard';
export const MASTER_CARD_CARD_TYPE = 'Master Card ';
export const AMERICAN__ITEM_TYPE = 'american express';
export const AMEX_CARD_TYPE = 'AMEX ';

/* Analytics Constant */
export const ANALYTICS_EVENT_IN = 'myaccount';
export const ANALYTICS_EVENT_CATEGORY = 'user account';
export const analyticsEventLabel = {
    ADD: 'payment|add credit card',
    REMOVE: 'payment|remove credit card',
    EDIT: 'payment|edit credit card'
};
export const analyticsEventAction = {
    ADD: 'new credit card added',
    REMOVE: 'credit card removed',
    UPDATE: 'update payment'
};
export const addGiftCardAnalyticsEventLabel = 'new gift card added';
export const removeGiftCardAnalyticsEventLabel = 'gift card removed';
export const addGiftCardAnalyticsEventAction = 'gift card|add gift card';
export const removeGiftCardAnalyticsEventAction = 'gift card|remove gift card';

export const analyticsErrorEvent = 'errormessage';
export const analyticsErrorEventCategory = 'error message';
export const analyticsErrorEventAction = 'form validation error|add credit card';
export const analyticsGCErrorEventAction = 'form validation error|add gift card';
