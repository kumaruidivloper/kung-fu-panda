import axios from 'axios';

export const updateStore = storeId => {
  axios.post(`/api/orders/00000/store/${storeId}`);
};
