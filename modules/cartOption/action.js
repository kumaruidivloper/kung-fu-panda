import { ON_CHECKOUT, INVENTORY_CHECK } from './constants';

export const doInventory = data => ({ type: INVENTORY_CHECK, data });
export const doCheckout = data => ({ type: ON_CHECKOUT, data });
