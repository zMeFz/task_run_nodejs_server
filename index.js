const app 		= require('express')()
const path 		= require('path')

const render 	= require('./render')
const run 		= require('./task_run')
const routes	= require('./routes')

const port 	= 3000

app.set('views', path.join(__dirname, 'src/jade'));
app.set('view engine', 'jade');

app.use(function (req, res, next) {
	console.log('Required: ' + req.url);
	next();
});

routes(app);

// app.use(function(req, res, next) {
// 	res.status(404);
// 	render('error', { subject: 'Page'}) (req, res);
// });

console.log("Server is listening at port", port)
app.listen(port)
