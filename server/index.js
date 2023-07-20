const express = require("express");
const mongoose = require('mongoose');
const fs = require("fs");
const https = require("https");
const apiRouter = require("./rotuers/router");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const mongoUrl = "mongodb+srv://tantan:tantantan@4350project.8t5onnr.mongodb.net/test";

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("Connected to database");
    const cors = require('cors');

    app.use(cors({
      origin: '*'
    }));
    const bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.get('/api/g', (req, res) => {
      res.send('Hello World!');
    });

    app.use('/api', apiRouter);

    // const options = {
    //   cert: fs.readFileSync('../ierg4350project_com.chained-2.crt'),
    //   key: fs.readFileSync('../4350key.pem')
    // };

    // https.createServer(options, app).listen(3001, () => {
    //   console.log("Server Started");
    // });
     app.listen(3001, () => {
      console.log("Server Started");
    });

  })
  .catch((e) => console.log(e));