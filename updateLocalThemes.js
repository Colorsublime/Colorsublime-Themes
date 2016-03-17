#!/usr/bin/env node

var request = require('request');
var fs = require('fs');

var themes = JSON.parse(fs.readFileSync('./themes.json', 'utf8'));

console.log('Local themes will be updated, remember to review updated themes before commiting.');

themes.forEach(function(theme){
	if( theme.Url && theme.Url.indexOf('://') > -1 ){
		// If the theme has a Url defined then download 
		// and save the latest version to our local theme folder.
		request(theme.Url, function(error, response, body) {			
			if(response.statusCode !== 200){
				console.error('Unable to download theme from: ' + theme.Url );				
				console.error('statusCode:' + response.statusCode );
				return;
			}
			if(body.length === 0 ){
				console.error('No content downloaded for ' + theme.Url + ' check Url is correct.' );
				return;
			}

			var filePath = __dirname + '/themes/' + theme.FileName;
  			fs.writeFile(filePath, body);  			
  			console.log('Saved file: ' + filePath);
		});
	}	
});
