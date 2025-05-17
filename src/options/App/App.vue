<!--
 * @Author: Penk
 * @LastEditors: Penk
 * @LastEditTime: 2023-10-09 14:30:01
 * @FilePath: \vue-chrome-ext-demo\src\options\App\App.vue
-->
<template>
  <div class="penk_app">
    <h3>Hello {{ msg }}</h3>

    <hello></hello>

    <span>这个页面在扩展-详情-扩展程序选项</span>
  </div>
</template>

<script>
import hello from '@/components/hello'
export default {
  name: 'app',
  components: {
    hello
  },
  data() {
    return {
      msg: 'Options',
    }
  },
  mounted() {
    console.log(`Hello ${this.msg}...`);
  },
}
</script>

<style></style>