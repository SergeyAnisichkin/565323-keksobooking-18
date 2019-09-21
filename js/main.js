var NOTICES_AMOUNT = 8;
var OFFER_TITLE = 'Заголовок предложения';
var MIN_PRICE = 1;
var MAX_PRICE = 10000;
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MIN_ROOMS = 1;
var MAX_ROOMS  = 4;
var MIN_GUESTS = 1;
var MAX_GUESTS = 4;
var CHECK_TIMES = ['12:00', '13:00', '14:00'];
var OFFER_FEATURES = ['wifi', 'flat', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var OFFER_DESCRIPTION = 'Описание предложения';
var OFFER_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_Y_LOCATION = 130;
var MAX_Y_LOCATION  = 630;

var map = document.querySelector(".map");
map.classList.remove("map--faded");
var mapPin = document.querySelector(".map__pin");
var minXLocation = mapPin.clientWidth / 2;
var maxXLocation = map.clientWidth - mapPin.clientWidth / 2;
var pinHeight = mapPin.clientHeight;

var notices = [];
for (var i = 0; i < NOTICES_AMOUNT; i++) {
  var xLocation  = Math.floor(minXLocation + Math.random() * (maxXLocation - minXLocation));
  var yLocation  = Math.floor(MIN_Y_LOCATION + Math.random() * (MAX_Y_LOCATION - MIN_Y_LOCATION));
  notices[i] = {
    author: {
      avatar: 'img/avatars/user0' + (i + 1) + '.png'
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
}

var mapPins = map.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

var renderNotices = function (notices) {
  var noticesElement = mapPinTemplate.cloneNode(true);
  noticesElement.style.left = Math.floor(notices.location.x - mapPin.clientWidth / 2) + 'px';
  noticesElement.style.top = Math.floor(notices.location.y - mapPin.clientHeight) + 'px';
  noticesElement.querySelector('img').src = notices.author.avatar;
  noticesElement.querySelector('img').alt = notices.offer.title;
  return noticesElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < notices.length; i++) {
  fragment.appendChild(renderNotices(notices[i]));
}
mapPins.appendChild(fragment);
