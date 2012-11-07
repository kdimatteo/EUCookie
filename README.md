EuroBake
========

Quick and dirty script to check what kinds of cookies are being set for a given URL.

Developed in response to the ICO EU Cookie ruling (Regulation 6) which took effect 6 May 2012 which limits the types of persistent information which can be stored
in a UA (with some exceptions).

Usage
-----
$ phantomjs app.js url dumpAll returnJSON

- the dumpAll argument will log the contents each cookie that is returned by the supplied URL in a JSON object if TRUE. Useful for debugging or just doing a quick inspection.
<pre>
	"domain": ".url.com",
    "expires": "Sun, 05 May 2013 20:16:51 GMT",
    "expiry": 1367785011,
    "httponly": false,
    "name": "MAD_INTERNAL",
    "path": "/",
    "secure": false,
    "value": "0"
</pre>

- the returnJSON argument will wrap all results in a json object if TRUE or log if FALSE


For more information:
*  http://www.ico.gov.uk

With thanks to:
* https://opendata.socrata.com/dataset/Country-List-ISO-3166-Codes-Latitude-Longitude/mnkm-8ram



