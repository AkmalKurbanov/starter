$(document).ready(function () {

  $('.input').on('click', function () {
    $(this).find('input').focus();
  });
  $('input, textarea').on('focus', function () {
    $(this).parents('.input').addClass('input_focused');
  });

  $('input, textarea').on('focusout', function () {
    $(this).parents('.input').removeClass('input_focused');
  });

  $('.select-js').on('click', function () {
    $('.select-js').not($(this)).removeClass('open');
  });

  $('.select-js').each(function (index) {


    $(this).on('click', function () {
      $(this).toggleClass('open');
    });
    $(this).find('.select__option').on('click', function () {
      let dataText = $(this).attr('data-text');
      let dataId = $(this).attr('data-id');
      $(this).parents('.select-js').find('.select-input').val(dataId);
      $(this).parents('.select-js').find('.select__selected .select__selected-text').text(dataText);
      $(this).parents('.select-js').addClass('selected');
    });
  });
  jQuery(function ($) {
    $(document).mouseup(function (e) {
      var div = $('.select-js');
      if (!div.is(e.target)
        && div.has(e.target).length === 0) {
        div.removeClass('open');
      }
    });
  });
});