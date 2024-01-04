$(document).ready(function () {

  $('.form-wrap').each(function () {

    let width = $(this).find('.form-wrap__media').outerWidth();
    let offsetLeft = $(this).find('.form-wrap__media').offset().left;
    $(this).find('.form-wrap__bg-img').css('width', width + offsetLeft);


    if (window.matchMedia('(max-width: 767px)').matches) {
      let height = $(this).find('.form-wrap__media .video').outerHeight();
      $(this).find('.form-wrap__bg-img').css('max-height', (height + 200));
      console.log(height)
    }
  })

});
