<template>
  <div v-if="node != null" style="display: inline">
    <div  style="display: inline;margin-right: 10px;">
      <el-tag :type="type()" >{{node.key}}</el-tag>
      <el-tag size="mini">{{node.val}}</el-tag>
    </div>
    <Item v-if="node.next != null" :now="now" :node="node.next"></Item>
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
