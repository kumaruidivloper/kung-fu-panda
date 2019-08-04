import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';

/* ****** Update Data Layer ****** */
const updateAnalytics = (
  event,
  gtmDataLayer,
  type = '',
  category = '',
  action = '',
  breadCrumbList = '',
  url,
  identifier = '',
  placement = '',
  isSearch
) => {
  // TBD - due to breadcrumb data issues, breadcrumb defaulted to empty string
  event.preventDefault();
  event.stopPropagation();
  const urlCheckList = ['null', 'undefined', null, undefined, '#', ''];
  if (!isSearch) {
    let obj = {
      event: type,
      eventCategory: category.toLowerCase(),
      eventAction: action.toLowerCase(),
      eventLabel: breadCrumbList.toLowerCase()
    };
    if (identifier || placement) {
      obj = {
        ...obj,
        navIdentifier: identifier.toLowerCase(),
        navPlacement: placement.toLowerCase()
      };
    }
    gtmDataLayer.push(obj);
  } else {
    gtmDataLayer.push({
      event: type,
      eventCategory: category.toLowerCase(),
      eventAction: action.toLowerCase(),
      eventLabel: breadCrumbList.toLowerCase()
    });
  }
  if (ExecutionEnvironment.canUseDOM && urlCheckList.indexOf(url) < 0) {
    window.location = `${url}`;
  }
};

/* ****** Hack for Complexity ****** */
const complexityCheck = param => {
  const tempParam = param;
  return tempParam;
};
const hasLabel = item => {
  const { sectionLabel, menuLabel, displayName, brandName, name, title, imageDescription2 } = item;
  return complexityCheck(sectionLabel || menuLabel || displayName || brandName || name || title || imageDescription2 || '');
};
const hasURL = item => {
  const { seoURL, brandLandingLink, brandPageURL, brandURL, ctaTarget } = item;
  return complexityCheck(seoURL || brandLandingLink || brandPageURL || brandURL || ctaTarget || '');
};

/* ******** Since Header has multiple types of label and url's filtering them with a unique val ******** */
const getTitleAndSEOURL = item => {
  const obj = { label: null, seoURL: null };
  obj.label = hasLabel(item);
  obj.seoURL = hasURL(item);
  return obj;
};

/* Construct Daily Deals and Category Deals */
const constructDeals = (l0, api) => {
  const dealsList = [];
  const l0Copy = l0;
  if (api[1] && api[1].categories && api[1].categories.length > 0) {
    api[1].categories.forEach(val => {
      dealsList.push({ name: val.name, seoURL: val.seoURL, cDeals: val.subCategories });
    });
  }
  if (api[2] && api[2].productinfo && api[2].productinfo.length > 0) {
    dealsList.push({ name: l0.categoryLabel, seoURL: l0.linkURL, dDeals: api[2].productinfo });
  }
  l0Copy.dealsList = dealsList;
  return l0Copy;
};

/* Updating the L1, L2 Seo URLs and creating the L3 Items List */
const updateMenuList = (list, api) => {
  if (api && api.length > 0) {
    list.forEach(l0 => {
      if (l0.dealsCategoryID) {
        constructDeals(l0, api);
      }
      if (api[0] && api[0].categories && api[0].categories.length > 0) {
        if (l0 && l0.menuItems && l0.menuItems.length > 0) {
          l0.menuItems.forEach(l1 => {
            const l1Category = l1;
            if (l1Category && l1Category.categoryID && l1Category.categoryID !== '') {
              const filteredL1Category = compareCategoryIDS(l1Category.categoryID, api[0].categories);
              if (filteredL1Category && filteredL1Category.seoURL) {
                l1Category.seoURL = filteredL1Category.seoURL;
              }
            }
            if (l1 && l1.subMenuItems && l1.subMenuItems.length > 0) {
              l1.subMenuItems.forEach(l2 => {
                const l2Category = l2;
                if (l2Category && l2Category.categoryID && l2Category.categoryID !== '') {
                  const filteredL2Category = compareCategoryIDS(l2Category.categoryID, api[0].categories);
                  if (filteredL2Category) {
                    if (filteredL2Category.seoURL) {
                      l2Category.seoURL = filteredL2Category.seoURL;
                    }
                    if (filteredL2Category.subCategories && filteredL2Category.subCategories.length > 0) {
                      l2Category.level4Items = filteredL2Category;
                    }
                  }
                }
              });
            }
          });
        }
      }
    });
  }
  return list;
};

/* Comparing the categoryIds from given AEM Response and from category response */
const compareCategoryIDS = (catID, categories) => {
  let value;
  for (let i = 0; i < categories.length; i += 1) {
    if (categories[i].categoryId === catID) {
      value = categories[i];
      break;
    }
  }
  return value;
};

/* **** Text ellipsis ***** */
const ellipsesText = (text, maxCount = 25, ellipses = '...') => {
  if (!text) {
    return text;
  }
  if (text && text.trim().length <= maxCount) {
    return text.trim();
  }
  const cleanMaxCount = Math.max(maxCount, 3);
  return `${text.trim().substr(0, cleanMaxCount - 3)}${ellipses}`;
};

const hasVisualGuidedSuggestion = searchResults => {
  if (
    searchResults &&
    searchResults.visualCategoriesBrands &&
    searchResults.visualCategoriesBrands.productinfo &&
    searchResults.visualCategoriesBrands.productinfo.length > 0
  ) {
    return true;
  }
  return false;
};

const hasAutoSuggestions = searchResults => {
  if (searchResults && searchResults.autoSuggestions && searchResults.autoSuggestions.length > 0) {
    return true;
  }
  return false;
};

const hasCategoryAutoSuggestions = searchResults => {
  if (
    searchResults &&
    searchResults.visualCategoriesBrands &&
    searchResults.visualCategoriesBrands.categorysuggestion &&
    searchResults.visualCategoriesBrands.categorysuggestion.length > 0
  ) {
    return true;
  }
  return false;
};

const hasBrandAutoSuggestions = searchResults => {
  if (
    searchResults &&
    searchResults.visualCategoriesBrands &&
    searchResults.visualCategoriesBrands.brandsuggestion &&
    searchResults.visualCategoriesBrands.brandsuggestion.length > 0
  ) {
    return true;
  }
  return false;
};

export {
  updateAnalytics,
  complexityCheck,
  updateMenuList,
  getTitleAndSEOURL,
  ellipsesText,
  hasAutoSuggestions,
  hasCategoryAutoSuggestions,
  hasBrandAutoSuggestions,
  hasVisualGuidedSuggestion
};
