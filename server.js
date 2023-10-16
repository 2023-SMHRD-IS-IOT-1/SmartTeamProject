const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");
const session = require("express-session");
const fileStore = require("session-file-store")(session);

// 라우터 연결
const indexRouter = require("./routes");
const userRouter = require("./routes/user");

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

app.listen(app.get("port"), () => {
  console.log(app.get("port") + "번 포트에서 대기 중..");
});
