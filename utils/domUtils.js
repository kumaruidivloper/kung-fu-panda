/**
 * Method returns true if element is still visible on viewport, else returns false.
 * Useful for places where one wants to check if the  element is above or below the fold
 * @param {*} el the element on which the check is made
 */
export const isElementInViewport = el => {
  if (!el) return null;

  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */ &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
  );
};
