const express = require("express");
const app = express();

// Express 앱을 HTTP 서버로 래핑
const http = require('http').createServer(app);
// HTTP 서버를 Socket.IO 서버로 래핑
const io = require('socket.io')(http,{
  path: '/socket.io'
});

// 소켓에서 DB 통신을 위해
const conn = require("./config/database");

const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const session = require("express-session");
const fileStore = require("session-file-store")(session);

// 라우터 연결
const indexRouter = require("./routes");
const userRouter = require("./routes/user");
const arduinoRouter = require("./routes/arduino");


const cors = require("cors");

app.use(express.json());
app.use(cors());

app.set("port", process.env.PORT || 3333);
app.set("view engine", "html");

// 세션 설정
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// Nunjucks 템플릿 설정
nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.use(
  session({
    saveUninitialized:false,
    httpOnly: true,
    resave: false,
    secret: "secret",
    store: new fileStore(),
  })
);

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/arduino", arduinoRouter);

// 알림 기준 재고량 
const stockAlertOption = 3;

// 클라이언트 연결 시
io.on("connection", (socket) => {
  console.log("클라이언트가 연결되었습니다.");

  // 클라이언트로부터 메시지를 받았을 때 처리
  socket.on("message", (data) => {
    // console.log("클라이언트가 주는 메시지:", data);

    // 클라이언트로 응답 보내기
    // socket.emit("response", "hello");
  });

  function sendStock() {
    const isPStockSql = 'select * from products where store_code = 1 and p_cnt <= ?'
    conn.query(isPStockSql, [stockAlertOption],  ( err,row ) => { 
      // console.log( "row.length :", row.length ) 

      // 클라이언트로 데이터를 보내기
      socket.emit("lowStock", row.length);
    } )
  }
  // 1분마다 갱신
  setInterval(sendStock, 60000);
});

http.listen(app.get("port"), () => {
  console.log(app.get("port") + "번 포트에서 대기 중..");
});
