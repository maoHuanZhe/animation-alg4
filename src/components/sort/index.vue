<template>
  <div>
    <el-menu
        default-active="1"
        mode="horizontal"
        router>
      <el-menu-item index="/sort/selection">
        <span slot="title">选择排序</span>
      </el-menu-item>
      <el-menu-item index="/sort/insertion">
        <span slot="title">插入排序</span>
      </el-menu-item>
      <el-menu-item index="/sort/shell">
        <span slot="title">希尔排序</span>
      </el-menu-item>
      <el-menu-item index="/sort/merge">
        <span slot="title">归并排序</span>
      </el-menu-item>
      <el-menu-item index="/sort/mergeBU">
        <span slot="title">归并排序2</span>
      </el-menu-item>
      <el-menu-item index="/sort/quick">
        <span slot="title">快速排序</span>
      </el-menu-item>
      <el-menu-item index="/sort/quick3way">
        <span slot="title">三分快速排序</span>
      </el-menu-item>
      <el-menu-item index="/sort/heap">
        <span slot="title">堆排序</span>
      </el-menu-item>
    </el-menu>
    <!-- 对应的组件内容渲染到router-view中 -->

    <router-view/>
  </div>
</template>

<script>
    export default {
        name: "index"
    }
</script>

<style scoped>

</style>
