/* jshint node:true */
'use strict';
var jsonlint = require('jsonlint');

describe('Check the themes.json file', function() {
	it('The themes.json is a valid json file', function() {
		expect(jsonlint.parse(JSON.stringify(themes))).to.be.an('array');
	});
});