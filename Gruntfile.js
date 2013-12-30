module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    jsonlint: {
      sample: {
        src: ['themes.json']
      }
    },
    htmllint: {
        all: ['themes/*']
    }
  });

  grunt.loadNpmTasks('grunt-jsonlint');

  grunt.registerTask('default', ['jsonlint']);
};