const express = require("express");
const { route } = require("../../Project_File copy/routes");
const router = express.Router();

// Main Page 열기
router.get("/", (req, res) => {
  // template engine안에서 내가 원하는 데이터를 사용하고 싶으면?
  // res.render("파일명", {속성: 보낼 데이터});
  res.render('index', {obj: req.session.user})
  // => index라는 파일 안에서 obj라는 변수이름으로 해당 값을 사용하겠다는 의미
  //index안에는 banner, mypage, layout이 포함
});

// 회원가입 Page 열기
router.get("/join", (req, res) => {
  res.render("join");
});

// 상품 관리 Page 열기
router.get("/itemmanage", (req, res) => {
  res.render("itemManage");
});


// 데이버 분석 Page 열기
router.get("/dataAnalysis",(req,res)=>{
  res.render("dataAnalysis")
})

// 로그인하기
router.get("/login", (req, res) => {
  res.render("login");
});

// 로그아웃하기
router.get("/logout", (req, res) => {
  res.render("logout");
});


// 회원가입하기
router.get('/register',(req,res) => {
  res.render("register")
})

module.exports = router;
