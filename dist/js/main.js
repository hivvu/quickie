var quickie = {
  'text': '',
  'alignment': 'bottom-left',
  'image': {
    'url': '//placehold.it/1080x1080/ccc/222?text=Falta+o+URL+da+imagem',
    'saturation': 1,
    'contrast': 1,
    'brightness': 1,
    'blur': 0
  }
}

var defaultOpts = {
  'text': '',
  'alignment': 'bottom-left',
  'image': {
    'url': '//placehold.it/1080x1080/ccc/222?text=Falta+o+URL+da+imagem',
    'saturation': 1,
    'contrast': 1,
    'brightness': 1,
    'blur': 0
  }
}

function loading() {
  if (!$('.loading').length){
    $('<div class="loading"><i class="fa fa-cog"></i><span>A processar imagem...</span></div>').appendTo($('body'));
  } else {
    $('.loading').remove();
  }
}

function load(){
  if (getUrlParameter('data') != undefined){
    var data = JSON.parse(getUrlParameter('data'));
    var url = 'archive/' + data.year  + '-' + data.month + '/' + data.filename + '.json';
    
    console.info('Quickie loaded from file: /archive/' + data.year  + '-' + data.month + '/' + data.filename + '.json');

    $.ajax({
      type: "GET",
      url: url,
      success: function(result){
        generateQuickie(result);
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

function alignWatermark(curTextAlign) {
  if (~curTextAlign.indexOf('top')) {
    $('.logo').attr('data-vertical-align', 'bottom');
  } else if (~curTextAlign.indexOf('bottom')) {
    $('.logo').attr('data-vertical-align', 'top');
  }

  if (~curTextAlign.indexOf('left')) {
    $('.logo').attr('data-horizontal-align', 'right');
  } else if (~curTextAlign.indexOf('right')) {
    $('.logo').attr('data-horizontal-align', 'left');
  }
}

function save(config){
  var encodeConfig = JSON.stringify(config);  
  localStorage.setItem('quickie', encodeConfig);
}

function notify(string, delay){
  $('.notification').text(string).fadeIn();

  setTimeout(function(){
    $('.notification').fadeOut('fast', function(){ $('this').empty(); });
  }, delay);  
}

function getUrlParameter(sParam) {
  var sPageURL = window.location.search.substring(1),
    sURLVariables = sPageURL.split('&'),
    sParameterName;

  for (var i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
}

// ---- EVENTS

load();

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
  save(quickie);
  generateQuickie(quickie);
});

$('.options #externalImg').on('keyup', function () {
  quickie.image.url = $(this).val();
  save(quickie);
  generateQuickie(quickie);
});

$('.editor button').on('click', function(e){
  
  if ($(this).attr('data-target') != undefined){
    if ($(this).hasClass('is-active')){
      $(this).removeClass('is-active');
      $('.editor').removeClass('open');  
    } else {
      $('.editor button').removeClass('is-active');  
      $(this).addClass('is-active');
      $('.editor').addClass('open');  

      var target = $(this).data('target');
      $('.options > div').hide();
      $('.'+target).show();
    }
  } 
  
});

$('.fa-save').on('click', function(){
  notify('Guardado', 2000);
  save(quickie);
});

$('.fa-download').on('click', function(){

  loading();
  
  save(quickie);

  $.ajax({
    type: "POST",
    data: JSON.stringify(quickie),
    url: "/save",
    contentType: 'application/json; charset=utf-8',
    crossDomain: true,
    success: function(result){
      // Adds the result to a hidden href and clicks it to automaticaly download
      $('.result').attr('download', result[0].title).attr('href', result[0].link);
    
      // trigger the click
      $('.result')[0].click();
      
      loading();
    }, 
    error: function(){
      loading();
      notify('Ocorreu um erro', 2000);
    }
  });
});

$('#imageLoader').on('change', function (e) {

  //add image to preview with edit mode on
  if (this.files && this.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        var img = $('.bg');
        img.attr('src', e.target.result);
        // img.appendTo($('.preview'));

          //update object
          quickie.image.url = e.target.result;

          // if (img.get(0).complete)
          //     ImageLoaded(img);
          // else
          //     img.on('load', function () {
          //         ImageLoaded(img);
          //     });

          // _IMAGE_LOADED = 1;
      }

      reader.readAsDataURL(this.files[0]);
  }
});

// CUSTOM UPLOAD BUTTON
$('.upload').on('click', function () {
  $('#imageLoader').click();
});

$('.side-tools button').on('click', function(){
  if ($(this).hasClass('fa-code')){
    $('.modal textarea').remove();
    $('<textarea rows="25">'+JSON.stringify(quickie, undefined, 4)+'</textarea>').appendTo($('.modal-body'));
  }

  $('.modal').show();
});

$('.modal .modal-close').on('click', function(){
  $('.modal').hide();
});

// var initialSize = $(window).width();
// var actualSize = initialSize;
// var perc;

// windowResize();

// function windowResize(){
//   // var initialSize = $(window).width();
//   // var actualSize = initialSize;

//   // on load
//   perc = Math.floor(actualSize*100/initialSize) + '%';
//   $(':root').css('--zoom-size', perc);


//   //every time window resizes
//   $(window).on('resize', function(){
//       console.log('resized');
//       actualSize = $(window).width();
//       perc = Math.floor(actualSize*100/initialSize) + '%';

//       $(':root').css('--zoom-size', perc);
//   });
// }