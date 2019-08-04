/**
 * SUCCESSFUL messageData format
 * {
 *    "status":201,
 *    "results": {
 *        "correlation_id":"228.3592028641150",
 *        "status":"success",
 *        "type":"FDToken", // token type
 *        "cvv2":"M",
 *        "token":{
 *            "type":"visa", // cc type
 *            "cardholder_name":"undefined", // cc card holder name
 *            "exp_date":"1220", // cc exp date
 *            "value":"7755315279671111" // token value
 *        }
 *    },
 *    "bin":"411111" // appears to be first 6 digits of CC
 * }
 */

/**
 * FAILED messageData format
 * {
 *     "status":400,
 *     "results":{
 *         "correlation_id":"228.3593655802347",
 *         "status":"failed",
 *         "Error":{
 *             "messages":[
 *                 {
 *                     "code":"invalid_card_number",
 *                     "description":"The credit card number check failed"
 *                 }
 *             ]
 *         },
 *         "type":"FDToken"
 *     },
 *     "bin":"401288"
 * }
 */

/**
 * @description attempts to pull out the http status returned from Payment Js event.data.status
 * @param  {object} messageData - The data property returned from a PaymentJs event. (event.data)
 * @returns {number}
 */
export const getMessageDataHttpStatus = messageData => {
  const payload = messageData || {};
  return payload.status;
};

/**
 * @description attempts to pull out the status returned from Payment Js event.data.results.status
 * @param  {object} messageData - The data property returned from a PaymentJs event. (event.data)
 * @returns {string}
 */
export const getMessageDataResultsStatus = messageData => {
  const payload = messageData || {};
  const results = payload.results || {};
  return results.status;
};

/**
 * @description attempts to pull out an error message returned from Payment Js event.data.results.Error.messages[0].description
 * @param  {object} messageData - The data property returned from a PaymentJs event. (event.data)
 * @returns {string}
 */
export const getMessageDataErrorMessage = messageData => {
  const payload = messageData || {};
  const results = payload.results || {};
  const err = results.Error || {};
  const messages = err.messages || [];
  const message = messages[0] || {};
  return message.description;
};

/**
 * @description attempts to pull out the correlationId returned from Payment Js EVENT_GENERATE_TOKEN (event.data.results.correlation_id)
 * @param  {object} messageData - The data property returned from a PaymentJs event. (event.data)
 * @returns {string}
 */
export const getMessageDataCorrelationId = messageData => {
  const payload = messageData || {};
  const results = payload.results || {};
  return results.correlation_id;
};

/**
 * @description attempts to pull out the token value returned from Payment Js EVENT_GENERATE_TOKEN (event.data.results.token.value)
 * @param  {object} messageData - The data property returned from a PaymentJs event. (event.data)
 * @returns {string}
 */
export const getMessageDataTokenValue = messageData => {
  const payload = messageData || {};
  const results = payload.results || {};
  const token = results.token || {};
  return token.value;
};

/**
 * @description attempts to pull out the credit card type returned from Payment Js EVENT_GENERATE_TOKEN (event.data.results.token.type)
 * @param  {object} messageData - The data property returned from a PaymentJs event. (event.data)
 * @returns {string}
 */
export const getMessageDataCreditCardType = messageData => {
  const payload = messageData || {};
  const results = payload.results || {};
  const token = results.token || {};
  return token.type;
};
