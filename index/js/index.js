 
/*
// Wrap every letter in a span
const firstNameWrapper = document.getElementById('dymock');
firstNameWrapper.innerHTML = firstNameWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

const lastNameWrapper = document.getElementById('brett');
lastNameWrapper.innerHTML = lastNameWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: false})
  .add({
    targets: '#dymock .letter',
    opacity: [0,1],
    easing: "easeInOutQuad",
    duration: 1250,
    delay: (el, i) => 150 * (i+1)
  })

  anime.timeline({loop: false})
  .add({
    targets: '#brett .letter',
    opacity: [0,1],
    easing: "easeInOutQuad",
    duration: 1250,
    delay: (el, i) => 150 * (i+1)
  })
  */

  //const fsWrapper = document.querySelector('.ml11 .letters');
  //fsWrapper.innerHTML = fsWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
    
  
  $(document).ready(function () {

    $('.carousel').carousel();


    /*
    function vhToPixels (vh) {
      return Math.round(window.innerHeight / (100 / vh));
    }
    */


    const _1vh = window.innerHeight / 100;

    const windowHeight = window.innerHeight;
    console.log('windowHeight', windowHeight);

    const adjustFactor = windowHeight / 3;

    const section0On = windowHeight - adjustFactor;
    const section1On = windowHeight*2 - adjustFactor;
    const section2On = windowHeight*3 - adjustFactor;
    const section3On = windowHeight*4 - adjustFactor;

    const listOfTitles = ['<span class="text-primary">Full-stack</span><span>developer</span>','Skills','Portfolio','Portfolio','Contact']

    let visibleSection = 0;

    let scrolling = false;

    window.onscroll = () => {
        scrolling = true;
        //$('#highlights').attr('style', `background-position: right 0px bottom ${window.scrollY / 4 }px`);
      };

    setInterval(() => {

        if (scrolling) {
            scrolling = false;


            
            currentSection = visibleSection.valueOf();
            
            if (window.scrollY <= section0On) {
              if (currentSection != 0) {
                visibleSection = 0;
                x.a = 0;
              };
              
            } else if (window.scrollY > section0On && window.scrollY < section1On) {
              if (currentSection != 1) {
                visibleSection = 1;
                x.a = 1;
              };
              
            } else if (window.scrollY > section1On && window.scrollY < section2On) {
              if (currentSection != 2) {
                visibleSection = 2;
                x.a = 2;
              };
              

            } else if (window.scrollY > section2On && window.scrollY < section3On){  
              if (currentSection != 3) {
                visibleSection = 3;
                x.a = 3;
              };
              
            } else if (window.scrollY >= section3On){  
              console.log('end of Scroll', window.scrollY);
              if (currentSection != 4) {
                visibleSection = 4;
                x.a = 4;
              };
              
            }
            
        }

    },300);

    x = {
      aInternal: 10,
      aListener: function(val) {},
      set a(val) {
        this.aInternal = val;
        this.aListener(val);
      },
      get a() {
        return this.aInternal;
      },
      registerListener: function(listener) {
        this.aListener = listener;
      }
    }

    console.log('x.a', x.a);

    x.registerListener(function(val) {

      $(`#section${val}`).fadeIn();
      $(`.fade-section:not(#section${val})`).fadeOut();

      //$('#toggle-text').hide().html(listOfTitles[val]).fadeIn(500);

      $(`#highlight${val}`).attr('style', 'font-weight: bold');
      $(`.highlight:not(#highlight${val})`).attr('style', 'font-weight: initial');

      console.log("Someone changed the value of x.a to " + val);

    });
    
    /*
    window.addEventListener("scroll", () => { 
      
      console.log(window.scrollY);


    });
    */
    
    anime.timeline({loop: false})
      .add({
        targets: '.ml11 .line',
        scaleY: [0,1],
        opacity: [0.5,1],
        easing: "easeOutExpo",
        duration: 700
      })
      .add({
        targets: '.ml11 .line',
        translateX: [0, document.querySelector('.ml11 .letters').getBoundingClientRect().width + 10],
        easing: "easeOutExpo",
        duration: 700,
        delay: 200
      }).add({
        targets: '.ml11 .letter',
        opacity: [0,1],
        easing: "easeOutExpo",
        duration: 600,
        offset: '-=775',
        delay: (el, i) => 34 * (i+1)
      }).add({
        targets: '.ml11',
        opacity: 1,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 0
      }).add({
        targets: '.ml11 .line',
        opacity: 0,
        duration: 1000,
        easing: "easeOutExpo",
        delay: 0
      })

/*
AOS.init({
easing: 'ease-in-out-sine'
});
*/

$('.nav-link').click(function(){
  $('.aos-item').attr('style', 'opacity: 1')
});


const rootDataset = document.documentElement.dataset;

/*
document.getElementById('toggle-light').onclick = () => {
const inDarkMode = (rootDataset.theme === 'dark');
rootDataset.theme = inDarkMode ? '' : 'dark';
}						

document.getElementById('desktop-light').onclick = () => {
const inDarkMode = (rootDataset.theme === 'dark');
rootDataset.theme = inDarkMode ? '' : 'dark';
}
*/
$('#first-name-last-name').delay(200).animate({opacity:1});
$('#light-btn').delay(200).animate({opacity: 1}, 1000);


/*
const myImg = document.getElementById('portfolio2-title');

let countObs = 0;

const ioOptions = {
  //root: document.getElementById('scrolling-container'),
  rootMargin: '0px 10px 0px 10px',
  //threshold: 0.5,
  trackVisibility: true,
  delay: 100,
}

const workingObserver = new IntersectionObserver((entry, observer) => {
  countObs ++;
  //console.log('entry:', entry);
  //console.log('observer:', observer);
  //console.log(countObs);
  if (countObs > 1) {
    $('#light-btn').attr('class', 'chandelier');
    $('#back-layer-cv').attr('style', 'opacity: 1');
  }
  }, ioOptions);

workingObserver.observe(myImg);




const fadeInElements = document.querySelectorAll('.aos-item');
console.log(fadeInElements);

let observer = new IntersectionObserver((entry, observer) => {
    //console.log('entry:', entry);
    //console.log('isIntersecting:', entry[0].isIntersecting);
    //console.log('observer:', observer);
    console.log('isVisible:', entry[0].isVisible, entry[0].target);
    if (entry[0].isIntersecting == true) {
      entry[0].target.setAttribute('style', 'opacity: 1');
    } 
              
}, ioOptions);

fadeInElements.forEach(elem => {
  observer.observe(elem);
});

*/


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


let fakeForm = setTimeout(function(){

  $('.php-email-form').trigger('reset');
  $('.sent-message').attr('style', 'display: block');

},1000);
  

/*

$.ajax({
url: "index/mail.php",
type: "POST",
dataType: "json",
data: emailMsgObj,
success: function(data, textStatus, jqXHR) {

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

*/

  
}) // end of PHP submit
    
/*  
var debugInput = document.querySelector("input");
function updateDebugState() {
  document.body.classList.toggle('debug-on', debugInput.checked);
}

debugInput.addEventListener("click", updateDebugState);
updateDebugState();
*/

});

