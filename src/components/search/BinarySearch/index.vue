<template>
  <el-container>
    <el-main>
      <el-divider content-position="left">有序数组</el-divider>
      <el-row :key="mainKey" :gutter="20" style="background-color: gray;" ref="main">
        <div style="display: inline;margin-right: 10px;" v-for="(item,index) in keys" :key="item + '-div-' + index">
          <el-tag :type="getType(index)" >{{ item }}</el-tag>
          <el-tag size="mini" :type="getType(index)" >{{ vals[index] }}</el-tag>
        </div>
      </el-row>
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
      <SerachFooter method="BinarySearch" :text-arr="textArr" @clear="clear"></SerachFooter>
    </el-footer>
  </el-container>
</template>

<script>
    import SerachFooter from "../modules/SerachFooter";
    import { compareTo } from "../../../util/util";
    export default {
        name: "BinarySearch",
        components: {
            SerachFooter
        },
        data() {
            return {
                keys:[],
                vals:[],
                put_key:"",
                put_val:"",
                get_key:"",
                textArr:[],
                mainKey : 0,
                intervalID: -1,
                N:0,
                current:{}
            }
        },
        methods: {
            put(){
                const key = this.put_key;
                const val = this.put_val;
                const current = this.current;
                this.textArr.unshift("开始添加");
                current.lo = 0;
                current.hi = this.N - 1;
                current.i = null;
                this.intervalID = setInterval(()=>{
                    //判断rank函数是否结束
                    if (current.i != null){
                        //put函数
                        if (current.i < this.N && compareTo(key,this.keys[current.i]) === 0){
                            //当前键等于待添加的键
                            this.textArr.unshift("当前键等于待添加的键,更新val值");
                            //更新val值
                            this.$set(this.vals,current.i,val);
                            //    添加结束
                            this.stop();
                            this.textArr.unshift("添加结束");
                            this.current = {};
                        } else {
                            //当前键不等于待添加的键
                            this.textArr.unshift("将后面的数组后移一位 当前位置设置为待添加的键与值");
                            //将后面的数组后移一位 当前位置设置为待添加的键与值
                            for (let j = this.N;j>current.i;j--){
                                this.$set(this.keys,j,this.keys[j-1]);
                                this.$set(this.vals,j,this.vals[j-1]);
                            }
                            this.$set(this.keys,current.i,key);
                            this.$set(this.vals,current.i,val);
                            this.N++;
                            this.stop();
                            this.textArr.unshift("添加结束");
                            this.current = {};
                        }
                    } else {
                        //rank函数
                        if (current.lo <= current.hi) {
                            //查找未结束
                            current.mid = current.lo + Math.floor((current.hi - current.lo)/2);
                            const cmd = compareTo(key, this.keys[current.mid]);
                            if (cmd < 0){
                                //在左侧继续查找
                                this.textArr.unshift("当前键小于待添加的键,在左侧继续查找");
                                current.hi = current.mid - 1;
                            } else if (cmd > 0) {
                                //在右侧查找
                                this.textArr.unshift("当前键大于待添加的键,在右侧查找");
                                current.lo = current.mid + 1;
                            } else {
                                //找到了
                                this.textArr.unshift("当前键等于待添加的键,返回mid:"+current.mid);
                                current.i = current.mid;
                            }
                        } else {
                            //查找已结束
                            this.textArr.unshift("查找结束,返回lo:"+current.lo);
                            current.i = current.lo;
                        }
                    }
                    this.mainKey++;
                },500);
            },
            get(){
                const key = this.get_key;
                const current = this.current;
                this.textArr.unshift("开始获取");
                current.lo = 0;
                current.hi = this.N - 1;
                current.i = null;
                this.intervalID = setInterval(()=>{
                    //判断rank函数是否结束
                    if (current.i != null){
                        //put函数
                        if (current.i < this.N && compareTo(key,this.keys[current.i]) === 0){
                            //当前键等于待添加的键
                            this.textArr.unshift("当前键等于待获取的键,返回val："+this.vals[current.i]);
                            this.$message(this.vals[current.i] + "");
                            //    获取结束
                            this.stop();
                            this.textArr.unshift("获取结束");
                            this.current = {};
                        } else {
                            //当前键不等于待获取的键
                            this.$message("键不存在");
                            this.stop();
                            this.textArr.unshift("获取结束");
                            this.current = {};
                        }
                    } else {
                        //rank函数
                        if (current.lo <= current.hi) {
                            //查找未结束
                            current.mid = current.lo + Math.floor((current.hi - current.lo)/2);
                            const cmd = compareTo(key, this.keys[current.mid]);
                            if (cmd < 0){
                                //在左侧继续查找
                                this.textArr.unshift("当前键小于待获取的键,在左侧继续查找");
                                current.hi = current.mid - 1;
                            } else if (cmd > 0) {
                                //在右侧查找
                                this.textArr.unshift("当前键大于待获取的键,在右侧查找");
                                current.lo = current.mid + 1;
                            } else {
                                //找到了
                                this.textArr.unshift("当前键等于待获取的键,返回mid:"+current.mid);
                                current.i = current.mid;
                            }
                        } else {
                            //查找已结束
                            this.textArr.unshift("查找结束,返回lo:"+current.lo);
                            current.i = current.lo;
                        }
                    }
                    this.mainKey++;
                },500);
            },
            stop(){
                clearInterval(this.intervalID);
                this.intervalID = -1;
            },
            clear(){
                this.textArr = [];
            },
            getType(index){
                if (this.current && this.current.i == null){
                    if (index === this.current.mid) {
                        return "danger";
                    } else if (index >= this.current.lo && index <= this.current.hi){
                        return "warning";
                    } else {
                        return "";
                    }
                }else {
                    return "";
                }
            }
        }
    }
</script>

<style scoped>
  .tagClass{
    margin: 10px;
  }
</style>
