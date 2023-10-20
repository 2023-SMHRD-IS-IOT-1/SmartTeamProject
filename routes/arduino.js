const express = require("express");
const router = express.Router();
const conn = require("../config/database");

// 데이터 인지 여부 변수 선언
let isDataConnecting = false;

// 아두이노와의 통신 성공 여부 확인
router.get('/sendData', (req, res) => {
  if (isDataConnecting) {
    res.send("<p>연결 중</p>")
  } else {
    res.send('<p>연결 끊김</p>')
  }
})



// 아두이노 데이터 처리
// 아두이노 => 서버
router.post('/sendData', async (req, res) => {
  // 아두이노의 데이터 >> req.body
  const receiveSensorData = req.body;
  // console.log("arduino.js - receiveSensorData :", receiveSensorData);
  // receiveSensorData = { store_code: '1', A: '3198' ,B: '3198'}
  const { store_code } = receiveSensorData;

  // receiveSensorData의 총 개수가 1개 초과면 코드 실행 
  if (Object.keys(receiveSensorData).length > 1) {
    // 받아온 선반만 검색하기 위한 배열 저장
    const SensorDataKeys = [receiveSensorData.store_code, ...Object.keys(receiveSensorData)];
    // 예시 ) SensorDataKeys = [1, 'A', 'B' ]
    // console.log( SensorDataKeys ) 

    receiveSensorData ? isDataConnecting = true : isDataConnecting = false;

    // 데이터베이스 연동
    // 받아온 선반의 상품의 데이터를 가져오는 쿼리문
    const SelectPDataSql = generateDynamicQuery(SensorDataKeys);
    // console.log(SelectPDataSql)
    try {
      const isStoreProductData = await queryAsync(conn, SelectPDataSql, [...SensorDataKeys]);
      // const { p_name, p_code, p_weight, p_cnt, shelf_loc } = pData;
      for (const pData of isStoreProductData) {
        /* 예시) pData = {
          p_name: 'p_name 2',
          p_code: 2,
          p_weight: 100,
          p_cnt: 4,
          shelf_loc: 'shelf_loc_2'
        } */
        const { p_weight, shelf_loc } = pData;
        // 선반의 현재 수량
        const isSensorCount = Math.round(parseInt(receiveSensorData[shelf_loc]) / p_weight)
        // console.log( "isSensorCount-1 :", isSensorCount ) 
        pData.isSensorCount = isSensorCount;
      }

      for (const pData of isStoreProductData) {
        const { p_name, p_code, p_cnt, shelf_loc, isSensorCount } = pData;
        // console.log( "isSensorCount-2 :",isSensorCount ) 
        if (isSensorCount != p_cnt) {
          // DB의 수량을 업데이트 해주는 쿼리문
          const isSendCountDataSql = 'UPDATE products SET p_cnt = ? WHERE ( store_code = ? AND shelf_loc = ?)'
          const SendCountData = await queryAsync(conn, isSendCountDataSql, [isSensorCount, store_code, shelf_loc]);
          // console.log("ardunio.js - SendCountData :", SendCountData)
          if (SendCountData.affectedRows > 0) {
            console.log(store_code + ' 번 매장의 ' + p_name + ' 상품의 DB 수량 수정완료')
          } else {
            console.log(store_code + ' 번 매장의 ' + p_name + ' 상품의 DB 수량 수정실패')
          }

          // DB의 출고 데이터를 넣어주는 쿼리문
          const isSendShipmentDataSql = 'INSERT INTO shipments ( p_code, ship_type, ship_cnt ) VALUES ( ?, ?, ? )'
          // 입출고 타입 정의
          const ship_type = p_cnt - isSensorCount > 0 ? "O" : "I"
          const SendShipmentData = await queryAsync(conn, isSendShipmentDataSql, [p_code, ship_type, Math.abs(p_cnt - isSensorCount)]);
          // console.log("ardunio.js - SendShipmentData :", SendShipmentData)
          if (SendShipmentData.affectedRows > 0) {
            console.log(store_code + ' 번 매장의 ' + p_name + ' 상품의 출고 기록 성공')
          } else {
            console.log(store_code + ' 번 매장의 ' + p_name + ' 상품의 출고 기록 실패')
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
})

// 쿼리문 생성기
function generateDynamicQuery(sensorDataKeys) {
  const SelectPDataSql = 'SELECT p_name, p_code, p_weight, p_cnt, shelf_loc FROM products WHERE store_code = ? AND shelf_loc in '

  if (!Array.isArray(sensorDataKeys)) {
    throw new Error('generateDynamicQuery 함수 오류');
  }

  const inClause = Array(sensorDataKeys.length - 1).fill('?').join(', ');

  const dynamicQuery = `${SelectPDataSql} (${inClause})`;
  return dynamicQuery;
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

module.exports = router;