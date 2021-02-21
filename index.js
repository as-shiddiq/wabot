const fs = require('fs');
const { Client } = require('whatsapp-web.js');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
// let sessionData;
// if(fs.existsSync(SESSION_FILE_PATH)) {
//     sessionData = require(SESSION_FILE_PATH);
//     if(JSON.stringify(sessionData)=='{}')
//     {
//     	sessionData = null
//     }
// }

// {session: sessionData}
// Use the saved values
const client = new Client();
const qrCode = require('qrcode');
const http = require('http');
const request = require('request');
// Save session values to the file upon successful auth

var server = http.createServer(function (req, res) {
 //    client.on('qr', async (qr) => {
 //    	// Generate and scan this code with your phone
 //     	var gambar = await qrCode.toDataURL(qr);
 //     	console.log(gambar);
	// 	var body = "<center><img src='" + gambar + "'></img><br/>Silahkan scan qrcode ini dengan Whatsapp</center>";
	    	
	//  	res.writeHead(200, {
	// 	    'Content-Length': body.length,
	// 	    'Content-Type': 'text/html',
	// 	    'Pesan-Header': 'Pengenalan Node.js'
	// 	});

	// 	res.write(body);
	// });

	// client.on('ready', () => {
 //       var body = "<center><h1>Berhasil terhubung</h1></center>";

 //       res.writeHead(200, {
 //           'Content-Length': body.length,
 //           'Content-Type': 'text/html',
 //           'Pesan-Header': 'Pengenalan Node.js'
 //       });

 //       res.write(body);
 //       console.log('Client is ready!');
	// });
	var body = "Si anjay";
	    	
	 	res.writeHead(200, {
		    'Content-Length': body.length,
		    'Content-Type': 'text/html',
		    'Pesan-Header': 'Pengenalan Node.js'
		});

		res.write(body);
	// client.on('authenticated', (session) => {
	//     console.log('AUTHENTICATED', session);
	//     sessionCfg=session;
	//     fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
	//         if (err) {
	//             console.error(err);
	//         }
	//     });
	// });

	// client.on('auth_failure', msg => {
	//     // Fired if session restore was unsuccessfull
	//     console.error('AUTHENTICATION FAILURE', msg);

	// });var http = require('http');
 
});

// client.on('message', message => {
// 	if(message.body === '!ping') {
// 		message.reply('sianjay');
// 	}
// 	else{
// 		message.reply(message.body);
// 	}
// });

// client.initialize();
server.listen(3000);


console.log("server running on http://localhost:3000");