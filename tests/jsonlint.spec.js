'use strict';

describe('Check the themes.json file', function() {
	it('The themes.json is a valid json file', function() {
		expect(themesJSON).to.be.an('array');
	});
});

describe('Check the themes.json entries are valid', function() {
    it('Title should not have surrounding whitespace', function() {
        themesJSON.forEach(function(theme) {
            expect(theme.Title.trim()).to.equal(theme.Title);
        });
    });
});
