'use strict';

// This could probably be more efficient.
describe('All the themes exist', function() {

	var fileNames = themesFiles.map(function(fileStat) {
		return fileStat.name;
	}).sort();

	var jsonNames = themesJSON.map(function(theme) {
		return theme.FileName;
	}).sort();

	// console.log(fileNames,'-',jsonNames);

	it('All theme files exist in themes JSON', function() {
		fileNames.forEach(function(fileName, i) {
			expect(fileName).to.equal(jsonNames[i]);
		});
	});

	it('All theme JSON entries exist in themes folder', function() {
		jsonNames.forEach(function(jsonName, i) {
			expect(jsonName).to.equal(fileNames[i]);
		});
	});

	it('No spaces allowed in the themes files names', function() {
		jsonNames.forEach(function(jsonName, i) {
			expect(jsonName).to.not.match(/\s/g, 'the theme "' + jsonName + '" must not contain spaces!');
		});
	});
});
