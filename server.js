const express = require('express');
const app = express();

const path = require('path');

const bodyParser = require("body-parser");
const nunjucks = require("nunjucks");

const cors = require("cors");

app.set("port", process.env.PORT || 3333)

app.listen(app.get("port"),  (  ) => { 
  console.log( app.get("port"), "번 포트에서 대기 중" );
 } )