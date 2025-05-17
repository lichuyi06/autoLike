/*
 * @Author: Penk
 * @LastEditors: Penk
 * @LastEditTime: 2023-10-09 13:52:48
 * @Desc：这个配置有点复杂，需要慢慢阅读了...
 *        另外，有时候有问题的话，可以试试手动重新加载插件，有可能是修改了这个文件的问题~
 * @FilePath: \vue-chrome-ext-demo\vue.config.js
 */
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const fs = require("fs");
const ZipPlugin = require('zip-webpack-plugin');

// Generate pages object
const pagesObj = {};


let plugins = []

// 配置"popup", "options", "devtools"
dealPerfectProjectByVue();

// 配置静态文件
dealStatic();

// 配置manifest文件
dealManifest();

// 配置devtools
dealDevtools();

// 配置有完整vue项目的chrome扩展项，background没有html页面，只能特殊处理...
// 配置background
dealBackground();

// 开发环境将热加载文件复制到dist文件夹
if (process.env.NODE_ENV !== 'production') {
  plugins.push(
    CopyWebpackPlugin([{
      from: path.resolve("src/background/hot-reload.js"),
      to: path.resolve("dist/background")
    }])
  )
}
// 生产环境打包dist为zip
else if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new ZipPlugin({
      path: path.resolve("dist"),
      filename: 'dist.zip',
    })
  )
}

module.exports = {
  // 可以打包多个...
  pages: pagesObj,
  // // 生产环境是否生成 sourceMap 文件
  productionSourceMap: true,
  configureWebpack: {
    resolve: {
      alias: {
        // 'src': '@', 默认已配置
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'api': '@/api',
        'views': '@/views',
        'plugins': '@/plugins',
        'utils': '@/utils',
      }
    },
    entry: {
      'content': './src/content/index.js'
    },
    output: {
      filename: 'js/[name].js'
    },
    plugins
  },
  css: {
    extract: {
      filename: 'css/[name].css'
    }
  },
  chainWebpack: config => {
    // 处理字体文件名，去除hash值
    const fontsRule = config.module.rule('fonts')

    // 清除已有的所有 loader。
    // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    fontsRule.uses.clear()
    fontsRule.test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .use('url')
      .loader('url-loader')
      .options({
        limit: 1000,
        name: 'fonts/[name].[ext]'
      })

    // 查看打包组件大小情况
    if (process.env.npm_config_report) {
      // 在运行命令中添加 --report参数运行， 如：npm run build --report
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  }
};

// 配置manifest文件
function dealManifest() {
  const manifest =
    process.env.NODE_ENV === "production" ? [{
      from: path.resolve("src/manifest.production.json"),
      to: `${path.resolve("dist")}/manifest.json`
    }] : [{
      from: path.resolve("src/manifest.development.json"),
      to: `${path.resolve("dist")}/manifest.json`
    }];

  plugins.push(CopyWebpackPlugin(manifest));
}

// 配置devtools
function dealDevtools() {
  // 读取devtools 目录文件
  var ret = fs.readdirSync('src/devtools');
  var devtools_panels = [];

  // 文件夹则打包
  ret.forEach(e => {
    var isDir = fs.lstatSync('src/devtools/' + e).isDirectory();

    if (isDir) {
      pagesObj[e] = {
        entry: `src/devtools/${e}/index.js`,
        template: "public/index.html",
        filename: `${e}.html`
      };

      devtools_panels.push(e);
    }
  })

  // 生成JSON文件
  var json = {
    panels: [...devtools_panels]
  }
  const content = JSON.stringify(json, null, "\t");
  // 生成临时文件devtools/index.json
  fs.writeFileSync("src/devtools/index.json", content, function (err) {
    if (err) {
      return console.log(err);
    }
  });

  // 将devtools/index.json文件打包到dist/devtools.json
  plugins.push(
    CopyWebpackPlugin([{
      from: path.resolve("src/devtools/index.json"),
      to: path.resolve("dist/devtools.json")
    }])
  )
}

// 配置background
function dealBackground() {
  plugins.push(
    CopyWebpackPlugin([{
      from: path.resolve("src/background/index.js"),
      to: path.resolve("dist/background")
    }])
  )
}

// 配置静态文件
function dealStatic() {
  // 引入图片
  plugins.push(
    CopyWebpackPlugin([{
      from: path.resolve("src/static"),
      to: path.resolve("dist/static")
    }])
  )
}

// 配置有完整vue项目的chrome扩展项，background没有html页面，只能特殊处理...
function dealPerfectProjectByVue() {
  const chromeName = ["popup", "options", "devtools"];

  chromeName.forEach(name => {
    pagesObj[name] = {
      entry: `src/${name}/index.js`,
      template: "public/index.html",
      filename: `${name}.html`
    };
  });
}