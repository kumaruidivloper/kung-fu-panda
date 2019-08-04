import { PLACE_SOF_LIMITEDSTOCK, TOGGLE_SOF_MODAL } from './constants';

export const updateOrderItems = data => ({
    type: PLACE_SOF_LIMITEDSTOCK,
    data
});

export const toggleSOFModal = data => ({
    type: TOGGLE_SOF_MODAL,
    data
});
