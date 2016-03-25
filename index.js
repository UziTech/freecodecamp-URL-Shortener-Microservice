//mongodb://<dbuser>:<dbpassword>@ds023088.mlab.com:23088/test-node
//pZ"RXPJZb)Te+K>\W,e"K<n){zLaU$eTA=9wF9Z$
var express = require('express');
var moment = require('moment');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(function (req, res) {
	var input = decodeURIComponent(req.path.replace(/^\//, ""));
	var time = {unix: null, natural: null};
	var date;
	if (!input.match(/\D/)) {
		date = moment(input, "X");
	} else {
		date = moment(input, "MMMM D, YYYY");
		if (date.format("MMMM D, YYYY") !== input) {
			date = moment.invalid();
		}
	}
	if (date.isValid()) {
		time.unix = date.unix();
		time.natural = date.format("MMMM D, YYYY");
	}
	res.json(time);
});

app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});
