'use strict';

var NOTICES_AMOUNT = 8;
var OFFER_TITLE = 'Заголовок предложения';
var MIN_PRICE = 1;
var MAX_PRICE = 10000;
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_ROOMS = 1;
var MAX_ROOMS = 4;
var MIN_GUESTS = 1;
var MAX_GUESTS = 4;
var CHECK_TIMES = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'flat', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_DESCRIPTION = 'Описание предложения';
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_Y_LOCATION = 130;
var MAX_Y_LOCATION = 630;

var map = document.querySelector('.map');
map.classList.remove('map--faded');
var mapPin = document.querySelector('.map__pin');
var minXLocation = mapPin.clientWidth / 2;
var maxXLocation = map.clientWidth - mapPin.clientWidth / 2;
var mapPins = map.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var createNotice = function (index) {
  var xLocation = Math.floor(minXLocation + Math.random() * (maxXLocation - minXLocation));
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
      title: OFFER_TITLE,
      address: xLocation + ', ' + yLocation,
      price: Math.floor(MIN_PRICE + Math.random() * (MAX_PRICE - MIN_PRICE)),
      type: OFFER_TYPES[Math.floor(Math.random() * OFFER_TYPES.length)],
      rooms: Math.floor(MIN_ROOMS + Math.random() * (MAX_ROOMS - MIN_ROOMS)),
      guests: Math.floor(MIN_GUESTS + Math.random() * (MAX_GUESTS - MIN_GUESTS)),
      checkin: CHECK_TIMES[Math.floor(Math.random() * CHECK_TIMES.length)],
      checkout: CHECK_TIMES[Math.floor(Math.random() * CHECK_TIMES.length)],
      features: OFFER_FEATURES.slice(Math.floor(Math.random() * OFFER_FEATURES.length)),
      description: OFFER_DESCRIPTION,
      photos: OFFER_PHOTOS.slice(Math.floor(Math.random() * OFFER_PHOTOS.length))
    }
  };
  return notice;
};

var generateNotices = function (noticesAmount) {
  var notices = [];
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

var createFragment = function (notices) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < notices.length; i++) {
    fragment.appendChild(createPinNotice(notices[i]));
  }
  return fragment;
};

mapPins.appendChild(createFragment(generateNotices(NOTICES_AMOUNT)));
