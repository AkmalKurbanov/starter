$(document).on('click', '.popup-trigger-js', function (e) {
  e.preventDefault();
  let dataNameTrigger = $(this).attr('data-name');
  $('.popup-js').each(function () {
    let popupTitleHeight = $(this).find('.title').outerHeight();
    console.log(popupTitleHeight);
    let dataNamePopup = $(this).attr('data-name');
    if (dataNamePopup == dataNameTrigger) {
      $(this).addClass('open');
      $('body').addClass('no-scroll');
    }
    $(this).find('.popup__window-content').css({ height: `calc(100% - ${popupTitleHeight}px)` });
  });

});
$(document).on('click', '.popup__close', function () {
  $(this).parents('.popup').removeClass('open');
  $('body').removeClass('no-scroll');
});

jQuery(function ($) {
  $(document).mouseup(function (e) {
    var div = $('.popup-js .popup__window ');
    if (!div.is(e.target)
      && div.has(e.target).length === 0) {
      $('.popup-js').removeClass('open');
      $('body').removeClass('no-scroll');
    }
  });
});




