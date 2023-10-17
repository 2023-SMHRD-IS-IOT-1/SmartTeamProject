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

<<<<<<< HEAD
// 상품 정보 저장 되있는 세션 
req.session.product

=======
>>>>>>> d9fb23db78c33552fe43a651f44b59dbddef4486
// Main Page 열기
router.get("/", (req, res) => {
  const data = {
    user: req.session.user,
    store: req.session.store
  }
<<<<<<< HEAD
  

  res.render('index',  data);
  // console.log("회원 이름: ", res.locals.data.user.m_name);
=======
  if ( req.session.user != undefined){
    res.render('index',  data);
  } else {
  res.redirect("/login");
  }
>>>>>>> d9fb23db78c33552fe43a651f44b59dbddef4486
})

// 상품 입력 Page 열기
router.get("/itemManage", (req, res) => {

  const data = {
    user: req.session.user,
    store: req.session.store,
    product : req.session.product
  }
  console.log(data);
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

module.exports = router;