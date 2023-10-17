const express = require("express");
const router = express.Router();
const app = express();


// 미들웨어


app.use((req,res)=>{
  res.locals.data={
      user : req.session.user,
      store : req.session.store
  }
      // console.log("회원 이름: ", res.locals.user.m_name);

})

// 상품 정보 저장 되있는 세션 
req.session.product

// Main Page 열기
router.get("/", (req, res) => {
  const data = {
    user: req.session.user,
    store: req.session.store
  }
  

  res.render('index',  data);
  // console.log("회원 이름: ", res.locals.data.user.m_name);
})


// 상품 입력 Page 열기
router.get("/itemmanage", (req, res) => {
  const data = {
    user: req.session.user,
    store: req.session.store
  }
  res.render("itemManage", data);
});

//마이페이지
router.get("/myPage", (req, res) => {
  const data = {
    user: req.session.user,
    store: req.session.store
  }
  res.render("myPage",  data);
});


// 회원가입 Page 열기
router.get("/register", (req, res) => {
  res.render("register");
});

//로그인하기
router.get("/login", (req, res) => {
  res.render("login");
});



// 리액트로 보낼 센서데이터 
let sendSensorData = undefined;

// 아두이노 와이파이 테스트
// 아두이노 => 노드 
router.post('/arduinoData', (req, res) => {
  // 아두이노의 데이터 >> req.body
  // sensorData 변수에 저장
  sendSensorData = req.body;
})


module.exports = router;
