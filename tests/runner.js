/* jshint node:true */
'use strict';

var chai = require('chai'),
	fs = require('fs');

global.expect = chai.expect;
global.themes = JSON.parse(fs.readFileSync('./themes.json', 'utf8'));

require('./jsonlint.spec');
require('./themes-exsist.spec');
require('./themes-parsing.spec');