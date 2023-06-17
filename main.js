const $body = document.querySelector("body");
const $container = document.querySelector(".container");
const $nav = document.querySelector("nav");
const $txt = document.getElementsByClassName("txt");
const $page = document.getElementsByClassName("page");
const $logo_img = document.querySelector("#logo_img");
const $weather_img = document.querySelector("#weather_img");
const $weather = document.querySelector("#weather");
const $share_img = document.querySelector("#share_img");
const $scroll_icon = document.querySelector(".scroll_icon");
const $gps_icon = document.querySelector("#gps_icon");
const $temperature = document.querySelector("#temperature");
const $temperature_second = document.querySelector("#temperature_second");
const $apparent_temperature = document.querySelector("#apparent_temperature");
const $location = document.querySelector("#location");
const $cloth_img = document.querySelector("#cloth_img");
const $outfit_list = document.querySelector("#outfit_list");
const $loader = document.querySelector('.loader');
const $html = document.querySelector('html');
const $weather_description = document.querySelector('#weather_description');
const $footer_page = document.querySelector('#footer_page');
const $set_loc_btn = document.querySelectorAll(".set_loc_btn");
const $loc_set = document.querySelector("#loc_set");
const $mask = document.querySelector("#mask");
const $xbtn = document.querySelector("#Xbtn");
const $loc_input = document.getElementById("loc_input");
const $set_btn = document.querySelector("#set_btn");

let autocomplete;

let latitude = ''; //위도
let longitude = ''; //경도

let time = new Date();
let hours = time.getHours();

const w_apikey = weather_apikey;
const g_apikey = gps_apikey;
let w_url = "";
let g_url = "";

const recommed_list = [["민소매", "반팔 티셔츠", "반바지", "민소매 원피스", "린넨"],
["반팔 티셔츠", "얇은 셔츠","얇은 긴팔 티셔츠", "반바지", "면바지"],
["얇은 가디건", "긴팔 티셔츠", "블라우스", "후드티", "셔츠"],
["후드티", "얇은 니트", "맨투맨", "가디건", "바람막이"],
["재킷", "가디건", "니트", "기모 맨투맨", "기모 후드티"],
["니트", "트렌치 코트", "야상", "점퍼", "기모바지"],
["코트", "울코트", "후리스", "니트", "내복"],
["패딩", "두꺼운 코트", "내복", "목도리", "장갑"]]

function loadlocation() {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      w_url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${w_apikey}&units=metric&lang=kr`;
      g_url =`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&location_type=ROOFTOP&result_type=street_address&language=ko&key=${g_apikey}`;
      getJSON(g_url,
        function (err, data) {
          if (err !== null) {
            alert('위치 정보가 없습니다. 에러코드:' + err);
          } else {
            const loc_a = data.results[0].address_components[2].long_name;
            const loc_b = data.results[0].address_components[1].long_name;
            $location.innerText = `${loc_a} ${loc_b}`;
          }
        })
      
      getJSON(w_url,
        function (err, data) {
          if (err !== null) {
            alert('날씨 정보가 없습니다. 에러코드:' + err);
          } else {
            getWeatherData(data);
            loadOver()
          }
        })
    },
    function(){
      console.log("gps 권한 없음");
      loadOver()
    }
  );
};

function loadOver(){
  $loader.style.opacity = '0';
  $html.style.overflow = 'auto'; //스크롤 방지 해제
  setTimeout(() => {
    $loader.style.display = 'none';
  }, 400);
}

// 밤 시간이되면 자동으로 다크모드 전환
function darkmode(){
  $body.style.backgroundImage = 'linear-gradient(120deg, #af4b1f 0%, #332363 100%)';
  $container.style.opacity = '0.85';
  $logo_img.src = "./image/dark_logo.png"
  $share_img.src = "./image/yoru.png"
  $weather_img.style.backgroundImage = "url('./image/Night.png')";
  $gps_icon.style.backgroundImage = "url('./image/gps_icon_dark.png')";
  $weather_img.style.filter = "drop-shadow(0 0 55px rgba(158, 158, 158, 0.4))";
  $scroll_icon.classList.add('dark');
  for(let i = 0; i < 3; i++){
    $page[i].classList.add('dark');
  }
  for(let i = 0; i < 9; i++){
    $txt[i].classList.add('dark');
  }
}

// api로 json정보 가져오기
const getJSON = function(url, callback){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'json';
  xhr.onload = function(){
    const status = xhr.status;
    if(status === 200){
      callback(null, xhr.response);
    }else{
      callback(status, xhr.response);
    }
  };
  xhr.send();
}

function getWeatherData(data) {
  const temp = Math.round(data.main.temp);
  const icon = data.weather[0].icon;
  changeIcon(icon);
  changeOutfit(temp);
  $weather.innerText = data.weather[0].description;
  $temperature.innerText = `${temp}°`;
  $temperature_second.innerText = `${temp}°`;
  $apparent_temperature.innerText = `습도 ${data.main.humidity}% 체감온도 ${Math.round(data.main.feels_like)}°`;
}

function changeIcon(icon) {
  const icon_num = icon.substr(0, 2);
  if (icon_num === "01") {
    $weather_img.style.backgroundPosition = "0% 0%";
  } else if (icon_num === "02" || icon_num === "50") {
    $weather_img.style.backgroundPosition = "40% 0%";
  } else if (icon_num === "03" || icon_num === "04") {
    $weather_img.style.backgroundPosition = "20% 0%";
  } else if (icon_num === "09" || icon_num === "10") {
    $weather_img.style.backgroundPosition = "60% 0%";
  } else if (icon_num === "11") {
    $weather_img.style.backgroundPosition = "100% 0%";
  } else if (icon_num === "13") {
    $weather_img.style.backgroundPosition = "80% 0%";
  }
}

function changeOutfit(temp) {
  if(temp > 27){
    $cloth_img.src = "./image/cloth/28.png"
    addList(recommed_list[0]);
    $weather_description.innerText = "한여름 날씨예요! 가볍게 입고나가요~"
  }else if(temp > 22){
    $cloth_img.src = "./image/cloth/23.png"
    addList(recommed_list[1]);
    $weather_description.innerText = "버틸만한 더위지만 얇은 옷으로!"
  }else if(temp > 19){
    $cloth_img.src = "./image/cloth/20.png"
    addList(recommed_list[2]);
    $weather_description.innerText = "가벼운 소재라면 긴소매도 OK!"
  }else if(temp > 16){
    $cloth_img.src = "./image/cloth/17.png"
    addList(recommed_list[3]);
    $weather_description.innerText = "슬슬 쌀쌀하네요. 겉옷을 챙겨요!"
  }else if(temp > 11){
    $cloth_img.src = "./image/cloth/12.png"
    addList(recommed_list[4]);
    $weather_description.innerText = "간절기 시작! 일교차 조심하세요~"
  }else if(temp > 8){
    $cloth_img.src = "./image/cloth/9.png"
    addList(recommed_list[5]);
    $weather_description.innerText = "외투 착용은 필수! 코트의 계절~"
  }else if(temp > 4){
    $cloth_img.src = "./image/cloth/5.png"
    addList(recommed_list[6]);
    $weather_description.innerText = "멋부리기엔 좀 추워졌어요~ 따뜻하게 입어요!"
  }else{
    $cloth_img.src = "./image/cloth/4.png"
    addList(recommed_list[7]);
    $weather_description.innerText = "롱패딩 꺼내세요..."
  }
}

function addList(arr){
  $outfit_list.replaceChildren();
  for(let i = 0; i < arr.length; i++){
    const li = document.createElement("li");
    li.setAttribute('id', arr[i]);
    const textnode = document.createTextNode(arr[i]);
    li.appendChild(textnode);
    $outfit_list.appendChild(li);
  }
}

// 마지막 페이지에서는 스크롤 유도 아이콘 안보이게
let hidden_scrollicon = new IntersectionObserver((e) => {
  e.forEach(entry=>{
    if(entry.isIntersecting){
      $scroll_icon.style.display = "none";
    }else{
      $scroll_icon.style.display ="block";
    }
  })
});

function onCilck(){
  $loc_set.style.display ="block";
  $mask.style.display ="block";
}

function onClose(){
  $loc_set.style.display ="none";
  $mask.style.display ="none";
}



function initAutocomplete(){
  autocomplete = new google.maps.places.Autocomplete($loc_input,{
    types: ['establishment'],
    componentRestrictions: {'country':['kr']},
    fields: ['place_id', 'geometry', 'name']
  });
  $set_btn.addEventListener('click', onSet);
}

function onSet() {
  let place = autocomplete.getPlace();
  latitude = place.geometry.location.lat();
  longitude = place.geometry.location.lng();
  w_url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${w_apikey}&units=metric&lang=kr`;
  g_url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&location_type=ROOFTOP&result_type=street_address&language=ko&key=${g_apikey}`;
  getJSON(g_url,
    function (err, data) {
      if (err !== null) {
        alert('위치 정보가 없습니다. 에러코드:' + err);
      } else {
        const loc_a = data.results[0].address_components[2].long_name;
        const loc_b = data.results[0].address_components[1].long_name;
        $location.innerText = `${loc_a} ${loc_b}`;
      }
    });
  getJSON(w_url,
    function (err, data) {
      if (err !== null) {
        alert('날씨 정보가 없습니다. 에러코드:' + err);
      } else {
        getWeatherData(data);
        loadOver()
      }
    });
  $loc_input.value = "";
  onClose();
}

function shareLink(){
  const shareObject = {
    title: '오늘 뭐입지? 사이트',
    text: '실시간 기온별로 옷차림을 추천해드릴게요~',
    url: window.location.href,
  };
  if (navigator.share) { // Navigator를 지원하는 경우만 실행
    navigator
      .share(shareObject)
      .then(() => {
        // 정상 동작할 경우 실행
        console.log('공유하기 성공');
      })
      .catch((error) => {
        console.log('에러가 발생했습니다.');
      })
  } else { // navigator를 지원하지 않는 경우
    console.log('페이지 공유를 지원하지 않습니다.');
  }
}

function shareTwitter() {
  var sendText = "오늘 뭐입지? 실시간 기온별로 옷차림을 추천해드립니다!"; // 전달할 텍스트
  var sendUrl = window.location.href; // 전달할 URL
  window.open("https://twitter.com/intent/tweet?text=" + sendText + "&url=" + sendUrl);
}

function shareFacebook() {
  var sendUrl = window.location.href; // 전달할 URL
  window.open("http://www.facebook.com/sharer.php?u=" + sendUrl);
}


function loadScript(src, callback) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = callback;
  document.body.appendChild(script);
}

loadScript(
  `https://maps.googleapis.com/maps/api/js?key=${g_apikey}&libraries=places&callback=initAutocomplete`,
  () => {
    // 로드 완료 후 실행할 코드
    console.log('성공');
  }
);

// 날씨 정보 불러오는 동안 로딩
$html.style.overflow = 'hidden'; //로딩 중 스크롤 방지
loadlocation();

if(hours < 5 || hours > 19){
  darkmode();
}

hidden_scrollicon.observe($share_img);

$set_loc_btn[0].addEventListener('click', onCilck);
$set_loc_btn[1].addEventListener('click', onCilck);
$set_loc_btn[2].addEventListener('click', onCilck);

$mask.addEventListener('click', onClose);
$xbtn.addEventListener('click', onClose);