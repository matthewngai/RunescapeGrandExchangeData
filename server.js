var express = require('express');
var app = express();


app.get('/', function (req, res) {
  res.send('Testing 123');
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});

//var request = require('request');
//request('http://www.google.com', function (error, response, body) {
//  if (!error && response.statusCode == 200) {
//    console.log(body) // Show the HTML for the Google homepage.
//  }
//})

var request = require('request');
//var dl = require('datalib');
//var d3 = require('d3');

var shot_chart_url = 'http://services.runescape.com/m=itemdb_rs/api/catalogue/items.json?category=1&alpha=a&page=1';

request.get(shot_chart_url, function(err, res, body){
    var data = JSON.parse(body);
    console.log(data);
//    var mArray = data.resultSets[0].rowSet;
//    console.log(mArray)
});
//2~~
//Lets require/import the HTTP module
//var http = require('http');
//
////Lets define a port we want to listen to
//const PORT=8080; 
//
////We need a function which handles requests and send response
//function handleRequest(request, response){
//    response.end('It Works!! Path Hit: ' + request.url);
//}
//
////Create a server
//var server = http.createServer(handleRequest);
//
////Lets start our server
//server.listen(PORT, function(){
//    //Callback triggered when server is successfully listening. Hurray!
//    console.log("Server listening on: http://localhost:%s", PORT);
//});

//var express = require('express');
//var app = express();
//
//app.get('/bits', function(req, res) {
//    res.send([{name:'bit1'}, {name:'bit2'}]);
//});
//
//app.get('/bits/:id', function(req, res) {
//    res.send({id:req.params.id, name: "The Name", description: "description"});
//});
//
//app.listen(8080);
//console.log('Listening on port 8080.');