import Swiper from "swiper";
import { Pagination, EffectFade, Autoplay } from 'swiper/modules';

var swiper = new Swiper(".slider-js", {
  modules: [Pagination, EffectFade],
  effect: "fade",
  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },
});



$('.slider-js').each(function (index) {
  let slideBottomPosition = $(this).find('.slider__item-bottom').offset();
  let slideBottomHeight = $(this).find('.slider__item-bottom').outerHeight();
  let slideBottomTotal = (slideBottomPosition.top + slideBottomHeight - 60);
  $(this).find('.swiper-pagination').css('top', slideBottomTotal);
});

if (window.matchMedia('(max-width: 767px)').matches) {
  $('.slider__item-interior').each(function (index) {
    $(this).find('.slider__bg-blur, .slider__desktop').remove();
  })
}



var swiper = new Swiper(".gallery-js", {
  
  loop: true,
  speed: 2000,
  modules: [Autoplay],
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    768: {
      spaceBetween: 10,
      slidesPerView: 2
    },
    992: {
      spaceBetween: 16,
      slidesPerView: 3
    },
  }
});