const address = require('address');
const mongoose = require('mongoose');
const Modelchat = require('./models/Modelchat');
const Chatcontroller = require('./controllers/Chatcontroller');

module.exports = function(io){

	let users = {};
	let userIp = {};
	let adminUser = {};
	let oldUsers = {};
	let adminData = {};

	io.on('connection', async socket => {
		console.log('new user connection', socket.id);

		Chatcontroller.list('', (res)=>{
			adminUser = res;
		});
		/* sql query functions */
		let messages = await Modelchat.find({});
		/* end sql query functions */
		socket.on('initial list', (data, cb) => { 
			cb(adminUser);
			console.log(data);
		});

		usersOld();

		function usersOld(){
			for (var i = 0; i < messages.length; i++) {
				if(messages[i]['nick'] in oldUsers){
					if(oldUsers[messages[i]['nick']]['id_sock'] != messages[i]['id_sock']){
						oldUsers[messages[i]['nick']] = messages[i];
					}
				}else{
					oldUsers[messages[i]['nick']] = messages[i];
				};
			};
		};
		//socket.emit('load old msgs', messages);

		socket.on('old message user', (data, cb) =>{
			let oldMsg =[];
			var a = 0;
			for (var i=0; i < messages.length; i++) {
				if(messages[i]['id_sock'] == data){
					oldMsg[a] = messages[i]['msg'];
					a++;
				}
			};
			cb(oldMsg);
		})

		/*if(address.ipv6() in users){
			var sock = socket.id;
		}*/

		socket.on('admin access', (data, cb) =>{
			saveUsers(data['nick'], 'administrador');
			cb(oldUsers);
		});

		socket.on('new user', (data, cb) =>{

			if(address.ipv6() in users){
				saveUsers(data, 'customer');
				cb(false);
			}else{
				cb(true);
				saveUsers(data, 'customer');
			}

			//console.log(users[address.ipv6()].nickname);

			//console.log(users);

			/*if(data in users){
				cb(false);
			}else{
				cb(true);
				socket.nickname = data;
				socket.ip = address.ip();
				socket.ipv6 = address.ipv6();
				users[socket.nickname] = socket;
				updateNicknames();
			}*/

		});

		socket.on('send message', async (data1,data2) => {

			const newMsg = new Modelchat({
					msg: data1,
					id_box: data2,
					type_user:'',
					nick: socket.nickname,
					id_sock: socket.id
				});

				console.log(newMsg);
				await newMsg.save();

			if(data2 != "all"){
				users[data2].emit('new message', {
					msg:data1,
					nick: socket.nickname,
					rct: data2
				});
			}else{
				io.sockets.emit('new message', {
					msg: data1,
					nick: socket.nickname,
					rct: data2
				});
			}

			console.log(data2);
		});

		socket.on('disconnect', data => {
			if(!socket.nickname){
				return;
			}else{
				delete users[socket.ipv6];
				delete userIp[socket.nickname];
				updateNicknames();
			}
		});

		function updateNicknames(){
			//let dataUs = Object.keys(users);
			let allUsers = {};
			let datauser = Object.keys(userIp);
			console.log(messages);
			for (var i=0; i < datauser.length; i++) {
				if(userIp[datauser[i]]['category'] = 'administrador'){
					adminData[i] = userIp[datauser[i]]['id'];
				}else{
					allUsers[datauser[i]] = userIp[datauser[i]]['id'];
				}
			};
			socket.emit('usernames customer', allUsers, (cb) =>{
				if(cb){
					io.sockets.emit()
				}
			});
			//console.log(Object.keys(users[Object.keys(users)]['nickname']));
		};

		function idAdmin(){
			if(adminData.length > 0){
				socket.emit('id admin customer', adminData[adminData.length -1]);
			}else{
				socket.emit('id admin customer','administrador');
			}
		}

		function saveUsers(user, type){
			socket.category = type;
			socket.nickname = user;
			socket.ip = address.ip();
			socket.ipv6 = address.ipv6();
			users[socket.id] = socket;
			userIp[socket.nickname] = socket;
			if(type == 'administrador'){
				updateNicknames();
			}else if (type == 'customer') {
				idAdmin();
			};
		};

	});
	
}

