/**
 * hit a URL and tell me about the cookies it returns
phantom.cookies[c] = {
	"domain": ".cnet.com",
    "expires": "Sun, 05 May 2013 20:16:51 GMT",
    "expiry": 1367785011,
    "httponly": false,
    "name": "MAD_INTERNAL",
    "path": "/",
    "secure": false,
    "value": "0"
}

 */



var page = require('webpage').create();
var system = require('system');

var sessionCookies = 0;
var totalCookies = 0;
var thirdPartyCookies = 0;
var persistantCookies = 0;
var url, domain, dumpAll, returnJSON;

if (system.args.length === 1) {
    console.log('Pass some args when invoking. e.g.: $phantomjs app.js com.com true, false');
    phantom.exit();
} else {
	phantom.cookiesEnabled = true;

	url = system.args[1];
	dumpAll = (system.args[2] == "true") ? true : false;
	returnJSON = system.args[3];

	if (url.substr(0,4) != "http"){
		domain = url
		url = "http://" + url;
	} else {
		domain = url.substr(7, url.length)
	}


	page.open(url, function() {
		

	    var d = new Date().getTime();

	    for(var c in phantom.cookies){
	    	// check domain, is this a 3rd party cookie
	    	if(phantom.cookies[c].domain.indexOf(domain) == -1){
	    		thirdPartyCookies++;
	    	} 
	    	totalCookies++;
	    	
	    	// check expiration date, if >29 days we consider this "persistent"
	    	// could also use expiry here
	    	var x = new Date(phantom.cookies[c].expires);
	    	var delta = (x.getTime() - d) / (1000*60*60*24);
			if(delta > 30) persistantCookies++;
			// dump the cookie to STD.out if it was requested 
			if(dumpAll) console.log(JSON.stringify(phantom.cookies[c], null, false));
	    }

	    if(returnJSON){ 
	    	var o = {};	
	    	try {
		    	o["results"] = {
		   			status 	: 1,
		   			domain	: domain,
		   			cookies 	: {
			    		"third_party" 	: thirdPartyCookies,
			    		"total"			: totalCookies,
			    		"persistent" 	: persistantCookies
			    	}
			    }
		    	console.log("###SUCCESS###" + JSON.stringify(o, null, false));
		    } catch(e) {
		    	o["results"] = {
		    		"status"	: 0,
		    		"domain"	: domain,
		    		}
		    }
	    } else {
	   		// log results
	   		console.log("Total Cookies:\t\t\t" + totalCookies);
	    	console.log("3rd Party Cookies:\t\t" + thirdPartyCookies)
	    	console.log("Persistent Cookies: \t\t" + persistantCookies)
	    }
	    phantom.exit();
	});

}

