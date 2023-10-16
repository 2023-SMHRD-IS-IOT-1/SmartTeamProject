const express = require("express");
const router = express.Router();
const app=express();

// 미들웨어
app.use((req,res)=>{
  res.locals.user = req.session.user;
  res.locals.store = req.session.store;
  console.log("회원 이름: ", res.locals.user.m_name);

})

// Main Page 열기
router.get("/", (req, res) => {
    res.render('index')
    // console.log("회원 이름: ", data.user.m_name);
  });
  


// 회원가입 Page 열기
router.get("/register", (req, res) => {
  res.render("register");
});

// 상품 관리 Page 열기
router.get("/itemmanage", (req, res) => {
  res.render("itemManage");
});


// 데이버 분석 Page 열기
router.get("/dataAnalysis",(req,res)=>{
  res.render("dataAnalysis")
})

//로그인하기
router.get("/login", (req, res) => {
  res.render("login");
});

//로그아웃하기
// router.get("/login", (req, res) => {
//   res.render("logout");
// });
//마이페이지
router.get("/myPage", (req, res) => {
  res.render("myPage");
});


// 리액트로 보낼 센서데이터 
let sendSensorData = undefined ;

// 아두이노 와이파이 테스트
// 아두이노 => 노드 
router.post('/arduinoData', ( req,res ) => { 
  // 아두이노의 데이터 >> req.body
  // sensorData 변수에 저장
  sendSensorData = req.body;
 } )

// 마이페이지
router.get('/myPage',(req,res) => {
  res.render("myPage")
})

// 회원가입하기
router.get('/register',(req,res) => {
  res.render("register")
})

module.exports = router;
