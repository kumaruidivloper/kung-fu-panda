import { SOURCE_REALTIME } from './constants';

export const formatedString = string => {
  let formatedstring = string.replace(/\s+/g, '-');
  formatedstring = formatedstring.toLowerCase();
  return formatedstring;
};

export const openingHours = todayHours => {
  let openHours = '';
  const d = new Date();
  const days = ['Sun.', 'Mon.', 'Tues.', 'Weds.', 'Thurs.', 'Fri.', 'Sat.'];
  if (todayHours) {
    const updatedTodayHours = todayHours.replace(/\+/g, ' ');
    const today = days[d.getDay()];
    const splitedHrs = updatedTodayHours.split(' ');
    const dayIdx = splitedHrs.indexOf(today);
    const todaysOpenHrsString = splitedHrs[dayIdx + 1];
    const splittedTime = todaysOpenHrsString.split('-');
    openHours = splittedTime[1]; // eslint-disable-line
  }
  return openHours;
};

export const getOpeningHoursObject = hours => {
  const openHours = {};
  if (hours) {
    const splitedHrs = hours.split(' ');
    const dayDuration = [];
    splitedHrs.map((data, i) => {
      let key;
      if (i % 2 === 0) {
        key = data;
      }
      const value = timeFormat(splitedHrs[i + 1]) || splitedHrs[i + 1];
      if (key) {
        const b = { [key]: value };
        dayDuration.push(b);
      }
      return '';
    });
    if (dayDuration.length) {
      dayDuration.map(days => {
        const dayName = Object.keys(days)[0];
        const time = days[dayName];
        if (openHours[time]) {
          openHours[time].push(dayName);
        } else {
          openHours[time] = [dayName];
        }
        return '';
      });
    }
  }
  return openHours;
};
/**
 * {String} time
 * Funtion for formatiing time to display in drawer of store modal
 */
export const timeFormat = time => {
  let formattedTime;
  if (time) {
    const startTime = time.split('-');
    if (Array.isArray(startTime) && startTime.length > 1) {
      formattedTime = startTime.map(data => {
        let formattedVal = '';
        const timePattern = data.match(/\d{1,2}:\d{1}\d{1}/);
        if (!timePattern) {
          const checkforDecimal = data.match(/^\d{1,2}\./);
          if (checkforDecimal) {
            formattedVal = data.replace(/\./, ':');
          } else {
            const digit = data.replace(/[^\d.]/g, '').length > 1 ? data.substring(0, 2) : data.substring(0, 1);
            const meridian = data.replace(/[^\d.]/g, '').length > 1 ? data.substring(2) : data.substring(1);
            formattedVal = `${digit}:00${meridian}`;
          }
        } else {
          formattedVal = data;
        }

        return addSpace(formattedVal);
      });
    }
  }
  if (Array.isArray(formattedTime)) {
    formattedTime = formattedTime.join(' - ');
  }
  return formattedTime;
};
/**
 * {String} time
 * Funtion For prefixing space before am/pm
 */
export const addSpace = data => {
  let spaceString;
  if (data) {
    spaceString = data.toLowerCase();
    if (spaceString.lastIndexOf(' ') === -1) {
      const meridianIndex = spaceString.indexOf('am') === -1 ? spaceString.indexOf('pm') : spaceString.indexOf('am');
      spaceString = `${spaceString.substring(0, meridianIndex)}  ${spaceString.substring(meridianIndex)}`;
    }
  }
  return spaceString;
};
export const inventoryData = (data, source) => {
  const result = {};
  const allItems = [];
  const skus = [];
  if (data && data.orderItem) {
    data.orderItem.forEach(order => {
      const { quantity, skuId, productId } = order;
      // const { skuInfo } = skuDetails;
      // const { imageAltDescription, thumbnail } = skuInfo;
      const skuWithQuant = `${source !== SOURCE_REALTIME ? productId : skuId}:${quantity}`;
      const skuIdToPass = source !== SOURCE_REALTIME ? productId : skuId;
      skus.push(skuWithQuant);
      allItems.push({ quantity, skuId: skuIdToPass });
    });
    result.allItems = allItems;
    result.skus = skus;
  }
  return result;
};

export const getStockAvailabilityStatus = (cartItems = [], storeInventory) => {
  const stockStatus = {
    avl: [],
    unAvl: []
  };

  if (!cartItems.length) {
    return stockStatus;
  }

  if (!storeInventory.skus || !storeInventory.skus.length) {
    stockStatus.unAvl = cartItems;
    return stockStatus;
  }

  cartItems.forEach(cartItem => {
    storeInventory.skus.some((inv, idx) => {
      if ((inv.skuId === cartItem.skuId || inv.skuId === cartItem.skuItemId) && inv.availableQuantity >= cartItem.quantity) {
        stockStatus.avl.push(cartItem);
        return true;
      } else if (idx === storeInventory.skus.length - 1) {
        stockStatus.unAvl.push(cartItem);
      }
      return false;
    });
  });
  return stockStatus;
};

export const findFavStoreInventory = (storeDetails, storeId) => {
  let storeFound = {
    inventory: {}
  };
  storeDetails.forEach(store => {
    if (store.properties && store.properties.gx_id && store.properties.gx_id === storeId) {
      storeFound = Object.assign({}, storeFound, { inventory: store.inventory });
    }
  });
  return storeFound;
};

export const checkNullObject = obj => Object.keys(obj).length === 0 && obj.constructor === Object;

export const myStoreIsEmpty = obj => obj && obj.neighborhood;

export const appendStoreName = (data, updateStoreName) => {
  let updatedStoreName = data;
  if (updatedStoreName) {
    const storeFixedNumber = 4;
    let wholetoFill = storeFixedNumber - updatedStoreName.length;
    while (wholetoFill > 0) {
      updatedStoreName = '0'.concat(updatedStoreName);
      wholetoFill -= 1;
    }
    if (updateStoreName) {
      updatedStoreName = 'store-'.concat(updatedStoreName);
    }
  }
  return updatedStoreName;
};

/**
 * Helper to get required store details
 * @param {object} properties
 * @param {*} label
 */
export const getRequiredStoreDetails = (
  {
    weekHours,
    todayTiming,
    todayHours,
    streetAddress,
    neighborhood,
    phone,
    state,
    zipCode,
    city,
    gx_id: gxID,
    storeName,
    bopisEligible,
    isFavStore,
    distance,
    userId = undefined
  },
  label
) => ({
  weekHours,
  todayTiming,
  todayHours,
  streetAddress,
  neighborhood,
  phone,
  state,
  zipCode,
  city,
  gx_id: gxID,
  storeId: gxID,
  storeName,
  bopisEligible,
  isFav: isFavStore,
  distance,
  userId,
  openhours: label ? `${label} ${openingHours(todayHours)}` : `${openingHours(todayHours)}`
});

export const extractRegUserResponse = (storeDetails, manualSearch, label) => {
  let selectedStore = {};
  if (storeDetails.stores && storeDetails.stores.length) {
    const { geometry, properties } = storeDetails.stores[0];
    const firstStore = getRequiredStoreDetails(properties, label);
    if (firstStore && geometry) {
      selectedStore = {
        geometry,
        manualSearch: manualSearch || false,
        ...firstStore
      };
    }
  }
  return selectedStore;
};
/**
 * @param {Object} storeDetails
 * For getting favorite store details to be added in cookie
 */
export const extractMyStoreResponse = (storeDetails, label) => {
  let SelectedStores = {};
  if (!checkNullObject(storeDetails.properties)) {
    const { geometry, properties } = storeDetails;
    const firstStore = getRequiredStoreDetails(properties, label);
    if (firstStore && geometry) {
      SelectedStores = {
        geometry,
        weekHours: storeDetails.weekHours,
        todayTiming: properties.todayTiming,
        ...firstStore
      };
    }
  }
  return SelectedStores;
};

/**
 * @param {Object} data
 * For Building Query params
 */
export const buildStoreApiQuery = data => {
  const { lat, lang, radius, storeId, skus, isBopisEligible, source, storeEligibility } = data;
  let queryFilter = '';
  const eligbility = !!storeEligibility;
  queryFilter =
    lat && lang ? `?lat=${lat}&lon=${lang}&rad=${radius}&bopisEnabledFlag=${eligbility}` : `?rad=${radius}&bopisEnabledFlag=${eligbility}`;
  if (storeId) {
    queryFilter = `${queryFilter}&storeDetailsID=${storeId}`;
  }
  if (isBopisEligible) {
    queryFilter = `${queryFilter}&isBopisEligible=${isBopisEligible}`;
  }
  if (skus) {
    queryFilter = `${queryFilter}&skus=${skus}`;
  }
  if (source) {
    queryFilter = `${queryFilter}&source=${source}`;
  }
  return queryFilter;
};

/**
 * @param {*} storeId
 * Changing drawer status closed/open
 */
export const checkCallStoreAPI = (myStore, storeId) => {
  let shouldCall = false;
  if (myStore && storeId) {
    try {
      const cookieData = JSON.parse(myStore);
      const zeroPrefixedMyStoreId = appendStoreName(cookieData.gx_id, false);
      const zeroPrefixedStoreId = appendStoreName(storeId, false);
      if (zeroPrefixedStoreId !== zeroPrefixedMyStoreId) {
        shouldCall = true;
      } else {
        shouldCall = false;
      }
    } catch (e) {
      shouldCall = false;
    }
  } else if (myStore) {
    shouldCall = false;
  } else {
    shouldCall = true;
  }
  return shouldCall;
};
