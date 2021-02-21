module.exports = app => {
	const wa = require('./controllers/wa.controller.js');
	app.get('/wa/scan', wa.scan);
	app.get('/wa/send', wa.send);
	app.get('/wa/success', wa.success);
	app.get('/wa/message', wa.message);
}