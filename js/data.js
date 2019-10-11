'use strict';

window.data = (function () {
  var NOTICES_AMOUNT = 8;
  var OFFER_TITLE = 'Заголовок предложения_';
  var MIN_PRICE = 0;
  var MAX_PRICE = 100000;
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

  var maxXLocation = document.querySelector('.map').clientWidth;

  var createNotice = function (index) {
    var xLocation = Math.floor(Math.random() * maxXLocation);
    var yLocation = Math.floor(MIN_Y_LOCATION + Math.random() * (MAX_Y_LOCATION - MIN_Y_LOCATION));
    var checkTime = CHECK_TIMES[Math.floor(Math.random() * CHECK_TIMES.length)];

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
        checkin: checkTime,
        checkout: checkTime,
        features: OFFER_FEATURES.slice(Math.floor(Math.random() * OFFER_FEATURES.length)),
        description: OFFER_DESCRIPTION + index,
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

  return {
    getNotices: function () {
      return generateNotices(NOTICES_AMOUNT);
    },
    getOfferTypeValue: function (offerTypeKey) {
      for (var i in OFFER_TYPES) {
        if (OFFER_TYPES[i].key === offerTypeKey) {
          return OFFER_TYPES[i].value;
        }
      }
      return 'Без типа';
    }
  };

})();
