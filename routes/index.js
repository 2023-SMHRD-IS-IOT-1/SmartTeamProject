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
    if (req.session.user != undefined) {
        let sql_m = 'select * from members where m_id=? and m_pw=?'
        let sql_s = 'select * from stores where m_id=?'
        let sql_p = "select * from products where store_code=?"
        let sql_ship_week = 'SELECT SUM(ship_cnt) AS week_sum_ship_cnt FROM shipments WHERE p_code = ? AND ship_date >= DATE_ADD(CURDATE(), INTERVAL -7 DAY);'
        let sql_ship_month = 'SELECT SUM(ship_cnt) AS month_sum_ship_cnt FROM shipments WHERE p_code = ? AND ship_date >= DATE_ADD(CURDATE(), INTERVAL -30 DAY);'

        let m_id = req.session.user.m_id
        let m_pw = req.session.user.m_pw
        let data = {};
        conn.query(sql_m, [m_id, m_pw], (err, m_rows) => {
            req.session.user = m_rows[0];
            data.user = req.session.user
            console.log('메인화면/ 회원 세션: ', req.session.user);
            conn.query(sql_s, [m_id], (err, s_rows) => {
                if (s_rows.length > 0) {
                    req.session.store = s_rows[0];
                    data.store = req.session.store
                    console.log('메인화면/ 매장: ', req.session.store);
                    let store_code = req.session.store.store_code;
                    conn.query(sql_p, [store_code], (err, p_rows) => {
                        req.session.product = p_rows;
                        data.product = req.session.product
                        console.log('메인화면/ 상품: ', req.session.product);
                        for (const pData of p_rows) {
                            let p_code = pData.p_code;
                            conn.query(sql_ship_week, [p_code], (err, ship_rows_week) => {
                                req.session.shipment_week = ship_rows_week;
                                data.shipment_week = ship_rows_week;
                                console.log('메인화면/ 출고Week: ', req.session.shipment_week);
                                conn.query(sql_ship_month, [p_code], (err, ship_rows_month) => {
                                    req.session.shipment_month = ship_rows_month;
                                    data.shipment_month = ship_rows_month;
                                    console.log('메인화면/ 출고Month: ', req.session.shipment_month);
                                })
                            })
                        }
                        console.log("주간 매장 :", data.shipment_week);
                        console.log("월간 매장 :", data.shipment_month);
                        // console.log("index로 보내주는 데이터", data);
                        res.render('index', data);
                    })
                }
            })
        })




    }
    else {
        res.redirect("/login");
    }
})


// router.get("/", (req, res) => {
//   let sql_m = 'select * from members where m_id=? and m_pw=?'
//   let sql_s = 'select * from stores where m_id=?'
//   let sql_p = "select * from products where store_code=?"
//   let sql_ship = 'select * from shipments where p_code=?'
//   let m_id = req.session.user.m_id
//   let m_pw = req.session.user.m_pw
//   let data = {};

//   new Promise((resolve, reject) => {
//     conn.query(sql_m, [m_id, m_pw], (err, m_rows) => {
//       if (err) reject(err);
//       req.session.user = m_rows[0];
//       console.log('메인화면/ 회원 세션: ', req.session.user);
//       resolve();
//     });
//   })
//     .then(() => {
//       return new Promise((resolve, reject) => {
//         conn.query(sql_s, [m_id], (err, s_rows) => {
//           if (err) reject(err);
//           if (s_rows.length > 0) {
//             req.session.store = s_rows[0];
//             console.log('메인화면/ 매장: ', req.session.store);

//             let store_code = req.session.store.store_code;
//             conn.query(sql_p, [store_code], (err, p_rows) => {
//               if (err) reject(err);
//               req.session.product = p_rows;
//               console.log('메인화면/ 상품: ', req.session.product);

//               let promises = [];
//               for (let i = 0; i < p_rows.length; i++) {
//                 let p_code = p_rows[i].p_code;
//                 promises.push(new Promise((resolve, reject) => {
//                   conn.query(sql_ship, [p_code], (err, ship_rows) => {
//                     if (err) reject(err);
//                     resolve(ship_rows);
//                   });
//                 }));
//               }

//               Promise.all(promises)
//                 .then((shipments) => {
//                   data.user = req.session.user,
//                     data.store = req.session.store,
//                     data.product = req.session.product,
//                     data.shipment =shipments;
//                     console.log('메인화면/ 출고: ',shipments);
//                   resolve();
//                 })
//                 .catch((err) => reject(err));
//             });
//           }
//         });
//       });
//     })
//     .then(() => {
//       if (req.session.user != undefined) {
//         res.render('index', data);
//       } else {
//         res.redirect("/login");
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.send(`
//       <script>
//         alert('오류가 발생했습니다.');
//         location.href="/";
//       </script>
//     `);
//     });
// });

// router.get("/", async (req, res) => {
//   let sql_m = 'select * from members where m_id=? and m_pw=?';
//   let sql_s = 'select * from stores where m_id=?';
//   let sql_p = "select * from products where store_code=?";
//   let sql_ship = 'select * from shipments where p_code=?';
//   let m_id = req.session.user.m_id;
//   let m_pw = req.session.user.m_pw;

//   try {
//     const m_rows = await query(sql_m, [m_id, m_pw]);
//     req.session.user = m_rows[0];
//     console.log('메인화면/ 회원 세션: ', req.session.user);

//     const s_rows = await query(sql_s, [m_id]);
//     if (s_rows.length > 0) {
//       req.session.store = s_rows[0];
//       console.log('메인화면/ 매장: ', req.session.store);

//       let store_code = req.session.store.store_code;
//       const p_rows = await query(sql_p, [store_code]);
//       req.session.product = p_rows;
//       console.log('메인화면/ 상품: ', req.session.product);
//       let shipmentData = []; // 출고 정보를 저장할 배열

//       for (let i = 0; i < p_rows.length; i++) {
//         const p_code = p_rows[i].p_code;
//         const ship_rows = await query(sql_ship, [p_code]);
//         shipmentData.push(ship_rows); // 각 상품의 출고 정보를 배열에 추가
//         console.log('메인화면/ 출고: ', ship_rows);
//       }

//       req.session.shipment = shipmentData; // 모든 출고 정보를 세션에 할당

//     }
//   } catch (err) {
//     console.error(err);
//   }

// 이제 모든 데이터를 사용하여 다음 작업을 수행하거나 응답을 보낼 수 있습니다.
//   const data = {
//     user: req.session.user,
//     store: req.session.store,
//     product: req.session.product,
//     shipment: req.session.shipment
//   };
//   res.render("index", data);
// });

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