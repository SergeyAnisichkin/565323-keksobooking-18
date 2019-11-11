'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.popup = {
    addPopupEventListeners: function (classPopup) {
      var closePopup = function () {
        var popup = document.querySelector(classPopup);
        var documentMain = document.querySelector('main');
        documentMain.removeChild(popup);
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
