'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  // var GAP_MAIN_PIN = 5;
  // var minPin = GAP_MAIN_PIN;
  // var maxPin = mainPin.clientWidth - GAP_MAIN_PIN;
  window.pin = {
    createPin: function (notice) {
      var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
      var mapPin = document.querySelector('.map__pin');
      var noticeElement = mapPinTemplate.cloneNode(true);
      noticeElement.style.left = Math.floor(notice.location.x - mapPin.clientWidth / 2) + 'px';
      noticeElement.style.top = Math.floor(notice.location.y - mapPin.clientHeight) + 'px';
      noticeElement.querySelector('img').src = notice.author.avatar;
      noticeElement.querySelector('img').alt = notice.offer.title;
      return noticeElement;
    },
    addPinsEventListeners: function (pins, notices) {
      for (var i = 0; i < pins.length; i++) {
        pins[i].addEventListener('click', function (evt) {
          window.card.open(evt.target, notices);
        });
        pins[i].addEventListener('keydown', function (evt) {
          if (evt.keyCode === ENTER_KEYCODE) {
            window.card.open(evt.target, notices);
          }
        });
      }
    },
    getLocationMainPin: function (mainPin) {
      var location = {
        x: parseInt(mainPin.style.left, 10) + Math.floor(mainPin.clientWidth / 2),
        y: parseInt(mainPin.style.top, 10) + Math.floor(mainPin.clientHeight / 2),
      };
      return location;
    },

    addMainPinListeners: function (mainPin, adFormAddressInput) {
      mainPin.addEventListener('mousedown', function (evt) {
        if (!window.map.activePageStatus) {
          window.map.setActivePageStatus();
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
          mainPin.style.top = (mainPin.offsetTop - shift.y) + 'px';
          mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
          var locationMainPin = window.pin.getLocationMainPin(mainPin);
          var pinX = locationMainPin.x;
          var pinY = locationMainPin.y + window.data.dropPinBottom;
          var isPinInMap = pinX > minX && pinX < maxX && pinY > minY && pinY < maxY;
          // var isCursorOutPin = moveEvt.offsetX < minPin || moveEvt.offsetY < minPin || moveEvt.offsetX > maxPin || moveEvt.offsetY > maxPin;
          if (!isPinInMap) {
            mainPin.style.top = (mainPin.offsetTop + shift.y) + 'px';
            mainPin.style.left = (mainPin.offsetLeft + shift.x) + 'px';
          }
          locationMainPin = window.pin.getLocationMainPin(mainPin);
          adFormAddressInput.value = locationMainPin.x + ', ' + (locationMainPin.y + window.data.dropPinBottom);
        };

        var onMouseUp = function (upEvt) {
          upEvt.preventDefault();
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      mainPin.addEventListener('keydown', function (evt) {
        if (evt.keyCode === ENTER_KEYCODE && !window.map.activePageStatus) {
          window.map.setActivePageStatus();
        }
      });
    },
  };
})();
