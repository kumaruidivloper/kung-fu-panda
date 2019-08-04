import { get } from '@react-nitro/error-boundary';
import { COUNTRY } from './../../../utils/constants';
import { has } from './../../../utils/objectUtils';
import { PAYPAL_STS } from './../constants';
/**
 * map order item key values according to paypal request object.
 * @param orderItems
 * @returns {*}
 */
export const getOrderItems = (orderItems, totals) => {
  const refinedOrderItems = orderItems.map(item => {
    const refinedItem = {};
    refinedItem.name = checkIfStringUndefined(item.skuDetails.skuInfo.name);
    refinedItem.description = checkIfStringUndefined(item.skuDetails.skuInfo.longDescription);
    refinedItem.quantity = `${checkIfStringUndefined(item.quantity)}`;
    refinedItem.price = `${checkIfStringUndefined(item.unitPrice)}`;
    refinedItem.currency = 'USD';
    return refinedItem;
  });
  const discount = has(totals, 'totalAdjustment') ? totals.totalAdjustment : 0;
  if (discount) {
    refinedOrderItems.push({
      name: 'Discount',
      price: discount,
      currency: 'USD',
      quantity: '1'
    });
  }
  const empDiscount = has(totals, 'employeeDiscount') ? totals.employeeDiscount : 0;
  if (empDiscount) {
    refinedOrderItems.push({
      name: 'Employee Discount',
      price: empDiscount,
      currency: 'USD',
      quantity: '1'
    });
  }
  return refinedOrderItems;
};
/**
 * returns an object with required price mapping for Paypal.
 * @param {object} totals object from the getOrderDetails API.
 */
export const getInlinePriceDetails = totals => {
  const details = {
    subtotal: totals.discountedTotalProductPrice,
    tax: totals.totalTax,
    shipping: totals.totalShippingCharge
  };
  return details;
};
/**
 * Get store address as per paypal request contract
 * @param storeAddress
 * @returns {Object}
 */
const getStoreAddress = storeAddress => {
  const store = get(storeAddress, 'data.stores[0]', {});
  if (Object.keys(store).length > 0) {
    const {
      properties: { streetAddress, neighborhood, city, zipCode, phone, stateCode }
    } = store; // eslint-disable-line
    return {
      recipient_name: PAYPAL_STS,
      line1: streetAddress,
      line2: neighborhood,
      city,
      country_code: COUNTRY,
      postal_code: zipCode,
      phone,
      state: stateCode
    }; // eslint-disable-line
  }
  return {};
};
/**
 * Get shipping address as per paypal request contract
 * @param shippingAddress
 * @returns {{recipient_name: string, line1: string, line2: string, city: string, country_code: string, postal_code: string, phone: string, state: string}}
 */
const getShipToMeAddress = shippingAddress => {
  const recipient_name = `${checkIfStringUndefined(shippingAddress.firstName)} ${checkIfStringUndefined(shippingAddress.lastName)}`; // eslint-disable-line
  const line1 = checkIfStringUndefined(shippingAddress.address);
  const line2 = checkIfStringUndefined(shippingAddress.companyName);
  const city = checkIfStringUndefined(shippingAddress.city);
  const country_code = COUNTRY; // eslint-disable-line
  const postal_code = checkIfStringUndefined(shippingAddress.zipCode); // eslint-disable-line
  const phone = checkIfStringUndefined(shippingAddress.phoneNumber);
  const state = checkIfStringUndefined(shippingAddress.state);
  return { recipient_name, line1, line2, city, country_code, postal_code, phone, state };
};
/**
 * Get shipping address
 * @param shippingAddress
 * @param storeAddress
 * @param shipToStore
 * @returns {Object}
 */
export const getShippingAddress = (shippingAddress, storeAddress, shipToStore = false) =>
  shipToStore ? getStoreAddress(storeAddress) : getShipToMeAddress(shippingAddress);
/**
 * Construct params that need to be sent to payPal API
 * @param data
 * @param orderDetails
 * @returns {{amount: *, transactionType: string, merchantReference: string, method: string, currencyCode: *, paypalTransactionDetails: {timestamp: string, authorization: string, message: string, paypalOrderId: *, payerId: *, cardHolderName: string}, billingAddress: {firstName: *, lastName: *, address: *, zipCode: *, state: *, city: *, country: *, email: *}, editBillingAddressId: (string)}}
 */
export const getRequestObject = (data, orderDetails) => {
  const { total, currency } = data.transactions[0].amount;
  const { id } = data.transactions[0].related_resources[0].order;
  const { status, payer_info } = data.payer; // eslint-disable-line
  const { payer_id, first_name, last_name, email, shipping_address } = payer_info; // eslint-disable-line
  const { line1, city, state, postal_code, country_code } = shipping_address; // eslint-disable-line
  const requestObject = {
    amount: total,
    transactionType: `${data.intent}`,
    merchantReference: 'AcademyEcom',
    method: `${data.payer.payment_method}`,
    currencyCode: currency,
    paypalTransactionDetails: {
      timestamp: `${data.create_time}`,
      authorization: id,
      message: 'Success',
      status,
      paypalOrderId: id,
      payerId: payer_id,
      cardHolderName: `${first_name} ${last_name}` // eslint-disable-line
    },
    billingAddress: {
      firstName: first_name,
      lastName: last_name,
      address: line1,
      zipCode: postal_code,
      state,
      city,
      country: country_code,
      email
    },
    billingAddressId: orderDetails.addresses.billingAddress.id || ''
  };
  return requestObject;
};
/**
 * Checks and returns boolean value if a string is undefined
 * @param value
 * @returns {string}
 */
export const checkIfStringUndefined = value => (value !== undefined || value !== null ? value : '');
