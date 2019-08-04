/**
 * loadScripts is meant to load scripts dynamically and append them onto body of document.
 * @param {array || string} scripts is either an array of strings(URL) or a string(URL) of script to be loaded.
 * @param {boolean} async is a boolean flag making async loading of script true or false.
 */
import { showLoader, hideLoader } from './../apps/checkout/store/actions/globalLoader';

export default function loadScripts(scripts, async = false) {
  showLoader(); // initiates loader
  let scriptPromises = null;
  if (typeof scripts === 'string') { // if scripts is a single URL string.
    scriptPromises = loadScript(scripts, async);
    hideLoader();
    return scriptPromises;
  } else if (Array.isArray(scripts)) { // if scripts is an array.
    scriptPromises = scripts.map(script => {
      if (typeof script === 'string') { // if the instance of array is a URL string.
        hideLoader();
        return loadScript(script, async).then().catch(`error in loading script from ${script}`);
      } else if (script.src) { // if the instance is an object and holds the src key.
        hideLoader();
        return loadScriptObject(script); // load the script using loadScriptObject helper function.
      }
      hideLoader();
      return Promise.all(scriptPromises); // return the combined promise from all promises in scriptPromises array.
    });
  } else if (scripts.src) {
    scriptPromises = loadScriptObject(scripts);
    hideLoader();
    return scriptPromises;
  }
  hideLoader();
  return null;
}
/**
 * loads a single URL string - script.
 * @param {string} script the url string.
 * @param {boolean} async flag to load script asynchronously or not.
 */
function loadScript(script, async = false) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = script;
      s.async = async;
      s.onload = () => {
        resolve();
      };
      s.onerror = () => {
        reject();
      };
      document.head.appendChild(s);
    });
}
/**
 * loads a script object.s
 * @param {object} script where object consists or src, onLoad and onError.
 */
function loadScriptObject(script) {
      return loadScript(script.src, script.async || false)
      .then(() => {
        if (script.onLoad && typeof script.onLoad === 'function') {
          script.onLoad();
        }
      })
      .catch(() => {
        if (script.onError && typeof script.onError === 'function') {
          script.onError();
        }
      });
}
// /** TODO :-
//  * Utility function to check if script is loaded already or not.
//  * @param {object} script - script object, containing src.
//  * @param {bool} reloadExistingScripts - overriding control for reloading existing scripts.
//  */
// function ifScriptAlreadyExistsOnDOM(script, reloadExistingScripts = false) {
//   if (reloadExistingScripts) {
//     return false;
//   }
//   return Array.from(document.getElementsByTagName('script')).filter(scr => script.src === scr.src).length > 0;
// }
