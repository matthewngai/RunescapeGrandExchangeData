var express = require('express');
var request = require('request');
var path = require('path');
var router = express.Router();
var app = express();

app.use(express.static(path.join(__dirname, 'static')));

router.get('/', function (req, res) {
  res.sendFile('index.html', {root: './static'});
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port 3000!');
});

var page = '&page=';
var searchQuery = 'https://secure.runescape.com/l=0/a=14/p=wwGlrZHF5gKN6D3mDdihco3oPeYN2KFybL9hUUFqOvk/m=itemdb_rs/api/catalogue/search.json?query=';

app.get('/search/:query', function (req, res) {
	request(searchQuery + req.params.query, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
			res.send(body);
		} else {
			console.log(response + error);
		}
	});
});

app.get('/search/:query/:pageNumber', function (req, res) {
	request(searchQuery + req.params.query + page + req.params.pageNumber, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
			res.send(body);
		} else {
			console.log(response + error);
		}
	});
});

app.get('/item/:itemID', function (req, res) {
	request('http://services.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=' + req.params.itemID, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
			res.send(body);
		} else {
			console.log(response.statusCode + error);
		}
	});
});

app.get('/item/:itemID/graph', function (req, res) {
	request('http://services.runescape.com/m=itemdb_rs/api/graph/' + req.params.itemID + '.json', function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
			res.send(body);
		} else {
			console.log(response.statusCode + error);
		}
	});
});
