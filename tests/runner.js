const chai = require('chai'),
  walk = require('walk'),
  themesFiles = []

walk.walkSync('./themes', {
  listeners: {
    file: function(root, fileStats) {
      themesFiles.push(fileStats)
    }
  }
})

// I know globals are never a good idea
// but in this case they work pretty well
global.themesFiles = themesFiles
global.expect = chai.expect
global.themesJSON = require('../themes')

require('./themes-exist.spec')
require('./themes-parsing.spec')
