import axios from 'axios';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { onCheckout, checkoutUrl, taxService } from '@academysports/aso-env';
import {
  PARAM_DEFAULT_SKU,
  PARAM_DEFAULT_PARTNUMBER,
  INVENTORY_LOOK_UP_NOT_AVAILABLE_STORE,
  KEY_INVENTORY_LOOK_UP_NOT_AVAILABLE_STORE,
  DEFINING,
  PATTERN,
  COLOR,
  CLEARANCE,
  SIZE_CHART_URL,
  SIZE,
  WAIST_SIZE,
  LENGTH_OF_PANT,
  SHOE_SIZE,
  SHOE_WIDTH,
  OUT_OF_STOCK,
  COOKIE_STORE_ID,
  STR_FREE
} from './constants';

import { THUMBNAIL_PRESET } from './dynamicMediaUtils';
import Storage from './StorageManager';
import { dollarFormatter } from './helpers';
const STORE_ZIP_CODE = 'WC_StZip_Selected';
const PUT_SUCCESS_CODE = 204;
const getInventoryMessage = (inventory = {}, skuId) => {
  const { online = [] } = inventory;

  const hasAllOnlineSkuId = online.length === 1 && online[0].skuId === 'ALL';
  if (hasAllOnlineSkuId) {
    return online[0];
  }

  const onlineMessagesBySkuId = online.filter(message => message.skuId === skuId);
  return onlineMessagesBySkuId.length > 0 ? onlineMessagesBySkuId[0] : {};
};

/**
 * Method to extract out store inventory messsage
 * @param {Object} inventory
 * @param {String} skuId
 */
const getStoreMessage = (inventory, skuId) => {
  const defaultMessage = {
    skuId,
    value: INVENTORY_LOOK_UP_NOT_AVAILABLE_STORE,
    key: KEY_INVENTORY_LOOK_UP_NOT_AVAILABLE_STORE
  };

  if (inventory) {
    const { online = [] } = inventory;

    if (online.length > 0) {
      // checking for an exception scenario where inventory is a single object with { skuId: ALL, inventoryStatus: Available }
      const hasAllOnlineSkuId = online.length === 1 && online[0].skuId === 'ALL';
      if (hasAllOnlineSkuId) {
        return online[0];
      }

      // extracting single inventory object for the input skuId
      const onlineMessagesBySkuId = online.filter(message => message.skuId === skuId);
      let formattedInventoryObj = {};

      // formatting returning object to have storeDeliveryMessage object extracted out to be used directly in PDP
      if (onlineMessagesBySkuId.length > 0) {
        const { deliveryMessage = {} } = onlineMessagesBySkuId[0];
        const { storeDeliveryMessage = {} } = deliveryMessage;

        formattedInventoryObj = {
          ...storeDeliveryMessage,
          ...onlineMessagesBySkuId[0]
        };
      } else {
        // exception scenario when sku does not exist
        formattedInventoryObj = { ...defaultMessage, storeInvType: 'LSI' };
      }
      return formattedInventoryObj;
    }
    return { ...defaultMessage, storeInvType: 'LSI' };
  }
  return { ...defaultMessage, storeInvType: 'LSI' };
};
const buildAttributeKeyValueStores = (sKUs, productAttributeGroups = []) => {
  const identifiersMap = {}; // maps the attribute type key (ex: 'COLOR' or 'SIZE') to an array of AttributeMetaObjects
  const identifiersValueMap = {}; // maps the attribute id to possible NEXT sibling attribute ids - example (selecting a COLOR may limit the SIZEs you are able to choose from )
  const alternateImageMap = {}; // maps attribute ids to array of image meta objects.
  const trueFitSizeLabelToIdentifiers = {};

  sKUs.forEach(item => {
    const { imageURL, attributes, thumbnail, alternateImages, skuResolvingAttrIdentifiers: itemSkuResolvingAttrIdentifiers, adBug } = item;

    productAttributeGroups.forEach((attributeTypeKey, attributeTypeKeyIndex) => {
      const attributeId = itemSkuResolvingAttrIdentifiers[attributeTypeKey];

      // BUILD - alternateImageMap - based on Color/Pattern identifier
      if (isImageIdentifierKey(attributeTypeKey)) {
        alternateImageMap[attributeId] = getAlternativeImageList([imageURL, ...alternateImages]);
      }

      // BUILD - identifiersValueMap
      const nextAttributeTypeKey = productAttributeGroups[attributeTypeKeyIndex + 1];
      if (nextAttributeTypeKey) {
        const nextAttributeTypeKeySelectedAttributeId = itemSkuResolvingAttrIdentifiers[nextAttributeTypeKey];
        identifiersValueMap[attributeId] = identifiersValueMap[attributeId] || [];
        if (identifiersValueMap[attributeId].indexOf(nextAttributeTypeKeySelectedAttributeId) === -1) {
          identifiersValueMap[attributeId].push(nextAttributeTypeKeySelectedAttributeId);
        }
      }

      // BUILD - identifiersMap
      identifiersMap[attributeTypeKey] = identifiersMap[attributeTypeKey] || [];
      const attrMetaObjects = identifiersMap[attributeTypeKey];
      if (!hasAttributeMetaObject(attrMetaObjects, attributeId)) {
        const attributeMetaObject = getAttributeMetaObject(attributes, attributeTypeKey, attributeId, imageURL, thumbnail, adBug);
        if (attributeMetaObject) {
          attrMetaObjects.push(attributeMetaObject);
        }
      }
    });
  });

  // BUILD - true fit keyToValues map
  sKUs.forEach(item => {
    const { skuResolvingAttrIdentifiers: itemSkuResolvingAttrIdentifiers } = item;
    let arrAttrLabelWords = [];
    const trueFitrecAttributeIds = {};
    productAttributeGroups.forEach(attributeKey => {
      if (isTrueFitIdentifierKey(attributeKey)) {
        const attrId = itemSkuResolvingAttrIdentifiers[attributeKey];
        const foundAttribute = identifiersMap[attributeKey].find(attrSelection => attrSelection.itemId === attrId);
        if (foundAttribute) {
          const label = foundAttribute.text;
          trueFitrecAttributeIds[attributeKey] = attrId;
          arrAttrLabelWords = arrAttrLabelWords.concat(label.split(' '));
        }
      }
    });
    trueFitSizeLabelToIdentifiers[arrAttrLabelWords.join(' ')] = trueFitrecAttributeIds;
  });

  return {
    identifiersMap,
    identifiersValueMap,
    alternateImageMap,
    trueFitSizeLabelToIdentifiers
  };
};

const hasAttributeMetaObject = (metaObjects, id) => metaObjects.find(metaObject => metaObject.itemId === id);

const getAttributeMetaObject = (attributes, identifierKey, identifierValue, imageURL, thumbnail, adBug) => {
  const attribute = getAttribute(attributes, identifierKey);
  if (!attribute) {
    return null;
  }
  const { value, sequence } = attribute;
  const attributeItem = {
    itemId: identifierValue,
    sellable: true,
    text: value,
    sequence,
    identifier: { key: identifierKey, value: identifierValue }
  };
  if (isImageIdentifierKey(identifierKey)) {
    attributeItem.imageURL = `${imageURL}${THUMBNAIL_PRESET}`;
    attributeItem.thumbnail = `${thumbnail}${THUMBNAIL_PRESET}`;
    attributeItem.isClearance = ofClearanceType(adBug);
  }
  return attributeItem;
};

const getAttribute = (attributes, identifierKey) => {
  const filtered = attributes.filter(attributeItem => {
    const { name, usage } = attributeItem;
    return name === identifierKey && usage === DEFINING;
  });
  return filtered[0];
};

const isImageIdentifierKey = identifierKey => identifierKey === COLOR || identifierKey === PATTERN;

const isTrueFitIdentifierKey = identifierKey => [SIZE, WAIST_SIZE, LENGTH_OF_PANT, SHOE_SIZE, SHOE_WIDTH].find(key => key === identifierKey);

const getAlternativeImageList = images =>
  images.map((image, index) => {
    const alternativeImage = {
      itemId: index,
      imageURL: image,
      thumbnail: image,
      sellable: true
    };
    return alternativeImage;
  });

const getSwatchImgList = getAlternativeImageList;

const ofClearanceType = adBug => {
  if (adBug && adBug.length > 0 && adBug.indexOf(CLEARANCE) >= 0) {
    return true;
  }
  return false;
};

const getSizeChartURL = productAttributes => {
  if (productAttributes) {
    const filtered = productAttributes.filter(item => item.key === SIZE_CHART_URL);
    if (filtered && filtered.length > 0) {
      return filtered[0].value;
    }
  }

  return null;
};

/**
 * Method to check for availablity of inventory for first attributes
 * @param {array} productAttributeGroups
 * @param {object} identifiersMap
 * @param {object} productAttrCombinationGroups
 * @param {object} inventory
 */
const getInventoryAvailableGroup = (productAttributeGroups, identifiersMap, productAttrCombinationGroups, inventory) => {
  const inventoryAvailableGroup = {};

  if (productAttributeGroups && productAttributeGroups.length > 0) {
    const firstAttributeItemKey = productAttributeGroups[0];
    const groupArray = Object.entries(productAttrCombinationGroups);
    const values = identifiersMap[firstAttributeItemKey];

    if (values) {
      values.forEach(({ itemId }) => {
        const filtered = groupArray.filter(group => group[1] === itemId || group[1].indexOf(`_${itemId}`) > 0);
        let counter = 0;
        if (filtered) {
          filtered.forEach(filteredItem => {
            const skuId = filteredItem[0];
            const inventoryMessage = getInventoryMessage(inventory, skuId);
            if (inventoryMessage) {
              const { inventoryStatus } = inventoryMessage;
              if (inventoryStatus === OUT_OF_STOCK) {
                counter += 1;
              }
            }
          });
        }
        inventoryAvailableGroup[itemId] = counter !== filtered.length;
      });
    }
  }
  return inventoryAvailableGroup;
};

/**
 * @param { array } availableSkuInventory
 * @description This method will take the availableSkuInventory list and based on inventory status it will returns the boolean.
 * @returns { boolean } availableItem
 */
const getAvailableSkuInventory = availableSkuInventory => {
  let availableItem = true;
  if (
    availableSkuInventory &&
    availableSkuInventory.length > 0 &&
    availableSkuInventory[0].inventoryStatus &&
    availableSkuInventory[0].inventoryStatus === 'OUT_OF_STOCK'
  ) {
    availableItem = false;
  }
  return availableItem;
};
/**
 * @param { object } productItem
 * @description This method will evaluate and appends selected product id as hash in the URL.
 * @returns { newProductItem } has new property selectedIdentifier
 */
const hasUrlSelectedIdentifier = productItem => {
  const newProductItem = productItem || {};
  const urlSelectedIdentifier = getSelectedIdentifierFromUrl();
  if (urlSelectedIdentifier) {
    newProductItem.selectedIdentifier = urlSelectedIdentifier;
  }
  return newProductItem;
};
/**
 * @param { array } defaultItemSKUID
 * @description This method will evaluate and appends repChildCatID hash.
 */
const addRepChildId = (defaultItemSKUID = [{ skuId: null }]) => {
  if (ExecutionEnvironment.canUseDOM && defaultItemSKUID[0].skuId) {
    window.location.hash = `repChildCatid=${defaultItemSKUID[0].skuId}`;
  }
};
/**
 * @param { defaultSkuProdInfo, defaultSkuFromPartNumber } defaultItemSKUID
 * @description This method will get the product based on URL paramater and sets it as a default selected.
 */
const getDefaultSKU = (defaultSkuProdInfo, defaultSkuFromPartNumber) =>
  getUrlHashParameter(PARAM_DEFAULT_SKU) || defaultSkuFromPartNumber || defaultSkuProdInfo;
/**
 * @param { array } inventory
 * @description This method will check the online Inventory Status.
 * @return { object } inventory
 */
const hasInventory = inventory => (inventory ? inventory.online : []);
/**
 * @param { array } onlineInventory
 * @description This method will check the online Inventory Status and retuns the firstAvailableRepCatChildId
 * @return { string } firstAvailableRepCatChildId
 */
const getFirstAvailableRepChild = onlineInventory => (onlineInventory.length > 0 && onlineInventory[0].firstAvailableRepCatChildId) || '';
/**
 * @param { object } 'product-info'
 * @description this method will take the product-info object from API and manipulates the JSON as per UI needs.
 * @returns { object } new manipulated productItem
 */
const getProductItem = (api, pageInfo) => {
  if (api && isObjectExists(api)) {
    const productInfo = api['product-info'];
    const { inventory } = api;
    const { productinfo } = productInfo;
    const {
      id,
      varianttype,
      bulkGiftcardMinQuantity,
      manufacturer,
      name,
      defaultSku: defaultSkuProdInfo,
      sKUs,
      bvRating,
      categoryId,
      categoryLevelMessage,
      isGiftCard,
      gcMinAmount,
      isSingleSkuProduct,
      bulkGiftcardSeoUrl,
      totalGcMaxAmount,
      standardGiftcardSeoUrl,
      minAmount,
      maxAmount,
      gcMaxAmount,
      gcAmounts,
      ppuEnabled,
      ppuMessage,
      promoMessage,
      productSpecifications,
      partNumber,
      longDescription,
      productAttributes,
      breadCrumb,
      shippingPrice,
      shippingMessage,
      showBIS,
      productAttributeGroups,
      productMessage,
      productType,
      seoURL,
      productAttrCombinationGroups,
      productAttrGroups,
      wgFlag,
      isBuyNowEligible,
      hotMarketMessaging
    } = productinfo;
    const defaultSkuFromPartNumber =
      getSku(sKUs, getUrlHashParameter(PARAM_DEFAULT_PARTNUMBER), 'itemId') &&
      getSku(sKUs, getUrlHashParameter(PARAM_DEFAULT_PARTNUMBER), 'itemId').skuId;
    let defaultSku = getDefaultSKU(defaultSkuProdInfo, defaultSkuFromPartNumber);
    let defaultItem = {};
    if (sKUs) {
      defaultItem = getSku(sKUs, defaultSku, 'skuId');
      if (defaultItem && defaultItem.price) defaultItem.price.ppuMsg = (productinfo.productPrice && productinfo.productPrice.ppuMsg) || '';
      const onlineInventory = hasInventory(inventory);
      // null check for non existing sku
      if (!defaultItem) {
        defaultSku = defaultSkuProdInfo;
        defaultItem = getSku(sKUs, defaultSku, 'skuId') || sKUs[0];
      }
      // defaultItem.skuResolvingAttrIdentifiers = gcAmounts;
      const firstAvailableRepCatCheck = getFirstAvailableRepChild(onlineInventory);
      let availableItem = true;
      const availableSkuInventory = onlineInventory.filter(item => item.skuId === (defaultItem && defaultItem.skuId));
      availableItem = getAvailableSkuInventory(availableSkuInventory);
      if (!availableItem) {
        const notAvailableOnlineInventory = hasInventory(inventory);
        const defaultItemSKUID = notAvailableOnlineInventory.filter(item => item.skuId === firstAvailableRepCatCheck);
        if (defaultItemSKUID && defaultItemSKUID.length > 0) {
          defaultItem = getSku(sKUs, defaultItemSKUID[0].skuId, 'skuId');
          addRepChildId();
        }
      }
      const atttributeKeyValueStores = buildAttributeKeyValueStores(sKUs, productAttributeGroups);
      const { identifiersMap } = atttributeKeyValueStores;
      const productItemPropertiesFromSku = getProductItemPropertiesFromSku(defaultItem, inventory, productAttributeGroups);
      // console.log('defaultItem', defaultItem);
      const productItem = {
        id,
        varianttype,
        bulkGiftcardMinQuantity,
        name,
        manufacturer,
        defaultSku,
        bvRating,
        categoryId,
        categoryLevelMessage,
        isGiftCard,
        gcMinAmount,
        isSingleSkuProduct,
        bulkGiftcardSeoUrl,
        standardGiftcardSeoUrl,
        gcMaxAmount,
        totalGcMaxAmount,
        minAmount,
        maxAmount,
        gcAmounts,
        ppuEnabled,
        ppuMessage,
        promoMessage,
        productSpecifications,
        partNumber,
        longDescription,
        sKUs,
        productAttributes,
        breadCrumb,
        sizeChartURL: getSizeChartURL(productAttributes),
        shippingPrice,
        shippingMessage,
        showBIS,
        originalShowBIS: showBIS,
        inventory,
        productId: pageInfo && pageInfo.productId,
        productAttributeGroups,
        productMessage,
        productType,
        seoURL,
        ...atttributeKeyValueStores,
        ...productItemPropertiesFromSku,
        productAttrCombinationGroups,
        productAttrGroups,
        wgFlag,
        isBuyNowEligible,
        inventoryAvailableGroup: getInventoryAvailableGroup(productAttributeGroups, identifiersMap, productAttrCombinationGroups, inventory),
        hotMarketMessaging
      };
      hasUrlSelectedIdentifier(productItem);
      return productItem;
    }

    return productinfo;
  }

  return null;
};

const getSku = (sKUs, id, key) => sKUs && sKUs.find(item => item[key] === id);

const isObjectExists = obj => Object.keys(obj) && Object.keys(obj).length > 0;

const getCurrentSelectedIdentifier = (productAttributeGroups, skuResolvingAttrIdentifiers) => {
  const nextSelectedIndetifiers = {};
  productAttributeGroups.forEach(key => {
    nextSelectedIndetifiers[key] = skuResolvingAttrIdentifiers[key];
  });
  return nextSelectedIndetifiers;
};

const getProductItemPropertiesFromSku = (skuObject, inventory, productAttributeGroups) => {
  const {
    imageURL,
    sellable,
    price,
    itemId,
    mfItemId,
    alternateImages,
    skuId,
    skuResolvingAttrIdentifiers,
    adBug,
    multiMediaSetName,
    productMessage: skuProductMessage
  } = skuObject;
  return {
    imageURL,
    sellable,
    price,
    swatchImgList: getSwatchImgList([imageURL, ...alternateImages]),
    itemId,
    mfItemId,
    skuId,
    skuResolvingAttrIdentifiers,
    adBug,
    inventoryMessage: getInventoryMessage(inventory, skuId),
    storeInventory: getStoreMessage(inventory, skuId),
    selectedIdentifier: getCurrentSelectedIdentifier(productAttributeGroups, skuResolvingAttrIdentifiers),
    multiMediaSetName,
    skuProductMessage
  };
};

const getNewProductItemFromSku = (productItem, skuId) => {
  const sku = getSku(productItem.sKUs, skuId);
  return {
    ...productItem,
    ...buildAttributeKeyValueStores(productItem.sKUs, productItem.productAttributeGroups),
    ...getProductItemPropertiesFromSku(sku, productItem.inventory, productItem.productAttributeGroups)
  };
};

const getSelectedIdentifierFromUrl = () => {
  if (!ExecutionEnvironment.canUseDOM) {
    return null;
  }

  const params = buildUrlHashParams();
  if (!params.attrKeys || !params.attrKeyValues) {
    return null;
  }

  const selectedIdentifier = {};
  params.attrKeys.split(',').forEach((key, idx) => {
    selectedIdentifier[key] = params.attrKeyValues.split(',')[idx];
  });
  return selectedIdentifier;
};

const getThumbnailAttributes = (imageURL, thumbnail, index, name) => ({
  imageURL: `${imageURL}`,
  thumbnail: `${thumbnail}${THUMBNAIL_PRESET}`,
  text: name ? `${name} - view number ${index + 1}` : `view number ${index + 1}`
});

/**
 * This method to extract imageList fetched from scene7 server
 * @param {array} swatchImgList
 * @param {object} imageList
 */
const getMixedMediaSwatchList = (swatchImgList, imageList, name = null) => {
  if (imageList) {
    const swatchImgAssetList = [];
    imageList.forEach((imageURL, index) => {
      swatchImgAssetList.push({
        itemId: index,
        ...getThumbnailAttributes(imageURL, imageURL, index),
        sellable: true
      });
    });
    return {
      swatchImgList: swatchImgAssetList
    };
  }

  return {
    swatchImgList:
      swatchImgList &&
      swatchImgList.map((swatch, index) => {
        const { imageURL, thumbnail, ...rest } = swatch;
        return {
          ...rest,
          ...getThumbnailAttributes(imageURL, thumbnail, index, name)
        };
      })
  };
};

export const areSelectedIdentifiersEquivalent = (selectedIdentifer1 = {}, selectedIdentifer2 = {}) => {
  const keys1 = Object.keys(selectedIdentifer1);
  const keys2 = Object.keys(selectedIdentifer2);
  if (keys1.length !== keys2.length) {
    return false;
  }

  let result = true;
  keys1.forEach(key => {
    if (selectedIdentifer1[key] !== selectedIdentifer2[key]) {
      result = false;
    }
  });
  return result;
};

/**
 * Used for generating url param attrKeys
 * @param {Object} productItem={} - the productItem as built by above getProductItem
 * @returns {array} - an array of attribute keys (keys refer to attribute type - Ex: COLOR, SIZE, etc...)
 */
const getAttributeKeysArray = (productItem = {}) => Object.keys(productItem.selectedIdentifier || {});

/**
 * Used for generating url param attrKeyValues
 * @param {Object} productItem={} - the productItem as built by above getProductItem
 * @returns {array} - an array of attribute value id's matching order of attribute keys returned by getAttributeKeysArray
 */
const getAttributeKeyValuesArray = (productItem = {}) => {
  const keys = getAttributeKeysArray(productItem);
  const { selectedIdentifier = {} } = productItem;
  return keys.map(key => selectedIdentifier[key]);
};

/**
 * @param  {array} sKUs - an array of SKU objects
 * @param  {Object} identifier - an object with attribute keys as props mapping to attribute selection id
 * @returns {string} skuId - returns the skuId matching the attribute ids passed in via identifier object
 */
const getSkuIdFromIdentifier = (sKUs, identifier) => {
  const keys = Object.keys(identifier);
  return (sKUs.find(sku => keys.every(key => identifier[key] === sku.skuResolvingAttrIdentifiers[key])) || {}).skuId;
};

/**
 * @param {Object} productItem={}
 * @returns {boolean} - true if productItem has prop skuId and skuId is not undefined, null, empty string, or N/A
 */
const hasSkuId = (productItem = {}) => {
  const { skuId } = productItem;
  return skuId !== undefined && skuId !== null && skuId.trim() !== '' && skuId.trim().toLowerCase() !== 'n/a';
};

/**
 * @param {Object} productItem={}
 * @returns {boolean} - true if productItem has prop itemId and itemId is not undefined, null, empty string, or N/A
 */
const hasItemId = (productItem = {}) => {
  const { itemId } = productItem;
  return itemId !== undefined && itemId !== null && itemId.trim() !== '' && itemId.trim().toLowerCase() !== 'n/a';
};

/**
 * @param {Object} productItem
 * @returns {string} a new pdp link based upon current selected attributes of productItem
 */
const generatePDPLink = productItem => {
  const [baseUrl] = productItem.seoURL.split('#');
  const params = buildUrlHashParams();
  if (hasItemId(productItem)) {
    params[PARAM_DEFAULT_PARTNUMBER] = productItem.itemId;
    delete params[PARAM_DEFAULT_SKU];
  } else if (hasSkuId(productItem)) {
    params[PARAM_DEFAULT_SKU] = productItem.skuId;
    delete params.attrKeys;
    delete params.attrKeyValues;
  } else {
    const newSkuId = getSkuIdFromIdentifier(productItem.sKUs, productItem.skuResolvingAttrIdentifiers);
    if (newSkuId) {
      params[PARAM_DEFAULT_SKU] = newSkuId;
    } else {
      delete params[PARAM_DEFAULT_SKU];
    }
    params.attrKeys = getAttributeKeysArray(productItem).join(',');
    params.attrKeyValues = getAttributeKeyValuesArray(productItem).join(',');
  }
  const paramKeys = Object.keys(params).filter(key => key && typeof key === 'string' && key.trim() !== '');
  const stringifiedParams = paramKeys.map(key => `${key}=${params[key]}`).join('&');
  return `${baseUrl}#${stringifiedParams}`;
};

/**
 * @param  {string} strParams - an ampersand delimted list of key value pairs
 * @returns  {Object} a simple JS object - key value store built from strParams
 */
const parseParams = strParams => {
  const cleanedParams = strParams.replace(/^(\?|#)+/, '');
  return cleanedParams.split('&').reduce((prev, keyAndValue) => {
    const [key, value] = keyAndValue.split('=');
    const result = { ...prev };
    // && found in string should be ignored
    if (key && key.trim() !== '') {
      const newValue = value === undefined ? true : decodeURI(value);
      const resultKey = decodeURI(key);
      if (!result[resultKey]) {
        result[decodeURI(key)] = newValue; // value === undefined means a key was not followed by =
      } else {
        // duplicate keys exist, return an array for this param
        result[resultKey] = result[resultKey] instanceof Array ? result[resultKey] : [result[resultKey]];
        result[resultKey].push(newValue);
      }
    }
    return result;
  }, Object.create(null));
};

/**
 * @param  {string} objParams - a simple JS object - a key value store to be converted to some query string or hash string.
 * @returns  {string} an ampersand delimted list of key value pairs which have been URI encoded
 */
const stringifyParams = objParams =>
  Object.keys(objParams)
    .reduce((result, key) => [...result, `${encodeURI(key)}${`=${encodeURI(objParams[key])}`}`], [])
    .join('&');

/**
 * @param  {string} keyAssumedCase - the key whose case you are trying to determine
 * @param  {Object} objParams - a simple JS object - a key value store like that returned by parseParams.
 * @returns {string} the key with current casing matching the passed in value
 */
const getParamKeyCorrectCase = (keyAssumedCase, objParams) => {
  const match = Object.keys(objParams).find(key => key.toLowerCase() === keyAssumedCase.toLowerCase());
  return match || keyAssumedCase;
};

/**
 * @param  {string} key
 * @param  {(string|Object)} params - either location.search | location.hash | an object keyValueStore
 */
const getParamNoCase = (key, params) => {
  const objParams = typeof params === 'string' ? parseParams(params) : params;
  const keyCorrectCase = getParamKeyCorrectCase(key, objParams);
  return objParams[keyCorrectCase];
};

/**
 * @returns {Object} - of hash url parameters
 */
const buildUrlHashParams = () => (ExecutionEnvironment.canUseDOM ? parseParams(window.location.hash) : {});

/**
 * @returns {Object} - of url query parameters
 */
// const buildUrlQueryParams = () => (ExecutionEnvironment.canUseDOM ? parseParams(window.location.search) : {});

/**
 * @param {string} key
 * @returns {string} - the value matching the passed in url hash param key
 */
const getUrlHashParameter = key => (ExecutionEnvironment.canUseDOM ? getParamNoCase(key, window.location.hash) : '');

/**
 * @description pulls bopis store id from url regardless of which page user is own (PLP or PDP)
 * @returns {string} bopisStoreId
 */
const getBopisStoreIdFromWindowLocation = () => plpGetBopisStoreIdFromWindowLocation() || pdpGetBopisStoreIdFromWindowLocation();

/**
 * @description pulls bopis store id from url on PLP
 * @returns {string} bopisStoreId
 */
const plpGetBopisStoreIdFromWindowLocation = () => {
  if (ExecutionEnvironment.canUseDOM) {
    const params = parseParams(window.location.search);
    const { facet } = params || {};

    if (facet) {
      const stringfacets = facet instanceof Array ? facet : [facet];
      const facets = stringfacets.reduce((result, f) => {
        const raw = decodeURIComponent(f).split(':');
        const [key, value] = raw;
        return { ...result, [key]: removeWrappingDoubleQuotes(value) };
      }, Object.create(null));
      return facets ? facets.bopisStoreId && facets.bopisStoreId.toString() : undefined;
    }
  }
  return undefined;
};

/**
 * @description pulls bopis store id from url on PDP
 * @returns {string} bopisStoreId
 */
const pdpGetBopisStoreIdFromWindowLocation = () => {
  if (ExecutionEnvironment.canUseDOM) {
    const params = parseParams(window.location.hash) || {};
    return params.bopisStoreId ? params.bopisStoreId.toString() : undefined;
  }
  return undefined;
};

const removeWrappingDoubleQuotes = val => {
  const value = val || '';
  return /^".*"$/.test(value) ? value.replace(/^"/, '').replace(/"$/, '') : val;
};

/**
 * Format given value to 10 based decimal
 */
const formatToDecimalNumber = value => {
  const parsedValue = parseInt(value, 10);
  return Number.isNaN(parsedValue) ? '' : parsedValue;
};

/**
 * This condition true only if Previously selected store not matches current storeId from cookie or
 * Cookie store id not exist (manually storeId deleted from cookie or directly user lands on pdp page with no previous store selection)
 * @param {object} findAStore
 * @param {object} currentFindAStore
 */
const hasStoreChanged = (findAStore = {}, currentFindAStore = {}) => {
  const { getMystoreDetails = {} } = findAStore;
  const { storeId } = getMystoreDetails;
  const { getMystoreDetails: currentMystoreDetails = {} } = currentFindAStore;
  const { storeId: currentStoreId } = currentMystoreDetails;
  const storeIdFromCookie = Storage.getCookie(COOKIE_STORE_ID);
  const formattedCurrentStoreId = formatToDecimalNumber(currentStoreId);
  const formattedCookie = formatToDecimalNumber(storeIdFromCookie);
  if ((formattedCurrentStoreId && !formattedCookie) || (formattedCookie && formattedCurrentStoreId !== formattedCookie)) {
    Storage.setCookie(COOKIE_STORE_ID, currentStoreId);
  }

  return (storeId && formatToDecimalNumber(storeId) !== formattedCurrentStoreId) || (!storeId && currentStoreId);
};

/**
 * @returns Initialize evergage component on every time when ever add to cart modal is opened -- Third party integration
 */
const initializeEvergageRecommendations = () => {
  if (ExecutionEnvironment.canUseDOM && window.Evergage) {
    window.Evergage.init();
  }
};

const initiateTaxService = orderId =>
  new Promise(resolve => {
    axios({
      method: 'GET',
      url: `${taxService(orderId)}?deliveryZipCode=&storeZipCode=${Storage.getCookie(STORE_ZIP_CODE) || ''}&orderId=${orderId}`
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        // To avoid functional impact, we are not rejecting. User need to proceed forward. Already discussed the same with Archs.
        resolve(err);
      });
  });

const initiateCheckout = (baseURL = checkoutUrl, orderId) =>
  new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: onCheckout(orderId),
      data: { orderId }
    })
      .then(res => {
        const storeZipCode = Storage.getCookie(STORE_ZIP_CODE);
        if (res.status === PUT_SUCCESS_CODE) {
          const redirectUrl = `${baseURL}?orderId=${orderId}&deliveryzip=&storeZipCode=${storeZipCode}`;
          resolve({ redirectUrl });
        } else {
          reject(res);
        }
      })
      .catch(err => {
        reject(err);
      });
  });

/**
 * Format storeId expected by inventory api
 * @param {string} storeId
 */
const formatStoreId = storeId => {
  switch (storeId.length) {
    case 1:
      return `00${storeId}`;
    case 2:
      return `0${storeId}`;
    default:
      return storeId;
  }
};

/**
 * Method to format and return shipping charges
 */
const getShippingCharges = (item = {}) => {
  const { saleShippingCharge, baseShippingCharge } = item;
  const forammtedSSCharge = formatToDecimalNumber(saleShippingCharge);
  const forammtedBSCharge = formatToDecimalNumber(baseShippingCharge);
  if (!forammtedSSCharge && !forammtedBSCharge) {
    return STR_FREE;
  }

  const saleCharge = forammtedSSCharge ? ` ${dollarFormatter(saleShippingCharge)}` : '';
  const baseCharge = baseShippingCharge ? `${valuesCheckerSymbolPrinter(saleShippingCharge)} ${dollarFormatter(baseShippingCharge)}` : '';
  return `${saleCharge}${baseCharge}`;
};

/**
 * function for checking values in OR condition whether undefined or not and returning - in the UI
 * @param {string} value1 string value either undefined or a particular string
 * @param {string} value2 string value either undefined or a particular string
 */
const valuesCheckerSymbolPrinter = (value1, value2) => (value1 || value2 ? '– ' : '');

export {
  getProductItem,
  getSku,
  getNewProductItemFromSku,
  generatePDPLink,
  hasSkuId,
  getMixedMediaSwatchList,
  getStoreMessage,
  getInventoryMessage,
  getSizeChartURL,
  buildAttributeKeyValueStores,
  getSwatchImgList,
  getAlternativeImageList,
  parseParams,
  stringifyParams,
  getParamKeyCorrectCase,
  getParamNoCase,
  getBopisStoreIdFromWindowLocation,
  hasStoreChanged,
  initializeEvergageRecommendations,
  initiateCheckout,
  formatStoreId,
  initiateTaxService,
  formatToDecimalNumber,
  getShippingCharges,
  valuesCheckerSymbolPrinter
};
