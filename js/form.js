'use strict';

(function () {
  var START_TYPE_VALUE = 'bungalo';

  var adForm = document.querySelector('.ad-form');
  var selectRoom = adForm.querySelector('#room_number');
  var selectCapacity = adForm.querySelector('#capacity');
  var selectType = adForm.querySelector('#type');
  var inputPrice = adForm.querySelector('#price');
  var timeIn = adForm.querySelector('#timein');
  var timeOut = adForm.querySelector('#timeout');
  var avatarFileChooser = document.querySelector('.ad-form__field input[type=file]');
  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoFileChooser = document.querySelector('.ad-form__upload input[type=file]');
  var photoPreview = document.querySelector('.ad-form__photo');
  var formReset = adForm.querySelector('.ad-form__reset');

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

  var setResultRoomValidity = function (select, message) {
    selectRoom.setCustomValidity('');
    selectCapacity.setCustomValidity('');
    if (message) {
      select.setCustomValidity(message);
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
      timeOptions[i].selected = (timeOptions[i].value === setValue) ? true : false;
    }
  };

  timeIn.addEventListener('change', function (evt) {
    setTimeInOut(timeOut.children, evt.target.value);
  });

  timeOut.addEventListener('change', function (evt) {
    setTimeInOut(timeIn.children, evt.target.value);
  });

  var onFormLoad = function () {
    window.map.setInactivePageStatus();
    var successTemplate = document.querySelector('#success').content.querySelector('.success');
    var successPopup = successTemplate.cloneNode(true);
    var documentMain = document.querySelector('main');
    documentMain.insertAdjacentElement('afterbegin', successPopup);
    window.popup.addPopupEventListeners('.success');
  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(adForm), onFormLoad, window.error.show);
  });

  adForm.addEventListener('reset', function () {
    selectRoom.setCustomValidity('');
    selectCapacity.setCustomValidity('');
    setMinPrice(START_TYPE_VALUE);
    avatarPreview.src = 'img/muffin-grey.svg';
    while (photoPreview.querySelector('img')) {
      photoPreview.removeChild(photoPreview.querySelector('img'));
    }
  });

  formReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.map.setInactivePageStatus();
  });

  window.upload.addFileListener(avatarFileChooser, avatarPreview);
  window.upload.addFileListener(photoFileChooser, photoPreview);

})();
