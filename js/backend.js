'use strict';

(function () {
  var SUCCESS_XHR_STATUS = 200;
  var XHR_TIMEOUT = 5000; // ms

  var addXhrListeners = function (xhr, onLoad, onError) {
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_XHR_STATUS) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
  };

  window.backend = {
    load: function (onLoad, onError) {
      var URL = 'https://js.dump.academy/keksobooking/data';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      addXhrListeners(xhr, onLoad, onError);
      xhr.timeout = XHR_TIMEOUT;
      xhr.open('GET', URL);
      xhr.send();
    },

    save: function (data, onLoad, onError) {
      var URL = 'https://js.dump.academy/keksobooking';
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      addXhrListeners(xhr, onLoad, onError);
      xhr.timeout = XHR_TIMEOUT;
      xhr.open('POST', URL);
      xhr.send(data);
    }
  };

})();
