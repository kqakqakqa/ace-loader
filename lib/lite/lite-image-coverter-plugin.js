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
var registerRequireContextHook = require("babel-plugin-require-context-hook/register");
var _require = require("./lite-enum");
var REGEXP_PNG = _require.REGEXP_PNG;
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
          return global.__requireContext("", e, !0, REGEXP_PNG).keys().map(function (r) { return _path.join(e, r) })
        }
      },
      {
        key: "apply",
        value: function (e) {
          var r = this.options.build;
          var t = this.getDir;
          e.hooks.done.tap(
            "image coverter",
            function (e, i) {
              var n = t(r);
              var o = function (e) {
                // fs.writeFile(
                //   _path.resolve(r, "image_convert_result.txt"),
                //   e,
                //   function (e) { if (e) return console.error(e) }
                // )
                if (e) return console.error(e);
              };
              var renameNobin = function (filePath) {
                var basename = _path.basename(filePath, _path.extname(filePath));
                if (basename.endsWith('--img2bin-nobin')) {
                  var newBasename = basename.replace(/--img2bin-nobin/g, '');
                  var newPath = _path.join(_path.dirname(filePath), newBasename + _path.extname(filePath));
                  if (!fs.existsSync(newPath)) {
                    fs.renameSync(filePath, newPath);
                    console.info("Renamed: " + require("path").basename(filePath) + " -> " + require("path").basename(newPath));
                  } else {
                    fs.unlinkSync(filePath);
                    console.info("Removed duplicate: " + require("path").basename(filePath));
                  }
                  return newPath;
                }
                return filePath;
              };
              var binTasks = [];
              n.forEach(function (e) {
                var basename = _path.basename(e, _path.extname(e));
                if (basename.endsWith('--img2bin-nobin')) {
                  var renamed = renameNobin(e);
                  console.info("Skipping conversion for: " + require("path").basename(e));
                } else {
                  binTasks.push(img2bin(e));
                }
              });
              if (binTasks.length > 0) {
                Promise.all(binTasks).
                  then(function () { console.info("ImageCoverterPlugin done"); o("{exitCode:0}") }).
                  catch(function () { console.info("ImageCoverterPlugin failed"); o("{exitCode:1}") })
              } else o("{exitCode:0}");
              "" !== iconPath && t(iconPath).forEach(function (e) {
                var basename = _path.basename(e, _path.extname(e));
                if (basename.endsWith('--img2bin-nobin')) {
                  renameNobin(e);
                  console.info("Skipping conversion for: " + require("path").basename(e));
                  return;
                }
                img2bin(e);
              })
            }
          )
        }
      }
    ]
  ), e
}();
module.exports = ImageCoverterPlugin;