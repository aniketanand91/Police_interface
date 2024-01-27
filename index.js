const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
var con = require('./database');
const bcrypt = require('bcrypt');
const app = express();
var path=require('path');
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'login-credentials'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

con.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database with ID ' + con.threadId);
});

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.static('Assest'));

app.get('/', (req, res) => {
  res.render('login', { message: '' });
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
      if (results.length == 0 ) {
        res.render('login', { message: 'Invalid username or password' });
      } else {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/sample_data');
      }
      res.end();
    });
  } else {
    res.render('login', { message: 'Please enter both username and password' });
    res.end();
  }
});


app.get('/sample_data', (req, res) => {
  if (req.session.loggedin) {
    con.query('SELECT * FROM report_it ORDER BY report_no DESC', function(error, results, fields){
      if (error) throw error;
      // Render the dashboard.ejs template and pass the data to it
      res.render('sample_data', { users: results });
    });
  } else {
    res.redirect('/');
  }
});


app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});


app.listen(3000, () => {
  console.log('Server started on port 3000');
});