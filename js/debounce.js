'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms
  var lastTimeout;
  window.debounce = {
    set: function (cb, mapPins, notices) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL, mapPins, notices);
    }
  };
})();

