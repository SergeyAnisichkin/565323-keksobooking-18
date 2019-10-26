'use strict';

(function () {
  window.popup = {
    addPopupEventListeners: function (classPopup) {
      var ESC_KEYCODE = 27;
      var closePopup = function () {
        var popup = document.querySelector(classPopup);
        document.body.removeChild(popup);
        document.removeEventListener('keydown', onEscPress);
        document.removeEventListener('click', onDocumentClick);
      };

      var onEscPress = function (evt) {
        if (evt.keyCode === ESC_KEYCODE) {
          closePopup();
        }
      };

      var onDocumentClick = function () {
        closePopup();
      };
      document.addEventListener('click', onDocumentClick);
      document.addEventListener('keydown', onEscPress);
    }
  };
})();
