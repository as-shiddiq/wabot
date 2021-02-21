let fs = require('fs');
let qrCode = require('qrcode');
const { Client } = require('whatsapp-web.js');

exports.scan = (req, res)=>{
	let client = new Client({ puppeteer: { headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox'] }});
	let no = req.query.no;
 	client.on('qr', async (qr) => {
     	var gambar = await qrCode.toDataURL(qr);
    	var body = "<center><img src='" + gambar + "'></img><br/>Silahkan scan qrcode ini dengan Whatsapp</center>";
   		res.send(body);
  	});
	client.on('authenticated', (session) => {
	    console.log('AUTHENTICATED', session);
	    // sessionCfg=session;
	    fs.writeFile('./session/'+no+'.json', JSON.stringify(session), function (err) {
	        if (err) {
	           fs.appendFile('./session/'+no+'.json', JSON.stringify(session), function (err) {
			  		if (err) throw err;
				  	console.log('Saved!');
					res.redirect('/wa/success');
				});
	        }
		});
	});
	// client.on('ready', () => {
	//    var body = "<center><h1>Berhasil terhubung</h1></center>";
	//    res.send(body);
	//    console.log('Client is ready!');
	// });


	client.initialize();

}

exports.send = (req, res)=>{
	let no = req.query.no;
	let to = req.query.to;
	let message = req.query.message;

	let sessionCfg;
	if (fs.existsSync('./session/'+no+'.json')) {
	    sessionCfg = require('../../session/'+no+'.json');
	}
	console.log(sessionCfg);
	let client = new Client({ puppeteer: { headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox'] }, session: sessionCfg});
	client.on('auth_failure', msg => {
	    // Fired if session restore was unsuccessfull
	    console.error('AUTHENTICATION FAILURE', msg);

		var body ='AUTHENTICATION FAILURE'+ msg;
		res.send(body);
	});

	client.on('ready', async () => {
		   	console.log('Client is ready!');
		   	let send = await client.sendMessage(to+'@c.us', message);
		   	console.log(send);
			var body = "Send!! to = "+to+", from="+no+", Message ="+message;
			res.send(body);
	});
	// fs.appendFile('./mynewfile1.json', '{Hello content!}', function (err) {
	// 	  		if (err) throw err;
	// 		  	console.log('Saved!');
	// 		    // res.redirect(app.get('siteUrl'));
	// 		});
	// res.redirect('/wa/success');
	client.initialize();

}

exports.success = (req, res)=>{
   var body = `<center><h1>Berhasil terhubung</h1></center>
   				gunakaan alamat <strong>?no=6283159236892&message=textcuk</strong>`;
   res.send(body);
}
exports.message = (req, res)=>{
	let no = req.query.no;
	let sessionCfg;
	if (fs.existsSync('./session/'+no+'.json')) {
	    sessionCfg = require('../../session/'+no+'.json');
	}
	console.log(sessionCfg);
	let client = new Client({ puppeteer: { headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox'] }, session: sessionCfg});

	client.on('message', message => {
		if(message.body === 'ping') {
			message.reply('sianjay');
			console.log(message);
		}
		else if(message.body === 'p') {
			message.reply('maok nyawa anjay!');
			console.log(message);
		}
	});


	client.initialize();

   var body = `<center><h1>Berhasil terhubung</h1></center>${no}`
   res.send(body);
}
