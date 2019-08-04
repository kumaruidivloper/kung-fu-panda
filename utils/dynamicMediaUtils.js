import { SCENE7_DOMAIN_URL, SCENE7_CONTENT_DATA } from '../../endpoints';

export const WIDTH = 'wid';
export const HEIGHT = 'hei';
export const THUMBNAIL_DIMENSION = '150';
export const DEFAULT_DIMENSION = '435';
export const UERY_ZOOM_DIMENSION = '1200';
export const ZOOM_MODAL_DIMENSION = '1200';
export const UERY_ZOOM_DIMENSION_MOBILE = '500';
export const ADD_TO_CART_DIMENSION = '150';
export const QUICK_VIEW_DIMENSION = '270';
export const BAIT_ADD_TO_CART_DIMENSION = '50';
export const THUMBNAIL_PRESET = `?${WIDTH}=${THUMBNAIL_DIMENSION}&${HEIGHT}=${THUMBNAIL_DIMENSION}`;
export const DEFAULT_PRESET = `?${WIDTH}=${DEFAULT_DIMENSION}&${HEIGHT}=${DEFAULT_DIMENSION}`;
export const UERY_ZOOM_PRESET = `?${WIDTH}=${UERY_ZOOM_DIMENSION}&${HEIGHT}=${UERY_ZOOM_DIMENSION}`;
export const ZOOM_MODAL_PRESET = `?${WIDTH}=${ZOOM_MODAL_DIMENSION}`;
export const UERY_ZOOM_PRESET_MOBILE = `?${WIDTH}=${UERY_ZOOM_DIMENSION_MOBILE}&${HEIGHT}=${UERY_ZOOM_DIMENSION_MOBILE}`;
export const ADD_TO_CART_PRESET = `?${WIDTH}=${ADD_TO_CART_DIMENSION}&${HEIGHT}=${ADD_TO_CART_DIMENSION}`;
export const QUICK_VIEW_PRESET = `?${WIDTH}=${QUICK_VIEW_DIMENSION}&${HEIGHT}=${QUICK_VIEW_DIMENSION}`;
export const BAIT_ADD_TO_CART_PRESET = `?${WIDTH}=${BAIT_ADD_TO_CART_DIMENSION}&${HEIGHT}=${BAIT_ADD_TO_CART_DIMENSION}`;

/**
 * This method to extract mixed media assets from mixedMediaMetaData fetched from scene7 server
 * if mixedMediaMetaData not null then this will be used for images/video or images from api
 * @param {array} swatchImgList
 * @param {object} mixedMediaMetaData
 */
export const getMixedMediaAssets = mixedMediaMetaData => {
  if (mixedMediaMetaData) {
    const {
      set: { item }
    } = mixedMediaMetaData;
    const imageList = [];
    let videoAssetName = null;
    let tempArray = [];
    if (Array.isArray(item)) {
      tempArray = [...item];
    } else if (typeof item === 'object') {
      tempArray = [item];
    }
    tempArray.forEach(row => {
      const { s, i, type } = row;
      let image = '';
      if (s) {
        image = s.n;
      } else if (i) {
        image = i.n;
      }
      const imageURL = `${SCENE7_DOMAIN_URL}${SCENE7_CONTENT_DATA}${image}`;
      if (type && type === 'video') {
        videoAssetName = s.n;
      } else {
        imageList.push(imageURL);
      }
    });
    return {
      imageList,
      videoAssetName
    };
  }

  return {};
};
