'use strict';

(function () {
  window.error = {
    show: function (errorMessage) {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var errorPopup = errorTemplate.cloneNode(true);
      errorPopup.querySelector('.error__message').textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', errorPopup);
      window.popup.addPopupEventListeners('.error');
    }
  };
})();
