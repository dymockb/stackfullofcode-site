 
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



const rootDataset = document.documentElement.dataset;

document.getElementById('toggle-light').onclick = () => {
const inDarkMode = (rootDataset.theme === 'dark');
rootDataset.theme = inDarkMode ? '' : 'dark';
}						

document.getElementById('desktop-light').onclick = () => {
const inDarkMode = (rootDataset.theme === 'dark');
rootDataset.theme = inDarkMode ? '' : 'dark';
}

$('#first-name-last-name').delay(200).animate({opacity:1});
$('#light-btn').delay(200).animate({opacity: 1}, 1000);


const myImg = document.getElementById('portfolio2-title');

let countObs = 0;

const workingObserver = new IntersectionObserver((entry, observer) => {
  countObs ++;
  //console.log('entry:', entry);
  //console.log('observer:', observer);
  //console.log(countObs);
  if (countObs > 1) {
    $('#light-btn').attr('class', 'chandelier');
  }
});

workingObserver.observe(myImg);


const fadeInElements = document.querySelectorAll('.aos-item');
console.log(fadeInElements);

let observer = new IntersectionObserver((entry, observer) => {
    //console.log('entry:', entry[0].target);
    //console.log('isIntersecting:', entry[0].isIntersecting);
    //console.log('observer:', observer);
    if (entry[0].isIntersecting == true) {
      entry[0].target.setAttribute('style', 'opacity: 1');
    } 
              
});

fadeInElements.forEach(elem => {
  observer.observe(elem);
});



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
    
  
var debugInput = document.querySelector("input");
function updateDebugState() {
  document.body.classList.toggle('debug-on', debugInput.checked);
}

debugInput.addEventListener("click", updateDebugState);
updateDebugState();

});

