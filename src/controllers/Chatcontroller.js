const dbConnection = require('../config/dbconnection');
const connection = dbConnection();
const Chatcontroller = {};

Chatcontroller.list = (req, res) =>{
	connection.query('SELECT * FROM user_admin', (err, data) =>{
		if(err){
			res(err);
		}
		if(data){
			res(data);
		}

	});
};

Chatcontroller.saved = (req, res) =>{
	connection.query('INSERT INTO user_controls SET ?', [req], (err, data) =>{
		if(err){
			res(err);
		}else if(data){
			res(data);
		}
	});
};

module.exports = Chatcontroller;