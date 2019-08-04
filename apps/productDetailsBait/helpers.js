import { KEY_PRICE_IN_CART } from './constants';

const buildProductListItem = (id, value, imageURL, sKUs, productAttrCombinationGroups, skuGroupId) => {
  const filtered = Object.entries(productAttrCombinationGroups).filter(group => group[1] === skuGroupId || group[1].indexOf(skuGroupId) > 0);
  if (filtered && filtered.length > 0) {
    const skuIdFiltered = filtered[0][0];
    const sKU = sKUs.filter(({ skuId }) => skuId === skuIdFiltered);
    const { skuId, price, itemId, skuResolvingAttrIdentifiers } = (sKU && sKU.length > 0 && sKU[0]) || {};
    return {
      price,
      skuId,
      color: value,
      itemId,
      skuResolvingAttrIdentifiers
    };
  }
  return null;
};

export const groupRelatedProducts = (sKUs, productAttrGroups, productAttrCombinationGroups) => {
  if (productAttrGroups) {
    const products = [];
    const { Color } = productAttrGroups[0]; // first item in the array expected to of type Color to avoid unneccessary loops

    if (Color) {
      Color.forEach(item => {
        const { id, value, imageURL, nextAvailableDiff } = item;
        const productItem = {
          itemId: id,
          color: value,
          imageURL
        };
        const list = [];
        if (nextAvailableDiff && nextAvailableDiff.length > 0) {
          const { ids } = nextAvailableDiff[0];
          ids.forEach(diff => {
            const groupId = `${diff}_${id}`;
            const listItem = buildProductListItem(id, value, imageURL, sKUs, productAttrCombinationGroups, groupId);
            if (listItem) {
              if (productAttrGroups[1] && productAttrGroups[1].Weight) {
                const { Weight } = productAttrGroups[1]; // first item in the array expected to of type Weight to avoid unneccessary loops
                const filteredWeight = Weight.filter(({ id: weightId }) => weightId === diff);
                if (filteredWeight && filteredWeight.length > 0) {
                  listItem.weight = filteredWeight[0].value;
                }
              }
              list.push(listItem);
            }
          });
        } else {
          const listItem = buildProductListItem(id, value, imageURL, sKUs, productAttrCombinationGroups, id);
          if (listItem) {
            list.push(listItem);
          }
        }
        productItem.list = list;
        products.push(productItem);
      });
    }

    return products;
  }

  return [];
};

export const checkSuppressSubTotal = sKUs => {
  const sKULength = sKUs.length;
  const filtered = sKUs.filter(sKU => sKU.price && sKU.price.priceMessage === KEY_PRICE_IN_CART);
  return filtered && filtered.length === sKULength;
};

export const getDefaultSkuItem = (products, defaultSku) => {
  if (products && products.length > 0) {
    let filtered = null;
    let selectedIndex = 0;
    products.forEach((product, index) => {
      const { list } = product;
      const filteredList = list.filter(({ skuId }) => skuId === defaultSku);
      if (filteredList && filteredList.length === 1) {
        filtered = product;
        selectedIndex = index;
      }
    });
    return { filtered, selectedIndex };
  }
  return null;
};
