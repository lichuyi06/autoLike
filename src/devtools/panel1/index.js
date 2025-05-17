/*
 * @Author: Penk
 * @LastEditors: Penk
 * @LastEditTime: 2023-10-09 14:09:19
 * @FilePath: \vue-chrome-ext-demo\src\devtools\panel1\index.js
 */
import Vue from "vue";
import AppComponent from "./App/App.vue";
import 'element-ui/lib/theme-chalk/index.css';
import '../../asserts/css/public.css';

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
