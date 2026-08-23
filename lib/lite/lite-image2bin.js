"use strict";

var sharp = require("sharp"),
  fs = require("fs"),
  _path = require("path");
var decodeIco = require("decode-ico");

function img2bin(t, options) {
  console.info("img2bin: " + require("path").basename(t));
  return _img2bin(t, options);
}

async function _img2bin(e, options) {
  try {
    var input = e;
    var inputOptions = { animated: false, pages: 1 };
    var extension = _path.extname(e).toLowerCase();
    if (extension === ".ico") {
      var icon = getLargestIcoImage(fs.readFileSync(e));
      input = Buffer.from(icon.data.buffer, icon.data.byteOffset, icon.data.byteLength);
      if (icon.type === "bmp") inputOptions.raw = { width: icon.width, height: icon.height, channels: 4 };
    } else if (extension === ".svg") {
      input = addDefaultSvgDimensions(fs.readFileSync(e));
    }
    var result = await sharp(input, inputOptions).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    var width = result.info.width;
    var height = result.info.height;
    var rgba = result.data;
    if (options.generateBin) {
      var output = Buffer.allocUnsafe(8 + rgba.length);
      output.writeUInt32LE(256, 0);
      output.writeUInt32LE(width + (height << 16), 4);
      for (var i = 0, offset = 8; i < rgba.length; i += 4, offset += 4) {
        output[offset] = rgba[i + 2];
        output[offset + 1] = rgba[i + 1];
        output[offset + 2] = rgba[i];
        output[offset + 3] = rgba[i + 3];
      }
      fs.writeFileSync(options.outputPath.replace(/\.[^.]+$/, ".bin"), output);
    }
    if (options.toPng) await sharp(input, inputOptions).png().toFile(options.outputPath);
    console.info("img2bin done: " + require("path").basename(e));
  } catch (error) {
    var basename = _path.basename(e);
    console.error("[31m", "Failed to convert image ".concat(basename, "."), "[39m");
    throw error;
  }
}

function getLargestIcoImage(source) {
  var images = decodeIco(source);
  if (!images.length) throw new Error("ICO contains no images");
  return images.reduce(function (largest, image) {
    return image.width * image.height > largest.width * largest.height ? image : largest;
  });
}

function addDefaultSvgDimensions(svg) {
  var source = svg.toString();
  return Buffer.from(source.replace(/<svg\b([^>]*)>/i, function (tag, attributes) {
    // Browsers use a 300 by 150 CSS-pixel fallback viewport for an SVG without intrinsic dimensions.
    var width = getSvgLength(attributes, "width");
    var height = getSvgLength(attributes, "height");
    var viewBox = attributes.match(/\bviewBox\s*=\s*["']\s*[-+\d.]+(?:\s+|,)\s*[-+\d.]+(?:\s+|,)\s*([-+\d.]+)(?:\s+|,)\s*([-+\d.]+)\s*["']/i);
    var ratio = viewBox && Number(viewBox[1]) > 0 && Number(viewBox[2]) > 0 ? Number(viewBox[1]) / Number(viewBox[2]) : 0;
    if (width === null) attributes += ' width="' + (height !== null && ratio ? height * ratio : 300) + '"';
    if (height === null) attributes += ' height="' + (width !== null && ratio ? width / ratio : 150) + '"';
    return "<svg" + attributes + ">";
  }));
}

function getSvgLength(attributes, name) {
  var match = attributes.match(new RegExp("\\b" + name + "\\s*=\\s*[\"']\\s*([+-]?\\d*\\.?\\d+)(?:px)?\\s*[\"']", "i"));
  return match ? Number(match[1]) : null;
}
module.exports = img2bin;
