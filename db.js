//var mysql = require('mysql');
var mysql = require('promise-mysql');

/*con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "iws123#",
  database: "bodyscanapp_db"
});

con.connect(function(err){
  if (err) throw err;
  console.log("Connected!");
}); */

con = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'iws123#',
  database: 'bodyscanapp_db',
  connectionLimit: 10
});