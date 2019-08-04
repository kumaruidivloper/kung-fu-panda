import { getAlternativeImageList } from '../../utils/productDetailsUtils';

const inventoryProduct = product => product && product.availability && product.availability[0];

const checkUnitInventory = inventory => {
  if (!inventory) {
    return {};
  }
  const { online } = inventory;
  if (online && online.length > 0) {
    const { products } = online[0];
    for (const i in products) {
      if (products[i]) {
        const { availability } = products[i];
        const { inventoryStatus } = availability[0];
        if (inventoryStatus === 'OUT_OF_STOCK') {
          return inventoryProduct(products[i]);
        }
      }
    }
    return inventoryProduct(products[0]);
  }
  return {};
};

const isObjectExists = obj => Object.keys(obj) && Object.keys(obj).length > 0;

const getProductSpecifications = bundleSpecs => {
  for (const i in bundleSpecs) {
    if (bundleSpecs[i]) {
      const { bundleDetailsSpecs } = bundleSpecs[i];
      if (bundleDetailsSpecs) {
        return bundleDetailsSpecs;
      }
    }
  }
  return {};
};

const getProductItem = (api, pageInfo) => {
  if (api && isObjectExists(api)) {
    const productInfo = api['product-info'];
    const { inventory } = api;
    const { productinfo } = productInfo;
    const {
      id,
      name,
      itemId,
      varianttype,
      partNumber,
      promoMessage,
      longDescription,
      breadCrumb,
      fullImage,
      shippingMessage,
      productMessage,
      categoryLevelMessage,
      bundleSpecifications,
      productType,
      seoURL,
      productPrice,
      adBug,
      components
    } = productinfo;

    const SKUs =
      components &&
      components.map(component => {
        const componentProductDetails = component.productDetails;
        const { sKUs } = componentProductDetails;
        return sKUs[0];
      });

    if (SKUs) {
      const alternateImages = SKUs.slice().map(item => item.imageURL);

      const productItem = {
        id,
        name,
        varianttype,
        productPrice,
        swatchImgList: getAlternativeImageList([fullImage, ...alternateImages]),
        itemId,
        promoMessage,
        productSpecifications: getProductSpecifications(bundleSpecifications),
        longDescription,
        skuId: partNumber,
        SKUs,
        adBug,
        breadCrumb,
        shippingMessage,
        inventory,
        inventoryMessage: checkUnitInventory(inventory),
        productId: pageInfo && pageInfo.productId,
        productMessage,
        categoryLevelMessage,
        productType,
        seoURL,
        identifiersMap: {}
      };
      return productItem;
    }

    return productinfo;
  }

  return null;
};

export { getAlternativeImageList, getProductItem };
