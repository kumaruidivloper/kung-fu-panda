import * as constants from './constants';

export const updateAnalytics = data => ({ type: constants.UPDATE_ANALYTICS, data });
export const updatedAnalytics = data => ({ type: constants.UPDATED_ANALYTICS, data });
