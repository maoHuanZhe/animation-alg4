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
          <el-tag type="warning" >当前切分的元素范围</el-tag>
        </el-col>
        <el-col :span="4">
          <el-tag type="warning" effect="dark" >当前切分的元素</el-tag>
        </el-col>
        <el-col :span="4">
          <el-tag type="danger" >左侧元素</el-tag>
        </el-col>
        <el-col :span="4">
          <el-tag type="danger" effect="dark" >右侧元素</el-tag>
        </el-col>
        <el-col :span="4">
          <el-tag type="success" >已排序元素</el-tag>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-row :gutter="20" :key="menuKey">
          <el-tag class="tagClass" :type="getType(index)" :effect="getEffect(index)" v-for="(item,index) in items" :key="item + '-' + index">{{item}}</el-tag>
        </el-row>
        </el-col>
        <el-col :span="6" v-if="stack.length > 0">
          <el-card class="box-card" shadow="hover">
            <div slot="header">
              <span>函数栈</span>
            </div>
            <div class="consoleDiv">
              <el-row :gutter="5">
                <el-col :span="8">
                  <el-tag type="danger">lo</el-tag>
                </el-col>
                <el-col :span="8">
                  <el-tag type="danger">j</el-tag>
                </el-col>
                <el-col :span="8">
                  <el-tag type="danger">hi</el-tag>
                </el-col>
              </el-row>
              <el-row :gutter="5" v-for="(args, index) in stack" :style="getStyle(index)">
                <el-col :span="8">
                  <el-tag>{{args.lo}}</el-tag>
                </el-col>
                <el-col :span="8">
                  <el-tag>{{args.j}}</el-tag>
                </el-col>
                <el-col :span="8">
                  <el-tag>{{args.hi}}</el-tag>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
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
public static void sort(Comparable[] a){
  sort(a,0,a.length-1);
}
private static void sort(Comparable[] a,int lo,int hi){
  if(lo >= hi)  return;
  int j = pratition(a,lo,hi);
  sort(a,lo,j-1)
  sort(a,j+1,hi);
}
private static int pratition(Comparable[] a,int lo,int mid,int hi){
  int i = lo;
  int j = hi + 1;
  Comparable v = a[lo];
  while(true){
    while(less(a[++i],v)) if(i == hi) break;
    while(less(v,a[--j])) if(j == lo) break;
    if(i>=j) break;
    exch(a,i,j);
  }
  exch(a,lo,j);
  return j;
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
    import {less, createArr, exch} from "../../util/util";
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
                    //左侧下标是否找到
                    serachLeft:false,
                    //右侧下标是否找到
                    serachRight:false
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
                //未排序数组
                ,oldArr:[]
                //函数栈
                ,stack:[]
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
                    //获取函数栈
                    this.stack.unshift({lo:0,j:"",hi:length-1})
                    //设置当前值
                    this.changeCurrent();
                    //设置排序状态为排序中
                    this.sortState = 2;
                } else if (this.sortState === 2) {
                    //排序中
                    //找到左侧比切分元素大的元素
                    if (current.serachLeft){
                        //左侧坐标还未确定
                        if (less(this.items[current.i],this.items[this.now.lo])){
                            //当前元素小于切分元素
                            this.textArr.unshift("左侧元素小于切分元素");
                            if (current.i === this.now.hi){
                                //已到达最右侧 结束查找
                                current.serachLeft = false;
                            } else {
                                current.i++;
                            }
                        } else {
                            //当前元素不小于切分元素
                            this.textArr.unshift("左侧元素不小于切分元素");
                            //结束查找
                            current.serachLeft = false;
                        }
                        this.menuKey++;
                        return;
                    }
                    //找到右侧比切分元素小的元素
                    if (current.serachRight){
                        //右侧坐标还未确定
                        if (!less(this.items[this.now.lo],this.items[current.j])){
                            //当前元素大于切分元素
                            //结束查找
                            current.serachRight = false;
                            this.textArr.unshift("右侧侧元素大于切分元素");
                        } else {
                            current.j--;
                            this.textArr.unshift("右侧侧元素不大于切分元素");
                        }
                        this.menuKey++;
                        return;
                    }
                    //比较两个下标
                    if (current.i>=current.j){
                        //两个下标交叉以后 结束查找 交换元素 继续切分
                        //将切分元素放到正确的位置
                        exch(this.items,this.now.lo,current.j);
                        this.textArr.unshift("将切分元素放到正确的位置");
                        //设置当前值
                        this.changeCurrent();
                    }else {
                        //满足条件就 交换元素 继续查找
                        exch(this.items,current.i,current.j);
                        this.textArr.unshift("交换元素 继续查找");
                        current.serachLeft = true;
                        current.serachRight = true;
                    }
                    this.menuKey++;
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
                    if (index === this.current.i || index === this.current.j) {
                        return "danger";
                    } else if (index >= this.now.lo && index <= this.now.hi) {
                        return 'warning';
                    } else {
                        return "info";
                    }
                }
            },
            getEffect(index){
              if (this.sortState === 2 && index === this.now.lo || index === this.current.j){
                  return "dark";
              }
            },
            getStyle(index){
              if (index === 0){
                  return "margin-top: 5px;background-color: lightsteelblue;";
              }
            },
            /**
             * 改变当前值
             * @param flag 是否结束当前循环
             */
            changeCurrent(flag){
                let current = this.current;
                if (this.sortState === 1) {
                    //设置初始值
                    current.i = this.now.lo + 1;
                    current.j = this.now.hi;
                    current.serachLeft = true;
                    current.serachRight = true;
                    //复制数组
                    this.items.forEach(((value, index) =>
                        this.$set(this.oldArr,index,value)
                    ))
                } else {
                    //设置当前栈的切分下标
                    this.now.j = current.j;
                    const lo = this.now.lo;
                    const hi = this.now.hi;
                    if (hi > current.j + 1){
                        this.stack.unshift({lo:current.j + 1,j:"",hi});
                    }
                    if (current.j -1 > lo){
                        this.stack.unshift({lo,j:"",hi:current.j -1});
                    }
                    while (this.stack.length > 0 && this.now.j !== ""){
                        this.stack.shift();
                    }
                    if (this.stack.length === 0){
                        //排序完成
                        this.textArr.unshift("排序完成");
                        this.sortState = 3;
                        this.current = {};
                        this.stop();
                    } else {
                        current.i = this.now.lo + 1;
                        current.j = this.now.hi;
                        current.serachLeft = true;
                        current.serachRight = true;
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
                this.stack.length = 0;
                ++this.menuKey;
            }
        },
        computed: {
            //是否排序完成
            isSort() {
                return this.sortState === 3;
            },
            now(){
                return this.stack[0];
            }
        }
    }
</script>

<style scoped>
  .tagClass{
    margin: 10px;
  }
  .consoleDiv{
    height: 380px;
    overflow: auto;
    text-align: left;
  }
</style>
