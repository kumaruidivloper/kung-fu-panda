/**
 *************************************************************
 * Static assets path.
 * The 'staticAssetsBucketPath' is used in webpack _rules.js
 *************************************************************
 */
const searchdexStorage = 'https://incl-v2.academy.com.searchdex.net';
const staticAssetsDomain = 'https://storage.googleapis.com/';
export const staticAssetsBucketPath = `${staticAssetsDomain}uat_component_registry_vol`;
export const staticVendorBucketPath = `${staticAssetsBucketPath}/vendor/`;
export const staticPublisherPath = '/shop/browse/aem-api/content/academy/includes/globalcomponentspage.fragment';
// ***********************************************************

export const inventoryApi = '/api/inventory';
export const apporigin = 'https://uat9www.academy.com';
export const footerAPI = '/mockapi';
export const headerAPI = '/mockapi-header';
export const categoriesAPI = '/api/category?categoryIds=';
export const productsAPI = '/api/productinfo?productIds=';
export const facetSearchAPI = '/api/search/';
export const SEARCHTERM_API = '/api/search/sitesearch?searchTerm=';
export const productInfoAPI = '/api/category/';
export const breadCrumbAPI = '/api/category/breadcrumb/';
export const seoCategoryAPI = '/api/variant/seo?categoryId=';
export const seoProductAPI = '/api/variant/seo?productId=';
export const sessionAPI = '/api/session ';
export const productAPI = '/api/product/';
export const wishListAPI = '/api/profile/wishlist';
export const espotAPI = '/api/promotion/espot/';
export const searchDexCat = `${searchdexStorage}/sdl-c`;
export const searchDexFooter = `${searchdexStorage}/sdf-`;
export const searchDexCanonical = `${searchdexStorage}/sdm-c`;
export const headerAutoSuggestAPI = '/api/search/autosuggest/';
export const visualGuidedCategoriesBrandsAPI = '/api/search/productSuggestions/';
export const miniCartAPI = '/api/cart/';
export const findAStoreAPI = '/api/stores';
export const makeMyStoreAPI = `${findAStoreAPI}/makeMyStore`;
// Event bus message
export const evtASOLoadComplete = 'aso:load-complete';
// Checkout variables
export const basenameCheckout = '/checkout';
// Cart variables
export const basenameCart = '/cart';
// PDP Generic variables
export const basenameProductDetailsGeneric = '/productDetailsGeneric';
// productDetailsMultiSku  variables
export const basenameProductDetailsMultiSku = '/productDetailsMultiSku';
// productDetailsBait variables
export const basenameProductDetailsBait = '/productDetailsBait';
// Public path needed for chunks to resolve specially for the SPA's
export const publicPaths = {
  cart: '/cart/assets/',
  checkout: '/checkout/assets/',
  productDetailsGeneric: '/productDetailsGeneric/assets/',
  productDetailsMultiSku: '/productDetailsMultiSku/assets/',
  productDetailsBait: '/productDetailsBait/assets/',
  productDetailsNoDifferentSelection: '/productDetailsNoDifferentSelection/assets',
  productDetailsMultiSkuPackage: '/productDetailsMultiSkuPackage/assets/'
};

export const siteMapAPI = '/api/category/sitemap';
// bazaarVoice environment variables
export const bvEnvironment = 'staging';
// trueFit environment variables
export const trueFitEnvironment = 'staging';
// Prod vs Non Prod script URLS
export const envScriptURL = {
  customerPhotos: 'https://static.curations.bazaarvoice.com/gallery/academy/stg/loader.js'
};
export const cartURL = '/api/cart/sku';
export const signOutURL = '/shop/LogonForm?rememberMe=true';
