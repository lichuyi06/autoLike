/*
 * @Author: Penk
 * @LastEditors: Penk
 * @LastEditTime: 2023-10-09 13:35:07
 * @Desc：options扩展，插件配置中-“选项” 里面就是它了~
 *        这里也只是单纯生成打包，还需要根据manifest.json文件指定路径
 * @FilePath: \vue-chrome-ext-demo\src\options\index.js
 */
import Vue from "vue";
import AppComponent from "./App/App.vue";
import 'element-ui/lib/theme-chalk/index.css';
import '../asserts/css/public.css';

Vue.component("app-component", AppComponent);

// 部分引入
// import {
//   Card,
//   Button
// } from 'element-ui';

// 部分引入
// Vue.use(Card);
// Vue.use(Button);

// 全局引入
import ElementUI from 'element-ui';
Vue.use(ElementUI,{size:"small"});

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});