/*
 * @Author: Penk
 * @LastEditors: Penk
 * @LastEditTime: 2022-06-22 16:23:40
 * @FilePath: \vue-extension\babel.config.js
 */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
