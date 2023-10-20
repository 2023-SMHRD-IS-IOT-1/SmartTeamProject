/*
✨세션 정리 (작성자: 이다현)
사용자 정보(members): user
매장 정보(stores): store
상품 정보(products): product
주간 출고량(week_sum_ship_cnt): shipment_week
주간 출고량(month_sum_ship_cnt): shipment_month
*/

const express = require("express");
const router = express.Router();
const app = express();
const conn = require("../config/database");

// Main Page 열기
router.get("/", async (req, res) => {
    if (req.session.user != undefined) {
        let sql_p = "select * from products where store_code=?"
        let sql_ship_week = 'SELECT SUM(ship_cnt) AS week_sum_ship_cnt, p_code FROM shipments WHERE p_code = ? AND ship_date >= DATE_ADD(CURDATE(), INTERVAL -7 DAY);'
        let sql_ship_month = 'SELECT SUM(ship_cnt) AS month_sum_ship_cnt, p_code FROM shipments WHERE p_code = ? AND ship_date >= DATE_ADD(CURDATE(), INTERVAL -30 DAY);'

        const { m_id, m_pw } = req.session.user
        let { store_code } = req.session.store
        let data = {
            user: req.session.user,
            store: req.session.store
        };
        try {
            const p_rows = await queryAsync(conn, sql_p, [store_code]);
            req.session.product = p_rows;
            data.product = p_rows;
            // console.log('메인화면/ 상품: ', req.session.product);
            data.shipment_week = [];
            data.shipment_month = [];

            const shipWeekPromises = p_rows.map(async (pData) => {
                let p_code = pData.p_code;
                const ship_rows_week = await queryAsync(conn, sql_ship_week, [p_code]);
                req.session.shipment_week = ship_rows_week;
                data.shipment_week.push(ship_rows_week[0]);
                // console.log('메인화면/ 출고Week: ', req.session.shipment_week);
            });
            const shipMonthPromises = p_rows.map(async (pData) => {
                let p_code = pData.p_code;
                const ship_rows_month = await queryAsync(conn, sql_ship_month, [p_code]);
                req.session.shipment_month = ship_rows_month;
                data.shipment_month.push(ship_rows_month[0]);
                // console.log('메인화면/ 출고Month: ', req.session.shipment_month);
            });

            await Promise.all([...shipWeekPromises, ...shipMonthPromises]);
            // console.log("주간 매장 :", data.shipment_week);
            // console.log("월간 매장 :", data.shipment_month);
            console.log("index로 보내주는 데이터", data);

            res.render('index', data);
        } catch (err) {
            console.error(err);
        }
    } else {
        res.redirect("/login");
    }
});

// 유틸리티 함수로 쿼리 실행을 Promise로 감싸기
function queryAsync(connection, sql, params) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// 유틸리티 함수로 쿼리 실행을 Promise로 감싸기
function queryAsync(connection, sql, params) {
  // 비동기 실행
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// 상품 입력 Page 열기
router.get("/itemManage", (req, res) => {
    if (req.session.user != undefined) {

        const data = {
            user: req.session.user,
            store: req.session.store,
            product: req.session.product,
            ship: req.session.shipment
        }
        console.log(data);
        res.render("itemManage", data);

    } else {
        res.redirect("/login");
    }
});

//마이페이지
router.get("/myPage", (req, res) => {
    if (req.session.user != undefined) {

        const data = {
            user: req.session.user,
            store: req.session.store,
            product: req.session.product,
            ship: req.session.shipment
        }
        res.render("myPage", data);
    } else {
        res.redirect("/login");
    }
});

// 회원가입 Page 열기
router.get("/register", (req, res) => {
  res.render("register");
});

//로그인하기
router.get("/login", (req, res) => {
  res.render("login");
});

// 차트 렌더용 
router.get("/piechart",  ( req,res ) => { 
  res.json(req.session.shipment_week)
  // console.log( "index.js 차트용 : ",req.session.shipment_week ) 
} )

module.exports = router;