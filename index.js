'use strict';

var cp = require('child_process');
var path = require('path');
var fs = require('fs');

module.exports = function(input, output, cb) {
  var suffix = '-new';
  var pngdefryBinPath = './pngdefry/bin/pngdefry';
  var newOutput = getNewOutput(output);
  var outputFileName = getOutputFileName(input, newOutput);

  convert(input, newOutput, outputFileName, function(err) {
    if (err) {
      cb(err);
    }

    cb(null);
  });

  // /////////////////////////////
  function getNewOutput(output) {
    var arr = output.split(path.sep);
    arr.pop();
    return arr.join(path.sep);
  }

  function getOutputFileName(input, newOutput) {
    var inputArr = input.split(path.sep);
    var originFileName = inputArr[inputArr.length - 1];
    var outputFileName = path.join(newOutput, originFileName.replace(/\.png$/, suffix + '.png'));
    return outputFileName;
  }

  function convert(input, newOutput, outputFileName, cb) {
    var pd = cp.spawn(pngdefryBinPath, ['-s', suffix, '-o', newOutput, input]);

    pd.stdout.on('data', function(data) {
      console.log(data.toString());
    });

    pd.on('exit', function(code) {
      if (code !== 0) {
        return cb('convert fail');
      }

      fs.renameSync(outputFileName, output);
      cb(null);
    });

  }

};