<template>
  <el-container>
    <el-main>
      <el-divider content-position="left">有序数组</el-divider>
      <el-divider content-position="left">操作</el-divider>
      <el-row>
        <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
          <el-input v-model="put_key" placeholder="请输入键"></el-input>
        </el-col>
        <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
          <el-input v-model="put_val" placeholder="请输入值"></el-input>
        </el-col>
        <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2">
          <el-button :loading="intervalID !== -1" @click="put" type="primary">添加</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
          <el-input v-model="get_key" placeholder="请输入键"></el-input>
        </el-col>
        <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2">
          <el-button :loading="intervalID !== -1" @click="get" type="primary">获取</el-button>
        </el-col>
      </el-row>
    </el-main>
    <el-footer>
      <SerachFooter method="SequentialSearch" :text-arr="textArr" @clear="clear"></SerachFooter>
    </el-footer>
  </el-container>
</template>

<script>
    import SerachFooter from "../modules/SerachFooter";
    export default {
        name: "BinarySearch",
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
                item:null,
            }
        },
        methods: {
            put(){
                const key = this.put_key;
                const val = this.put_val;
                this.textArr.unshift("开始添加");
                this.item = this.first;
                this.intervalID = setInterval(()=>{
                    if (this.item != null){
                        if (this.item.key === key){
                            this.textArr.unshift("当前键值等于待添加的键值，更新val");
                            this.item.val = val;
                            this.stop();
                            this.textArr.unshift("添加结束");
                        } else {
                            this.textArr.unshift("当前键值不等于待添加的键值，继续查找");
                            this.item = this.item.next;
                        }
                    } else {
                        this.textArr.unshift("节点不存在，创建新的节点添加到链接头部");
                        this.first = new Node(key,val,this.first);
                        this.stop();
                        this.textArr.unshift("添加结束");
                    }
                },500);
            },
            get(){
                const key = this.get_key;
                this.textArr.unshift("开始获取");
                this.item = this.first;
                this.intervalID = setInterval(()=>{
                    if (this.item != null){
                        if (this.item.key === key){
                            this.textArr.unshift("当前键值等于待添加的键值，返回val:"+this.item.val);
                            this.$message(this.item.val + "");
                            this.stop();
                            this.textArr.unshift("获取结束");
                        } else {
                            this.textArr.unshift("当前键值不等于待获取的键值，继续查找");
                            this.item = this.item.next;
                        }
                    } else {
                        this.textArr.unshift("节点不存在，返回null");
                        this.$message("键不存在");
                        this.stop();
                        this.textArr.unshift("获取结束");
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
