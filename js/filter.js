'use strict';

(function () {
  var HOUSING_FILTER_ID = 'housing-';
  var FEATURES_FILTER_ID = 'filter-';
  var START_CHECK_STATUS = true;
  var LOW_PRICE_LEVEL = 10000;
  var HIGH_PRICE_LEVEL = 50000;

  var getLevelPrice = function (price) {
    if (price < LOW_PRICE_LEVEL) {
      return 'low';
    } else if (price > HIGH_PRICE_LEVEL) {
      return 'high';
    }
    return 'middle';
  };

  var checkHousingFilters = function (idKey, idValue, noticeValue) {
    noticeValue = String(noticeValue);
    if (idValue === 'any') {
      return true;
    } else if (idKey === 'price') {
      return idValue === getLevelPrice(Number(noticeValue));
    }
    return idValue === noticeValue;
  };

  var checkFilters = function (notice) {
    var checkStatus = START_CHECK_STATUS;
    var filtersState = window.map.filters;
    for (var key in filtersState) {
      if ({}.hasOwnProperty.call(filtersState, key)) {
        var idKey;
        if (key.includes(HOUSING_FILTER_ID)) {
          idKey = key.replace(HOUSING_FILTER_ID, '');
          checkStatus = checkHousingFilters(idKey, filtersState[key], notice.offer[idKey]);
        } else if (key.includes(FEATURES_FILTER_ID)) {
          idKey = key.replace(FEATURES_FILTER_ID, '');
          checkStatus = filtersState[key] ? notice.offer.features.includes(idKey) : true;
        }
        if (checkStatus === false) {
          break;
        }
      }
    }
    return checkStatus;
  };

  window.filter = {
    addFilterNodesListeners: function (mapPins, mapFilters, notices) {
      for (var i = 0; i < mapFilters.length; i++) {
        mapFilters[i].addEventListener('change', function (evt) {
          if (evt.target.tagName === 'SELECT') {
            window.map.filters[evt.target.id] = evt.target.value;
          } else if (evt.target.tagName === 'INPUT') {
            window.map.filters[evt.target.id] = evt.target.checked;
          }
          window.pin.removePins(mapPins);
          var filteredNotices = window.filter.getFilteredNotices(notices);
          if (filteredNotices) {
            mapPins.appendChild(window.pin.createPinsFragment(filteredNotices));
            var mapPinElements = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
            window.pin.addPinsEventListeners(mapPinElements, filteredNotices);
          }
        });
      }
    },

    getFilteredNotices: function (notices) {
      var limitNotices = window.data.limitNotices;
      var filteredNotices = notices.filter(function (notice) {
        return checkFilters(notice);
      });
      if (filteredNotices.length > limitNotices) {
        return notices.slice(0, limitNotices);
      }
      return filteredNotices;
    },

    getFiltersState: function (mapFilters) {
      var filtersState = {};
      mapFilters.forEach(function (node) {
        if (node.tagName === 'SELECT') {
          filtersState[node.id] = node.value;
        } else if (node.tagName === 'FIELDSET') {
          node.childNodes.forEach(function (child) {
            if (child.tagName === 'INPUT') {
              filtersState[child.id] = child.checked;
            }
          });
        }
      });
      return filtersState;
    }
  };

})();
