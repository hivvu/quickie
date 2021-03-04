function loading() {
    if (!$('.loading').length) {
        $('<div class="loading"><i class="fa fa-cog"></i><span>A processar imagem...</span></div>').appendTo($('body'));
    } else {
        $('.loading').remove();
    }
}

function notify(string, delay) {
    $('.notification').text(string).fadeIn();

    setTimeout(function () {
        $('.notification').fadeOut('fast', function () { $('this').empty(); });
    }, delay);
}

function copyToClipboard(textToCopy, el) {
    el = (typeof el !== 'undefined') ? el : false

    if (!el) {
        var $tempElement = $('<input>');

        $('body').append($tempElement);
        $tempElement.val(textToCopy).select();
        document.execCommand('Copy');
        $tempElement.remove();

    } else {
        $tempElement.val(textToCopy).select();
        document.execCommand('Copy');
    }
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

// function getUrlParameter(sParam) {
//     var sPageURL = window.location.search.substring(1),
//         sURLVariables = sPageURL.split('&'),
//         sParameterName;

//     for (var i = 0; i < sURLVariables.length; i++) {
//         sParameterName = sURLVariables[i].split('=');

//         if (sParameterName[0] === sParam) {
//             return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
//         }
//     }
// }


function downloadQuickie(quickieId){
    loading();
    
    $.ajax({
      type: "GET",
      // data: JSON.stringify(quickie),
      url: 'http://localhost:3000/download/' + quickieId,
      contentType: 'application/json; charset=utf-8',
      crossDomain: true,
      success: function(result){
        // debugger;
  
        // Adds the result to a hidden href and clicks it to automaticaly download
        $('.result').attr('download', result[0].title).attr('href', result[0].link);
      
        // trigger the click
        $('.result')[0].click();
        
        loading();
      }, 
      error: function(e){
        loading();
        notify('Ocorreu um erro', 2000);
      }
    });
  }