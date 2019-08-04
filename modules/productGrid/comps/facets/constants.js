export const LABEL_CLEAR = 'Clear';
export const LABEL_APPLY = 'Apply';

export const FACETDRAWER_PRICE = 'Price';
export const FACETDRAWER_ADBUG = 'Ad Feature';

export const LABEL_PICKUP_LOCATION = 'Change Pickup Location';

// shipping and pickup friter
export const SHIPPING_PICKUP_ID = '250099999';
export const SHIPPING_PICKUP_TITLE = 'Shipping & Pickup';
export const IN_STORE_PICKUP_NAME = 'In-Store Pickup';
export const IN_STORE_PICKUP_ID = '1000199999';
export const SHIPPING_NAME = 'Shipping';
export const SHIPPING_ID = '1000110499999';
export const BOPIS_STORE_ID = 'bopisStoreId';
export const SHIPPING_FACET_PROPERTY = 'shipping:%22Y%22';
export const NO_STORES_WITHIN_250_MI = 'No Stores Within 250 mi';
export const NO_STORES_WITHIN_250_MI_ID = '3000199999';

export const NO_STORES_WITHIN_250_MI_FACET = {
  id: SHIPPING_PICKUP_ID,
  name: SHIPPING_PICKUP_TITLE,
  facetExpanded: false, // Bopis facet collapsed by default
  allowMultipleValueSelection: false,
  labels: [
    {
      property: '',
      name: NO_STORES_WITHIN_250_MI,
      id: NO_STORES_WITHIN_250_MI_ID,
      disabled: true
    },
    {
      property: SHIPPING_FACET_PROPERTY,
      name: SHIPPING_NAME,
      id: SHIPPING_ID
    }
  ]
};

export const IN_STORE_PICKUP_FACET = {
  id: SHIPPING_PICKUP_ID,
  name: SHIPPING_PICKUP_TITLE,
  facetExpanded: false, // Bopis facet collapsed by default
  allowMultipleValueSelection: false,
  labels: [
    {
      property: '',
      name: IN_STORE_PICKUP_NAME,
      id: IN_STORE_PICKUP_ID,
      showStore: true
    },
    {
      property: SHIPPING_FACET_PROPERTY,
      name: SHIPPING_NAME,
      id: SHIPPING_ID
    }
  ]
};
