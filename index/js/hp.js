 

$(document).ready(function () {

  AOS.init({
    easing: 'ease-in-out-sine'
  });

  (function() {
    var $gallery2 = new SimpleLightbox('.gallery2 a', {overlay: true});
  })();
  (function() {
      var $gallery = new SimpleLightbox('.gallery a', {overlay: true});       
  })();

      
  anime.timeline({loop: false})
    .add({
      targets: '.ml11 .line',
      scaleY: [0,1],
      opacity: [0.5,1],
      easing: "easeOutExpo",
      duration: 700
    }).add({
      targets: '.ml11 .line',
      translateX: [0, document.querySelector('.ml11 .letters').getBoundingClientRect().width + 10],
      easing: "easeOutExpo",
      duration: 700,
      delay: 100
    }).add({
      targets: '.ml11 .letter',
      opacity: [0,1],
      easing: "easeOutExpo",
      duration: 600,
      offset: '-=775',
      delay: (el, i) => 34 * (i+1)
    }).add({
      targets: '.ml11 .line',
      opacity: 0,
      duration: 1000,
      easing: "easeOutExpo",
      delay: 1000
    });


  const rootDataset = document.documentElement.dataset;

  document.getElementById('mobile-dark-switch').onclick = () => {
    console.log('ww');
    const inDarkMode = (rootDataset.theme === 'dark');
    rootDataset.theme = inDarkMode ? '' : 'dark';
  }

  document.getElementById('desktop-light').onclick = () => {
    console.log('hi');
    const inDarkMode = (rootDataset.theme === 'dark');
    rootDataset.theme = inDarkMode ? '' : 'dark';
  }


  $('.php-email-form').submit(function(e){
  e.preventDefault();

  let emailMsgObj = {};						

  for (let elem = 0; elem < this.elements.length; elem ++){
              
    if (this.elements[elem].tagName != 'BUTTON') {
    
        console.log(this.elements[elem].name);
        console.log(this.elements[elem].value);

        emailMsgObj[this.elements[elem].name] = this.elements[elem].value;
    
    }

  }

  /*
  let fakeForm = setTimeout(function(){

    $('.loading').attr('style', 'display: block');
    $('.php-email-form').trigger('reset');
    $('.sent-message').attr('style', 'display: block');
    let sentMsgMsg = setTimeout(function (){
      $('.sent-message').fadeOut();
      $('.loading').fadeOut();
      clearTimeout(sentMsgMsg);
    },3500);
    clearTimeout(fakeForm);
  },1000);
  */


  $('.loading').attr('style', 'display: block');

  $.ajax({
  url: "index/mail.php",
  type: "POST",
  dataType: "json",
  data: emailMsgObj,
  success: function(data, textStatus, jqXHR) {

    let loadingTimer = setTimeout(function (){
      $('.loading').fadeOut();
      $('.sent-message').fadeIn();
      let sentMsg = setTimeout(function(){
        $('.sent-message').fadeOut();
        clearTimeout(sentMsg);
      }, 2000);
      clearTimeout(loadingTimer);
    }, 1500);

    console.log(data);
    console.log('reset form');
    $('.php-email-form').trigger('reset');


  },
  error: function (jqXHR, textStatus, errorThrown) {
      console.log('error', jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });



  
  }) // end of PHP submit
    

});

