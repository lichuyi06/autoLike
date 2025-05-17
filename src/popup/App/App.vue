<!--
 * @Author: Penk
 * @LastEditors: Penk
 * @LastEditTime: 2023-10-09 15:25:49
 * @FilePath: \vue-chrome-ext-demo\src\popup\App\App.vue
-->
<template>
  <div class="penk_app">
    <h3>Hello {{ msg }}</h3>

    <hello></hello>

    <span>左键浏览器penk-ext插件即可显示</span>
  </div>
</template>

<script>
import hello from '../../components/hello.vue'
export default {
  name: 'app',
  components: {
    hello
  },
  data() {
    return {
      msg: 'popup',
    }
  },
  mounted() {
    console.log(`Hello ${this.msg}...`);
  },
}
</script>

<style>
/* 这里需要给大小，不然显示不了~ */
html {
  width: 200px;
  height: 400px;
}
</style>