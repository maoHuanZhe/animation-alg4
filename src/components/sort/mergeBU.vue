<template>
  <el-container>
    <el-header>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-input
              placeholder="输入一个数字或以逗号相隔的数组"
              v-model="imput"
              @blur="create"
              clearable>
          </el-input>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" @click="sort" icon="el-icon-video-play" :loading="intervalID!==''">开始</el-button>
          <el-button type="primary" @click="stop" icon="el-icon-video-pause">暂停</el-button>
          <el-button type="primary" @click="step" icon="el-icon-video-pause">下一步</el-button>
          <el-button type="primary" @click="finished" icon="el-icon-finished">跳过</el-button>
          <el-button type="primary" @click="refresh" icon="el-icon-refresh-right">重置</el-button>
        </el-col>
        <el-col :span="2">
          <el-slider v-model="intervalTime" :min="1" :max="99" @change="changeInterval" style="width:100px;"></el-slider>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-tag type="info" >未排序元素</el-tag>
        </el-col>
        <el-col :span="4">
          <el-tag type="warning" >当前归并的元素范围</el-tag>
        </el-col>
        <el-col :span="4">
          <el-tag type="danger" >当前归并的元素</el-tag>
        </el-col>
        <el-col :span="4">
          <el-tag type="success" >已排序元素</el-tag>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card" shadow="hover">
            <div slot="header">
              <span>左侧数组</span>
            </div>
            <div>
              <el-tag class="tagClass"
                      v-for="(item,index) in aux"
                      v-if="index>=current.i && index <= current.mid">{{item}}</el-tag>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" shadow="hover">
            <div slot="header">
              <span>右侧数组</span>
            </div>
            <div>
              <el-tag class="tagClass"
                      v-for="(item,index) in aux"
                      v-if="index>=current.j && index <= current.hi">{{item}}</el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="20" :key="menuKey">
      <el-tag class="tagClass" :type="getType(index)" v-for="(item,index) in items" :key="item + '-' + index">{{item}}</el-tag>
    </el-row>
    </el-main>
    <el-footer height="460px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card" shadow="hover">
            <div slot="header">
              <span>console</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="clear">clear</el-button>
            </div>
            <div class="consoleDiv" style="text-align: left;">
              <div v-for="(text,index) in textArr" :key="index">
                <el-link :underline="false" type="primary">{{text}}</el-link>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card" shadow="hover">
            <div slot="header">
              <span>code</span>
            </div>
            <div class="consoleDiv">
              <code>
                <pre>
private static Comparable[] aux;
public static void sort(Comparable[] a){
  int N = a.length;
  aux = new Comparable[N];
  for(int sz = 1;sz < N;sz *= 2){
    for(int lo = 0; lo < N -sz; lo += 2*sz){
      merge(a,lo,lo+sz-1,Math.min(lo+2*sz-1,N-1));
}
private static void merge(Comparable[] a,int lo,int mid,int hi){
  int i = lo;
  int j = mid + 1;
  for(int k = lo;k<=hi;k++) aux[k] = a[k];
  for(int k = lo;k<=hi;k++){
    if(i>mid) a[k] = aux[j++];
    else if(j>hi) a[k] = aux[i++];
    else if(less(aux[i],aux[j]) a[k] = aux[i++];
    else a[k] = aux[j++];
}
                </pre>
              </code>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
    import {less, createArr} from "../../util/util";
    export default {
        name: "merge"
        ,data() {
            return {
                imput: ''
                ,menuKey:1
                //当前值
                ,current: {
                    //左侧下标
                    i: "",
                    //右侧下标
                    j: "",
                    //当前下标
                    k: "",
                    //外循环
                    sz: "",
                    //内循环
                    lo: "",
                    //中间值
                    mid: "",
                    hi: ""
                },
                /**
                 * 排序状态
                 * 0:未排序
                 * 1:开始排序
                 * 2:排序中
                 * 3:排序完成
                 */
                sortState : 0
                //待排序数组
                ,items: []
                //辅助数组
                ,aux: []
                //未排序数组
                ,oldArr:[]
                //控制台数组
                ,textArr:[]
                //定时器编号
                ,intervalID:''
                //定时器速度
                ,intervalTime:50
            }
        },
        methods:{
            sort(){
                this.intervalID = setInterval(this.step,1000 - this.intervalTime*10);
            }
            ,step: function () {
                let current = this.current;
                const length = this.items.length;
                if (length <= 0){
                    this.$message({
                        message: '数组为空',
                        type: 'warning'
                    });
                    this.stop();
                    return;
                }
                //判断排序状态
                if (this.sortState === 0){
                    //未排序状态
                    //设置排序状态为开始排序
                    this.sortState = 1;
                    this.textArr.unshift('开始排序');
                    this.step();
                } else if (this.sortState === 1) {
                    //开始排序状态
                    //设置当前值
                    this.changeCurrent();
                    //设置排序状态为排序中
                    this.sortState = 2;
                } else if (this.sortState === 2) {
                    //排序中
                    //归并当前函数栈中
                    if (current.i > current.mid){
                        this.textArr.unshift("左侧数组用完 放右侧元素");
                        this.$set(this.items,current.k++,this.aux[current.j++]);
                    } else if(current.j>current.hi){
                        this.textArr.unshift("右侧数组用完 放左侧元素");
                        this.$set(this.items,current.k++,this.aux[current.i++]);
                    } else if (less(this.aux[current.i],this.aux[current.j])){
                        this.textArr.unshift("左侧元素比右侧元素小 放左侧元素");
                        this.$set(this.items,current.k++,this.aux[current.i++]);
                    } else {
                        this.textArr.unshift("左侧元素不比右侧元素小 放右侧元素");
                        this.$set(this.items,current.k++,this.aux[current.j++]);
                    }
                    //设置当前值
                    this.changeCurrent();
                } else if (this.sortState === 3) {
                    //已排序
                    this.$message({
                        message: '排序已经完成',
                        type: 'warning'
                    });
                }
            },
            getType(index){
                if (this.sortState === 0){
                    return 'info'
                } else if (this.sortState === 3){
                    return 'success';
                }else {
                    if (index === this.current.k) {
                        return "danger";
                    } else if (index >= this.current.lo && index <= this.current.hi) {
                        return 'warning';
                    } else {
                        return "info";
                    }
                }
            },
            getStyle(index){
              if (index === 0){
                  return "margin-top: 5px;background-color: lightsteelblue;";
              }
            },
            changeAux(){
                for (let k = this.current.lo;k<=this.current.hi;k++){
                    this.$set(this.aux,k,this.items[k]);
                }
            },
            /**
             * 改变当前值
             * @param flag 是否结束当前循环
             */
            changeCurrent(flag){
                let current = this.current;
                if (this.sortState === 1) {
                    current.sz = 1;
                    current.lo = 0;
                    current.mid = 0;
                    current.hi = 1;
                    current.i = 0;
                    current.j = 1;
                    current.k = 0;
                    this.changeAux();
                    //复制数组
                    this.items.forEach(((value, index) =>
                        this.$set(this.oldArr,index,value)
                    ))
                } else {
                  if (current.k > current.hi){
                      //当前范围归并结束
                      if (current.lo > this.items.length - 3*current.sz){
                          //内循环结束
                          if (current.sz *2  > this.items.length){
                              //排序完成
                              this.textArr.unshift("排序完成");
                              this.sortState = 3;
                              this.current = {};
                              this.stop();
                          } else {
                              //继续外循环
                              current.sz *=2;
                              current.lo = 0;
                              current.mid = current.sz -1;
                              current.hi = Math.min(current.sz * 2 - 1,this.items.length-1);
                              current.i = current.lo;
                              current.j = current.mid + 1;
                              current.k = current.lo;
                              this.changeAux();
                          }
                      } else {
                          //继续内循环
                          current.lo +=current.sz * 2;
                          current.mid = current.lo+current.sz -1;
                          current.hi = Math.min(current.lo+current.sz * 2 - 1,this.items.length-1);
                          current.i = current.lo;
                          current.j = current.mid + 1;
                          current.k = current.lo;
                          this.changeAux();
                      }
                  }
                }
                this.menuKey++;
            },
            //创建数组
            create(){
                this.refresh();
                createArr(this.imput,this.items);
            },
            clear(){
                this.textArr = [];
            },
            //跳过按钮点击事件
            finished(){
                this.stop();
                while (this.items.length > 0 && !this.isSort){
                    this.step();
                }
            },
            //暂停按钮
            stop(){
                clearInterval(this.intervalID);
                this.intervalID = '';
            },
            changeInterval(){
                this.stop();
                this.sort();
            },
            refresh(){
                this.stop();
                this.clear();
                if (this.oldArr.length > 0){
                    this.oldArr.forEach(((value, index) =>
                            this.$set(this.items,index,value)
                    ))
                }
                this.current = {}
                this.sortState = 0;
                ++this.menuKey;
            }
        },
        computed: {
            //是否排序完成
            isSort() {
                return this.sortState === 3;
            }
        }
    }
</script>

<style scoped>
  .tagClass{
    margin: 10px;
  }
  .consoleDiv{
    height: 315px;
    overflow: auto;
    text-align: left;
  }
</style>
