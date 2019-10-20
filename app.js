var express = require('express')
  , flash = require('connect-flash')
  , util = require('util')
  , bodyParser = require('body-parser')
  , request = require('request')
  , cheerio = require("cheerio");

var app = express();

// configure Express
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.logger());
    app.use(express.cookieParser('keyboard cat'));
    app.use(express.session({ key: 'sid', cookie: { maxAge: 60000 }}));
  
    app.use(flash());
    app.use(app.router);
});

app.get('/', function(req, res){
    let arrEmails = req.flash('arrEmails');
    res.render('index', { emails: arrEmails});
});

app.get('/scrape', function(req, res){
    let strLink = req.query.link;
    makeRequest(strLink, function (arrEmails) {
        req.flash('arrEmails', arrEmails)
        res.redirect('/');
    });
});

app.get('/no-flash', function(req, res){
    res.redirect('/');
});

function makeRequest(url, callback) {
    console.log("Request to " + url + " performed");
    request.get(url, function (err, res, html) {
        if (!err && res.statusCode == 200) {
            const $ = cheerio.load(html);
            const body = $("body").html();
            var arrEmail = body.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
            callback(arrEmail);
        } else {
            console.log("error:" + err);
        }
    });
}

app.listen(3000);
