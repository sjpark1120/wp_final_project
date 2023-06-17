const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/')); 
const weather_apikey = process.env.weather_apikey;
const gps_apikey = process.env.gps_apikey;

const guestbookEntriesFile = __dirname + '/guestbook_entries.json';
let guestbookEntries = [];
try {
  const entriesData = fs.readFileSync(guestbookEntriesFile, 'utf8');
  guestbookEntries = JSON.parse(entriesData);
} catch (err) {
  console.error('Error loading guestbook entries:', err);
}

app.listen(8080, function(){
  console.log('listening on 8080');
});

app.post('/guestbook', (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  const password = req.body.password;
  const timestamp =new Date().getTime();

  guestbookEntries.push({ name, message, password, timestamp });
  fs.writeFile(guestbookEntriesFile, JSON.stringify(guestbookEntries), 'utf8', (err) => {
    if (err) {
      console.error('Error saving guestbook entries:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/guestbook');
  });
});

app.post('/guestbook/delete', (req, res) => {
  const entryIndex = req.body.index;
  const password = req.body.password;

  // 글 삭제시 패스워드 확인
  if (guestbookEntries[entryIndex] && guestbookEntries[entryIndex].password === password) {
    // guestbookEntries 에서 entry제거
    guestbookEntries.splice(entryIndex, 1);
    // Json에 삭제내용 반영
    fs.writeFileSync(guestbookEntriesFile, JSON.stringify(guestbookEntries));
    res.redirect('/guestbook');
  } else {//패스워드 틀린경우
    res.redirect('/guestbook?wrongPassword=true');
    return;
  }
});

app.get('/guestbook', (req, res) => {
  fs.readFile(__dirname + '/guestbook.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    // 방명록 변경
    const modifiedData = modifyGuestbookHTML(data, guestbookEntries);
    if (req.query.wrongPassword) {
      const finalData = modifiedData.replace('{{wrongPassword}}', 'true');
      res.send(finalData);
    }else{
      res.send(modifiedData);
    }
  });
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

//html에 적용
function modifyGuestbookHTML(data, entries) {
  const entriesHTML = entries
    .map((entry, index) => `<li>${entry.name} <span>${new Date(entry.timestamp).toLocaleString()}</span><hr> ${entry.message}<form action="/guestbook/delete" method="post" class="list"><input type="hidden" name="index" value="${index}"><input type="password" name="password" placeholder="Password"><button type="submit">삭제</button></form></li>`)
    .join('');
  const modifiedData = data.replace('{{entries}}', `${entriesHTML}`);

  return modifiedData;
}