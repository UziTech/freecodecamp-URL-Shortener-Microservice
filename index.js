var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var MONGODB_URI = process.env.MONGOLAB_URI || "mongodb://localhost:27017/testdb";
var PORT = (process.env.PORT || 5000);

var urls = null;

app.use(function (req, res) {
	var path = req.path.replace(/^\//, "");
	var isInt = !path.match(/\D/);
	var isUrl = !!path.match(/^https?:\/\//);

	if (path === "") {
		//TODO: show info
		res.json({error: "Invalid Parameters"});
	} else if (isInt) {
		urls.find({id: parseInt(path, 10)}).limit(1).next(function (err, results) {
			if (err) {
				return res.json({error: err});
			}
			if (results) {
				res.redirect(results.url);
			} else {
				res.json({error: "No url with that id"});
			}
		});
	} else if (isUrl) {
		urls.find({url: path}).limit(1).next(function (err, results) {
			if (err) {
				return res.json({error: err});
			}
			if (results) {
				res.json({id: results.id});
			} else {
				urls.findOneAndUpdate({maxid: {$exists: true}}, {$inc: {maxid: 1}}, {upsert: true, returnOriginal: false})
					.then(function (results) {
						var id = results.value.maxid;
						urls.insertOne({id: id, url: path}).then(function () {
							res.json({id: id});
						}).catch(function (err) {
							res.json({error: err});
						});
					})
					.catch(function (err) {
						res.json({error: err});
					});
			}
		});
	} else {
		res.json({error: "Invalid Parameters"});
	}
});

MongoClient.connect(MONGODB_URI, function (err, mongodb) {
	if (err) {
		console.error("Error connecting to MongoDB.", err);
		process.exit(1);
	} else {
		urls = mongodb.collection('urls');

		app.listen(PORT, function () {
			console.log('Node app is running on port', PORT);
		});
	}
});
