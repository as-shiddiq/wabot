const fs = require('fs');

// let client = new Client({ puppeteer: { headless: true,args: ['--no-sandbox', '--disable-setuid-sandbox'] }});
const SESSION_FILE_PATH = './session.json';
var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
app.set('siteUrl', 'http://localhost:5000');
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
 
  // client.on('ready', () => {
  //      var body = "<center><h1>Berhasil terhubung</h1></center>";
  //      response.send(body);
  //      console.log('Client is ready!');
  // });

});

require("./app/routes.js")(app);


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


// client.on('message', message => {
//  if(message.body === 'ping') {
//    message.reply('sianjay');
//  }
// });


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
