import { ShippingText } from './constants';

export const getSpecification = (specs, type) => {
  if (specs && specs.length > 0) {
    const spec = specs.filter(s => Object.keys(s)[0] === type);
    if (spec && spec.length) {
      return spec[0][type];
    }
    return null;
  }
  return null;
};

export const getInitialState = data => {
  const shippingMessage = getSpecification(data.productinfo.bundleSpecifications, 'bundleShippingMessage');
  const state = {
    products: [],
    selectedSkus: {},
    shippingMessage: shippingMessage && shippingMessage.value ? shippingMessage.value : ShippingText
  };

  data.productinfo.components.map(comp => {
    state.products.push(comp.productDetails.uniqueID);
    state.selectedSkus[comp.productDetails.uniqueID] = null;
    return null;
  });

  if (state.products.length > 0) {
    state.expanded = state.products[0]; // eslint-disable-line
  }

  return state;
};

export const hasNoStock = inventory => {
  if (inventory && inventory.online && inventory.online.length > 0 && inventory.online[0].products && inventory.online[0].products.length > 0) {
    return !inventory.online[0].products.every(
      ({ availability }) => !availability.every(({ inventoryStatus }) => inventoryStatus === 'OUT_OF_STOCK')
    );
  }
  return false;
};
