const express = require('express')
const fetch = require('node-fetch');
const fs = require('fs');
const { Client, LocalAuth  } = require('whatsapp-web.js');
let qrCode = require('qrcode');
const app = express()
const port = 5000
let client = [];
let apiUrl = 'http://wacoba.kodingakan.id/';

app.get('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html',
        'Pesan-Header': 'Scan QR'
    });
    let userNum = req.query.userNum;
    if(userNum==undefined)
    {
        res.send('Error');
    }
    else
    {
        if(req.query.reset=='true')
        {
            console.log('reset session-'+userNum);
            fs.rmSync('.wwebjs_auth/session-'+userNum, { recursive: true, force: true });
        }
        console.log(userNum);
        client[userNum] = new Client({ 
                            authStrategy: new LocalAuth ({clientId: userNum}),
                            puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
                    });

        client[userNum].initialize();
        client[userNum].on('qr', async (qr) => {
            console.log(qr);
            let gambar = await qrCode.toDataURL(qr);
            let body = `<center><img src="${gambar}"></img><br/>Silahkan scan qrcode ini dengan Whatsapp</center>`;
            res.write(body);
        });

        client[userNum].on('authenticated', () => {
            console.log(`AUTHENTICATED FOR ${userNum}`);
            res.write('Connected');
        });

        client[userNum].on('auth_failure', msg => {
            // Fired if session restore was unsuccessful
            console.error('AUTHENTICATION FAILURE', msg);
        });

        client[userNum].on('ready', async () => {
            console.log('READY');
            setInterval(async () =>{
                let get = await fetch(`${apiUrl}list.php?akun=${userNum}`);
                let resp = await get.json();
                console.log(resp);
                if(resp.status=='success')
                {
                    let data = resp.data;
                    client[userNum].sendMessage(data.dest+'@c.us', data.text);
                    //delete 
                    let del = await fetch(`${apiUrl}index.php?delete=${data.name}&akun=${userNum}`);
                    let respDel = await del.json();
                    console.log(respDel);
                }
            },5000);
        });

        client[userNum].on('message', async (msg) => {
            console.log(msg);
        });
    }

})


app.listen(port, () => {
  console.log(`Node app is running on port ${port}`);
});