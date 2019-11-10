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
    phone: function(arrWebPageHrefs){
        var arrPhones = [];
        arrWebPageHrefs.forEach(function(strLink){
            if (/tel:/.test(strLink)) {
                if(arrPhones.indexOf(strLink) === -1) {
                    arrPhones.push(strLink);
                }
            }
        });
        return arrPhones;
    }
};

function removeDuplicates(arr) {
    let arrUnique = Array.from(new Set(arr))
    return arrUnique
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

module.exports = search;