const mysql = require('mysql');

module.exports = ()=>{
	return mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '',
		port: 3306,
		database: 'chatorta'
	}, 'single');
}