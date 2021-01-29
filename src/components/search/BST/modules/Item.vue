<template>
  <el-row style="text-align: center;">
    <el-tag size="mini" style="margin-bottom: 20px;" :type="getType()">{{ node.N }}</el-tag>
    <el-tag :size="getSize()" style="margin-bottom: 20px;" :type="getType()">{{ node.key }}</el-tag>
    <el-tag size="mini" style="margin-bottom: 20px;" :type="getType()">{{ node.val }}</el-tag>
    <el-row v-if="hasLeft || hasRight">
      <el-col :span="12" v-if="hasLeft">
        <Item :node="node.left"></Item>
      </el-col>
      <el-col :span="12" :offset="hasLeft?0:12" v-if="hasRight">
        <Item :node="node.right"></Item>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
    export default {
        name: "Item"
        ,props: {
            node:Object
        }
        ,methods :{
            getSize(){
                const size = this.$store.state.size;
                if (size === 'xl'){
                    return "medium"
                } else {
                    return "small"
                }
            },
            getType(){
                // if (this.sortState === 0){
                    return 'info'
                // } else if (this.sortState === 3){
                //     return 'success';
                // }else {
                //     if (index === this.current.k){
                //         return 'warning';
                //     } else if (index === this.current.j) {
                //         return 'danger';
                //     } else if (index >= this.current.N){
                //         return 'success';
                //     } else {
                //         return "info";
                //     }
                // }
            }
        }
        ,computed:{
            hasLeft(){
                return this.node.left != null
            }
            ,hasRight(){
                return this.node.right != null
            }
        }
    }
</script>

<style scoped>

</style>
