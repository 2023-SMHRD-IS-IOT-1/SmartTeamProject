# SmartTeamProject
## 데이터베이스 정보
USER : campus_23IS_IoT1_hack_3  
PW : smhrd3  
서버종류 캠퍼스 mysql 8.0.26  
URL(호스트이름) project-db-campus.smhrd.com  
포트번호 3307  
DB 유저명  

# 수정 내역  
기본 틀  
10-00 00:00 오승헌 - 작업내용    
‼ 줄바꿈 하고 싶으면 문장 끝에 스페이스바 2번  

10-11 15:30 - 이다현 - 기본 틀 오류가 있어서 push 함  
10-11 18:00 - 이다현 - 회원가입 페이지 만들어 push 완료  
10-11 19:30 - 오승헌 - 아두이노 연결  
10-12 12:04 - 이다현 - 로그인~메인화면 경로 연결  
10-12 17:17 - 오승헌 - 아두이노 - 노드 노드 - 리액트 연결 완료  
10-13 12:08 - 오승헌 - 리액트 제거  
10-13 17:30 - 이다현 - 회원가입 DB 연동  
10-13 22:00 - 이다현 - 로그인 시 세션 저장  
10-15 17:30 - 이다현 - 회원가입 DB 연동  
10-16 11:30 - 이다현 - 로그인 레이아웃 연동  
10-16 17:00 - 이다현 - 상품 입력 페이지 DB 연동  
10-17 09:00 - 이다현 - 마이페이지 수정 DB 연동  
10-17 12:30 - 오승헌 - 실시간 재고량 알림 레이아웃 연동 

## 프로젝트명(팀명:NoPainGain)
팀명 : NoPainGain
## 👀 서비스 소개
서비스명 : 무게센서를 활용한 Iot 선반  
서비스 설명: 선반에 있는 물건의 무게를 측정하여 재고가 부족할 시 관리자에게 알림을 주고 데이터분석을 통해 시각적으로 제품의 판매량을 알려준다.
## 프로젝트 기간
2023.10.06 ~ 2023.10.24 (2주)
## 👍 주요기능
- 선반의 위치에 따른 재고 부족시 그 선반위치의 제품이 부족하다고 알림 
## 🔨 기술스택
<table>
  <tr>
    <th>구분</th>
    <th>내용</th>
  </tr>
  <tr>
    <td>Back-end</td>
    <td><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white"/>  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"/> </td>
  </tr>
    <tr>
    <td>Front-end</td>
    <td><img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white">  <img src="https://img.shields.io/badge/BootStrap-7952B3?style=for-the-badge&logo=BootStrap&logoColor=white"/>  <img src="https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=Chart.js&logoColor=white"/></td>
  </tr>
    <tr>
    <td>Data</td>
    <td><img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=black"></td>
  </tr>
    <tr>
    <td>Library & API</td>
    <td><img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white"></td>
  </tr>
  <tr>
    <td>IDE</td>
    <td><img src="https://img.shields.io/badge/Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white"/> <img src="https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=VisualStudioCode&logoColor=white"/> <img src="https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=Jupyter&logoColor=white"/> <img src="https://img.shields.io/badge/Anaconda-44A833?style=for-the-badge&logo=Anaconda&logoColor=white"/></td>
  </tr>
  <tr>
    <td>Etc.</td>
    <td><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white"/></td>
  </tr>
</table>

## ⚙ 시스템아키텍쳐

## 🖋 유스케이스
![image](https://github.com/2023-SMHRD-IS-IOT-1/SmartTeamProject/assets/146160350/fe6f11a5-4104-4915-9938-7a824ac97ab5)

## 🖋 서비스흐름도
![image](https://github.com/2023-SMHRD-IS-IOT-1/SmartTeamProject/assets/146160350/4e23a3ea-e74b-4ac6-8c55-6885d7cfdbde)

## 📈 ER 다이어그램
![스마트하조_231011_데이터 베이스 ERD](https://github.com/2023-SMHRD-IS-IOT-1/SmartTeamProject/assets/146160350/0079f915-dad0-4890-8d65-e5c17582885e)

## 🖥 화면구성
로그인 화면  
![로그인](https://github.com/2023-SMHRD-IS-IOT-1/SmartTeamProject/assets/146160350/94529e25-fa37-4924-bfce-9b5e891bc384)  

회원가입 화면  
![회원가입](https://github.com/2023-SMHRD-IS-IOT-1/SmartTeamProject/assets/146160350/5667c4e6-9756-43ae-94b0-322aa5abd9e2)  

메인화면  
![메인](https://github.com/2023-SMHRD-IS-IOT-1/SmartTeamProject/assets/146160350/9adf712c-f012-4a3e-8a6f-46d9d75cd23e)  

상품입력화면  
![상품입력](https://github.com/2023-SMHRD-IS-IOT-1/SmartTeamProject/assets/146160350/001940f8-da1c-45eb-bce5-87e53987fcf5)  

회원정보화면  
![회원정보](https://github.com/2023-SMHRD-IS-IOT-1/SmartTeamProject/assets/146160350/6915b420-d84b-492c-8a63-0a73f859d88d)  

## 👨‍👩‍👦‍👦 팀원역할


## 🎞 시연영상

## 🧾 참고문헌
[제안배경-유사제품]  
출처:  https://tagapro.com/project-post/shelfx/  
출처: https://www.sosit.kr/rfid-reader-etc/?idx=375  
{제안배경-시장분석]  
출처: https://www.sisajournal-e.com/news/articleView.html?idxno=301739  
출처: https://biz.chosun.com/site/data/html_dir/2019/09/09/2019090902000.html
