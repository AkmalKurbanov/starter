$('.rating').each(function () {
  let $this = $(this);
  $(this).find('.rating__item').on('click', function () {
    let startVal = $(this).attr('data-val');
    $this.find('.rating__wrap').attr('data-total-val', startVal);
    $this.find('input').val(startVal);
  });
});