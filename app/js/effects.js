$(document).ready(function () {
  $(document).on('click', '.click-effect-js', function () {
    let $this = $(this);
    $this.addClass('run');

    setTimeout(function () {
      $this.removeClass('run');
    }, 300);
  });
});