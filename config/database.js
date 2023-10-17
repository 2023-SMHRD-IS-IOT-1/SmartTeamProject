// 외부 DB와 연결하려면 npm 모듈이 필요함 - mysql2
// 1) 설치 : npm i mysql2
// 2) require
const mysql = require("mysql2");

// 3) 나의 DB 정보 기재
let conn = mysql.createConnection({
  host: "project-db-campus.smhrd.com",
  user: "campus_23IS_IoT1_hack_3",
  password: "smhrd3",
  port: 3307,
  database: "campus_23IS_IoT1_hack_3"
});

conn.connect();

// const sql_p = 'select p_code, p_name, p_weight,p_cnt, p_category,shelf_loc from products where store_code=?';
// let store_code= req.session.store.store_code;

//  conn.query(sql_p,[store_code], (err,rows){
//   if(err) throw err;
//     console.error('값: ',rows);
//   })

module.exports = conn;
// 내 mysql 정보를 가지고 연결한 conn을 모듈화하겠다!
