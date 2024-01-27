const mysql = require('mysql');

var connection = mysql.createConnection({
	host : 'localhost',
	database : 'report_itv1',
	user : 'root',
	password : ''
});


module.exports = connection;