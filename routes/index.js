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
        let data = {user: req.session.user,
                    store: req.session.store};
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
// --------------------------------
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