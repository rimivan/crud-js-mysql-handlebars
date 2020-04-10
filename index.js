//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express();

//Create Connection
const conn = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'sequelize-db'
});

//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});

//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));

//route for homepage
app.get('/',(req, res) => {
  let sql = "SELECT * FROM person";
  console.log("Query GET --> ", sql);
  let query = conn.query(sql, (err, results) => {
    console.log(results);
    if(err) throw err;
    res.render('person_view',{
      results: results
    });
  });
});

//route for insert data
app.post('/save',(req, res) => {
  let data = {name: req.body.name, lastname: req.body.lastname};
  let sql = "INSERT INTO person SET ?";
  console.log("Query INSERT --> ", sql);
  let query = conn.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

//route for update data
app.post('/update',(req, res) => {
    console.log("REQ NAME --> ", req.body.name);
    console.log("REQ LASTNAME --> ", req.body.lastname);
    console.log("REQ ID --> ", req.body.id);
    
    let sql = "UPDATE person SET name='"+req.body.name+"', lastname='"+req.body.lastname+"' WHERE id='"+req.body.id+"'";
    console.log("Query UPDATE --> ", sql);
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

//route for delete data
app.post('/delete',(req, res) => {
    let sql = "DELETE FROM person WHERE id='"+req.body.id+"'";
    console.log("Query DELETE --> ", sql);
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

//server listening
app.listen(8001, () => {
  console.log('Server is running at port 8001!');
});
