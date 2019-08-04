import { UPDATE_SEO_BLOCK, UPDATE_FEATURED_BLOCK, INIT_STATE } from './constants';

export function updateSeoBlock(data) {
  return {
    type: UPDATE_SEO_BLOCK,
    payload: data
  };
}

export function updateFeaturedBlock(data) {
  return {
    type: UPDATE_FEATURED_BLOCK,
    payload: data
  };
}

export function initCompState(data) {
  return {
    type: INIT_STATE,
    payload: data
  };
}
