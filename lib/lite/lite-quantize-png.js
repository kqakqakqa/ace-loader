"use strict";

var fs = require("fs");
var _path = require("path");
var LibImageQuant = require("libimagequant-wasm/node");

// 原来这里调的是本机的 pngquant.exe（execFile("pngquant", ["--force", "--output", ...])），
// 现在换成 libimagequant-wasm：同一个 libimagequant 内核编成的 WASM，Node 侧跑一个 worker 线程，
// 构建链因此不再依赖本机装没装 pngquant。
//
// 参数照 pngquant 的默认值写死，不写就会落回库自己的默认：
//   --quality=<q>-<q>  → quality: { min: q, target: q }，min 和 max 都锁在 q
//   maxColors 256 / speed 3 / dithering 1   ← pngquant 不传这三个参数时的取值
//
// 实测（atri-mdm 的 bg-homepage --nobin.png，853x480、32 色，quality 80）：量化后 30 色、
// 到达质量 0.950、单张 172 ms；紧接着跑第二张只要 9 ms（worker 已热）。
// **输出不再和 pngquant 字节一致** —— pngquant 用 libpng 写盘，这里用 png-rs，
// 对齐的是「色数 / 质量阈值」这层语义，字节别拿来做对照。
function createPngQuantizer() {
  var quantizer = null;

  // worker + WASM 初始化只在第一次真正用到时付：实测首张 140 ms，之后 ~9 ms。
  // 工程里一张带 --pngquant 的图都没有的话，这里一分钱不花。
  function getQuantizer() {
    if (quantizer === null) quantizer = new LibImageQuant();
    return quantizer;
  }

  return {
    // 量化后直接覆盖原文件，对应 pngquant 的 --force --output <同一个文件>
    quantizeFile: async function (filePath, quality) {
      var result;
      try {
        result = await getQuantizer().quantizePng(fs.readFileSync(filePath), {
          maxColors: 256,
          speed: 3,
          dithering: 1,
          quality: { min: quality, target: quality }
        });
      } catch (error) {
        // 达不到 min 质量时库抛 QUALITY_TOO_LOW，原来那版是靠 pngquant 非零退出把它变成构建失败
        throw new Error("libimagequant failed for " + _path.basename(filePath) + ": " + error.message);
      }
      fs.writeFileSync(filePath, Buffer.from(result.pngBytes.buffer, result.pngBytes.byteOffset, result.pngBytes.byteLength));
      return result.quality;
    },
    // 必须调：worker 线程不收回，构建进程退不出去
    dispose: function () {
      if (quantizer !== null) quantizer.dispose();
      quantizer = null;
    }
  };
}

module.exports = createPngQuantizer;
