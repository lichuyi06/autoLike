<!--
 * @Author: Penk
 * @LastEditors: Penk
 * @LastEditTime: 2023-10-09 14:34:11
 * @FilePath: \vue-chrome-ext-demo\src\devtools\panel1\App\App.vue
-->
<template>
  <div class="penk_app">
    <h3>Hello {{ msg }}</h3>

    <hello></hello>

    <span>这个页面在F12控制台-panel1(跟console在同一级的菜单)。</span>
  </div>
</template>

<script>
import hello from '../../../components/hello.vue'
export default {
  name: 'app',
  components: {
    hello
  },
  data() {
    return {
      msg: 'panel1',
    }
  },
  mounted() {
    console.log(`Hello ${this.msg}...`);
  },
}
</script>

<style></style>