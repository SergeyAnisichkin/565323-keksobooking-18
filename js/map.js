'use strict';

(function () {
  var START_TYPE_VALUE = 'bungalo';

  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var mapFilters = mapFiltersContainer.querySelectorAll('.map__filters > *');
  var filtersForm = mapFiltersContainer.querySelector('.map__filters');
  var adForm = document.querySelector('.ad-form');
  var adFormFields = document.querySelectorAll('.ad-form > *');
  var adFormAddressInput = adForm.querySelector('input#address');
  var mapMainPin = mapPins.querySelector('.map__pin--main');
  var locationMainPin = window.pin.getLocationMainPin(mapMainPin);
  var mainPinStartTop = mapMainPin.style.top;
  var mainPinStartLeft = mapMainPin.style.left;

  var toggleDisabledStatus = function (elements) {
    for (var i = 0; i < elements.length; ++i) {
      elements[i].disabled = !elements[i].disabled;
    }
  };

  window.map = {
    activePageStatus: false,
    filters: window.filter.getFiltersState(mapFilters),

    setInactivePageStatus: function () {
      if (window.map.activePageStatus) {
        window.form.removePhoto();
        filtersForm.reset();
        adForm.reset();
        window.form.setMinPrice(START_TYPE_VALUE);
        window.pin.removePins(mapPins);
        window.card.close();
        mapMainPin.style.top = mainPinStartTop;
        mapMainPin.style.left = mainPinStartLeft;
        locationMainPin = window.pin.getLocationMainPin(mapMainPin);
        window.map.activePageStatus = false;
        map.classList.add('map--faded');
        adForm.classList.add('ad-form--disabled');
      }
      toggleDisabledStatus(mapFilters);
      toggleDisabledStatus(adFormFields);
      adFormAddressInput.value = locationMainPin.x + ', ' + locationMainPin.y;
    },

    setActivePageStatus: function () {
      var onPinsLoad = function (noticesArray) {
        window.pin.notices = noticesArray;
      };
      toggleDisabledStatus(mapFilters);
      toggleDisabledStatus(adFormFields);
      map.classList.remove('map--faded');
      window.backend.load(onPinsLoad, window.error.show);
      var notices = window.pin.notices;
      window.filter.addFilterNodesListeners(mapPins, mapFilters, notices);
      adForm.classList.remove('ad-form--disabled');
      adFormAddressInput.value = locationMainPin.x + ', ' + (locationMainPin.y + window.data.dropPinBottom);
      window.map.filters = window.filter.getFiltersState(mapFilters);
      var filteredNotices = window.filter.getFilteredNotices(notices);
      mapPins.appendChild(window.pin.createPinsFragment(filteredNotices));
      var mapPinElements = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
      window.pin.addPinsEventListeners(mapPinElements, notices);
      window.map.activePageStatus = true;
    }
  };

  window.map.setInactivePageStatus();
  window.pin.addMainPinListeners(mapMainPin, adFormAddressInput);

})();
