import { getBopisStoreIdFromWindowLocation } from '../../../../utils/productDetailsUtils';

/**
 * @description creates the request object to be used for ajax calls "add to cart" and "buy now".
 * @param  {Object} item - product item
 * @param  {number} selectedQuantity
 * @param  {boolean} isNoDiffBundle
 * @param  {string} selectedSwatchAmount
 * @param  {string} gcAmount
 * @param  {boolean} isSof
 * @param  {string} storeId
 * @returns {Object} requestObject to be used for ajax calls "add to cart" and "buy now".
 */
export const createAddToCartRequestObject = (item, selectedQuantity, isNoDiffBundle, selectedSwatchAmount, gcAmount, isSof, storeId, bopisOrder, shippingMethodsItems) => {
  const SKUs = isNoDiffBundle ? item.SKUs : [item];
  const skuItems = SKUs.map(skuObj => ({
    id: skuObj.skuId,
    quantity: selectedQuantity,
    type: 'REGULAR'
  }));

  const requestObj = {
    skus: skuItems,
    giftAmount: selectedSwatchAmount || `${gcAmount}`,
    inventoryCheck: true,
    isGCItem: item.isGiftCard === 'Y',
    shippingModes: [shippingMethodsItems]
  };

  if (isNoDiffBundle) {
    requestObj.bundleId = item.productId;
  }

  if (isSof) {
    requestObj.selectedStoreId = storeId;
  }

  if (isNoDiffBundle) {
    requestObj.isBundle = true;
    requestObj.isGCItem = false;
  }

  const bopisStoreId = getBopisStoreIdFromWindowLocation();
  if (bopisStoreId || bopisOrder) {
    requestObj.isPickUpInStore = true;
    requestObj.selectedStoreId = bopisStoreId || storeId;
  }

  return requestObj;
};
