'use strict';

(function () {
  var ENTER_KEYCODE = 13;
  var ESC_KEYCODE = 27;
  var LENGTH_AVATAR_SRC = 22;
  var map = document.querySelector('.map');
  var mapFiltersContainer = map.querySelector('.map__filters-container');
  var mapCardTemplate = document.querySelector('#card').content.querySelector('.map__card');

  var changeFeaturesList = function (featuresNode, featuresNotice) {
    var copyChild = featuresNode.firstElementChild;
    while (featuresNode.querySelector('.popup__feature')) {
      featuresNode.removeChild(featuresNode.querySelector('.popup__feature'));
    }
    for (var i = 0; i < featuresNotice.length; ++i) {
      copyChild.setAttribute('class', 'popup__feature popup__feature--' + featuresNotice[i]);
      featuresNode.appendChild(copyChild.cloneNode(true));
    }
    return featuresNode;
  };

  var addPhotosList = function (photosNode, photosNotice) {
    var copyChild = photosNode.querySelector('.popup__photo');
    photosNode.removeChild(copyChild);
    for (var i = 0; i < photosNotice.length; ++i) {
      copyChild.src = photosNotice[i];
      photosNode.appendChild(copyChild.cloneNode(true));
    }
    return photosNode;
  };

  var createCardNotice = function (notice) {
    var cardElement = mapCardTemplate.cloneNode(true);
    cardElement.querySelector('.popup__title').textContent = notice.offer.title;
    cardElement.querySelector('.popup__text--address').textContent = notice.offer.address;
    cardElement.querySelector('.popup__text--price').textContent = notice.offer.price + '₽/ночь';
    cardElement.querySelector('.popup__type').textContent = window.data.getOfferTypeValue(notice.offer.type);
    var textCapacity = notice.offer.rooms + ' комнаты для ' + notice.offer.guests + ' гостей';
    cardElement.querySelector('.popup__text--capacity').textContent = textCapacity;
    var textTime = 'Заезд после ' + notice.offer.checkin + ', выезд до ' + notice.offer.checkout;
    cardElement.querySelector('.popup__text--time').textContent = textTime;
    changeFeaturesList(cardElement.querySelector('.popup__features'), notice.offer.features);
    cardElement.querySelector('.popup__description').textContent = notice.offer.description;
    addPhotosList(cardElement.querySelector('.popup__photos'), notice.offer.photos);
    cardElement.querySelector('.popup__avatar').src = notice.author.avatar;
    return cardElement;
  };

  var getNoticeBySrc = function (src, notices) {
    src = src.slice(-LENGTH_AVATAR_SRC);
    for (var i = 0; i < notices.length; ++i) {
      if (notices[i].author.avatar === src) {
        return notices[i];
      }
    }
    return notices[0];
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      window.card.close();
    }
  };

  var openCardPopup = function (target, notices) {
    var cardPopup = map.querySelector('.popup');
    if (cardPopup) {
      map.removeChild(cardPopup);
      document.removeEventListener('keydown', onPopupEscPress);
    }
    var avatarSrc = (target.tagName === 'IMG') ? target.src : target.children[0].src;
    cardPopup = window.card.create(getNoticeBySrc(avatarSrc, notices));
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
  };

  window.card = {
    create: function (notice) {
      return createCardNotice(notice);
    },
    open: function (target, notices) {
      return openCardPopup(target, notices);
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
