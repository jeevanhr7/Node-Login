
var bcrypt = require('bcryptjs');
// body-parser
var bodyParser = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({extended: false});

// express
var express = require("express");
var app = express();

//mysql
var mysql = require("mysql");
// connect strings for mysql
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "users"
});

// connecting ......
connection.connect();

// requesting express to get data as text
app.use(bodyParser.text());

// using express for post method
app.post("/somePage", urlEncodedParser, function(request, response) {
    if(request.url!="/favicon.ico") {
        if(request.body.regOrLogin=="Register") {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(request.body.pwd, salt, function(err, hash) {
                    var body = request.body;
                    var date = new Date();
                    var currentDate = date.getFullYear()+"-"+date.getMonth()+"-"+date.getDay();
                    var postVars = {username: body.username, password: hash, dob: body.dob, reg_date: currentDate};
                    // insertion into MySQL
                    connection.query("INSERT INTO users set ?", postVars, function(err, result) {
                        if(err) throw err;
                    });
                });
            });
            console.log("user registered");
            response.sendFile( "/Users/Jeevan/Desktop/Login/RegAndLogin-master/regSuccess.html");
        } else if (request.body.login=="Login") {
            var  body = request.body;
            console.log(body.username+": username");
            connection.query("SELECT * FROM users WHERE username='"+body.username+"'", function(err, res, fields){
                if(err) {
                    response.sendFile( "/Users/Jeevan/Desktop/Login/RegAndLogin-master/unauthorised.html");
                } else {
                    bcrypt.compare(body.pwd, res[0].password, function(err, res) {
                        if(res) {
                            console.log("authorised user");
                            response.sendFile( "/Users/Jeevan/Desktop/Login/RegAndLogin-master/authorised.html");
                        } else {
                            console.log("not an authorised user");
                            response.sendFile("/Users/Jeevan/Desktop/Login/RegAndLogin-master/unauthorised.html");
                        }
                    });
                }
            });
        }
    }
});

app.listen(3000);
console.log("Server Running at 3000");