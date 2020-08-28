<template>
  <div id="app">
    <el-menu
        default-active="1"
        mode="horizontal"
        router>
      <el-menu-item index="/sort">
        <span slot="title">排序</span>
      </el-menu-item>
      <el-menu-item index="/search">
        <span slot="title">查找</span>
      </el-menu-item>
    </el-menu>
    <router-view/>
  </div>
</template>

<script>
    export default {
        name: "home"
    }
</script>

<style scoped>

</style>
