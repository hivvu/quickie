var quickie = {
  "text": "",
  "alignment": "bottom-left",
  "image": {
    "url": "/static/img/no-image.png",
    "saturation": 1,
    "contrast": 1,
    "brightness": 1,
    "blur": 0
  }
}

var defaultOpts = {
  "text": "",
  "alignment": "bottom-left",
  "image": {
    "url": "/static/img/no-image.png",
    "saturation": 1,
    "contrast": 1,
    "brightness": 1,
    "blur": 0
  }
}


function load(){

  if (window.location.pathname.includes('id')){
    // Usally the id itself is the last text in the url. This reg ex gets the text after the last slash
    var id = window.location.pathname.match(/\/([^\/]+)\/?$/)[1];
    
    $.ajax({
      type: "GET",
      url: '/load/' + id,
      success: function(result){
        quickie = JSON.parse(result);
        generateQuickie(quickie);
      }, 
      error: function(){
        notify('Ocorreu um erro', 2000);
      }
    });

  } else if (localStorage.getItem('quickie')){
    console.info('Quickie loaded from localStorage');
    var savedConfig = localStorage.getItem('quickie');
    quickie = JSON.parse(savedConfig);
    generateQuickie(quickie);

  } else {
    console.info('Quickie loaded from default options');
    generateQuickie(defaultOpts);
  }
}

function generateQuickie(json){
  $('.bg').attr('src', json.image.url ? json.image.url : defaultOpts.image.url);
  $('.text p').text(json.text);
  
  $(':root').css('--saturation', json.image.saturation ? json.image.saturation : defaultOpts.image.saturation);
  $(':root').css('--contrast', json.image.contrast ? json.image.contrast : defaultOpts.image.contrast);
  $(':root').css('--brightness', json.image.brightness ? json.image.brightness : defaultOpts.image.brightness);
  $(':root').css('--blur', json.image.blur ? json.image.blur : defaultOpts.image.blur);
  
  var alignment = json.alignment ? json.alignment : defaultOpts.alignment;
  $('.text').attr('class', 'text').addClass(alignment);
  alignWatermark(alignment);
  
  $('.options #text').val(json.text ? json.text : defaultOpts.text);
  
  $('.options .alignment input').prop('checked', false);
  $('.options .alignment input[value="' + alignment + '"]').prop('checked', true);
  
  $('.options #saturation').val(json.image.saturation ? json.image.saturation : defaultOpts.image.saturation);
  $('.options #contrast').val(json.image.contrast ? json.image.contrast : defaultOpts.image.contrast);
  $('.options #brightness').val(json.image.brightness ? json.image.brightness : defaultOpts.image.brightness);
  $('.options #blur').val(json.image.blur ? json.image.blur : defaultOpts.image.blur);
}

// Save quickie locally
function saveLocally(config){
  localStorage.setItem('quickie', JSON.stringify(config));
}

function save(config, reload){
  copyLink = (typeof copyLink !== 'undefined') ? copyLink : false
  

  var quickieId;
  //Add creation date to quickie obj
  config.created = Date.now();

  // If quickie id is present, update quickie. 
  // Else create a new quickie 
  if (window.location.pathname.length > 1){
    // Usally the id itself is the last text in the url. This reg ex gets the text after the last slash
    var uniqueId = window.location.pathname.match(/\/([^\/]+)\/?$/)[1];
    reload = false;
  } else {
    var uniqueId = Math.random().toString(36).substr(2, 9);
  }


  // Save it on the server
  $.ajax({
    type: "POST",
    data: config,
    async: false,
    url: '/save/' + uniqueId,
    success: function(result){
      notify('Guardado', 2000);
    
      saveLocally(config);

      if (reload){
        setTimeout(function(){
          window.location.href = '/id/' + result.id;
        }, 2100);
      }
      
      quickieId = result.id;
      
    },
    complete: function(){
      return quickieId;
    }, 
    error: function(){
      notify('Ocorreu um erro', 2000);
    }
  });

}




// ---- EVENTS

load();

if (localStorage.getItem('quickieZoom')){
  $(':root').css('--zoom', localStorage.getItem('quickieZoom'));
}

$('.js-zoom-out').on('click', function () {
    var curZoom = parseFloat($(':root').css('--zoom').trim());

    if (curZoom > 0.4){
      var newZoom = curZoom - .1;
      $(':root').css('--zoom', newZoom);
      localStorage.setItem('quickieZoom', newZoom);
    }
});

$('.js-zoom-in').on('click', function () {
  var curZoom = parseFloat($(':root').css('--zoom').trim());

  if (curZoom < 0.9){
    var newZoom = curZoom + .1;
    $(':root').css('--zoom', newZoom);
    localStorage.setItem('quickieZoom', newZoom);
  }
});


$('.side-options .js-share-quickie').on('click', function () {

  if ((quickie.text != '' && quickie.image.url.indexOf('no-image') != -1) || window.location.pathname.length > 1){
    var quickieId = window.location.pathname.match(/\/([^\/]+)\/?$/)[1];
    var quickieLink = window.location.protocol + '//' + window.location.host + '/id/' + quickieId;
    copyToClipboard(quickieLink);
  } else {
    notify('É preciso gravar primeiro', 1500);
  }
  
});

$('.js-new-quickie').on('click', function () {
  localStorage.removeItem('quickie');
  window.location.href = '/';
});

$('.alignment input').on('click', function () {
  var curTextAlign = $(this).val();
  $('.text').attr('class', 'text').addClass(curTextAlign);
  
  quickie.alignment = curTextAlign;
  alignWatermark(curTextAlign);

});

$('.options input[type="range"]').on('change', function () {
  $(':root').css('--saturation', $('#saturation').val());
  $(':root').css('--contrast', $('#contrast').val());
  $(':root').css('--brightness', $('#brightness').val());
  $(':root').css('--blur', $('#blur').val());

  quickie.image.saturation = $('#saturation').val();
  quickie.image.contrast = $('#contrast').val();
  quickie.image.brightness = $('#brightness').val();
  quickie.image.blur = $('#blur').val();

  generateQuickie(quickie);
});

$('.options #text').on('keyup', function () {
  quickie.text = $(this).val();
  saveLocally(quickie);
  generateQuickie(quickie);
});

$('.options #externalImg').on('keyup', function () {
  quickie.image.url = $(this).val();
  saveLocally(quickie);
  generateQuickie(quickie);
});

$('.toolbar button').on('click', function(e){
  
  if ($(this).attr('data-target') != undefined){
    if ($(this).hasClass('is-active')){
      $(this).removeClass('is-active');
      $('.toolbar').removeClass('open');  
    } else {
      $('.toolbar button').removeClass('is-active');  
      $(this).addClass('is-active');
      $('.toolbar').addClass('open');  

      var target = $(this).data('target');
      $('.options > div').hide();
      $('.'+target).show();
    }
  } 
  
});

$('.fa-save').on('click', function(){
  // notify('Guardado', 2000);
  save(quickie, true);
});

$('.fa-download').on('click', function(){
  
  if (window.location.pathname.length > 1){
    // Usally the id itself is the last text in the url. This reg ex gets the text after the last slash
    var quickieId = window.location.pathname.match(/\/([^\/]+)\/?$/)[1];
  } else {
    var quickieId = save(quickie, false);
    // var uniqueId = Math.random().toString(36).substr(2, 9);
  }
  
  downloadQuickie(quickieId);
  
});


$('#imageLoader').on('change', function (e) {

  //add image to preview with edit mode on
  if (this.files && this.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var img = $('.bg');
        img.attr('src', e.target.result);
          //update object
          quickie.image.url = e.target.result;
      }

      reader.readAsDataURL(this.files[0]);
  }
});

// CUSTOM UPLOAD BUTTON
$('.upload').on('click', function () {
  $('#imageLoader').click();
});

$('.fa-code').on('click', function(){
  if ($(this).hasClass('fa-code')){
    $('.modal textarea').remove();
    $('<textarea rows="25">'+JSON.stringify(quickie, undefined, 4)+'</textarea>').appendTo($('.modal-body'));
  }

  $('.modal').show();
});

$('.modal .modal-close').on('click', function(){
  $('.modal').hide();
});
