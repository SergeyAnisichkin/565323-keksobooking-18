'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  window.upload = {
    addFileListener: function (fileChooser, preview) {
      fileChooser.addEventListener('change', function () {
        var file = fileChooser.files[0];
        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (fileType) {
          return fileName.endsWith(fileType);
        });

        if (matches) {
          var reader = new FileReader();
          reader.addEventListener('load', function () {
            if (preview.tagName !== 'IMG') {
              var newPhoto = document.createElement('img');
              newPhoto.src = reader.result;
              newPhoto.alt = 'Фото жилья';
              newPhoto.width = '70';
              newPhoto.height = '70';
              preview.append(newPhoto);
            } else {
              preview.src = reader.result;
            }
          });
          reader.readAsDataURL(file);
        }
      });
    }
  };

})();
