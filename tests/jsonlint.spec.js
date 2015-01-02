'use strict';
var fs = require('fs');
var jsonlint = require('jsonlint');

describe('Check the themes.json file', function() {
    it('The themes.json is a valid json file', function() {
        var jsonSting = fs.readFileSync('./themes.json', 'utf8');
        expect(jsonlint.parse(jsonSting)).to.be.an('array');
    });
});

describe('Check the themes.json entries are valid', function() {
    it('Title should not have surrounding whitespace', function() {
        themesJSON.forEach(function(theme) {
            expect(theme.Title.trim()).to.equal(theme.Title);
        });
    });
});
