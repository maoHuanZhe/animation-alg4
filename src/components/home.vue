<template>
  <el-container id="app" ref="app">
    <el-header>
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
    </el-header>
    <el-main ref="main">
      <router-view/>
    </el-main>
    <el-footer>
      <el-link type="info" href="http://beian.miit.gov.cn/" target="_blank">皖ICP备2020015593号</el-link>
    </el-footer>
  </el-container>
</template>

<script>
    export default {
      name: "home"
      ,mounted() {
          //获取浏览器高度
          const mainHeight = document.documentElement.clientHeight;
          this.$refs.main.$el.style.height = (mainHeight-120-16) +'px';
      }
    }
</script>

<style scoped>

</style>
