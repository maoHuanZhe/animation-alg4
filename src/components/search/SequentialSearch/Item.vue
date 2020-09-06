<template>
  <div v-if="node != null">
    <div  style="display: inline-block;margin-right: 10px;">
      <el-tag :type="type()" >{{node.key}}</el-tag>
      <el-tag size="mini">{{node.val}}</el-tag>
    </div>
    <div v-if="node.next != null" style="display: inline-block">
      <Item :now="now" :node="node.next"></Item>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Item",
        props:{
            node:Object,
            now:Object
        },
        methods:{
            type(){
                if (this.now == null){
                    return "";
                }
                return this.node.key === this.now.key ? "danger" : ""
            }
        }
    }
</script>

<style scoped>

</style>
