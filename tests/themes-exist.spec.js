'use strict';

describe('All the themes exist', function() {
	it('Any theme has an entry in the themes.json file and vice versa', function() {
		expect(JSON.parse(themesJSON).length).to.be.equal(themesFiles.length);
	});
});