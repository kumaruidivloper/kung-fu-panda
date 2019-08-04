/* eslint-disable */
/**
 * This code is copy pasted from 3rd party, hence the eslint-disable
 */
import trueFitEnvironment from '@academysports/aso-env';

export const initFitrec = () => {
  var a = (function() {
    var a = {};
    function g(l) {
      a[l] = function(r, e, o) {
        var w = window,
          d = document,
          p = [],
          t,
          s,
          x;
        w.tfcapi = t =
          w.tfcapi ||
          function() {
            t.q = t.q || [];
            t.q.push(arguments);
          };
        o && o.forceMobile === true && p.push('deviceType=mobile');
        o && o.autoCalculate === false && p.push('autoCalculate=false');
        x = d.getElementsByTagName('script')[0];
        s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src =
          'https://' +
          r +
          '-cdn' +
          (e === 'dev' || e === 'staging' ? '.' + e : '') +
          '.truefitcorp.com/fitrec/' +
          r +
          '/js/' +
          l +
          '.js?' +
          p.join('&');
        x.parentNode.insertBefore(s, x);
      };
    }
    g('fitrec');
    g('tracker');
    return a;
    // Don't change anything above this line
  })();

  a.fitrec('asp', trueFitEnvironment);

  return a;
};
