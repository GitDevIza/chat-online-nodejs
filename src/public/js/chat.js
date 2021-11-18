/*const socket = io();

//DOM Elements
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');

btn.addEventListener('click',function(){
	socket.emit('chat:message',{
		message: message.value,
		username : username.value
	});
});

socket.on('chat:message', function(data){
	actions.innerHTML = '';
	output.innerHTML += `<p>
	<strong> ${data.username} </strong>: ${data.message}
	</p>`;
});

message.addEventListener('keypress', function(){
	socket.emit('chat:typing', username.value);
});

socket.on('chat:typing', function(data){
	actions.innerHTML = `<p><em> ${data} is typing one message</em></p>`;
})*/

const ObjChat = {
	'socket': io(),
	'accessAdmin': [],
	'user_type':'',
	'clickp': (data, user) =>{
		ObjChat.socket.emit('old message user', data, (cb)=>{
			let myHTML = '';
			for (var i=0; i < cb.length; i++) {
				myHTML += '<b>'+ user +'</b>:'+ cb[i] +'</br>';
			};
			$("#chat").html(myHTML);
			$('#usser_recept').val(data);
		});
	},
	'oldUsers': (data)=>{
		let html ='';
		let ussers = Object.keys(data);
		for (var i=0; i < ussers.length ; i++) {
			html +=`<p class='userrecepter' onclick="ObjChat.clickpold('${data[ussers[i]]['id_sock']}','${ussers[i]}')"><i class="fas fa-user"></i> ${ussers[i]}</p>`;
		};
		$("#oldusernames").html(html);
	},
	'eachZone': (user) =>{
		$('.card-chat').each((index, domObj)=>{
			if(domObj.getAttribute('id').indexOf(user) == -1){
				$("#"+domObj.getAttribute('id')).addClass("hide");
			}else{
				$("#"+domObj.getAttribute('id')).removeClass("hide");
			}
		});
	},
	'userBoxMessage': (idbox,useremit,msg)=>{
		if(document.getElementById("chat-"+idbox)){
			$("chat-"+idbox).append('<b>'+ useremit +'</b>:'+ msg +'</br>');
		}else{
			$("#message-form").before(`<div id="chat-${idbox}" class="card-body card-chat hide"><b>${useremit}</b>:${msg}</br></div>`);
		}
	},
	'clickpold':(data, user) =>{
		ObjChat.socket.emit('old message user', data, (cb)=>{
			let myHTML = '';
			for (var i=0; i < cb.length; i++) {
				myHTML += '<b>'+ user +'</b>:'+ cb[i] +'</br>';
			};
			$("#chat").html(myHTML);
			$('#usser_recept').val('oldmsg');
		});
	},
	'displayOldMsg': (data) =>{
		$("#chat").append(`<p class="whisper"><b>${data.nick}</b>:${data.msg}</p>`);
	}
};

$(function(){
	//Obtaining DOM elements from the interface
	const $messageForm = $("#message-form");
	const $messageBox = $("#message");
	const $chat = $("#chat");

	//Obtaining DOM elements from the NicknameForm
	const $nickform = $('#nickform');
	const $nickError = $('#nickError');
	const $nickname = $('#nickname');

	const $users = $('#usernames');
	const $userrecept = $('#usser_recept');

	ObjChat.socket.emit('initial list', 'aqui-toy', (data) => {
		ObjChat.accessAdmin = data;
	});

	$nickname.keyup(() => {
		if( $nickname.val() == ObjChat.accessAdmin[0]['user']){
			$('#nickname').hide();
			$('#nickadmin').show();
			$('#password').show();
		} 
	});

	$nickform.submit( e =>{
		e.preventDefault();

		if($nickname.val() == ObjChat.accessAdmin[0]['user']){
			if($('#password').val() == ObjChat.accessAdmin[0]['password']){
				let dataUsers = {
					'user':  $('#nickname').val(),
					'nick': $('#nickadmin').val(),
					'password': $('#password').val()
				};
				ObjChat.socket.emit('admin access', dataUsers, (data)=>{
					ObjChat.oldUsers(data);
					ObjChat.user_type = 'administrador';
				});
					$nickname.val('');
					$('#nickadmin').val('');
					$('#password').val('');
					$('#nickWrap').hide();
					$('#contentWrap').show();
					$('#listusers').show();
					$userrecept.val('oldmsg');
			}else{
				$nickError.html(`
					<div class="alert alert-danger">
					This password is incorrect.
					</div>
					`);
			}
		}else{
			let messageAdmin ={
				'sss':'sss'

			}
			ObjChat.socket.emit('new user',$nickname.val(), (data)=>{
				if(data){
					$('#nickWrap').hide();
					$('#contentWrap').show();
				}else{
					$nickError.html(`
						<div class="alert alert-danger">
						That username already exists.
						</div>
						`);
				}
				$nickname.val('');

			});
		};

	});

	//events
	$messageForm.submit( e => {
		e.preventDefault();

		ObjChat.socket.emit('send message', $messageBox.val(), $userrecept.val());
		$messageBox.val('');

	});

	ObjChat.socket.on('new message', (data)=>{
		if(data.rct == "all"){
			$chat.append('<b>'+ data.nick +'</b>:'+ data.msg +'</br>');
		}else{
			ObjChat.userBoxMessage(data.rct,data.nick,data.msg);
		}
	});

	ObjChat.socket.on('usernames customer', (data, cb) =>{
		let html = '';
		let ussers = Object.keys(data);
		for(let i = 0; i < ussers.length; i++){
			html +=`<p class='userrecepter' onclick="ObjChat.clickp('${data[ussers[i]]}','${ussers[i]}')"><i class="fas fa-user"></i> ${ussers[i]}</p>`;
		}
		$users.html(html);
		cb('aqui-alfin');
	});

	/*socket.on('load old msgs', data =>{
		for(let i=0; i< data.length; i++){
			ObjChat.displayOldMsg(data[i]);
		}
	});*/

});