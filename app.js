var express = require('express')
  , flash = require('connect-flash')
  , util = require('util')
  , bodyParser = require('body-parser')
  , request = require('request')
  , cheerio = require("cheerio")
  , search = require('./search');

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
        arrLinkedIn  = objData[0].Social.linkedin,
        arrFacebook  = objData[0].Social.facebook,
        arrTwitter   = objData[0].Social.twitter;

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
        PhoneNumbers   : [],
        Postcodes      : []
    };

    request.get(url, function (err, res, html) {
        if (!err && res.statusCode == 200) {
            const $ = cheerio.load(html);
            const htmlBody = $("body").html();
            const textBodyTrimmed = $("body").text().replace(/\s\s+/g, ' ');

            let arrWebPageHrefs = [];
            $("a").each(function (i, el) {
                const link = $(el).attr("href");
                arrWebPageHrefs.push(link);
            });

            objData.Social          = search.social(arrWebPageHrefs);
            objData.EmailAddresses  = search.email(htmlBody);
            objData.PhoneNumbers    = search.phone(arrWebPageHrefs);
            objData.Postcodes       = search.postcode(textBodyTrimmed);
            callback(objData);
        } else {
            console.log("error:" + err);
        }
    });
}

app.listen(3000);
