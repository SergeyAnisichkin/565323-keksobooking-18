'use strict';

(function () {
  window.error = {
    show: function (errorMessage) {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var errorPopup = errorTemplate.cloneNode(true);
      var documentMain = document.querySelector('main');
      errorPopup.querySelector('.error__message').textContent = errorMessage;
      documentMain.insertAdjacentElement('afterbegin', errorPopup);
      window.popup.addPopupEventListeners('.error');
    }
  };
})();
