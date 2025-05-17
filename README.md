# vue-chrome-ext

#### 介绍
基于他人开源项目进行二创  可在项目代码查看原作者信息
用vue搭建了一套chrome扩展插件通用模板，涵盖了background，content_script，popup，option，devtool~
实现指定区域主动点赞,自动评论(自动评论功能仅适用于抖音直播)

#### 安装教程

1.  本人node环境 16
2.  npm i 下载所有依赖
3.  npm run build-watch 打包文件
4.  将打包后生成的dist文件夹拖入插件扩展中即可

## 📁 项目结构

```bash

vue2-chrome-ext-template/
├── public/                  # 静态资源
│   └── index.html
├── src/                     # 源码目录
│   ├── assets/              # 图片、样式等资源
│   ├── background/          # Chrome 扩展的后台脚本
│   ├── components/          # Vue 组件
│   ├── content/             # 注入页面的内容脚本
│   │   ├──APP/
│   │   │── APP.vue          # 自动点赞,评论代码(需要修改则在此处)
│   │   │──index.js
│   ├── devtools/            # Chrome DevTools 插件面板
│   ├── options/             # 扩展选项页
│   ├── popup/               # 扩展弹窗页面
│   └── utils/               # 工具函数
├── .gitignore
├── package.json
└── vue.config.js
```


#### 参与贡献
penk
李初一

