'use strict';

(function () {

  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var LENGTH_AVATAR_SRC = 22;

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
  var DROP_PIN_BOTTOM = 53;
  var xLocationMainPin = parseInt(mapMainPin.style.left, 10) + Math.floor(mapMainPin.clientWidth / 2);
  var yLocationMainPin = parseInt(mapMainPin.style.top, 10) + Math.floor(mapMainPin.clientHeight / 2);
  var activePageStatus = false;

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
    adFormAddressInput.value = xLocationMainPin + ', ' + yLocationMainPin;
  };

  var setActivePageStatus = function () {
    toggleDisabledForms();
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    adFormAddressInput.value = xLocationMainPin + ', ' + (yLocationMainPin + DROP_PIN_BOTTOM);
    mapPins.appendChild(createPinsFragment(notices));
    activePageStatus = true;
    var mapPinElements = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
    addPinsEventListeners(mapPinElements);
  };

  mapMainPin.addEventListener('mousedown', function () {
    if (!activePageStatus) {
      setActivePageStatus();
    }
  });

  mapMainPin.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE && !activePageStatus) {
      setActivePageStatus();
    }
  });

  var getNoticeBySrc = function (src) {
    src = src.slice(-LENGTH_AVATAR_SRC);
    for (var i = 0; i < notices.length; ++i) {
      if (notices[i].author.avatar === src) {
        return notices[i];
      }
    }
    return notices[0];
  };

  var openCardPinPopup = function (target) {
    var cardPopup = map.querySelector('.popup');

    var onPopupEscPress = function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closePopup();
      }
    };

    if (cardPopup) {
      map.removeChild(cardPopup);
      document.removeEventListener('keydown', onPopupEscPress);
    }
    var avatarSrc = (target.tagName === 'IMG') ? target.src : target.children[0].src;
    cardPopup = window.card.createCard(getNoticeBySrc(avatarSrc));
    map.insertBefore(cardPopup, mapFiltersContainer);
    var popupClose = map.querySelector('.popup__close');

    var closePopup = function () {
      cardPopup = map.querySelector('.map__card');
      if (cardPopup) {
        map.removeChild(cardPopup);
      }
      document.removeEventListener('keydown', onPopupEscPress);
    };

    popupClose.addEventListener('click', function () {
      closePopup();
    });

    popupClose.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ENTER_KEYCODE) {
        closePopup();
      }
    });

    document.addEventListener('keydown', onPopupEscPress);
  };

  var addPinsEventListeners = function (pins) {
    for (var i = 0; i < pins.length; ++i) {
      pins[i].addEventListener('click', function (evt) {
        openCardPinPopup(evt.target);
      });
      pins[i].addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE) {
          openCardPinPopup(evt.target);
        }
      });
    }
  };

  setInactivePageStatus();

})();
