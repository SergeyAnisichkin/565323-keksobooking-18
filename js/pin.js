'use strict';

(function () {
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
    }
  };
})();
