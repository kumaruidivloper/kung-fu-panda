import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';
import { has } from '../../utils/objectUtils';

/**
 * Method to parse incoming data to lower case format before updating gtm
 * Do not use fat arrow so we can allow this function's scope to be bound.
 * * @param {object} data incoming analytics data to be parsed
 */
export function dataFormatter(rawData) {
  // if no data provided, return blank object
  if (!rawData) return {};
  const formattedData = {};
  // loop through all props of the rawData
  for (const key in rawData) {
    // check if key exists in the rawData
    if (has(rawData, key)) {
      const data = rawData[key];
      const dataType = typeof data;
      if (Array.isArray(data)) {
        formattedData[key] = formattedData[key] || [];
        const mapData = data.map(item => dataFormatter(item));
        formattedData[key].push(...mapData);
      } else if (dataType === 'object' && data !== null) {
        formattedData[key] = dataFormatter(data);
      } else {
        formattedData[key] = (dataType === 'string' && (key !== 'name' && key !== 'dimension 74' && key !== 'dimension74' && rawData[key] !== 'removeFromCart')) ? data.toLowerCase() : data;
      }
    }
  }
  return formattedData;
}

/**
 * Method to trigger action for analytics
 */
export function analyticsContent(data) {
  if (ExecutionEnvironment.canUseDOM) {
    const formattedData = dataFormatter(data);
    window.dataLayer.push(formattedData);
  }
}
