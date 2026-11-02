"use strict";

function _classCallCheck(e, r) {
  if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function")
}

function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) { var i = r[t]; i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i) }
}

function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), e
}

var _path = require("path");
var fs = require("fs");
var createPngQuantizer = require("./lite-quantize-png");
var registerRequireContextHook = require("babel-plugin-require-context-hook/register");
var _require = require("./lite-enum");
var REGEXP_IMAGE = _require.REGEXP_IMAGE;
var iconPath = process.env.iconPath || "";
var img2bin = require("./lite-image2bin");

registerRequireContextHook();
var ImageCoverterPlugin = function () {
  function e(r) {
    _classCallCheck(this, e), this.options = r
  }
  return _createClass(
    e,
    [
      {
        key: "getDir",
        value: function (e) {
          return global.__requireContext("", e, !0, REGEXP_IMAGE).keys().map(function (r) { return _path.join(e, r) })
        }
      },
      {
        key: "apply",
        value: function (e) {
          var r = this.options.build;
          var t = this.getDir;
          e.hooks.done.tapAsync(
            "image coverter",
            function (e, callback) {
              var n = t(r);
              var binTasks = [], quantizer = createPngQuantizer();
              n.forEach(function (e) {
                binTasks.push(processImage(e, quantizer));
              });
              "" !== iconPath && t(iconPath).forEach(function (e) {
                binTasks.push(processImage(e, quantizer));
              });
              Promise.all(binTasks).
                then(function () {
                  quantizer.dispose();
                  console.info("ImageCoverterPlugin done");
                  callback();
                }).
                catch(function (error) {
                  quantizer.dispose();
                  console.info("ImageCoverterPlugin failed");
                  callback(error);
                });
            }
          )
        }
      }
    ]
  ), e
}();

function processImage(filePath, quantizer) {
  var options = getImageOptions(filePath);
  return img2bin(filePath, options).then(function () {
    if (options.toPng) {
      fs.unlinkSync(filePath);
      console.info("Converted: " + _path.basename(filePath) + " -> " + _path.basename(options.outputPath));
    } else if (options.outputPath !== filePath) {
      fs.renameSync(filePath, options.outputPath);
      console.info("Renamed: " + _path.basename(filePath) + " -> " + _path.basename(options.outputPath));
    }
    if (options.pngquant !== null) return quantizer.quantizeFile(options.outputPath, options.pngquant);
  });
}

function getImageOptions(filePath) {
  var extension = _path.extname(filePath);
  var name = _path.basename(filePath, extension);
  var tokens = name.split(" ");
  var cleanTokens = [];
  var toPng = false;
  var noBin = false;
  var pngquant = null;
  for (var i = 0; i < tokens.length; i++) {
    if (tokens[i] === "--topng") {
      toPng = true;
    } else if (tokens[i] === "--nobin") {
      noBin = true;
    } else if (tokens[i] === "--pngquant") {
      var quality = tokens[++i];
      if (!/^(100|[1-9]?\d)$/.test(quality || "")) throw new Error("Invalid --pngquant value in " + _path.basename(filePath) + "; expected 0 through 100.");
      pngquant = Number(quality);
    } else {
      cleanTokens.push(tokens[i]);
    }
  }
  var outputName = cleanTokens.join(" ").trim();
  if (!outputName) throw new Error("Image filename is empty after processing arguments: " + _path.basename(filePath));
  var outputExtension = toPng ? ".png" : extension;
  var outputPath = _path.join(_path.dirname(filePath), outputName + outputExtension);
  return {
    outputPath: outputPath,
    toPng: toPng,
    generateBin: !noBin,
    pngquant: _path.extname(outputPath).toLowerCase() === ".png" ? pngquant : null
  };
}
module.exports = ImageCoverterPlugin;
