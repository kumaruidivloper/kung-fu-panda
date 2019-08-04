import React from 'react';
import { ECOM_CODE_STORE, MESSAGE_NOT_SOLD_ONLINE, KEY_OUT_OF_STOCK } from '../constants';

/**
 * Not sold message online message component
 * This component rendered only if emcom code 2 (store only) and out of stock online
 * @param {object} props
 */
const NotSoldOnlineMessage = ({ ecomCode, inventoryStatus, isAddToCartDisabled, className }) =>
  ecomCode === ECOM_CODE_STORE &&
  inventoryStatus === KEY_OUT_OF_STOCK &&
  isAddToCartDisabled && <div className={className}>{MESSAGE_NOT_SOLD_ONLINE}</div>;

export default NotSoldOnlineMessage;
