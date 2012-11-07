#!/usr/bin/python2.7
import bs4
import json
import re
import subprocess
import sys
import urllib2

# if you dont pass false to JSON.stringify in phantomJS
# you will need this to clean up your json
def stripslashes(s):
    r = re.sub(r"\\(n|r)", "\n", s)
    r = re.sub(r"\\", "", r)
    return r

def go(country_code, debug=False):
	u = "http://www.alexa.com/topsites/countries/%s" % (country_code)
	html = urllib2.urlopen(u).read()
	soup = bs4.BeautifulSoup(html)
	soup.prettify()
	o = []

	for span in soup.find_all("span", {"class":"small topsites-label"}):
			
		url = span.get_text()

		if debug == True:
			subprocess.call(["phantomjs", "app.js", url, 'false', 'true'])
		else:
			s = subprocess.check_output(["phantomjs", "app.js", url, 'false', 'true'])
			# this is a hack to keep JS errors on destination sites from tainting our data
			# there is no way to supress destination-site JS errors in phantomJS
			if "###SUCCESS###" in s:
				a = s.split("###SUCCESS###")
				o.append(json.loads(a[1]))

	if debug == False:
		return o


def multiBall(s):
	a = sys.argv[1].split(",")
	o = {}
	for code in a:
		if len(code) > 1:
			#filename = "%s.txt" % code
			#f = open(filename, w)
			o[code] = go(code, False)
			#f.write(json.dumps(o))
	#print stripslashes(json.dumps(o, sort_keys=True, indent=4))
	print stripslashes(json.dumps(o))


# usage 
# python scrape_alexa.py US
# python scrape_alexa.py HK,FR
if __name__ == "__main__":
	if sys.argv[1] == None:
		print "specify a 2 digit country code"
	else:
		if ("," in sys.argv[1]):
			multiBall(sys.argv[1])
		else :
			go(sys.argv[1], True)	
