const $body = document.querySelector("body");
const $container = document.querySelector(".container");
const $nav = document.querySelector("nav");
const $txt = document.getElementsByClassName("txt");
const $page = document.getElementsByClassName("page");
const $logo_img = document.querySelector("#logo_img");
const deleteForms = document.querySelectorAll('.list');

let time = new Date();
let hours = time.getHours();

deleteForms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const confirmation = confirm('정말로 삭제하시겠습니까?');
    if (confirmation) {
      form.submit();
    }
  });
});
const urlParams = new URLSearchParams(window.location.search);
const wrongPassword = urlParams.get('wrongPassword');
if (wrongPassword === 'true') {
  alert('패스워드가 틀렸습니다.');
}

function darkmode() {
  $body.style.backgroundImage = 'linear-gradient(120deg, #af4b1f 0%, #332363 100%)';
  $container.style.opacity = '0.85';
  $logo_img.src = "./image/dark_logo.png"
  $page[0].classList.add('dark');
  for (let i = 0; i < 6; i++) {
    $txt[i].classList.add('dark');
  }
}

if (hours < 5 || hours > 19) {
  darkmode();
}