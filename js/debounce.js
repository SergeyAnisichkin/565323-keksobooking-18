'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms
  var lastTimeout;
  window.debounce = {
    set: function (func, mapPins, notices) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(func, DEBOUNCE_INTERVAL, mapPins, notices);
    }
  };
})();

