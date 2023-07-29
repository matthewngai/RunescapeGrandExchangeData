var express = require('express');
var request = require('request');
var app = express();


app.get('/', function (req, res) {
  res.send('Testing 123');
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});

var page = '&page=';
var alpha = '&alpha=';
var category = 'category=';
var items = 'items.json?';
var category = 'category.json?';
var service_url = 'http://services.runescape.com/m=itemdb_rs/api/catalogue/';


app.get('/categories/:categoryID', function (req, res) {
	request('http://services.runescape.com/m=itemdb_rs/api/catalogue/category.json?category=' + req.params.categoryID, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
			res.send(body);
		}
	});
});

app.get('/categories/:categoryID/:letter', function (req, res) {
	request('http://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=' + req.params.categoryID + alpha + req.params.letter, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
			res.send(body);
		}
	});
});

