var parser = require('./parse');
var ascii85 = require('ascii85');
var bmp = require("bmp-js");


var app = function(lines) {

  var newObj = null;
  var objs = [];

  while(lines.length > 0) {

    var line = lines.shift();
    if(isStartObject(line)) {
      newObj = {
        start: line,
        lines: [],
        stream: false
      };
    } else if (isEndObject(line)) {
        objs.push(newObj);
        newObj = null;
    } else if (newObj !== null) {
        if(line.indexOf('<</') === 0) {
          if(line.indexOf('stream') === line.length - 6) {
            newObj.stream = true;
            line = line.substr(0, line.length - 6);
          }
          newObj.info = parseInfoLine(line);
        } else {
          newObj.lines.push(line);
        }
    } else {
    }

  }

  return objs;

};

var isStartObject = function isStartObject(line) {
  var pieces = line.split(' ');
  return pieces[pieces.length-1]==='obj';
};
var isEndObject = function isStartObject(line) {
  return line==='endobj';
};
var isStream = function isStream(line) {
  return line.indexOf('stream') === line.length - 6;
};
var parseInfoLine = function(line) {
  return parser.parse(line);
};


module.exports = {
  parse: function(str) {
    var lines = str.split('\n');
    var result = app(lines);
    var summary = [];
    result.forEach(function(r) {
      summary.push({
        start: r.start,
        info: r.info,
        lines: r.lines.length,
        stream: r.stream
      });
      if(r.stream === true) {
        r.stream = r.lines.join('');
        delete r.lines;
      }
    });
    return {
      summary: summary,
      full: result
    };
  }
};
