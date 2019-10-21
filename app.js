var express = require('express')
  , flash = require('connect-flash')
  , util = require('util')
  , bodyParser = require('body-parser')
  , request = require('request')
  , cheerio = require("cheerio");

var app = express();
app.use(express.static('public'));
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
    res.render('index');
});

app.get('/scrape', function(req, res){
    let strLink = req.query.link;
    makeRequest(strLink, function (objData) {
        req.flash('objData', objData)
        res.redirect('/result');
    });
});

app.get('/result', function(req, res){
    let objData = req.flash('objData');

    // Stops server crashing on refresh
    if (!objData[0]) {
        res.redirect('/');
    }

    let arrEmails = objData[0].EmailAddresses,
        arrPhones = [],
        arrPostcodes = [],
        arrSocial = [];

    console.log(objData[0]);

    res.render(
        'result',
        {
            emails    : arrEmails,
            phones    : arrPhones,
            postcodes : arrPostcodes,
            social    : arrSocial
        }
    );
});

function makeRequest(url, callback) {
    console.log("Request to " + url + " performed");

    let objData = {
        EmailAddresses : [],
        PhoneNumbers   : [],
        Postcodes      : [],
        LinkedIn       : [],
        Facebook       : [],
        Twitter        : []
    };

    request.get(url, function (err, res, html) {
        if (!err && res.statusCode == 200) {
            const $ = cheerio.load(html);
            const htmlBody = $("body").html();
            const textBody = $("body").text();

            objData.EmailAddresses  = uniqueEmailSearch(htmlBody);
            objData.PhoneNumbers    = uniquePhoneSearch(textBody);
            objData.Postcodes       = [];
            objData.LinkedIn        = [];
            objData.Facebook        = [];
            objData.Twitter         = [];

            callback(objData);
        } else {
            console.log("error:" + err);
        }
    });
}

function uniqueEmailSearch(body) {
    var arrEmail = body.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    return removeDuplicates(arrEmail);
}

function uniquePhoneSearch(body) {
    let arrPhone = [];
    var matchedPhone = body.match(/^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/gi);
    arrPhone.push(matchedPhone);
    return removeDuplicates(arrPhone);
}

function removeDuplicates(arr){
    let arrUnique = Array.from(new Set(arr))
    return arrUnique
}

app.listen(3000);
