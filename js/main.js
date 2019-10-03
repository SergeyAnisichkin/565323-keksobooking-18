'use strict';

var NOTICES_AMOUNT = 8;
var OFFER_TITLE = 'Заголовок предложения_';
var MIN_PRICE = 1;
var MAX_PRICE = 10000;
var OFFER_TYPES = [
  {key: 'palace', value: 'Дворец'},
  {key: 'flat', value: 'Квартира'},
  {key: 'house', value: 'Дом'},
  {key: 'bungalo', value: 'Бунгало'},
];
var MIN_ROOMS = 1;
var MAX_ROOMS = 3;
var MIN_GUESTS = 1;
var MAX_GUESTS = 3;
var CHECK_TIMES = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_DESCRIPTION = 'Описание предложения_';
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_Y_LOCATION = 130;
var MAX_Y_LOCATION = 630;
var ENTER_KEYCODE = 13;
var ESC_KEYCODE = 27;
var LENGTH_AVATAR_SRC = 22;

var map = document.querySelector('.map');
var mapPin = document.querySelector('.map__pin');
var maxXLocation = map.clientWidth;
var mapPins = map.querySelector('.map__pins');
var mapFiltersContainer = map.querySelector('.map__filters-container');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');
var notices = [];

var createNotice = function (index) {
  var xLocation = Math.floor(Math.random() * maxXLocation);
  var yLocation = Math.floor(MIN_Y_LOCATION + Math.random() * (MAX_Y_LOCATION - MIN_Y_LOCATION));
  var notice = {
    author: {
      avatar: 'img/avatars/user0' + (index + 1) + '.png'
    },
    location: {
      x: xLocation,
      y: yLocation
    },
    offer: {
      title: OFFER_TITLE + index,
      address: xLocation + ', ' + yLocation,
      price: Math.floor(MIN_PRICE + Math.random() * (MAX_PRICE - MIN_PRICE)),
      type: OFFER_TYPES[Math.floor(Math.random() * OFFER_TYPES.length)].key,
      rooms: Math.floor(MIN_ROOMS + Math.random() * (MAX_ROOMS - MIN_ROOMS)),
      guests: Math.floor(MIN_GUESTS + Math.random() * (MAX_GUESTS - MIN_GUESTS)),
      checkin: CHECK_TIMES[Math.floor(Math.random() * CHECK_TIMES.length)],
      checkout: CHECK_TIMES[Math.floor(Math.random() * CHECK_TIMES.length)],
      features: OFFER_FEATURES.slice(Math.floor(Math.random() * OFFER_FEATURES.length)),
      description: OFFER_DESCRIPTION + index,
      photos: OFFER_PHOTOS.slice(Math.floor(Math.random() * OFFER_PHOTOS.length))
    }
  };
  return notice;
};

var generateNotices = function (noticesAmount) {
  for (var i = 0; i < noticesAmount; i++) {
    notices[i] = createNotice(i);
  }
  return notices;
};

var createPinNotice = function (notice) {
  var noticeElement = mapPinTemplate.cloneNode(true);
  noticeElement.style.left = Math.floor(notice.location.x - mapPin.clientWidth / 2) + 'px';
  noticeElement.style.top = Math.floor(notice.location.y - mapPin.clientHeight) + 'px';
  noticeElement.querySelector('img').src = notice.author.avatar;
  noticeElement.querySelector('img').alt = notice.offer.title;
  return noticeElement;
};

var createPinsFragment = function (noticesArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < noticesArray.length; i++) {
    fragment.appendChild(createPinNotice(noticesArray[i]));
  }
  return fragment;
};

var getOfferTypeValue = function (offerTypeKey) {
  for (var i in OFFER_TYPES) {
    if (OFFER_TYPES[i].key === offerTypeKey) {
      return OFFER_TYPES[i].value;
    }
  }
  return 'Без типа';
};

var changeFeaturesList = function (featuresNode, featuresNotice) {
  var copyChild = featuresNode.firstElementChild;
  while (featuresNode.querySelector('.popup__feature')) {
    featuresNode.removeChild(featuresNode.querySelector('.popup__feature'));
  }
  for (var i = 0; i < featuresNotice.length; ++i) {
    copyChild.setAttribute('class', 'popup__feature popup__feature--' + featuresNotice[i]);
    featuresNode.appendChild(copyChild.cloneNode(true));
  }
  return featuresNode;
};

var addPhotosList = function (photosNode, photosNotice) {
  var copyChild = photosNode.querySelector('.popup__photo');
  photosNode.removeChild(copyChild);
  for (var i = 0; i < photosNotice.length; ++i) {
    copyChild.src = photosNotice[i];
    photosNode.appendChild(copyChild.cloneNode(true));
  }
  return photosNode;
};

var createCardNotice = function (notice) {
  var cardElement = mapCardTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = notice.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = notice.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = notice.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = getOfferTypeValue(notice.offer.type);
  var textCapacity = notice.offer.rooms + ' комнаты для ' + notice.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--capacity').textContent = textCapacity;
  var textTime = 'Заезд после ' + notice.offer.checkin + ', выезд до ' + notice.offer.checkout;
  cardElement.querySelector('.popup__text--time').textContent = textTime;
  changeFeaturesList(cardElement.querySelector('.popup__features'), notice.offer.features);
  cardElement.querySelector('.popup__description').textContent = notice.offer.description;
  addPhotosList(cardElement.querySelector('.popup__photos'), notice.offer.photos);
  cardElement.querySelector('.popup__avatar').src = notice.author.avatar;
  return cardElement;
};

var mapFilters = mapFiltersContainer.querySelectorAll('.map__filters > *');
var adForm = document.querySelector('.ad-form');
var adFormFields = document.querySelectorAll('.ad-form > *');
var adFormAddressInput = adForm.querySelector('input#address');
var mapMainPin = mapPins.querySelector('.map__pin--main');
var DROP_PIN_BOTTOM = 53;
var xLocationMainPin = parseInt(mapMainPin.style.left, 10) + Math.floor(mapMainPin.clientWidth / 2);
var yLocationMainPin = parseInt(mapMainPin.style.top, 10) + Math.floor(mapMainPin.clientHeight / 2);
var selectRoom = adForm.querySelector('#room_number');
var selectCapacity = adForm.querySelector('#capacity');
var INVALID_BORDER_STYLE = '5px solid orange';
var activePageStatus = false;
var popupClose = document.querySelector('.popup__close');

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
  mapPins.appendChild(createPinsFragment(generateNotices(NOTICES_AMOUNT)));
  activePageStatus = true;
  var mapPinElements = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');
  addPinsEventListeners(mapPinElements);
};

var checkRoomCapacity = function (room, capacity) {
  room = +room;
  capacity = +capacity;
  if (room === 1 && capacity !== 1) {
    return '1 комната только для 1 гостя';
  } else if (room === 2 && (capacity < 1 || capacity > 2)) {
    return '2 комнаты только для 1 гостя или 2 гостей';
  } else if (room === 3 && capacity === 0) {
    return '3 комнаты не могут использовать не для гостей';
  } else if (room === 100 && capacity !== 0) {
    return '100 комнат только не для гостей';
  }
  return '';
};

var setResultValidity = function (select, message) {
  selectRoom.style.border = '';
  selectRoom.setCustomValidity('');
  selectCapacity.style.border = '';
  selectCapacity.setCustomValidity('');
  select.style.border = message ? INVALID_BORDER_STYLE : '';
  select.setCustomValidity(message);
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

selectRoom.addEventListener('change', function (evt) {
  var messageValidity = checkRoomCapacity(evt.target.value, selectCapacity.value);
  setResultValidity(selectRoom, messageValidity);
});

selectCapacity.addEventListener('change', function (evt) {
  var messageValidity = checkRoomCapacity(selectRoom.value, evt.target.value);
  setResultValidity(selectCapacity, messageValidity);
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
  var avatarSrc = (target.tagName === 'IMG') ? target.src : target.children[0].src;
  var cardPopup = createCardNotice(getNoticeBySrc(avatarSrc));
  map.insertBefore(cardPopup, mapFiltersContainer);
  popupClose.addEventListener('click', function () {
    closePopup(cardPopup);
  });
  popupClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      closePopup(cardPopup);
    }
  });
  document.addEventListener('keydown', onPopupEscPress);
  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };
  var closePopup = function () {
    map.removeChild(cardPopup);
    document.removeEventListener('keydown', onPopupEscPress);
  };
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

