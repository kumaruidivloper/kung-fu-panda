export const formatString = (string = '') => {
  const formatedString = string.replace(/\+/g, ' ');
  return formatedString;
};

export const openingHours = (todayHours = '', openUntilLbl) => {
  let openHours = '';
  const d = new Date();
  const days = ['Sun.', 'Mon.', 'Tues.', 'Weds.', 'Thurs.', 'Fri.', 'Sat.'];
  if (todayHours) {
    const updatedTodayHours = todayHours.replace(/\+/g, ' ');
    const today = days[d.getDay()];
    /**
     * if condition will check for future store opening hours and returns the value associated with pipe symbol
     * else if condition will check for closed stores, which doesn't have days in the string.
     */
    if (todayHours.indexOf('|') > -1) {
      return todayHours.split('|')[0];
    } else if (todayHours.indexOf(today) < 0) {
      return todayHours;
    }
    const splitedHrs = updatedTodayHours.split(' ') || '';
    const dayIdx = splitedHrs.indexOf(today) || 0;
    const todaysOpenHrsString = splitedHrs[dayIdx + 1] || '';
    openHours = todaysOpenHrsString.replace(/-/g, ' to ');
  }
  return `${openUntilLbl} ${openHours}`;
};

export const getStoreIds = (stores = [], start = 0, end = 10) => {
  const storesList = [];
  stores.slice(`${start}`, `${start + end}`).forEach((val = {}) => storesList.push(val.properties && val.properties.gx_id));
  return storesList.toString();
};

export const updateAnalytics = (
  gtmDataLayer,
  eventType,
  evtCategory,
  evtAction,
  evtLabel,
  searchResultsCount,
  storeId,
  searchKeyword,
  successfulFinder = 1,
  unsuccessfulFinder = 1,
  viewStoreDetails = 0
) => {
  gtmDataLayer.push({
    event: eventType,
    eventCategory: evtCategory,
    eventAction: evtAction,
    eventLabel: evtLabel,
    searchresultscount: searchResultsCount,
    storeid: storeId,
    storesearchkeyword: searchKeyword,
    successfulstorefinder: parseInt(successfulFinder, 10),
    unsuccessfullstorefinder: parseInt(unsuccessfulFinder, 10),
    viewstoredetails: parseInt(viewStoreDetails, 10)
  });
};
