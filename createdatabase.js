const MongoClient = require("mongodb").MongoClient;

// const url = 'mongodb://gq-user:hanoi@node14624-geo-quiz.us.reclaim.cloud/geoquiz';
const url = "mongodb://127.0.0.1:27017/geoquiz";
const dbName = "geoquiz";
var bcrypt = require("bcrypt");
var data = require("./data/countryDatabase.json");
var userData = require("./data/userDatabase.json");
// var User = require('./models/user.model.js');

MongoClient.connect(url, async function DBConnectHandler(err, client) {
	if (err) {
		console.log("Error Connecting");
		console.log(err);
		throw err;
	}
	console.log("Connected");
	const db = client.db(dbName);
	//Initialize countries
	db.collection("countries").insertMany(
		data["features"],
		function InsertHandler(err, res) {
			if (err) {
				console.log("Error Inserting data");
				console.log(err);
				throw err;
			}
			console.log(res);
			client.close();
		}
	);

	//Initialize Users
	var firstUser = userData[0];
	let hash = bcrypt.hashSync(firstUser.password, 10);
	firstUser.password = hash;

	db.collection("users").insertOne(firstUser, function InsertHandler(err, res) {
		if (err) {
			console.log("Error Inserting User data");
			console.log(err);
			throw err;
		}
		console.log(res);
		client.close();
	});
});

/***********
Whenever we are retrieving from the database we must create an object in such
a way that OL will be able to reconstruct
var map;
map["type"] = "FeatureCollection";
map["features"] = The array of data that we retrieve from the database
then we send map to OL as a JSON

accessing the features from a continent:
db.countries.find({ "properties.continent" : "africa"})


***********/

/*
console.log(data["features"]);

var countriesFeatures = data["features"];
for (var i in countriesFeatures)
    console.log(countriesFeatures[i]["properties"]["name"]);
*/
