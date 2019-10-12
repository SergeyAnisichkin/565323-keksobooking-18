
'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var selectRoom = adForm.querySelector('#room_number');
  var selectCapacity = adForm.querySelector('#capacity');
  var INVALID_BORDER_STYLE = '5px solid orange';
  var selectType = adForm.querySelector('#type');
  var inputPrice = adForm.querySelector('#price');
  var timeIn = adForm.querySelector('#timein');
  var timeOut = adForm.querySelector('#timeout');

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

  var setSuccessValidity = function (element) {
    element.style.border = '';
    element.setCustomValidity('');
  };

  var setErrorValidity = function (element, message) {
    element.style.border = INVALID_BORDER_STYLE;
    element.setCustomValidity(message);
  };

  var setResultRoomValidity = function (select, message) {
    setSuccessValidity(selectRoom);
    setSuccessValidity(selectCapacity);
    if (message) {
      setErrorValidity(select, message);
    }
  };

  selectRoom.addEventListener('change', function (evt) {
    var messageValidity = checkRoomCapacity(evt.target.value, selectCapacity.value);
    setResultRoomValidity(selectRoom, messageValidity);
  });

  selectCapacity.addEventListener('change', function (evt) {
    var messageValidity = checkRoomCapacity(selectRoom.value, evt.target.value);
    setResultRoomValidity(selectCapacity, messageValidity);
  });

  var getMinPriceByType = function (typeValue) {
    if (typeValue === 'flat') {
      return '1000';
    } else if (typeValue === 'house') {
      return '5000';
    } else if (typeValue === 'palace') {
      return '10000';
    }
    return '0';
  };

  var setMinPrice = function (typeValue) {
    var minPrice = getMinPriceByType(typeValue);
    inputPrice.min = minPrice;
    inputPrice.placeholder = minPrice;
  };

  selectType.addEventListener('change', function (evt) {
    setMinPrice(evt.target.value);
  });

  var setTimeInOut = function (timeOptions, setValue) {
    for (var i = 0; i < timeOptions.length; ++i) {
      timeOptions[i].selected = false;
      if (timeOptions[i].value === setValue) {
        timeOptions[i].selected = true;
      }
    }
  };

  timeIn.addEventListener('change', function (evt) {
    setTimeInOut(timeOut.children, evt.target.value);
  });

  timeOut.addEventListener('change', function (evt) {
    setTimeInOut(timeIn.children, evt.target.value);
  });

})();
