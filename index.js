
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var MONGODB_URI = process.env.MONGOLAB_URI;

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(function (req, res) {
	MongoClient.connect(MONGODB_URI, function (err, db) {
		if (err) {
			res.end("Error connecting to Mong0DB: " + err.message);
		} else {
			res.end("Connected to MongoDB");
		}
		db.close();
	});
});

app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});
