const express = require("express");
const router = express.Router();
const conn = require("../config/database");

// 데이터 인지 여부 변수 선언
let isDataConnecting = false;

// 아두이노 와이파이 테스트
// 아두이노 => 노드 
router.post('/sendData', (req, res) => {
  // 아두이노의 데이터 >> req.body
  receiveSensorData = req.body;
  // console.log(receiveSensorData);
  let { store_code, shelf_loc_1, shelf_loc_2, shelf_loc_3, shelf_loc_4, shelf_loc_5, shelf_loc_6, } = receiveSensorData;

  receiveSensorData ? isDataConnectiong = true : isDataConnectiong = false;

  // 1) 데이터베이스 
  // 내가 사용할 sql 쿼리문 작성
  let isSendProductDataSql = 'SELECT p_name, p_code, p_weight, p_cnt, shelf_loc FROM products WHERE store_code = ?'

  conn.query(isSendProductDataSql, [store_code], (err, row) => {
    // console.log("isSendProductDataSql row :", row)
    // console.log( "receiveSensorData :",receiveSensorData );
    // i 번의 개별 무게 : row[i].p_weight
    // i 번의 선반 위치 : row[i].shelf_loc

    // i 번의 선반 무게 : receiveSensorData[row[i].shelf_loc]
    // i 번의 DB에 저장된 수량 : row[i].p_cnt
    for (let i = 0; i < row.length; i++) {
            // row 는 DB에서 받아온 데이터
      let p_cnt = row[i].p_cnt
      let p_code = row[i].p_code
      let p_name = row[i].p_name
      let p_weight = row[i].p_weight
      let shelf_loc = row[i].shelf_loc
      let isSensorCount = Math.round(receiveSensorData[shelf_loc] / p_weight)
      // console.log("선반 무게 :", receiveSensorData[shelf_loc]);
      // console.log("개별 무게 :", p_weight);
      // console.log("선반 수량 :", isSensorCount);
      if (isSensorCount != p_cnt) {
        let isSendCountDataSql = 'UPDATE products SET p_cnt = ? WHERE store_code = ? AND shelf_loc = ?'
        conn.query(isSendCountDataSql, [isSensorCount, store_code, shelf_loc], (err, row) => {
          console.log("isSendCountDataSql row:", row);
          if (row.affectedRows > 0) {
            console.log(store_code + ' 번 매장의 ' + p_name + ' 상품의 DB 수량 수정완료')
          } else {
            console.log(store_code + ' 번 매장의 ' + p_name + ' 상품의 DB 수량 수정실패')
          }
        })
        // 출고 sql 정의
        let isSendShipmentDataSql = 'INSERT INTO shipments ( p_code, ship_type, ship_cnt ) VALUES ( ?, ?, ? )'
        // 입출고 타입 정의
        let ship_type = p_cnt - isSensorCount > 0 ? "O" : "I"

        conn.query(isSendShipmentDataSql, [p_code, ship_type, Math.abs(p_cnt - isSensorCount)], (err, row) => {
          console.log("isSendShipmentDataSql row:", row);
          if (row.affectedRows > 0) {
            console.log(store_code + ' 번 매장의 ' + p_name + ' 상품의 출고 기록 성공')
          } else {
            console.log(store_code + ' 번 매장의 ' + p_name + ' 상품의 출고 기록 실패')
          }
        })
      }
    }
  })
})

router.get('/sendData', (req, res) => {
  if (isDataConnecting) {
    res.send("<p>연결 중</p>")
  } else {
    res.send('<p>연결 끊김</p>')
  }
})

module.exports = router;