const fs = require('fs');
const { Client } = require('whatsapp-web.js');

const client = new Client();
const qrCode = require('qrcode');

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
  client.on('qr', async (qr) => {
     // Generate and scan this code with your phone
     var gambar = await qrCode.toDataURL(qr);
     // console.log(gambar);
    var body = "<center><img src='" + gambar + "'></img><br/>Silahkan scan qrcode ini dengan Whatsapp</center>";
    response.send(body);
  });

  client.on('ready', () => {
       var body = "<center><h1>Berhasil terhubung</h1></center>";
       response.send(body);
       console.log('Client is ready!');
  });

});
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://www.civimechengineering.com');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


client.on('message', message => {
 if(message.body === 'ping') {
   message.reply('sianjay');
 }
});

client.initialize();

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
