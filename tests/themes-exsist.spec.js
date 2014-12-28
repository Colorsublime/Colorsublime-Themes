/* jshint node:true */
'use strict';

var walk = require('walk');

describe('All the themes exsist', function() {
	it('Any theme has an entry in the themes.json file', function(done) {
		var walker = walk.walk('./themes'),
			themesFiles = [];

		walker.on('file', function(root, stat, next) {
			// Add this file to the list of files
			themesFiles.push(stat.name);
			next();
		});

		walker.on('end', function() {
			expect(themes.length).to.be.equal(themesFiles.length);
			done();
		});
	});
})