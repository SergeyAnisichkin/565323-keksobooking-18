'use strict';

(function () {
  var MIN_Y_LOCATION = 130;
  var MAX_Y_LOCATION = 630;
  var DROP_PIN_BOTTOM = 53;
  var MAP_NOTICES_LIMIT = 5;
  var OFFER_TYPES = [
    {key: 'palace', value: 'Дворец'},
    {key: 'flat', value: 'Квартира'},
    {key: 'house', value: 'Дом'},
    {key: 'bungalo', value: 'Бунгало'},
  ];

  var maxXLocation = document.querySelector('.map').clientWidth;

  window.data = {
    getOfferTypeValue: function (offerTypeKey) {
      return OFFER_TYPES.find(function (offerType) {
        return offerType.key === offerTypeKey;
      }).value;
    },
    sizeMap: {
      minX: 0,
      maxX: maxXLocation,
      minY: MIN_Y_LOCATION,
      maxY: MAX_Y_LOCATION
    },
    dropPinBottom: DROP_PIN_BOTTOM,
    noticesLimit: MAP_NOTICES_LIMIT
  };

})();
