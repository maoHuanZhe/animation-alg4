<template>
  <el-container>
    <el-main>
      <el-divider content-position="left">有序数组</el-divider>
      <el-row :key="mainKey" :gutter="20" style="background-color: gray;" ref="main">
        <div style="display: inline;margin: 10px;" v-for="(item,index) in keys" :key="item + '-div-' + index">
          <el-tag style="margin-top: 10px;margin-bottom: 10px;" :type="getType(index)" >{{ item }}</el-tag>
          <el-tag size="mini" :type="getType(index)" >{{ vals[index] }}</el-tag>
        </div>
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
        <el-col :span="24">
          <el-input v-model="select_key" placeholder="请输入排名">
            <el-button slot="append" :loading="intervalID !== -1" @click="select" type="primary">选择</el-button>
          </el-input>
        </el-col>
        <el-col :span="24">
          <el-input v-model="rank_key" placeholder="请输入键">
            <el-button slot="append" :loading="intervalID !== -1" @click="rank" type="primary">排名</el-button>
          </el-input>
        </el-col>
        <el-col :span="24">
          <el-input v-model="delete_key" placeholder="请输入键">
            <el-button slot="append" :loading="intervalID !== -1" @click="rank" type="primary">删除</el-button>
          </el-input>
        </el-col>
        <el-col :span="24">
          <el-input v-model="floor_key" placeholder="请输入键">
            <el-button slot="append" :loading="intervalID !== -1" @click="rank" type="primary">向下取整</el-button>
          </el-input>
        </el-col>
        <el-col :span="24">
          <el-input v-model="ceil_key" placeholder="请输入键">
            <el-button slot="append" :loading="intervalID !== -1" @click="rank" type="primary">向上取整</el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button :loading="intervalID !== -1" @click="min" type="primary">最小值</el-button>
        </el-col>
        <el-col :span="8">
          <el-button :loading="intervalID !== -1" @click="max" type="primary">最大值</el-button>
        </el-col>
        <el-col :span="8">
          <el-button :loading="intervalID !== -1" @click="size" type="primary">长度</el-button>
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
                select_key:"",
                rank_key:"",
                delete_key:"",
                ceil_key:"",
                floor_key:"",
                textArr:[],
                mainKey : 0,
                intervalID: -1,
                N:0,
                current:{}
            }
        },
        methods: {
            put(){
                const key = this.put_key.trim();
                const val = this.put_val.trim();
                if (key === "" || val=== ""){
                    return this.$message("请输入的键和值");
                }
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
                if (this.isEmty()){
                    return this.$message("数组为空");
                }
                const key = this.get_key.trim();
                if (key === ""){
                    return this.$message("请输入待获取的键");
                }
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
                        } else {
                            //当前键不等于待获取的键
                            this.$message("键不存在");
                            this.textArr.unshift("键不存在");
                        }
                        this.stop();
                        this.textArr.unshift("获取结束");
                        this.current = {};
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
            select(){
                let select = 0;
                if (this.isEmty()){
                    this.$message("数组为空");
                } else {
                    if (this.select_key.trim() === ""){
                        this.$message("请输入正确的排名");
                        return;
                    }
                    try {
                        select = parseInt(this.select_key);
                    } catch (e) {
                        this.$message("请输入正确的排名");
                    }
                    if (select < 0 || select >= this.N){
                        this.$message("请输入正确的排名");
                        return;
                    }
                    const key = this.keys[select];
                    this.$message(key+"");
                }
            },
            min(){
                if (this.isEmty()){
                    this.$message("数组为空");
                } else {
                    const key = this.keys[0];
                    this.$message(key+"");
                }
            },
            max(){
                if (this.isEmty()){
                    this.$message("数组为空");
                } else {
                    const key = this.keys[this.N-1];
                    this.$message(key+"");
                }
            },
            size(){
                this.$message(this.N+"");
            },
            rank(){
                if (this.isEmty()){
                    return this.$message("数组为空");
                }
                const key = this.rank_key.trim();
                if (key === ""){
                    return this.$message("请输入待排名的键");
                }
                const current = this.current;
                this.textArr.unshift("开始排名");
                current.lo = 0;
                current.hi = this.N - 1;
                current.i = null;
                this.intervalID = setInterval(()=>{
                  if (current.lo <= current.hi) {
                      //查找未结束
                      current.mid = current.lo + Math.floor((current.hi - current.lo)/2);
                      const cmd = compareTo(key, this.keys[current.mid]);
                      if (cmd < 0){
                          //在左侧继续查找
                          this.textArr.unshift("当前键小于待排名的键,在左侧继续查找");
                          current.hi = current.mid - 1;
                      } else if (cmd > 0) {
                          //在右侧查找
                          this.textArr.unshift("当前键大于待排名的键,在右侧查找");
                          current.lo = current.mid + 1;
                      } else {
                          //找到了
                          this.textArr.unshift("当前键等于待排名的键,返回mid:"+current.mid);
                          this.$message(current.mid + "");
                          this.stop();
                          this.textArr.unshift("排名结束");
                          this.current = {};
                      }
                  } else {
                      //查找已结束
                      this.textArr.unshift("排名结束,返回lo:"+current.lo);
                      this.$message(current.lo + "");
                      this.stop();
                      this.textArr.unshift("排名结束");
                      this.current = {};
                  }
                  this.mainKey++;
                },500);
            },
            ceil(){
                if (this.isEmty()){
                    return this.$message("数组为空");
                }
                const key = this.ceil_key.trim();
                if (key === ""){
                    return this.$message("请输入待向上取整的键");
                }
                const current = this.current;
                this.textArr.unshift("开始向上取整");
                current.lo = 0;
                current.hi = this.N - 1;
                current.i = null;
                this.intervalID = setInterval(()=>{
                    //判断rank函数是否结束
                    if (current.i != null){
                        if (current.i >= this.N){
                            this.textArr.unshift("键不存在");
                            this.$message("键不存在");
                        } else {
                            this.textArr.unshift("返回"+this.keys[current.i]);
                            this.$message(this.keys[current.i] + "");
                        }
                        this.stop();
                        this.textArr.unshift("向上取整结束");
                        this.current = {};
                    } else {
                        //rank函数
                        if (current.lo <= current.hi) {
                            //查找未结束
                            current.mid = current.lo + Math.floor((current.hi - current.lo)/2);
                            const cmd = compareTo(key, this.keys[current.mid]);
                            if (cmd < 0){
                                //在左侧继续查找
                                this.textArr.unshift("当前键小于待向上取整的键,在左侧继续查找");
                                current.hi = current.mid - 1;
                            } else if (cmd > 0) {
                                //在右侧查找
                                this.textArr.unshift("当前键大于待向上取整的键,在右侧查找");
                                current.lo = current.mid + 1;
                            } else {
                                //找到了
                                this.textArr.unshift("当前键等于待向上取整的键,返回mid:"+current.mid);
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
            floor(){
                if (this.isEmty()){
                    return this.$message("数组为空");
                }
                const key = this.floor_key.trim();
                if (key === ""){
                    return this.$message("请输入待向下取整的键");
                }
                const current = this.current;
                this.textArr.unshift("开始向下取整");
                current.lo = 0;
                current.hi = this.N - 1;
                current.i = null;
                this.intervalID = setInterval(()=>{
                    //判断rank函数是否结束
                    if (current.i != null){
                        if (current.i < this.N && compareTo(key,this.keys[current.i]) === 0){
                            this.textArr.unshift("当前键等于待向下取整的键,返回kay："+this.keys[current.i]);
                            this.$message(this.keys[current.i] + "");
                        } else {
                            if (current.i >= 1){
                                this.textArr.unshift("当前键不等于待向下取整的键,返回kay："+this.keys[current.i-1]);
                                this.$message(this.keys[current.i-1] + "");
                            } else {
                                this.$message("键不存在");
                                this.textArr.unshift("键不存在");
                            }
                        }
                        this.stop();
                        this.textArr.unshift("向下取整结束");
                        this.current = {};
                    } else {
                        //rank函数
                        if (current.lo <= current.hi) {
                            //查找未结束
                            current.mid = current.lo + Math.floor((current.hi - current.lo)/2);
                            const cmd = compareTo(key, this.keys[current.mid]);
                            if (cmd < 0){
                                //在左侧继续查找
                                this.textArr.unshift("当前键小于待向下取整的键,在左侧继续查找");
                                current.hi = current.mid - 1;
                            } else if (cmd > 0) {
                                //在右侧查找
                                this.textArr.unshift("当前键大于待向下取整的键,在右侧查找");
                                current.lo = current.mid + 1;
                            } else {
                                //找到了
                                this.textArr.unshift("当前键等于待向下取整的键,返回mid:"+current.mid);
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
            del(){
                if (this.isEmty()){
                    return this.$message("数组为空");
                }
                const key = this.delete_key.trim();
                if (key === ""){
                    return this.$message("请输入待删除的键");
                }
                const current = this.current;
                this.textArr.unshift("开始删除");
                current.lo = 0;
                current.hi = this.N - 1;
                current.i = null;
                this.intervalID = setInterval(()=>{
                    //判断rank函数是否结束
                    if (current.i != null){
                        //put函数
                        if (current.i < this.N && compareTo(key,this.keys[current.i]) === 0){
                            //当前键等于待删除的键
                            this.textArr.unshift("当前键等于待删除的键,删除键，将后面的数组前移一位");
                            for (let j = current.i;j<this.N;j++){
                                this.$set(this.keys,j,this.keys[j+1]);
                                this.$set(this.vals,j,this.vals[j+1]);
                            }
                            this.keys.length--;
                            this.vals.length--;
                            this.N--;
                            this.stop();
                            this.textArr.unshift("删除结束");
                            this.current = {};
                        } else {
                            //当前键不等于待删除的键
                            this.textArr.unshift("键不存在");
                            this.$message("键不存在");
                            this.stop();
                            this.textArr.unshift("删除结束");
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
                                this.textArr.unshift("当前键小于待删除的键,在左侧继续查找");
                                current.hi = current.mid - 1;
                            } else if (cmd > 0) {
                                //在右侧查找
                                this.textArr.unshift("当前键大于待删除的键,在右侧查找");
                                current.lo = current.mid + 1;
                            } else {
                                //找到了
                                this.textArr.unshift("当前键等于待删除的键,返回mid:"+current.mid);
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
            isEmty(){
                return this.N === 0;
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
