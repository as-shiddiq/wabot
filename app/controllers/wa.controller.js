let fs = require('fs');
let qrCode = require('qrcode');
const { Client } = require('whatsapp-web.js');

exports.scan = (req, res, next)=>{
	let client = new Client({ puppeteer: { headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox'] }});
	let no = req.query.no;
	if(no!==undefined)
	{
		let nowQr = '';
	 	client.on('qr', async (qr) => {
	 		if(nowQr=='')
	 		{
	 			nowQr = qr;
		     	let gambar = await qrCode.toDataURL(qr);

			    let body = `<center><img src="${gambar}"></img><br/>Silahkan scan qrcode ini dengan Whatsapp</center>

			    	<script>
			    	setInterval(()=>{},5000)
			    	</script>
			    `;
			    res.writeHead(200, {
		            'Content-Type': 'text/html',
		            'Pesan-Header': 'Pengenalan Node.js'
		        });
		   		res.write(body);
	 		}
	  	});

		client.on('authenticated', (session) => {
		    console.log('AUTHENTICATED', session);
		    fs.writeFile('./sessions/'+no+'.json', JSON.stringify(session), function (err) {
		        console.log("saved");
		        if (err) 
		        {
		           fs.appendFile('./sessions/'+no+'.json', JSON.stringify(session), function (err) {
				  		if (err) throw err;
					  	console.log('Saved!');
					});  
		        }
		        else{
					res.write(`
			    	<script>
			    	alert('terhubung!');
			    	window.location.href = "/";
			    	</script>`);
		        }

			});
		});

		client.initialize();
	}
	else
	{
		res.status(500).json({ error: true,message : 'you must add your number phone on parameter, e.g (?no=628xxxxxx)' });
	}
}

exports.form = (req, res)=>{
	let body = `
	<div>
		<label>Nomor</label><br>
		<input type="text" name="no"><br>
		<label>Tujuan</label><br>
		<input type="text" name="to"><br>
		<label>Pesan</label><br>
		<textarea name="message"></textarea><br>
		<button type="button" name="kirim">Kirim Pesan</button>
	</div>

	<script>
	let kirim = document.querySelector('[name=kirim]');
	let no = document.querySelector('[name=no]');
	let to = document.querySelector('[name=to]');
	let message = document.querySelector('[name=message]');
	kirim.addEventListener('click',()=>{
		let q = '';
			q +='no='+no.value;
			q +='&to='+to.value;
			q +='&message='+message.value;
		fetch('/wa/send?'+q).then(res=>res.json())
		.then((res)=>{
			console.log(res);
			if(res.status==401)
			{
				alert(res.message);
		    	window.location.href = "/wa/scan?no="+no.value;
			}
			else
			{
				alert(res.message);
			}
		});
	});
	</script>
	`
	res.send(body);
}


exports.send = (req, res)=>{
	let no = req.query.no;
	let to = req.query.to;
	let message = req.query.message;
	if((no!=undefined && to!=undefined && message!=undefined)||(no!='' && to!='' && message!='') )
	{
		let sessionCfg;
		if (fs.existsSync('./sessions/'+no+'.json')) {
		    sessionCfg = require('../../sessions/'+no+'.json');
			console.log(sessionCfg);
			let client = new Client({ puppeteer: { headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox'] }, session: sessionCfg});
			client.on('auth_failure', msg => {
			    console.error('AUTHENTICATION FAILURE', msg);
				res.status(401).json({ status:401,error: true,message : `You't not logged! : ${msg}` });
				
			});

			client.on('ready', async () => {
				   	let send = await client.sendMessage(to+'@c.us', message);
				   	console.log(send);
					res.status(401).json({ status:200,error: false,message : `Messages success to, ${to}!` });
			});

			client.initialize();
		}
		else
		{
			res.status(401).json({ status:401,error: true,message : `You't not logged!` });
		}
	}
	else
	{
		res.status(500).json({status:500, error: true,message : 'you must add your number phone on parameter, e.g (?no=628xxxxxx)' });
	}

}

exports.success = (req, res)=>{
   var body = `<center><h1>Berhasil terhubung</h1></center>
   				gunakaan alamat <strong>?no=6283159236892&message=textcuk</strong>`;
   res.send(body);
}

exports.message = (req, res)=>{
	let no = req.query.no;
	let sessionCfg;
	if (fs.existsSync('./sessions/'+no+'.json')) {
	    sessionCfg = require('../../sessions/'+no+'.json');
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
