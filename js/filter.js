'use strict';

(function () {
  var HOUSING_FILTER_PREFIX = 'housing-';
  var FEATURES_FILTER_PREFIX = 'filter-';
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
        if (key.includes(HOUSING_FILTER_PREFIX)) {
          idKey = key.replace(HOUSING_FILTER_PREFIX, '');
          checkStatus = checkHousingFilters(idKey, filtersState[key], notice.offer[idKey]);
        } else if (key.includes(FEATURES_FILTER_PREFIX)) {
          idKey = key.replace(FEATURES_FILTER_PREFIX, '');
          checkStatus = filtersState[key] ? notice.offer.features.includes(idKey) : true;
        }
        if (!checkStatus) {
          break;
        }
      }
    }
    return checkStatus;
  };

  var renderFilteredNotices = function (mapPins, notices) {
    var filteredNotices = window.filter.getFilteredNotices(notices);
    window.pin.removePins(mapPins);
    if (filteredNotices) {
      mapPins.appendChild(window.pin.createPinsFragment(filteredNotices));
      var mapPinElements = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
      window.pin.addPinsEventListeners(mapPinElements, filteredNotices);
    }
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
          window.card.close();
          window.debounce.set(renderFilteredNotices, mapPins, notices);
        });
      }
    },

    getFilteredNotices: function (notices) {
      var noticesLimit = window.data.noticesLimit;
      var filteredNotices = notices.filter(function (notice) {
        return checkFilters(notice);
      });
      if (filteredNotices.length > noticesLimit) {
        return filteredNotices.slice(0, noticesLimit);
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
