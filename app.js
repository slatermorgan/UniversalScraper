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

    let arrEmails    = objData[0].EmailAddresses,
        arrPhones    = objData[0].PhoneNumbers,
        arrPostcodes = objData[0].Postcodes,
        arrLinkedIn  = objData[0].LinkedIn,
        arrFacebook  = objData[0].Facebook,
        arrTwitter   = objData[0].Twitter;

    console.log(objData[0]);

    res.render(
        'result',
        {
            emails    : arrEmails,
            phones    : arrPhones,
            postcodes : arrPostcodes,
            linkedIn  : arrLinkedIn,
            facebook  : arrFacebook,
            twitter   : arrTwitter,

        }
    );
});

function makeRequest(url, callback) {
    console.log("Request to " + url + " performed");

    let objData = {
        EmailAddresses : [],
        PhoneNumbers   : ['0776547560', '0778657560', '0778657444'],
        Postcodes      : ['LL299XX', 'LL289XO'],
        LinkedIn       : ['linkedin.com/profile1', 'linkedin.com/profile2'],
        Facebook       : ['facebook.com/profile1', 'facebook.com/profile2'],
        Twitter        : ['twitter.com/profile1', 'twitter.com/profile2']
    };

    request.get(url, function (err, res, html) {
        if (!err && res.statusCode == 200) {
            const $ = cheerio.load(html);
            const htmlBody = $("body").html();
            const textBodyTrimmed = $("body").text().replace(/\s\s+/g, ' ');

            objData.EmailAddresses  = emailSearch(htmlBody);
            objData.PhoneNumbers    = mobilePhoneSearch(textBodyTrimmed);
            callback(objData);
        } else {
            console.log("error:" + err);
        }
    });
}

function emailSearch(body) {
    var arrEmail = body.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    return removeDuplicates(arrEmail);
}

function mobilePhoneSearch(str) {
    let arrPhone = [];
    var matchedPhone = str.match(/(070|071|072|073|074|075|076|077|078|079)\d{7,8}$/gi);
    arrPhone.push(matchedPhone);
    return removeDuplicates(arrPhone);
}

function landlinePhoneSearch(str) {
    let arrPhone = [];
    var matchedPhone = str.match(/^0([1-6][0-9]{8,10}|7[0-9]{9})$/gi);
    arrPhone.push(matchedPhone);
    return removeDuplicates(arrPhone);
}

function removeDuplicates(arr) {
    let arrUnique = Array.from(new Set(arr))
    return arrUnique
}

app.listen(3000);
