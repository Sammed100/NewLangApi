require("dotenv").config();
const connection = require('./connection');
const express = require('express');
const morgan = require('morgan');
const moment = require('moment-timezone');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3002;

app.get('/api', async (req, res) => {
  try {
    const currentTimestamp1 = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss.SSS');
    console.log(`Current date and time: ${currentTimestamp1}`);

    const language = req.query.language;
    const time_stamp = req.query.time_stamp;

    const rows = await new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM data_table WHERE language='${language}' AND TIMESTAMP('${time_stamp}') < time_stamp`, (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
    console.log(rows);
    const currentTimestamp2 = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss.SSS');
    console.log(`Current date and time: ${currentTimestamp2}`);
    return res.send(rows);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});
app.post('/api', async (req, res) => {
  try {
    const dataArray = req.body; // Assuming dataArray is an array of objects

    const currentTimestamp = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
    const language = req.query.language;

    for (const data of dataArray) {
      const Data = [data.id, language, data.operation, currentTimestamp, data.word];

      await new Promise((resolve, reject) => {
        connection.query(`INSERT INTO data_table(id, language, operation, time_stamp, word) VALUES (?)`, [Data], (err, rows) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }

    return res.send(dataArray);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log('express server is running on port 3000');
});
