var config = {
  'text': 'Mudrunner é a mais recente oferta da Epic Games Store. Disponível até dia 3 de Dezembro',
  'alignment': 'bottom-left',
  'image': {
    'url': 'https://image.api.playstation.com/cdn/EP4133/CUSA09958_00/rE7MA0VJfBTydDSJCh8EfKYbTnSSoKJT.png'
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


// -------- LOAD 

$('.bg').attr('src', config.image.url ? config.image.url : defaultOpts.image.url);
$('.text p').text(config.text);

$(':root').css('--saturation', config.image.saturation ? config.image.saturation : defaultOpts.image.saturation);
$(':root').css('--contrast', config.image.contrast ? config.image.contrast : defaultOpts.image.contrast);
$(':root').css('--brightness', config.image.brightness ? config.image.brightness : defaultOpts.image.brightness);
$(':root').css('--blur', config.image.blur ? config.image.blur : defaultOpts.image.blur);

var alignment = config.alignment ? config.alignment : defaultOpts.alignment;
$('.text').attr('class', 'text').addClass(alignment);
alignWatermark(alignment);


// -------- TOOLS

$('.alignment input').prop('checked', false);
$('.alignment input[value="' + alignment + '"]').prop('checked', true);

$('.background #saturation').val(config.image.saturation ? config.image.saturation : defaultOpts.image.saturation);
$('.background #contrast').val(config.image.contrast ? config.image.contrast : defaultOpts.image.contrast);
$('.background #brightness').val(config.image.brightness ? config.image.brightness : defaultOpts.image.brightness);
$('.background #blur').val(config.image.blur ? config.image.blur : defaultOpts.image.blur);
// --------

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

$('.alignment input').on('click', function () {
  var curTextAlign = $(this).val();
  $('.text').attr('class', 'text').addClass(curTextAlign);

  alignWatermark(curTextAlign);

});

$('.background input').on('change', function () {
  $(':root').css('--saturation', $('#saturation').val());
  $(':root').css('--contrast', $('#contrast').val());
  $(':root').css('--brightness', $('#brightness').val());
  $(':root').css('--blur', $('#blur').val());
});


$('#btnSave').on('click', function () {
  var curWHeight = $('body').innerHeight();

  console.info('saved');

});

function load(curWHeight) {

  $('.tools').show();
  $('body, html').innerHeight(curWHeight);

}

function showLoading() {


  console.log('started');
}

