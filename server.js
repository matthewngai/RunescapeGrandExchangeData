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
var alpha = '&alpha=';
var category = 'category=';
var items = 'items.json?';
var category = 'category.json?';
var service_url = 'http://services.runescape.com/m=itemdb_rs/api/catalogue/';

app.get('/categories/:categoryID', function (req, res) {
	request('http://services.runescape.com/m=itemdb_rs/api/catalogue/category.json?category=' + req.params.categoryID, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
			res.send(body);
		} else {
			console.log(response.statusCode);
			console.log(error);
		}
	});
});

app.get('/categories/:categoryID/:letter', function (req, res) {
	request('http://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=' + req.params.categoryID + alpha + req.params.letter, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
			res.send(body);
		} else {
			console.log(response.statusCode);
			console.log(error);
		}
	});
});

app.get('/categories/:categoryID/:letter/:pageNumber', function (req, res) {
	request('http://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=' + req.params.categoryID + alpha + req.params.letter + page + req.params.pageNumber, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
			res.send(body);
		} else {
			console.log(response.statusCode);
			console.log(error);
		}
	});
});

//item info and price
app.get('/item/:itemID', function (req, res) {
	request('http://services.runescape.com/m=itemdb_rs/api/catalogue/detail.json?item=' + req.params.itemID, function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
			res.send(body);
		} else {
			console.log(response.statusCode);
			console.log(error);
		}
	});
});

app.get('/item/:itemID/graph', function (req, res) {
	request('http://services.runescape.com/m=itemdb_rs/api/graph/' + req.params.itemID + '.json', function (error, response, body) {
	  	if (!error && response.statusCode == 200) {
			res.send(body);
		} else {
			console.log(response.statusCode);
			console.log(error);
		}
	});
});
