<template>
  <el-container>
    <el-main>
      <el-divider content-position="left">无序链表</el-divider>
      <el-row>
        <Item :key="itemKey" :now="item" :node="first"></Item>
      </el-row>
      <el-divider content-position="left">操作</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input v-model="put_key" placeholder="请输入键"></el-input>
        </el-col>
        <el-col :span="12">
          <el-input v-model="put_val" placeholder="请输入值">
            <el-button slot="append" :loading="intervalID !== -1" @click="put" type="primary">添加</el-button>
          </el-input>
        </el-col>
        <el-col :span="24">
          <el-input v-model="get_key" placeholder="请输入键">
            <el-button slot="append" :loading="intervalID !== -1" @click="get" type="primary">获取</el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <SerachFooter method="SequentialSearch" :text-arr="textArr" @clear="clear"></SerachFooter>
    </el-footer>
  </el-container>
</template>

<script>
  import Item from "./Item";
  import SerachFooter from "../modules/SerachFooter";
  import { Node } from "./node"
    export default {
        name: "SequentialSearch",
        components: {
          Item,
          SerachFooter
        },
        data() {
            return {
                first:null,
                put_key:"",
                put_val:"",
                get_key:"",
                textArr:[],
                intervalID: -1,
                itemKey: 1,
                item:null,
            }
        },
        methods: {
            put(){
                const key = this.put_key.trim();
                const val = this.put_val.trim();
                if (key === "" || val=== ""){
                    return this.$message("请输入的键和值");
                }
              this.textArr.unshift("开始添加");
              this.item = this.first;
              this.intervalID = setInterval(()=>{
                  if (this.item != null){
                      if (this.item.key === key){
                          this.textArr.unshift("当前键值等于待添加的键值，更新val");
                          this.item.val = val;
                          this.stop();
                          this.textArr.unshift("添加结束");
                          this.item = null;
                      } else {
                          this.textArr.unshift("当前键值不等于待添加的键值，继续查找");
                          this.item = this.item.next;
                      }
                  } else {
                      this.textArr.unshift("节点不存在，创建新的节点添加到链接头部");
                      this.first = new Node(key,val,this.first);
                      this.stop();
                      this.textArr.unshift("添加结束");
                      this.item = null;
                  }
                  this.itemKey++;
              },500);
            },
            get(){
                if (this.first === null){
                    return this.$message("链表为空");
                }
                const key = this.get_key.trim();
                if (key === ""){
                    return this.$message("请输入待获取的键");
                }
                this.textArr.unshift("开始获取");
                this.item = this.first;
                this.intervalID = setInterval(()=>{
                    if (this.item != null){
                        if (this.item.key === key){
                            this.textArr.unshift("当前键值等于待添加的键值，返回val:"+this.item.val);
                            this.$message(this.item.val + "");
                            this.stop();
                            this.textArr.unshift("获取结束");
                            this.item = null;
                        } else {
                            this.textArr.unshift("当前键值不等于待获取的键值，继续查找");
                            this.item = this.item.next;
                        }
                    } else {
                        this.textArr.unshift("节点不存在，返回null");
                        this.$message("键不存在");
                        this.stop();
                        this.textArr.unshift("获取结束");
                        this.item = null;
                    }
                },500);
            },
            stop(){
              clearInterval(this.intervalID);
              this.intervalID = -1;
            },
            clear(){
                this.textArr = [];
            }
        }
    }
</script>

<style scoped>

</style>
