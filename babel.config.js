/*
 * Copyright (c) 2020 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = function (api) {
  api.cache(true);

  const presets = [[
    "@babel/preset-env",
    {
      targets: {
        esmodules: false,
        ie: "9",
      },
      loose: true,
      modules: "commonjs",
      debug: true,
      exclude: [
        "bugfix/transform-edge-default-parameters",
        "bugfix/transform-edge-function-name",
        "bugfix/transform-firefox-class-in-computed-class-key",
        "bugfix/transform-safari-class-field-initializer-scope",
        "bugfix/transform-safari-block-shadowing",
        "bugfix/transform-safari-for-shadowing",
        "bugfix/transform-v8-static-class-fields-redefine-readonly",
        "transform-async-generator-functions",
        "transform-async-to-generator",
        "transform-dynamic-import",
        "transform-function-name",
        "transform-modules-amd",
        "transform-modules-systemjs",
        "transform-modules-umd",
        "transform-regenerator",
        "transform-typeof-symbol",

        "transform-block-scoping",
        "transform-arrow-functions",
      ],
      corejs: false,
      helpers: true,
      regenerator: false,
      useBuiltIns: false,
    },
  ]];
  const plugins = [
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-transform-class-properties",
    "@babel/plugin-transform-runtime",
  ];

  return {
    presets,
    plugins,
  };
};
