import { SIZE_TYPES, COLOR, PATTERN, ACADEMY_GIFT_CARD_IDENTIFIER, NOT_APPLICABLE, GIFT_CARD_YES, STR_ALL, OUT_OF_STOCK } from './constants';
import { getStoreMessage } from '../../utils/productDetailsUtils';

const ofImageType = identifierKey => identifierKey === COLOR || identifierKey === PATTERN;

const getImageIdentifier = identifiers => identifiers[COLOR] || identifiers[PATTERN];

const isMoreThanOneExist = array => isMoreThanXExist(array, 1);

const isMoreThanXExist = (array, x) => array.length > x;

const sortBySequence = (a, b) => a.sequence - b.sequence;

const ofSizeType = key => SIZE_TYPES.indexOf(key) >= 0;

/**
 * Method to check particular derived sku is available in stock or not
 * @param {array} skuGroup
 * @param {object} productAttrCombinationGroups
 * @param {object} inventory
 */
export const checkStockStatus = (skuGroup, productAttrCombinationGroups, inventory) => {
  const reversedGroup = skuGroup.reverse().join('_');
  const groupArray = Object.entries(productAttrCombinationGroups);
  const filtered = groupArray.filter(group => group[1] === reversedGroup || group[1].indexOf(reversedGroup) > 0);
  if (filtered.length > 0) {
    const skuId = filtered[0][0];
    const inventoryMessage = getInventoryMessage(inventory, skuId);
    if (inventoryMessage) {
      const { inventoryStatus, deliveryMessage: { storeDeliveryMessage = {} } = {} } = inventoryMessage;
     const { showTick, storeInvType } = storeDeliveryMessage;
     return inventoryStatus !== OUT_OF_STOCK || (showTick === 'true' && storeInvType === 'BOPIS');
    }
  }
  return false;
};

/**
 * Method to build and prepare attrbutes to view ready
 * @param {Object} productItem
 * @param {Function} handleSwatchClick
 */
const prepareAttributesToRender = (productItem, handleSwatchClick) => {
  const {
    identifiersMap,
    productAttributeGroups,
    selectedIdentifier,
    productAttrCombinationGroups,
    inventory,
    inventoryAvailableGroup
  } = productItem;

  if (!selectedIdentifier) {
    return [];
  }

  const selectedAttributeValues = Object.values(selectedIdentifier);
  const productAttributeGroupArray = [];

  const skuGroup = [];

  productAttributeGroups.forEach(key => {
    const value = identifiersMap[key];
    const identifier = selectedIdentifier[key];

    const defaultItem = value.filter(item => item.itemId === identifier)[0];
    const swatchObj = { swatchList: value };
    if (defaultItem) {
      const prevValueIndex = selectedAttributeValues.indexOf(defaultItem.itemId);
      const prevIdentifierValue = selectedAttributeValues[prevValueIndex - 1];
      if (prevIdentifierValue) {
        skuGroup.push(prevIdentifierValue);
        const sortedValues = value.sort(sortBySequence);
        let nextItem = {};
        // const identifierMap = identifiersValueMap[prevIdentifierValue];
        const updatedValues = sortedValues.map(item => {
          const { itemId, ...rest } = item;
          const newSKUGroup = [...skuGroup, itemId];
          if (item.identifier.key === ACADEMY_GIFT_CARD_IDENTIFIER) {
            nextItem = {
              itemId,
              ...rest,
              sellable: true
            };
          } else {
            nextItem = {
              itemId,
              ...rest,
              sellable: checkStockStatus(newSKUGroup, productAttrCombinationGroups, inventory)
            };
          }
          return nextItem;
        });
        swatchObj.swatchList = updatedValues;
      } else {
        swatchObj.swatchList = value.map(item => ({
          ...item,
          sellable: inventoryAvailableGroup[item.itemId]
        }));
      }
    }

    const swatchProps = {
      tabIndex: '0',
      handleSwatchClick,
      default: defaultItem || {},
      cms: { ...swatchObj }
    };

    productAttributeGroupArray.push({
      key,
      defaultItem: defaultItem || {},
      swatchProps
    });
  });

  return productAttributeGroupArray;
};

/**
 * Method to get inventory message
 * @param {Object} inventory
 * @param {String} skuId
 */
const getInventoryMessage = (inventory, skuId) => {
  if (inventory) {
    const { online } = inventory;

    if (online && online.length === 1) {
      const { skuId: allOnlineSkuId } = online[0];
      if (allOnlineSkuId === STR_ALL) {
        return online[0];
      }
    }

    const filtered = online.filter(onlineItem => onlineItem.skuId === skuId);
    return filtered && filtered.length >= 0 && filtered[0];
  }

  return {};
};

/**
 * This method is used to extract the sku resolving identifier
 * given the productAttributeGroups and skuResolvingAttrIdentifier/selected Identifier
 * Extracted identifier used to find out the SKU
 * @param {Array} productAttributeGroups
 * @param {Object} identifiers
 */
const getSKUResolvingIdentifiers = (productAttributeGroups, identifiers) => {
  const resolvingIdentifiers = {};
  productAttributeGroups.forEach(key => {
    resolvingIdentifiers[key] = identifiers[key];
  });
  return resolvingIdentifiers;
};

/**
 * This method is used to get the SKU item using the selected attribute identifier
 * @param {Array} sKUs
 * @param {Object} skuResolvingAttrIdentifiers
 * @param {Object} selectedIdenfier
 * @param {Array} productAttributeGroups
 * @param {String} isGiftCard
 */
const getSelectedItem = (sKUs, skuResolvingAttrIdentifiers, selectedIdenfier, productAttributeGroups, isGiftCard) => {
  const transformedIdentifier = getSKUResolvingIdentifiers(productAttributeGroups, selectedIdenfier);
  let filtered = {};
  if (isGiftCard && isGiftCard === GIFT_CARD_YES) {
    const filteredSKU = sKUs.filter(item => item.skuResolvingAttrIdentifiers.Color === transformedIdentifier.Color);
    filteredSKU[0].skuResolvingAttrIdentifiers.Amount = selectedIdenfier.Amount;
    filtered = filteredSKU;
  } else {
    filtered = sKUs.filter(
      item =>
        JSON.stringify(getSKUResolvingIdentifiers(productAttributeGroups, item.skuResolvingAttrIdentifiers)) === JSON.stringify(transformedIdentifier)
    );
  }
  return filtered && filtered.length > 0 && filtered[0];
};

/**
 * Build a new productItem object from the selected attributes
 * @param {Object} productItem
 * @param {Object} nextSelectedIndetifiers
 */
const createNewProductItemFromNextSelected = (productItem, nextSelectedIndetifiers) => {
  const {
    sKUs,
    alternateImageMap,
    inventory,
    skuResolvingAttrIdentifiers,
    productAttributeGroups,
    isGiftCard,
    swatchImgList: swatchImgListFromProductItem,
    originalShowBIS
  } = productItem;
  const currentSelected = getSelectedItem(sKUs, skuResolvingAttrIdentifiers, nextSelectedIndetifiers, productAttributeGroups, isGiftCard);
  // If only one attributes of type image then swatchList from existing productItem
  const swatchImgList = alternateImageMap[getImageIdentifier(nextSelectedIndetifiers)] || swatchImgListFromProductItem;
  if (currentSelected) {
    const { skuId, adBug, multiMediaSetName, productMessage: skuProductMessage } = currentSelected;
    return {
      ...productItem,
      ...currentSelected,
      adBug,
      swatchImgList,
      inventoryMessage: getInventoryMessage(inventory, skuId),
      storeInventory: getStoreMessage(inventory, skuId),
      selectedIdentifier: nextSelectedIndetifiers,
      forceHideAdBug: false,
      showBIS: originalShowBIS, // originalShowBIS - retains showBIS returned from product API
      multiMediaSetName,
      mixedMediaMetaData: null,
      skuProductMessage
    };
  }

  return {
    ...productItem,
    swatchImgList,
    inventoryMessage: { inventoryStatus: OUT_OF_STOCK }, // Set out of stock message for Non Existent SKU
    storeInventory: { ...getStoreMessage(inventory), skuId: NOT_APPLICABLE },
    itemId: NOT_APPLICABLE,
    mfItemId: NOT_APPLICABLE,
    selectedIdentifier: nextSelectedIndetifiers,
    forceHideAdBug: true,
    showBIS: 'false', // Hide back in stock for Non Existent SKU
    multiMediaSetName: null,
    mixedMediaMetaData: null
  };
};

export {
  isMoreThanOneExist,
  isMoreThanXExist,
  ofSizeType,
  prepareAttributesToRender,
  ofImageType,
  getInventoryMessage,
  getSelectedItem,
  getImageIdentifier,
  createNewProductItemFromNextSelected
};
