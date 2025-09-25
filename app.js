const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const path = require("path");
//configuring the database
const dbConfig   =   { url: 'mongodb://gq-user:geoquiz2018@node15202-geoquiz-v2.wc.reclaim.cloud/geoquiz'};
// const dbConfig = { url: "mongodb://127.0.0.1:27017/geoquiz" };
const mongoose = require("mongoose");
const compression = require("compression");
// const https			 =	 require('https');
// const pm2   = require('pm2');
// const nodeMailer = require('nodemailer');
const port = 3000;

//var fs = require('fs');
// SSL Keys
// *********Setting up the credentials for the https server

// var privateKey = fs.readFileSync('___________.key');
// var certificate = fs.readFileSync('_.crt');
// var credentials = {key: privateKey, cert: certificate};
// *****************************************************************************

mongoose.Promise = global.Promise;

//connecting to the database
mongoose
	.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(function ConnectionHandler() {
		console.log("Connection successful");
	})
	.catch(function ExceptionHandler(err) {
		console.log("Could not connect to Mongo");
		console.log(err);
		process.exit();
	});

app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
	session({
		secret: "geoquiz",
		resave: false,
		saveUninitialized: true,
	})
);

//check for new changes before sending the cached version
app.set("etag", false);

var router = require("./routes/country.routes.js");
app.use(compression());

app.get("/favicon.ico", function (req, res) {
	res.status(204);
});

// let transporter = nodeMailer.createTransport({
//             host: 'smtp.gmail.com',
// 						port: 465,
// 						secure: true,
// 						//tls: true,
//             auth: {
//                 user: 'spu.etmhelp@gmail.com',
//                 pass: __________
//             }
//         });
//
//
// pm2.connect(function(err) {
// 	  if (err) {
// 			transporter.sendMail(mailOptions, function(error, info){
// 			    if(error){
// 			        return console.log(error);
// 			    }
// 			    console.log('Message sent: ' + info.response);
// 			});
// 		}
// 	  setTimeout(function worker() {
// 	    console.log("Restarting app...");
// 	    pm2.restart('app', function() {});
// 			transporter.sendMail(mailOptions, function(error, info){
// 					if(error){
// 							return console.log(error);
// 					}
// 					console.log('Message sent: ' + info.response);
// 			});
// 	    setTimeout(worker, 60000 * 60 *24 *7);
// 	  }, 60000 * 60 *24 *7);
// });

// app.use( function(req, res, next) {
// 	res.set('Cache-Control', 'no-cache');
//  next();
// });

//serve static files in a folder and cache six months
// app.use('/', express.static(path.join(__dirname,'views'),{
// 				maxAge: 2592000*2, //about a month *2
// 				etag: false
// 			}));

app.use("/", router);

//******** Create HTTPS server
//	var httpsServer = https.createServer(credentials, app);
// httpsServer.listen(3443);
// httpsServer.on('error', onError);
// httpsServer.on('listening', onListeningS);

//********Redirect http -> https
// app.use(function(req, res, next) {
//   if (req.secure){
// 		next();
// 	}
// 	else{
// 		res.redirect('https://'+req.headers.host +req.url);
// 	}
// });

app.listen(port, () => console.log(`Geoquiz app listening on port ${port}!`));
app.on("error", onError);
app.on("listening", onListening);

function onError(error) {
	if (error.syscall !== "listen") {
		throw error;
	}

	var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use");
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = httpServer.address();
	var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

	map = makeMap();
	console.log("Listening on " + bind);
}

function onListeningS() {
	var addr = httpsServer.address();
	var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
	console.log("Listening on " + bind);
}
