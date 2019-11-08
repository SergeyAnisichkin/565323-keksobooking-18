'use strict';

(function () {
  var OFFER_TYPES = [
    {key: 'palace', value: 'Дворец'},
    {key: 'flat', value: 'Квартира'},
    {key: 'house', value: 'Дом'},
    {key: 'bungalo', value: 'Бунгало'},
  ];
  var MIN_Y_LOCATION = 130;
  var MAX_Y_LOCATION = 630;
  var DROP_PIN_BOTTOM = 53;
  var maxXLocation = document.querySelector('.map').clientWidth;
  var MAP_NOTICES_LIMIT = 10;

  window.data = {
    getOfferTypeValue: function (offerTypeKey) {
      for (var i in OFFER_TYPES) {
        if (OFFER_TYPES[i].key === offerTypeKey) {
          return OFFER_TYPES[i].value;
        }
      }
      return 'Без типа';
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
