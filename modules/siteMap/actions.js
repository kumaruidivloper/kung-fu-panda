import { SITE_MAP_DETAILS, LOAD_SITE_MAP_DETAILS_SUCCESS, LOAD_SITE_MAP_DETAILS_ERROR } from './constants';

export const loadSiteMapDetails = data => ({ type: SITE_MAP_DETAILS, data });
export const siteMapLoaded = data => ({ type: LOAD_SITE_MAP_DETAILS_SUCCESS, data });
export const siteMapLoadingError = error => ({
  type: LOAD_SITE_MAP_DETAILS_ERROR,
  error
});
