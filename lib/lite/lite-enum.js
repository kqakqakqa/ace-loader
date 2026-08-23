"use strict";

var SPECIAL_STYLE = {
  OPACITY: "opacity",
  BORDEROPACITY: "borderOpacity",
  ANIMATION_DELAY: "animationDelay",
  ANIMATION_DURATION: "animationDuration",
  ANIMATION_ITERATION_COUNT: "animationIterationCount",
  BACKGROUND_IMAGE: "backgroundImage",
  BACKGROUND_IMAGE_ACTIVE: "backgroundImage:active",
  BACKGROUND_IMAGE_CHECKED: "backgroundImage:checked"
};
var DEVICE_LEVEL = {
  RICH: "rich",
  LITE: "lite",
  CARD: "card"
};
var DEVICE_TYPE = {
  LITEWEARABLE: "liteWearable",
  SMARTVISION: "smartVision"
};
var PLATFORM = {
  VERSION3: "Version3",
  VERSION4: "Version4",
  VERSION5: "Version5",
  VERSION6: "Version6"
};
var REGEXP_NUMBER_PX = /^[-+]?[0-9]*\.?[0-9]+(px|cm|em|deg|rad)?$/;
var REGEXP_COLOR = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/;
var REGEXP_UNIT = /px|cm|em|deg|rad/;
var REGEXP_IMAGE = /\.(png|jpe?g|bmp|gif|webp|tiff?|ico|avif|svg)$/i;
var REGXP_QUOTES = /"|'/g;
var REGXP_LANGUAGE = /\$t/;
var REGXP_LANGUAGE_KEY = /_vm\.\$t\([^()]+?\)/g;
var REGXP_FUNC_RETURN = /return(.*)}/g;
exports.SPECIAL_STYLE = SPECIAL_STYLE;
exports.REGEXP_NUMBER_PX = REGEXP_NUMBER_PX;
exports.REGEXP_COLOR = REGEXP_COLOR;
exports.REGEXP_UNIT = REGEXP_UNIT;
exports.DEVICE_LEVEL = DEVICE_LEVEL;
exports.REGEXP_IMAGE = REGEXP_IMAGE;
exports.REGXP_QUOTES = REGXP_QUOTES;
exports.DEVICE_TYPE = DEVICE_TYPE;
exports.REGXP_LANGUAGE = REGXP_LANGUAGE;
exports.REGXP_LANGUAGE_KEY = REGXP_LANGUAGE_KEY;
exports.REGXP_FUNC_RETURN = REGXP_FUNC_RETURN;
exports.PLATFORM = PLATFORM;