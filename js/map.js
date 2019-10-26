'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var pinsFragment = document.createDocumentFragment();
  var notices = [];
  var mapFilters = mapFiltersContainer.querySelectorAll('.map__filters > *');
  var adForm = document.querySelector('.ad-form');
  var adFormFields = document.querySelectorAll('.ad-form > *');
  var adFormAddressInput = adForm.querySelector('input#address');
  var mapMainPin = mapPins.querySelector('.map__pin--main');
  var locationMainPin = window.pin.getLocationMainPin(mapMainPin);
  var mainPinStartTop = mapMainPin.style.top;
  var mainPinStartLeft = mapMainPin.style.left;

  var toggleDisabled = function (elements) {
    for (var i = 0; i < elements.length; ++i) {
      elements[i].disabled = elements[i].disabled ? false : true;
    }
    return elements;
  };

  var toggleDisabledForms = function () {
    toggleDisabled(mapFilters);
    toggleDisabled(adFormFields);
  };

  window.map = {
    activePageStatus: false,
    setInactivePageStatus: function () {
      if (window.map.activePageStatus) {
        adForm.reset();
        map.classList.add('map--faded');
        adForm.classList.add('ad-form--disabled');
        var pinsNodeList = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
        for (var i = 0; i < pinsNodeList.length; i++) {
          mapPins.removeChild(pinsNodeList[i]);
        }
        window.card.close();
        mapMainPin.style.top = mainPinStartTop;
        mapMainPin.style.left = mainPinStartLeft;
        locationMainPin = window.pin.getLocationMainPin(mapMainPin);
        window.map.activePageStatus = false;
      }
      toggleDisabledForms();
      adFormAddressInput.value = locationMainPin.x + ', ' + locationMainPin.y;
    },
    setActivePageStatus: function () {
      toggleDisabledForms();
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      adFormAddressInput.value = locationMainPin.x + ', ' + (locationMainPin.y + window.data.dropPinBottom);
      window.backend.load(onPinsLoad, window.error.show);
      mapPins.appendChild(pinsFragment);
      var mapPinElements = map.querySelectorAll('.map__pin:not(.map__pin--main)');
      window.pin.addPinsEventListeners(mapPinElements, notices);
      window.map.activePageStatus = true;
    }
  };

  var onPinsLoad = function (noticesArray) {
    for (var i = 0; i < noticesArray.length; i++) {
      pinsFragment.appendChild(window.pin.createPin(noticesArray[i]));
    }
    notices = noticesArray;
  };

  window.backend.load(onPinsLoad, window.error.show);
  window.map.setInactivePageStatus();
  window.pin.addMainPinListeners(mapMainPin, adFormAddressInput);

})();
