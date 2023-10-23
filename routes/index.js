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
const http = require('http');

// Main Page 열기
router.get("/", async (req, res) => {
  if (req.session.user != undefined || req.session.store != undefined) {
    let sql_p = "select * from products where store_code=?"
    let sql_ship_week = `SELECT products.p_code, products.p_name, 
                            SUM(shipments.ship_cnt) AS week_sum_ship_cnt
                        FROM products
                        JOIN shipments ON products.p_code = shipments.p_code
                        WHERE shipments.ship_date >= DATE_ADD(CURDATE(), INTERVAL -7 DAY) AND products.p_code = ? AND shipments.ship_type = 'O'
                        GROUP BY products.p_code, products.p_name;`
    let sql_ship_month = `SELECT SUM(ship_cnt) AS month_sum_ship_cnt, p_code 
                          FROM shipments 
                          WHERE p_code = ? AND ship_date >= DATE_ADD(CURDATE(), INTERVAL -30 DAY) AND shipments.ship_type = 'O';`


    let { store_code } = req.session.store
    let data = {
      user: req.session.user,
      store: req.session.store
    };
    try {
      const p_rows = await queryAsync(conn, sql_p, [store_code]);
      p_rows.sort((a, b) => (a.shelf_loc > b.shelf_loc) ? 1 : -1);
      req.session.product = p_rows;
      data.product = p_rows;
      // console.log('메인화면/ 상품: ', req.session.product);
      data.shipment_week = [];
      data.shipment_month = [];
      data.shipment_time = [];

      const shipWeekPromises = p_rows.map(async (pData) => {
        let p_code = pData.p_code;
        const ship_rows_week = await queryAsync(conn, sql_ship_week, [p_code]);
        data.shipment_week.push(ship_rows_week[0]);
        // console.log('메인화면/ 출고Week: ', shipment_week);
      });
      const shipMonthPromises = p_rows.map(async (pData) => {
        let p_code = pData.p_code;
        const ship_rows_month = await queryAsync(conn, sql_ship_month, [p_code]);
        data.shipment_month.push(ship_rows_month[0]);
        // console.log('메인화면/ 출고Month: ', shipment_month);
      });

      console.log('p_row: ', p_rows);

      await Promise.all([...shipWeekPromises, ...shipMonthPromises]);
      // console.log("주간 매장 :", data.shipment_week);
      // console.log("월간 매장 :", data.shipment_month);
      console.log("index로 보내주는 데이터", data);
      req.session.shipment_week = data.shipment_week;
      req.session.shipment_month = data.shipment_month;
      res.render('index', data);
    } catch (err) {
      console.error(err);
    }
  } else {
    res.redirect("/login");
  }
});

// 원그래프
router.get("/piechart", async (req, res) => {
  if (req.session.store != undefined) {
    let sql_p = "select * from products where store_code=?";
    let store_code = req.session.store.store_code;
    let shipment_week_n = [];
    let shipment_week_d = [];
    const p_rows = await queryAsync(conn, sql_p, [store_code]);

    for (let i = 0; i < p_rows.length; i++) {
      let p_code = p_rows[i].p_code;
      let sql_ship_week = `
      SELECT products.p_name, SUM(shipments.ship_cnt) AS week_sum_ship_cnt
      FROM products
      JOIN shipments ON products.p_code = shipments.p_code
      WHERE shipments.ship_date >= DATE_ADD(CURDATE(), INTERVAL -7 DAY)
      AND products.p_code = ? AND shipments.ship_type = 'O'
      GROUP BY products.p_name;
    `;

      const ship_rows_week = await queryAsync(conn, sql_ship_week, [p_code]);
      console.log("ship_rows_week: ", ship_rows_week);
      for (let j = 0; j < ship_rows_week.length; j++) {
        shipment_week_n.push(ship_rows_week[j].p_name);
        shipment_week_d.push(ship_rows_week[j].week_sum_ship_cnt);
      }
    }
    console.log("shipment_week_n:", shipment_week_n);
    console.log("shipment_week_d:", shipment_week_d);
    const data = {
      ship_rows_week_n: shipment_week_n,
      shipment_week_d: shipment_week_d
    };

    res.json(data);
  }
});
// console.log( "index.js 차트용 : ",req.session.shipment_week ) 

// 꺾은선 그래프
router.get("/getshipment", async (req, res) => {
  if (req.session.store != undefined) {
  let store_code = req.session.store.store_code;
  let sql_ship_time = `SELECT
                  time_intervals.time_interval,
                  COALESCE(SUM(shipments.ship_cnt), 0) AS total_sales
              FROM (
                  SELECT '00:00 - 03:59' AS time_interval
                  UNION SELECT '04:00 - 07:59'
                  UNION SELECT '8:00 - 11:59'
                  UNION SELECT '12:00 - 15:59'
                  UNION SELECT '16:00 - 19:59'
                  UNION SELECT '20:00 - 23:59'
              ) AS time_intervals
              LEFT JOIN (
                  SELECT
                      CASE
                          WHEN HOUR(ship_date) BETWEEN 0 AND 3 THEN '00:00 - 03:59'
                          WHEN HOUR(ship_date) BETWEEN 4 AND 7 THEN '04:00 - 07:59'
                          WHEN HOUR(ship_date) BETWEEN 8 AND 11 THEN '8:00 - 11:59'
                          WHEN HOUR(ship_date) BETWEEN 12 AND 15 THEN '12:00 - 15:59'
                          WHEN HOUR(ship_date) BETWEEN 16 AND 19 THEN '16:00 - 19:59'
                          WHEN HOUR(ship_date) BETWEEN 20 AND 23 THEN '20:00 - 23:59'
                      END AS time_interval,
                      COALESCE(ship_cnt, 0) AS ship_cnt
                  FROM shipments
                  WHERE DATE(ship_date) = CURDATE()
                  AND p_code IN (select p_code from products where store_code= ? )
                  AND ship_type = 'O'
              ) AS shipments
              ON time_intervals.time_interval = shipments.time_interval
              GROUP BY time_intervals.time_interval
              ORDER BY
                  CASE
                      WHEN time_intervals.time_interval = '00:00 - 03:59' THEN 1
                      WHEN time_intervals.time_interval = '04:00 - 07:59' THEN 2
                      WHEN time_intervals.time_interval = '8:00 - 11:59' THEN 3
                      WHEN time_intervals.time_interval = '12:00 - 15:59' THEN 4
                      WHEN time_intervals.time_interval = '16:00 - 19:59' THEN 5
                      WHEN time_intervals.time_interval = '20:00 - 23:59' THEN 6
                  END;`
  const ship_rows_time = await queryAsync(conn, sql_ship_time, [store_code]);
  let ship_rows_time_list = []
  for (let i = 0; i < ship_rows_time.length; i++) {
    ship_rows_time_list.push(ship_rows_time[i].total_sales)
  }
  res.json(ship_rows_time_list);
}
})

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
  if (req.session.user != undefined || req.session.store != undefined) {

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
  if (req.session.user != undefined || req.session.store != undefined) {

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



module.exports = router;