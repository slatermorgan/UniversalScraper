var search = {
    social: function(arrWebPageHrefs) {
    let fbPattern = /facebook/,
        twPattern = /twitter/,
        liPattern = /linkedin/,
        gitPattern = /github/,
        arrSocialData = {
            facebook : [],
            twitter : [],
            linkedin : [],
            github : []
        };
    
        arrWebPageHrefs.forEach(function(strLink){
            if (fbPattern.test(strLink)) {
                if(arrSocialData.facebook.indexOf(strLink) === -1) {
                    arrSocialData.facebook.push(strLink);
                }
            }
            if (twPattern.test(strLink)) {
                if(arrSocialData.twitter.indexOf(strLink) === -1) {
                    arrSocialData.twitter.push(strLink);
                }
            }
            if (liPattern.test(strLink)) {
                if(arrSocialData.linkedin.indexOf(strLink) === -1) {
                    arrSocialData.linkedin.push(strLink);
                }
            }
            if (gitPattern.test(strLink)) {
                if(arrSocialData.github.indexOf(strLink) === -1) {
                    arrSocialData.github.push(strLink);
                }
            }
        });
        return arrSocialData;
    },
    email: function(strBody){
        var arrEmail = strBody.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        return removeDuplicates(arrEmail);
    },
    phone: function(strBody){
        var arrPhones = strBody.match(/(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?/gi);
        return removeDuplicates(arrPhones);
    },
    postcode : function(strBody){
        var arrPostcodes = strBody.match(/[A-Za-z]{1,2}[0-9][A-Za-z0-9]?\s?[0-9][ABD-HJLNP-UW-Zabd-hjlnp-uw-z]{2}/gi);
        return removeDuplicates(arrPostcodes);
    },
};

function removeDuplicates(arr) {
    let arrUnique = Array.from(new Set(arr))
    return arrUnique
}

module.exports = search;