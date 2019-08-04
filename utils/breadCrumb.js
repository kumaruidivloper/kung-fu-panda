export const BREAD_CRUMB_DELIMETER = ' > ';
export const LABEL_ACADEMY = 'Academy';

/**
 * @description Accepts an array of breadCrumb objects whose labels are then joined with the delimeter
 * @param  {Array} breadCrumbs=[] array of breadCrumb objects
 * @param  {Object} options options to change method behavior
 * @param  {string} options.delimeter=' > ' the delimeter used to separate the breadCrumb list.
 * @param  {boolean} options.printEmptyValues=true if true, will not filter out empty values
 *  @param  {boolean} options.removeAcademyLabel=true if true, will remove breadcrumb with label 'Academy'
 * @returns {string} a list of breadCrumb labels separated by greater than.
 */
export const printBreadCrumb = (breadCrumbs, options) => {
  const { delimeter = BREAD_CRUMB_DELIMETER, printEmptyValues = true, removeAcademyLabel = false } = options || {};

  const newbreadCrumbs = removeAcademyLabel ? breadCrumbs.filter(item => item.label !== LABEL_ACADEMY) : breadCrumbs;
  const formattedBreadCrumbArray = formatBreadCrumbArray(newbreadCrumbs);
  const computedBreadCrumbs = formattedBreadCrumbArray.filter(crumb => printEmptyValues || (crumb && crumb.label));
  return computedBreadCrumbs.map(crumb => (crumb || {}).label).join(delimeter);
};

/**
 * @descript Accepts an array of breadCrumb objects and a name and converts them into a list separated by the passed in delimeter
 * @param  {Array} breadCrumbs array of breadCrumb objects
 * @param  {string} name the name of the product
 * @param  {Object} options options to change method behavior
 * @param  {string} options.delimeter=' > ' the delimeter used to separate the breadCrumb list.
 * @param  {boolean} options.printEmptyValues=true if true, will not filter out empty values
 * @returns {string} a list of breadCrumb labels separated by greater than followed by name.
 */
export const printBreadCrumbAndName = (breadCrumbs, name, options) => {
  const computedBreadCrumbs = [...(breadCrumbs || [])];
  computedBreadCrumbs.push({ label: name });
  return `${printBreadCrumb(computedBreadCrumbs, options)}`;
};

/**
 * @description Returns the breadCrumb label with the greatest depth.
 * @param  {Array} breadCrumbs=[] array of breadCrumb objects
 * @returns {string} the label of the breadCrumb with greatest depth.
 */
export const getCategoryFromBreadcrumb = (breadCrumbs = []) => {
  const rightMostBreadCrumb = breadCrumbs[breadCrumbs.length - 1] || {};
  return rightMostBreadCrumb.label || 'academy';
};
/**
 * Allows caller to pass in breadcrumbs of various formats.  Accepts ['some bc label', {label: 'object with bread crumb label'}];
 * @param  {Array} breadCrumbs
 * @returns {Array} breadCrumb array with consistent element formatting {lable: 'object with bread crumb label'}
 */
const formatBreadCrumbArray = breadCrumbs =>
  (breadCrumbs || []).map(el => {
    const isString = typeof el === 'string';
    return isString ? { label: el } : el;
  });
