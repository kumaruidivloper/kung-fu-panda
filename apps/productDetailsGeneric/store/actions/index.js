import { SAVE_PRODUCT_INFO, SAVE_PRODUCT_SUCCESS, SAVE_PRODUCT_FAILURE, UPDATE_INVENTORY, SAVE_STORE_ID } from '../types';

const saveProductItem = data => ({ type: SAVE_PRODUCT_INFO, data });
const updateProductInventory = data => ({ type: UPDATE_INVENTORY, data });
const productItemSaved = data => ({ type: SAVE_PRODUCT_SUCCESS, data });
const productItemSaveError = error => ({
  type: SAVE_PRODUCT_FAILURE,
  error
});

const saveStoreId = data => ({ type: SAVE_STORE_ID, data });

export { saveProductItem, productItemSaved, productItemSaveError, updateProductInventory, saveStoreId };
