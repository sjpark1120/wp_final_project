# 오늘뭐입지?(실시간 기온별 옷차림 추천사이트)
**웹프로그래밍 기말과제**
'오늘뭐입지'는 사용자가 현재 위치의 날씨(기온)에 따라 옷차림을 계획할 수 있도록 도와주는 웹 사이입니다. 사용자가 그날의 날씨에 맞는 옷을 입을 수 있도록 실시간 날씨와 의상 추천을 제공합니다.

+ link : https://weather-wear1120.netlify.app/

![image](https://github.com/sjpark1120/wp_final_project/assets/69676617/af6e1dd9-a3b3-425a-9bcc-9f784c478e12)
![image](https://github.com/sjpark1120/wp_final_project/assets/69676617/5849611b-659d-4097-803d-922731e5078e)

## 기능

- **위치 기반 날씨 데이터:** '오늘뭐입지'는 사용자의 현재 위치를 기준으로 실시간 날씨 정보를 가져옵니다.
- **옷차림 추천:** 현재 기온에 따라 적절한 옷차림을 추천해줍니다.
- **위치 설정:** Google Places API를 이용하여 주소를 자동완성하고 해당 주소의 위도와 경도를 가져옵니다. 이를 통해 현재 위치를 확인하고 날씨 정보를 가져옵니다.
- **방명록 기능:** 사용자들은 의견이나 소감을 남길 수 있는 방명록 기능을 이용할 수 있습니다. 이름, 비밀번호, 내용을 입력하여 방명록을 작성하고, 작성된 방명록은 서버에 저장됩니다.

## 사용 기술

- Front-end: HTML, CSS, JavaScript
- Back-end: Node.js, Express.js
- Weather API: [OpenWeatherMap](https://openweathermap.org/api)
- Location Information API: Places API, Geocoding API
