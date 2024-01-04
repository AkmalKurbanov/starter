import Lottie from "lottie-web";
const element = document.getElementById('preloader');
const observer = new MutationObserver(function (event) {

  // Lottie.loadAnimation({
  //   container: document.querySelector('.preloader-run .lottie1'),
  //   render: 'svg',
  //   loop: true,
  //   autoplay: true,
  //   path: '/images/dist/animation.json'
  // });
  // Lottie.loadAnimation({
  //   container: document.querySelector('.preloader-run .lottie2'),
  //   render: 'svg',
  //   loop: true,
  //   autoplay: true,
  //   path: '/images/dist/animation.json'
  // });

});

observer.observe(element, {
  childList: false, 
  attributeFilter: ['class'],
  subtree: false, 
  characterDataOldValue: true
});