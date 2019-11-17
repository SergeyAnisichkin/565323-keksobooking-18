'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var FEATURES_FLAG_CLASS_INDEX = 1;

  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var changeFeaturesList = function (featuresNode, noticeFeatures) {
    var fragment = document.createDocumentFragment();
    noticeFeatures.forEach(function (item) {
      var copyChild = featuresNode.firstElementChild.cloneNode(true);
      copyChild.classList.remove(copyChild.classList[FEATURES_FLAG_CLASS_INDEX]);
      copyChild.classList.add('popup__feature--' + item);
      fragment.appendChild(copyChild);
    });
    while (featuresNode.firstElementChild) {
      featuresNode.removeChild(featuresNode.firstElementChild);
    }
    return featuresNode.appendChild(fragment);
  };

  var addPhotosList = function (photosNode, noticePhotos) {
    var copyChild = photosNode.querySelector('.popup__photo');
    photosNode.removeChild(copyChild);
    noticePhotos.forEach(function (photoPath) {
      copyChild.src = photoPath;
      photosNode.appendChild(copyChild.cloneNode(true));
    });
    return photosNode;
  };

  var getNoticeByAlt = function (alt, notices) {
    return notices.find(function (notice) {
      return notice.offer.title === alt;
    });
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.card.close();
    }
  };

  var getCardText = function (notice) {
    var textCapacity = notice.offer.rooms + ' комнаты для ' + notice.offer.guests + ' гостей';
    var textTime = 'Заезд после ' + notice.offer.checkin + ', выезд до ' + notice.offer.checkout;
    return {
      '.popup__title': notice.offer.title,
      '.popup__text--address': notice.offer.address,
      '.popup__text--price': notice.offer.price ? notice.offer.price + '₽/ночь' : null,
      '.popup__type': notice.offer.type ? window.data.getOfferTypeValue(notice.offer.type) : null,
      '.popup__text--capacity': notice.offer.rooms && notice.offer.guests ? textCapacity : null,
      '.popup__text--time': notice.offer.checkin && notice.offer.checkout ? textTime : null,
      '.popup__description': notice.offer.description
    };
  };

  window.card = {
    create: function (notice) {
      var cardElement = mapCardTemplate.cloneNode(true);
      if (!notice.offer) {
        return null;
      }
      var cardText = getCardText(notice);
      for (var key in cardText) {
        if (cardText.hasOwnProperty(key) && cardText[key]) {
          cardElement.querySelector(key).textContent = cardText[key];
        } else {
          cardElement.removeChild(cardElement.querySelector(key));
        }
      }
      changeFeaturesList(cardElement.querySelector('.popup__features'), notice.offer.features);
      addPhotosList(cardElement.querySelector('.popup__photos'), notice.offer.photos);
      cardElement.querySelector('.popup__avatar').src = notice.author.avatar;
      return cardElement;
    },

    open: function (target, notices) {
      var cardPopup = map.querySelector('.popup');
      if (cardPopup) {
        map.removeChild(cardPopup);
        document.removeEventListener('keydown', onPopupEscPress);
      }
      var pinImageAlt = (target.tagName === 'IMG') ? target.alt : target.children[0].alt;
      cardPopup = window.card.create(getNoticeByAlt(pinImageAlt, notices));

      if (cardPopup) {
        map.insertBefore(cardPopup, mapFiltersContainer);
        var popupClose = map.querySelector('.popup__close');
        popupClose.addEventListener('click', function () {
          window.card.close();
        });
        popupClose.addEventListener('keydown', function (evt) {
          if (evt.keyCode === ENTER_KEYCODE) {
            window.card.close();
          }
        });
        document.addEventListener('keydown', onPopupEscPress);
      }
    },

    close: function () {
      var cardPopup = map.querySelector('.map__card');
      if (cardPopup) {
        map.removeChild(cardPopup);
      }
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

})();
