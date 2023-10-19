const express = require("express");
const app = express();

// Express 앱을 HTTP 서버로 래핑
const http = require('http').createServer(app);
// HTTP 서버를 Socket.IO 서버로 래핑
const io = require('socket.io')(http, {
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

// Nunjucks 템플릿 설정
nunjucks.configure("views", {
  express: app,
  watch: true,
});

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

// 세션 설정
/* app.use(
  session({
    saveUninitialized: false,
    httpOnly: true,
    resave: false,
    secret: "secret",
    store: new fileStore(),
  })
); */

const sessionMiddleware = session({
  saveUninitialized: true,
  resave: false,
  secret: "secret"
})

app.use(sessionMiddleware);

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/arduino", arduinoRouter);


// ---------------- 웹 소켓 구현 파트 -----------------------------------
// 알림 기준 재고량 
const stockAlertOption = 3;
// 연결된 클라이언트 저장
const connectedClients = {};
// 연결된 클라이언트에 따른 setInterval 저장
const socketTimers = {};

// 세션 연결
io.engine.use(sessionMiddleware)

// 클라이언트 연결 시
io.on("connection", (socket) => {
  console.log("소켓 ID :", socket.id, "클라이언트가 연결되었습니다.");

  // 세션 접속
  const session = socket.request.session;
  const {store_code} = session.store || {};
  console.log("server.js - store_code :", store_code)

  // 클라이언트 연결 시 소켓을 저장
  connectedClients[socket.id] = socket;

  // 클라이언트로부터 메시지를 받았을 때 처리
  /* socket.on("message", (data) => {
    console.log("클라이언트가 주는 메시지:", data);

    // 클라이언트로 응답 보내기
    socket.emit("response", "hello");
  }); */


  socket.on("disconnect", () => {
    console.log("클라이언트 연결 종료:", socket.id);

    // 소켓 ID에 연결된 타이머 중지
    if (socketTimers[socket.id]) {
      clearInterval(socketTimers[socket.id]);
      delete socketTimers[socket.id];
    }

    // 클라이언트 연결 종료 시 소켓을 제거
    delete connectedClients[socket.id];
  });

  let isSendingData = false; // 데이터를 보내는 동안 true로 설정

  function sendStock() {
    if (isSendingData) {
      // 데이터를 보내는 중이라면 다음 호출을 기다립니다.
      return;
    }

    isSendingData = true; // 데이터 보내는 중으로 표시

    const isPStockSql = 'select * from products where store_code = ? and p_cnt <= ?'
    conn.query(isPStockSql, [store_code,stockAlertOption], (err, row) => {
      console.log("소켓 ID :", socket.id, "row.length :", row.length)

      // 클라이언트로 데이터를 보내기
      socket.emit("lowStock", row.length);

      isSendingData = false; // 데이터 보내기 완료로 표시
    })
  }

  // Intervaltime에 정의된 주기마다 갱신
  if (store_code != undefined) {
    const timerId = setInterval(sendStock, 5000);
    socketTimers[socket.id] = timerId;
  }
});

// ---------------- 웹 소켓 구현 파트 끝 -----------------------------------


http.listen(app.get("port"), () => {
  console.log(app.get("port") + "번 포트에서 대기 중..");
});
