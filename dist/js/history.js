var defaultOpts = {
  'text': '',
  'alignment': 'bottom-left',
  'image': {
    'url': '//placehold.it/1080x1080/ccc/222?text=Adicionar+um+URL+ou+fazer+upload+de+imagem',
    'saturation': 1,
    'contrast': 1,
    'brightness': 1,
    'blur': 0
  }
}

function convertFolderNameToDate(theDate) {
  var year = theDate.split('-')[0],
    month = theDate.split('-')[1];

  var monthsName = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  return monthsName[month - 1] + ' ' + year;
}

function loadQuickies() {
  $.ajax({
    url: "/archive",
    contentType: 'application/json; charset=utf-8',
    crossDomain: true,
    success: function (result) {

      for (var i = 0; i <= result.archive.length - 1; i++) {
        var theDate = result.archive[i].folder;

        $('<h2>' + convertFolderNameToDate(theDate) + '</h2>').appendTo($('body'));
        $('<div class="image-grid" data-year="' + theDate + '"></div>').appendTo($('body'));

        // Cycle trough files
        if (result.archive[i].children.length > 0) {
          for (var x = 0; x <= result.archive[i].children.length - 1; x++) {

            var quickieId = result.archive[i].children[x].id;
            var quickieFile = result.archive[i].children[x].file;

            appendQuickies(theDate, quickieFile, quickieId);

          }
        }
      }
    },
    error: function () {
      // loading();
      notify('Ocorreu um erro', 2000);
    }
  });
}


function appendQuickies(folder, file, id) {
  $.ajax({
    type: "GET",
    url: 'http://localhost:3000/archive/' + folder + '/' + file,
    success: function (quickie) {

      var quickieMarkup = $('<div class="item" id="' + id + '"></div>');
      // var minieQuickie = $('<div class="mini-quickie" id="' + id + '"></div>').appendTo(quickieMarkup);
      var quickieLayers = $('<div class="layers"><img class="logo" data-horizontal-align="right" data-vertical-align="top" src="https://www.wasd.pt/CDN/wasd-icon.png" /></div>').appendTo(quickieMarkup);

      var quickTools = $('<div class="quick-tools"></div>').appendTo(quickieMarkup);

      $('<button type="button" class="fa fa-download js-download-quickie" title="Download"></button>').appendTo(quickTools);
      $('<button type="button" class="fa fa-pen js-edit-quickie" title="Editar"></button>').appendTo(quickTools);
      $('<button type="button" class="fas fa-share-alt js-share-quickie" title="Partilhar"></button>').appendTo(quickTools);
      $('<button type="button" class="fa fa-trash-alt js-delete-quickie" title="Eliminar"></button>').appendTo(quickTools);

      if (quickie.image.url != undefined) {
        $('<img src="' + quickie.image.url + '" />').appendTo(quickieMarkup);
      } else { console.log(id) }
      $('<div class="text bottom-left"><p>' + quickie.text + '</p></div>').appendTo(quickieLayers);

      quickieMarkup.appendTo($('[data-year=' + folder + ']'));

    },
    error: function () {
      notify('Ocorreu um erro', 2000);
    }
  });
}

// EVENTS
$('.history').on('click', '.js-download-quickie', function () {
  var quickieId = $(this).parents('.item').attr('id');
  downloadQuickie(quickieId);
});

$('.history').on('click', '.js-share-quickie', function () {
  var quickieId = $(this).parents('.item').attr('id');
  var quickieLink = window.location.protocol + '//' + window.location.host + '/id/' + quickieId;

  copyToClipboard(quickieLink);
  notify('Copiado para clipboard', 2000);
});

$('.history').on('click', '.js-edit-quickie', function () {
  var quickieId = $(this).parents('.item').attr('id');

  window.location.href = '/id/' + quickieId;
});

$('.history').on('click', '.js-delete-quickie', function () {
  var confirmFirst = confirm('Apagar este quickie?');
  var quickieId = $(this).parents('.item').attr('id');

  if (confirmFirst) {
    $.ajax({
      type: "GET",
      url: 'http://localhost:3000/delete/' + quickieId,
      success: function (data) {
        notify('Quickie apagado', 2000);

        // Wait 2 sec and refresh page 
        setTimeout(function () {
          location.reload();
        }, 2000);
      }
    });

  }

});


loadQuickies();