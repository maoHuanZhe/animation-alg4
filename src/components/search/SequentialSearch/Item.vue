<template>
  <div v-if="node != null">
    <div :span="2" style="display: inline-block;margin-right: 10px;">
      <el-tag>{{node.key}}</el-tag>
      <el-tag size="mini">{{node.val}}</el-tag>
    </div>
    <div v-if="node.next != null" :span="2" style="display: inline-block">
      <Item :node="node.next"></Item>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Item",
        props:{
            node:Object
        }
    }
</script>

<style scoped>

</style>
