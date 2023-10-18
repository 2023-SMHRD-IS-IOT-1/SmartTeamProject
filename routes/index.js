const express = require("express");
const router = express.Router();
const app = express();
const conn = require("../config/database");

// 미들웨어
/* app.use((req, res) => {
  res.locals.data = {
    user: req.session.user,
    store: req.session.store
  }
  // console.log("회원 이름: ", res.locals.user.m_name);
}) */

// Main Page 열기
router.get("/", (req, res) => {
  /* let sql_m = 'select * from members where m_id=? and m_pw=?'
  let sql_s = 'select * from stores where m_id=?'
  let sql_p = "select * from products where store_code=?"
  let sql_ship = 'select * from shipments where p_code=?'
  let m_id = req.session.user.m_id
  let m_pw = req.session.user.m_pw
  let data={};
  conn.query(sql_m, [m_id, m_pw], (err, m_rows) => {
    req.session.user = m_rows[0];
    console.log('메인화면/ 회원 세션: ', req.session.user);
    conn.query(sql_s, [m_id], (err, s_rows) => {
      if (s_rows.length > 0) {
        req.session.store = s_rows[0];
        console.log('메인화면/ 매장: ', req.session.store);

        let store_code = req.session.store.store_code;
        conn.query(sql_p, [store_code], (err, p_rows) => {
          req.session.product = p_rows;
          console.log('메인화면/ 상품: ', req.session.product);

          for (let i = 0; i < p_rows.length; i++) {
            let p_code = p_rows[i].p_code;
            conn.query(sql_ship, [p_code], (err, ship_rows) => {
              req.session.shipment = ship_rows;
              console.log('메인화면/ 출고: ', req.session.shipment);
              
                data.user= req.session.user,
                data.store= req.session.store,
                data.product= req.session.product,
                data.shipment= req.session.shipment
              
            })
          }
        })
      }
    })
  }) */

  if (req.session.user != undefined) {
    res.render('index', data);
  } else {
    res.redirect("/login");
  }
})

// 상품 입력 Page 열기
router.get("/itemManage", (req, res) => {

  const data = {
    user: req.session.user,
    store: req.session.store,
    product: req.session.product,
    ship: req.session.shipment
  }
  console.log(data);
  res.render("itemManage", data);
});

//마이페이지
router.get("/myPage", (req, res) => {
  const data = {
    user: req.session.user,
    store: req.session.store,
    product: req.session.product,
    ship: req.session.shipment
  }
  res.render("myPage", data);
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