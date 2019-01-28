/**
 * this test is an ugly fork of tmtheme.js
 * https://github.com/ajaxorg/ace/blob/master/tool/tmtheme.js
 */

var plist = require('plist'),
  libxml = require('libxmljs'),
  colorParser = require('color-parser'),
  fs = require('fs'),
  et = require('elementtree'),
  THEMES_DIR = './themes/',
  unsupportedScopes = {},
  currentTheme,
  supportedScopes = {
    'keyword': 'keyword',
    'keyword.operator': 'keyword.operator',
    'keyword.other.unit': 'keyword.other.unit',

    'string.quoted': 'string.quoted',
    'meta.paragraph': 'meta.paragraph',
    'entity': 'entity',
    'entity.name.section': 'entity.name.section',
    'markup': 'markup',
    'markup.raw.inline.markdown': 'markup.raw.inline.markdown',
    'string.other.link.title.markdown': 'string.other.link.title.markdown',
    'string.other.link.description.markdown': 'string.other.link.description.markdown',
    'markup.quote.markdown': 'markup.quote.markdown',

    'constant': 'constant',
    'constant.language': 'constant.language',
    'constant.library': 'constant.library',
    'constant.numeric': 'constant.numeric',
    'constant.character': 'constant.character',
    'constant.character.escape': 'constant.character.escape',
    'constant.character.entity': 'constant.character.entity',
    'constant.other': 'constant.other',

    'support': 'support',
    'support.function': 'support.function',
    'support.function.dom': 'support.function.dom',
    'support.function.firebug': 'support.firebug',
    'support.function.constant': 'support.function.constant',
    'support.constant': 'support.constant',
    'support.constant.property-value': 'support.constant.property-value',
    'support.class': 'support.class',
    'support.type': 'support.type',
    'support.other': 'support.other',

    'function': 'function',
    'function.buildin': 'function.buildin',

    'source': 'source',

    'storage': 'storage',
    'storage.type': 'storage.type',

    'invalid': 'invalid',
    'invalid.illegal': 'invalid.illegal',
    'invalid.deprecated': 'invalid.deprecated',

    'string': 'string',
    'string.regexp': 'string.regexp',

    'comment': 'comment',
    'comment.documentation': 'comment.doc',
    'comment.documentation.tag': 'comment.doc.tag',

    'variable': 'variable',
    'variable.language': 'variable.language',
    'variable.parameter': 'variable.parameter',

    'meta': 'meta',
    'meta.tag.sgml.doctype': 'xml-pe',
    'meta.tag': 'meta.tag',
    'meta.selector': 'meta.selector',

    'entity.other.attribute-name': 'entity.other.attribute-name',
    'entity.name.function': 'entity.name.function',
    'entity.name': 'entity.name',
    'entity.name.tag': 'entity.name.tag',

    'punctuation.definition.string': 'punctuation.definition.string',
    'punctuation.definition.parameters': 'punctuation.definition.parameters',
    'punctuation.definition.array': 'punctuation.definition.array',

    'markup.heading': 'markup.heading',
    'markup.heading.1': 'markup.heading.1',
    'markup.heading.2': 'markup.heading.2',
    'markup.heading.3': 'markup.heading.3',
    'markup.heading.4': 'markup.heading.4',
    'markup.heading.5': 'markup.heading.5',
    'markup.heading.6': 'markup.heading.6',
    'markup.list': 'markup.list',

    'collab.user1': 'collab.user1'
  },
  fallbackScopes = {
    'keyword': 'meta',
    'support.type': 'storage.type',
    'variable': 'entity.name.function',
    'tag.open': 'foreground',
    'doctype': 'entity.name.tag'
  }

function parseColor(color, elementId) {

  var alpha = 1,
    message = 'something went wrong parsing the colors of the theme: ' + currentTheme + ', the issue is the on the property: ' + elementId


  if (!color || color.length < 2) {
    //console.log('undefined color: ' + color);
    return null
  } else {

    expect(color).to.have.length.within(4, 9, message)
    expect(color).to.not.have.length.equal(5, message)
    expect(color).to.not.have.length.equal(6, message)
    expect(color).to.have.length.below(10, message)

    if (color.length > 7) {
      alpha = parseInt(color.substring(7, 9), 16) / 100
      color = color.substring(0, 7)
    }

    var rgba = colorParser(color)

    expect(rgba).to.be.an('object', message)

    return 'rgba(' + rgba.r + ',' + rgba.g + ',' + rgba.b + ',' + alpha + ')'

  }
}

function parseStyles(styles) {
  var css = []
  if (!styles) {
    return
  }
  var fontStyle = styles.fontStyle || ''
  if (fontStyle.indexOf('underline') !== -1) {
    css.push('text-decoration:underline;')
  }
  if (fontStyle.indexOf('italic') !== -1) {
    css.push('font-style:italic;')
  }
  if (styles.foreground) {
    css.push('color:' + parseColor(styles.foreground, 'foreground') + ';')
  }
  if (styles.background) {
    css.push('background-color:' + parseColor(styles.background, 'background') + ';')
  }


  return css.join('\n')
}

function luma(color) {

  var rgb

  if (!color) {
    return false
  }

  if (color[0] === '#') {
    rgb = color.match(/^#(..)(..)(..)/).slice(1).map(function(c) {
      return parseInt(c, 16)
    })
  } else {
    rgb = color.match(/\(([^,]+),([^,]+),([^,]+)/).slice(1).map(function(c) {
      return parseInt(c, 10)
    })
  }


  return (0.21 * rgb[0] + 0.72 * rgb[1] + 0.07 * rgb[2]) / 255
}

function extractStyles(theme) {
  var globalSettings = theme.settings[0].settings

  var colors = {
    'printMargin': '#e8e8e8',
    'background': parseColor(globalSettings.background, 'background'),
    'foreground': parseColor(globalSettings.foreground, 'foreground'),
    'overwrite': parseColor(globalSettings.caret, 'caret'),
    'gutter': '#e8e8e8',
    'selection': parseColor(globalSettings.selection, 'selection'),
    'step': 'rgb(198, 219, 174)',
    'bracket': parseColor(globalSettings.invisibles, 'bracket'),
    'active_line': parseColor(globalSettings.lineHighlight, 'active_line'),
    'cursor': parseColor(globalSettings.caret, 'caret'),

    'invisible': 'color: ' + parseColor(globalSettings.invisibles, 'invisible') + ';'
  }


  for (var i = 1; i < theme.settings.length; i++) {
    var element = theme.settings[i]
    if (!element.scope) {
      continue
    }
    var scopes = element.scope.split(/\s*[|,]\s*/g)
    //console.log(scopes);
    for (var j = 0; j < scopes.length; j++) {
      var scope = scopes[j]
      //console.log(scope);
      var style = parseStyles(element.settings)

      var aceScope = supportedScopes[scope]

      if (aceScope) {
        colors[aceScope] = style
      } else if (style) {
        unsupportedScopes[scope] = (unsupportedScopes[scope] || 0) + 1
      }
    }
  }

  for (const i in fallbackScopes) {
    if (!colors[i]) {
      colors[i] = colors[fallbackScopes[i]]
    }
  }

  if (!colors.fold) {
    var foldSource = colors['entity.name.function'] || colors.keyword
    if (foldSource) {
      colors.fold = foldSource.match(/:([^;]+)/)[1]
    }
  }

  if (!colors.selected_word_highlight) {
    colors.selected_word_highlight = 'border: 1px solid ' + colors.selection + ';'
  }

  colors.isDark = (luma(colors.background) < 0.5) + ''

  return colors
}

describe('The themes can be parsed correctly', function() {
  var themes = themesFiles.map(function(theme) {
    return {
      'body': fs.readFileSync(THEMES_DIR + theme.name, 'utf8'),
      'name': theme.name
    }
  })

  it('Themes are valid XML', function(done) {
    this.timeout(15000)
    themes.forEach(function(theme, i) {
      try {
        var res = libxml.parseXml(theme.body)
        if (res.errors.length > 0) {
          throw new Error(theme.name + ' doesn\'t appear to be valid XML, see the following errors: ' + JSON.stringify(res.errors))
        }
      } catch (e) {
        e.message = 'Can\'t parse ' + theme.name + '. ' + e.message
        throw e
      }
      if (i === themes.length - 1) {done()}
    })
  })

  it('I could get the colors for all the themes', function(done) {
    this.timeout(15000)
    themes.forEach(function(theme, i) {
      currentTheme = theme.name
      var themeParsed = plist.parse(theme.body)
      extractStyles(themeParsed)
      if (i === themes.length - 1) {done()}
    })
  })

  it('Themes have a valid name', function(done) {
    this.timeout(15000)
    themes.forEach(function(theme, i) {
      var themeParsed = plist.parse(theme.body)
      if (themeParsed.name === undefined || themeParsed.name.trim().length === 0) {
        throw new Error(theme.name + ' is missing a key-string pair for "name".')
      }
      if (i === themes.length - 1) {done()}
    })
  })

  it('Themes are valid', function(done) {
    this.timeout(15000)
    themes.forEach(function(theme, i) {
      function testLooseText(s) {
        if (s) {
          var str = s.trim()
          expect(str).to.equal('', 'Unexpected loose text="' + str + '" found in theme ' + theme.name)
        }
      }

      function testValue(value, collectionName) {
        if (!collectionName) {
          collectionName = 'unknown'
        }
        // <dict>
        if (value.tag === 'dict') {
          testDict(value)
        }
        // <array>
        else if (value.tag === 'array') {
          testArray(value)
        }
        // anything other than <string> is an error
        else if (value.tag !== 'string') {
          throw new Error('Unexpected tag in ' + collectionName + ' ' + value.tag + '" found in theme ' + theme.name)
        }
      }

      function testDict(dict) {
        testLooseText(dict.tail)
        testLooseText(dict.text)
        var foundKey = false
        var children = dict.getchildren()
        for (var idx in children) {
          var n = children[idx]
          testLooseText(n.tail)
          // <key>
          if (!foundKey && n.tag === 'key') {
            foundKey = true
          }
          else if (foundKey) {
            testValue(n, 'dict')
            foundKey = false
          }
          else {
            throw new Error('Mismatching key-value pair in dict, see the XML element object: ' + JSON.stringify(dict) + '" found in theme ' + theme.name)
          }
        }
      }

      function testArray(array) {
        testLooseText(array.tail)
        testLooseText(array.text)
        var children = array.getchildren()
        for (var idx in children) {
          var n = children[idx]
          testLooseText(n.tail)
          testValue(n, 'array')
        }
      }

      var plist = et.parse(theme.body).getroot()
      // <plist>
      expect(plist.tag).to.equal('plist')
      testLooseText(plist.tail)
      testLooseText(plist.text)
      // <dict>
      var children = plist.getchildren()
      expect(children.length).to.equal(1)
      expect(children[0].tag).to.equal('dict')
      testDict(children[0])
      if (i === themes.length - 1) {done()}
    })
  })
})

describe('Check the themes.json entries are valid', function() {
  it('Title should not have surrounding whitespace', function() {
    themesJSON.forEach(function(theme) {
      expect(theme.Title.trim()).to.equal(theme.Title)
    })
  })
})
