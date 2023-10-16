const express = require("express");
const router = express.Router();
const conn = require("../config/database");

// 재고량이 부족한 상품의 p_code가 저장되어있는 세션
// req.session.ShelfLowInventoryAlert

// 데이터 인지 여부 변수 선언
let isDataConnecting = false;

// 선반 기준 수량
const ShelfLowInventoryCnt = 3;

// 아두이노와의 통신 성공 여부 확인
router.get('/sendData', (req, res) => {
  if (isDataConnectiong) {
    res.send("<p>연결 중</p>")
  } else {
    res.send('<p>연결 끊김</p>')
  }
})

// 아두이노 데이터 처리
// 아두이노 => 서버
router.post('/sendData', (req, res) => {
  // 아두이노의 데이터 >> req.body
  const receiveSensorData = req.body;
  // console.log(receiveSensorData);
  const { store_code } = receiveSensorData;

  // 선반 재고량 부족한 목록을 저장하기 위한 빈 배열
  const ShelfLowInventory = [];

  receiveSensorData ? isDataConnectiong = true : isDataConnectiong = false;

  // 1) 데이터베이스 
  // 상품의 데이터를 가져오는 쿼리문
  const isSendProductDataSql = 'SELECT p_name, p_code, p_weight, p_cnt, shelf_loc FROM products WHERE store_code = ?'

  // 상품의 데이터를 데이터베이스에서 가져옴
  conn.query(isSendProductDataSql, [store_code], (err, row) => {
    // console.log("isSendProductDataSql row :", row)
    // console.log( "receiveSensorData :",receiveSensorData );
    for ( const productData of row){
      // console.log( "productData",productData );

      // productData는 상품의 정보
      const { p_name, p_code, p_weight, p_cnt, shelf_loc } = productData;
      // 선반의 현재 수량
      const isSensorCount = Math.round(receiveSensorData[shelf_loc] / p_weight)

      // 선반 수량과 DB의 수량이 다를 때 DB를 업데이트해주는 코드
      if (isSensorCount != p_cnt) {
        // 데이터베이스의 수량을 업데이트 해주는 쿼리문
        const isSendCountDataSql = 'UPDATE products SET p_cnt = ? WHERE store_code = ? AND shelf_loc = ?'

        conn.query(isSendCountDataSql, [isSensorCount, store_code, shelf_loc], (err, row) => {
          // console.log("isSendCountDataSql row:", row);
          if (row.affectedRows > 0) {
            console.log(store_code + ' 번 매장의 ' + p_name + ' 상품의 DB 수량 수정완료')
          } else {
            console.log(store_code + ' 번 매장의 ' + p_name + ' 상품의 DB 수량 수정실패')
          }
        })

        // DB의 출고량을 업데이트 해주는 코드
        // DB의 출고 데이터를 넣어주는 쿼리문
        const isSendShipmentDataSql = 'INSERT INTO shipments ( p_code, ship_type, ship_cnt ) VALUES ( ?, ?, ? )'
        // 입출고 타입 정의
        const ship_type = p_cnt - isSensorCount > 0 ? "O" : "I"
        
        conn.query(isSendShipmentDataSql, [p_code, ship_type, Math.abs(p_cnt - isSensorCount)], (err, row) => {
          // console.log("isSendShipmentDataSql row:", row);
          if (row.affectedRows > 0) {
            console.log(store_code + ' 번 매장의 ' + p_name + ' 상품의 출고 기록 성공')
          } else {
            console.log(store_code + ' 번 매장의 ' + p_name + ' 상품의 출고 기록 실패')
          }
        })
      }

      // 선반의 수량이 기준량 보다 작다면 p_code 추가
      if (isSensorCount <= ShelfLowInventoryCnt) {
        ShelfLowInventory.push(p_code)
      }
    }

    req.session.ShelfLowInventoryAlert = ShelfLowInventory;
    
    console.log('세션의 값:',req.session.ShelfLowInventoryAlert );
  })
})

module.exports = router;