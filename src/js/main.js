var quickie;
// OBJECT EXAMPLE
// var quickie = {
//   'text': 'Mudrunner é a mais recente oferta da Epic Games Store. Disponível até dia 3 de Dezembro',
//   'alignment': 'bottom-left',
//   'image': {
//     'url': 'https://image.api.playstation.com/cdn/EP4133/CUSA09958_00/rE7MA0VJfBTydDSJCh8EfKYbTnSSoKJT.png'
//   }
// }

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

function showLoading() {
  console.log('started');
}

function load(config){

  if (localStorage.getItem('quickie')){
    var savedConfig = localStorage.getItem('quickie');
    quickie = config = JSON.parse(savedConfig);
  }

  $('.bg').attr('src', config.image.url ? config.image.url : defaultOpts.image.url);
  $('.text p').text(config.text);
  
  $(':root').css('--saturation', config.image.saturation ? config.image.saturation : defaultOpts.image.saturation);
  $(':root').css('--contrast', config.image.contrast ? config.image.contrast : defaultOpts.image.contrast);
  $(':root').css('--brightness', config.image.brightness ? config.image.brightness : defaultOpts.image.brightness);
  $(':root').css('--blur', config.image.blur ? config.image.blur : defaultOpts.image.blur);
  
  var alignment = config.alignment ? config.alignment : defaultOpts.alignment;
  $('.text').attr('class', 'text').addClass(alignment);
  alignWatermark(alignment);
  
  $('.options #text').val(config.text ? config.text : defaultOpts.text);
  
  // -------- TOOLS
  
  $('.options .alignment input').prop('checked', false);
  $('.options .alignment input[value="' + alignment + '"]').prop('checked', true);
  
  $('.options #saturation').val(config.image.saturation ? config.image.saturation : defaultOpts.image.saturation);
  $('.options #contrast').val(config.image.contrast ? config.image.contrast : defaultOpts.image.contrast);
  $('.options #brightness').val(config.image.brightness ? config.image.brightness : defaultOpts.image.brightness);
  $('.options #blur').val(config.image.blur ? config.image.blur : defaultOpts.image.blur);
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



// ---- EVENTS

load(quickie);

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
});

$('.options #text').on('keydown change', function () {
  quickie.text = $(this).val();
  save(quickie);
  load(quickie); 
});

$('.options #externalImg').on('change', function () {
  quickie.image.url = $(this).val();
  save(quickie);
  load(quickie); 
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
  notify('A processar...', 2000);

  $.ajax({
    url: "http://localhost:3000", 
    dataType: 'json',
    success: function(result){
      // Adds the result to a hidden href and clicks it to automaticaly download
      $('.result').attr('download', result[0].title).attr('href', result[0].link);
      $('.result')[0].click();
      // setTimeout(function(){
      //   $('.result').click();
      // }, 1000);
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