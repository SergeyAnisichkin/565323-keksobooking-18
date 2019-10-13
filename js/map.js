'use strict';

(function () {

  var ENTER_KEYCODE = 13;

  var notices = window.data.getNotices();
  var map = document.querySelector('.map');
  var mapPins = map.querySelector('.map__pins');
  var mapFiltersContainer = map.querySelector('.map__filters-container');

  var createPinsFragment = function (noticesArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < noticesArray.length; i++) {
      fragment.appendChild(window.pin.createPin(noticesArray[i]));
    }
    return fragment;
  };

  var mapFilters = mapFiltersContainer.querySelectorAll('.map__filters > *');
  var adForm = document.querySelector('.ad-form');
  var adFormFields = document.querySelectorAll('.ad-form > *');
  var adFormAddressInput = adForm.querySelector('input#address');
  var mapMainPin = mapPins.querySelector('.map__pin--main');
  // var GAP_MAIN_PIN = 5;
  // var minPin = GAP_MAIN_PIN;
  // var maxPin = mapMainPin.clientWidth - GAP_MAIN_PIN;
  var DROP_PIN_BOTTOM = 53;
  var activePageStatus = false;

  var getLocationMainPin = function (mainPin) {
    var location = {
      x: parseInt(mainPin.style.left, 10) + Math.floor(mainPin.clientWidth / 2),
      y: parseInt(mainPin.style.top, 10) + Math.floor(mainPin.clientHeight / 2),
    };
    return location;
  };

  var locationMainPin = getLocationMainPin(mapMainPin);

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

  var setInactivePageStatus = function () {
    toggleDisabledForms();
    adFormAddressInput.value = locationMainPin.x + ', ' + locationMainPin.y;
  };

  var setActivePageStatus = function () {
    toggleDisabledForms();
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    adFormAddressInput.value = locationMainPin.x + ', ' + (locationMainPin.y + DROP_PIN_BOTTOM);
    mapPins.appendChild(createPinsFragment(notices));
    activePageStatus = true;
    var mapPinElements = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    addPinsEventListeners(mapPinElements);
  };

  mapMainPin.addEventListener('mousedown', function (evt) {
    if (!activePageStatus) {
      setActivePageStatus();
    }
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var minX = window.data.sizeMap.minX;
      var maxX = window.data.sizeMap.maxX;
      var minY = window.data.sizeMap.minY;
      var maxY = window.data.sizeMap.maxY;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mapMainPin.style.top = (mapMainPin.offsetTop - shift.y) + 'px';
      mapMainPin.style.left = (mapMainPin.offsetLeft - shift.x) + 'px';

      locationMainPin = getLocationMainPin(mapMainPin);
      var pinX = getLocationMainPin(mapMainPin).x;
      var pinY = getLocationMainPin(mapMainPin).y + DROP_PIN_BOTTOM;
      var isPinInMap = pinX > minX && pinX < maxX && pinY > minY && pinY < maxY;
      // var isCursorOutPin = moveEvt.offsetX < minPin || moveEvt.offsetY < minPin || moveEvt.offsetX > maxPin || moveEvt.offsetY > maxPin;
      if (!isPinInMap) {
        mapMainPin.style.top = (mapMainPin.offsetTop + shift.y) + 'px';
        mapMainPin.style.left = (mapMainPin.offsetLeft + shift.x) + 'px';
      }
      pinX = getLocationMainPin(mapMainPin).x;
      pinY = getLocationMainPin(mapMainPin).y + DROP_PIN_BOTTOM;
      adFormAddressInput.value = pinX + ', ' + pinY;
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  mapMainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE && !activePageStatus) {
      setActivePageStatus();
    }
  });

  var addPinsEventListeners = function (pins) {
    for (var i = 0; i < pins.length; ++i) {
      pins[i].addEventListener('click', function (evt) {
        window.card.openCard(evt.target, notices);
      });
      pins[i].addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          window.card.openCard(evt.target, notices);
        }
      });
    }
  };

  setInactivePageStatus();

})();
