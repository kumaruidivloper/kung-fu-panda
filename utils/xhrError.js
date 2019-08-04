import { get } from '@react-nitro/error-boundary';
/**
 * @description Calls multiple sub methods trying to pull out an error message from ajax response if one exists
 * @param  {Object} response
 * @returns {undefined}
 */
export const getXhrErrorMessageFrom = (response, msgs) => getCustomErrorMessageFrom(response, msgs) || getFallBackErrorMessage(response);

/**
 * @description Tries to find an error message on the root of the ajax response.
 * @param  {Object} response
 * @returns {undefined}
 */
const getCustomErrorMessageFrom = (response, msgs) => {
  const { errors = [] } = get(response, 'data', {});
  const error = errors[0] || {};
  return (msgs && msgs[error.errorKey]) || error.errorMessage || getCustomErrorMessageFromData(response);
};

/**
 * @description Tries to find an error message in the data object of the ajax response.
 * @param  {Object} response
 * @returns {undefined}
 */
const getCustomErrorMessageFromData = response => {
  const payload = response || {};
  const data = payload.data || {};
  const errors = data.errors || [];
  const error = errors[0] || {};
  return error.errorMessage;
};

/**
 * @description Tries to find an error message based upon http error code, and returns default message if not found.
 * @param  {Object} response
 * @returns {undefined}
 */
const getFallBackErrorMessage = response => {
  const { status } = response;
  const message = httpResponseCodeMessages[status] || 'An unknown error occured.';
  return `http ${status} - ${message}`;
};

const httpResponseCodeMessages = {
  201: 'The requested resource has been created.',
  400: "Bad request. Some of the inputs provided to the request aren't valid.",
  401: "Not authenticated. The user session isn't valid.",
  403: "The user isn't authorized to perform the specified request.",
  404: "The specified resource couldn't be found.",
  500: 'Internal server error. Additional details will be contained on the server logs.',
  503: 'Service Unavailable'
};
