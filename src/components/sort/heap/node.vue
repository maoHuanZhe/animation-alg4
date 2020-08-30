<template>
  <el-row style="text-align: center;">
    <el-tag style="margin-bottom: 20px;" :type="getType(index)" ref="parent" @mouseover.native="show" @mouseout.native="hide">{{ items[index] }}</el-tag>
    <el-row v-if="hasLeft">
      <el-col :span="12" v-if="hasLeft">
        <node :items="items" :index="index * 2 + 1" ref="left"></node>
      </el-col>
      <el-col :span="12" v-if="hasRight">
        <node :items="items" :index="index * 2 + 2" ref="right"></node>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
    import {LeaderLine} from "../../../util/leader-line.min";
    export default {
        name: "node"
        ,props: {
            items: Array,
            index: Number
        }
        ,data() {
            return {
                left : '',
                rigth: ''
            }
        }
        ,mounted() {
            if (this.hasLeft){
                this.left = new LeaderLine(
                    this.$refs.parent.$el,
                    this.$refs.left.$children[0].$children[0].$el
                    , {hide: true}
                );
            }
            if (this.hasRight){
                this.right = new LeaderLine(
                    this.$refs.parent.$el,
                    this.$refs.right.$children[0].$children[0].$el
                    , {hide: true}
                );
            }
        }
        ,methods :{
            show(){
              if (this.hasLeft){
                this.left.show();
              }
              if (this.hasRight){
                  this.right.show();
              }
            },
            hide(){
                if (this.hasLeft){
                    this.left.hide();
                }

                if (this.hasRight){
                    this.right.hide();
                }
            },
            getType(index){
                // if (this.sortState === 0){
                //     return 'info'
                // } else if (this.sortState === 3){
                //     return 'success';
                // }else {
                //     if (index === this.current.min){
                //         return 'warning';
                //     } else if (index === this.current.outside || index === this.current.inner) {
                //         return 'danger';
                //     } else {
                //         return "info";
                //     }
                // }
                return 'success';
            }
        }
        ,computed:{
            hasLeft(){
                return (this.index + 1) * 2 <= this.items.length
            }
            ,hasRight(){
                return (this.index + 1) * 2 + 1 <= this.items.length
            }
        }
    }
</script>

<style scoped>

</style>
