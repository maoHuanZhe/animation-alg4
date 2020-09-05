<template>
  <el-container>
    <el-header>
      <SortHeader
          :current="current"
          :items="items"
          :interval-i-d="intervalID"
          :interval-time="intervalTime"
          :old-arr="oldArr"
          :sort-state="sortState"
          :text-arr="textArr"
          @step="step"
          @stop="stop"
          @refresh="refresh"
          @create="create"
          @changeInterval="changeInterval"
          @finished="finished"
          @sort="sort"
      ></SortHeader>
    </el-header>
    <el-main>
      <SortMain ref="main"  :key="menuKey" :current="current" :items="items" method="select" :demo-tag="demoTag" :sort-state="sortState" />
    </el-main>
    <el-footer height="290px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card" shadow="hover">
            <div slot="header" style="text-align: center">
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
            <div slot="header" style="text-align: center">
              <span>code</span>
            </div>
            <div class="consoleDiv">
              <code>
                <pre>
for(int i = 0;i < arr.size(); i++;){
  for(int j = i + 1; j< arr.size(); j++;){
    int min = i;
    if(less(arr[j],arr[min]){
      min = j;
    }
  }
  exch(arr,i,min);
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
    import {exch, less, createArr} from "../../util/util";
    import {PlainDraggable} from "../../util/plain-draggable-limit.min"
    import SortHeader from "./modules/SortHeader";
    import SortMain from "./modules/SortMain";
    export default {
        name: "selection"
        ,components: {
            SortHeader,
            SortMain
        }
        ,data() {
            return {
                demoTag:[
                    {text:"未排序元素",type:"info",effect:"plain"},
                    {text:"比较元素",type:"danger",effect:"plain"},
                    {text:"当前最小元素",type:"warning",effect:"plain"},
                    {text:"已排序元素",type:"success",effect:"plain"}
                ],
                menuKey:1
                //当前值
                ,current: {
                    //外循环下标
                    outside: '',
                    //当前最小值下表
                    min: '',
                    //内循环下标
                    inner: ''
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
                //控制台数组
                ,textArr:[]
                //定时器编号
                ,intervalID:-1
                //动画定时器
                ,intervalIDanimation : ''
                //定时器速度
                ,intervalTime:50
            }
        },
        methods:{
          sort(){
              if (this.items.length <= 0){
                  this.$message({
                      message: '数组为空',
                      type: 'warning'
                  });
                  return;
              }
              this.intervalID = setInterval(()=>{
                  this.step();
              },1000 - this.intervalTime*10);
          }
          ,step: function () {
              let current = this.current;
              const length = this.items.length;
              if (length <= 0){
                  this.$message({
                      message: '数组为空',
                      type: 'warning'
                  });
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
                  current.outside = 0;
                  current.min = 0;
                  current.inner = 1;
                  //复制数组
                  this.items.forEach(((value, index) =>
                      this.$set(this.oldArr,index,value)
                  ))
                  //设置排序状态为排序中
                  this.sortState = 2;
              } else if (this.sortState === 2) {
                  //排序中
                  //判断外循环
                  if (current.outside < length){
                      //判断内循环的值
                      if (current.inner < length) {
                          //比较当前内循环的值与最小值 小于就交换
                          if (less(this.items[current.inner],this.items[current.min])) {
                              this.textArr.unshift('当前值小于最小值');
                              current.min = current.inner++;
                          } else {
                              this.textArr.unshift('当前值不小于最小值');
                              current.inner++;
                          }
                          this.menuKey++;
                      } else {
                          //内循环结束
                          this.textArr.unshift("交换数据");
                          if (this.hasAnimation){
                              this.animation(current.outside,current.min);
                          }else {
                              exch(this.items,current.outside,current.min)
                              //设置最小值
                              current.min = ++current.outside;
                              //外循环加一
                              current.inner = current.outside + 1;
                              ++this.menuKey;
                          }
                      }
                  } else {
                      //外循环结束
                      //排序完成
                      this.textArr.unshift("排序完成");
                      this.$message({
                          message: '排序完成',
                          type: 'success'
                      });
                      this.sortState = 3;
                      this.current = {};
                      this.stop();
                  }
              } else if (this.sortState === 3) {
                  //已排序
                  this.$message({
                      message: '排序已经完成',
                      type: 'warning'
                  });
                  this.stop();
              }
          },
          //创建数组
          create(imput){
              this.refresh();
              createArr(imput,this.items);
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
              this.intervalID = -1;
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
          ,animation(a,b){
              let current = this.current;
              if (a === b){
                //设置最小值
                current.min = ++current.outside;
                //外循环加一
                current.inner = current.outside + 1;
                return
              }
              this.stop();
              //a所在的行
              const a_row = Math.floor(a/this.lineNum);
              //a所在的列
              const a_col = Math.floor(a%this.lineNum);
              //b所在的行
              const b_row = Math.floor(b/this.lineNum);
              //b所在的列
              const b_col = Math.floor(b%this.lineNum);
              let draggable_a = new PlainDraggable(this.$refs.main.$refs['tag'+a][0].$el);
              let draggable_b = new PlainDraggable(this.$refs.main.$refs['tag'+b][0].$el);
              draggable_a.top += (10 + (b_row - a_row)*52);
              draggable_b.top -= (10 + (b_row - a_row)*52);
              let conut = 1;
              const row = (b_col - a_col)*65;
              const ina = setInterval(()=>{
                if (conut === 10){
                  draggable_a.left += row - 9*Math.floor(row/10);
                  draggable_b.left -= row - 9*Math.floor(row/10);
                  draggable_a.top -= 10;
                  draggable_b.top += 10;
                  draggable_a.remove();
                  draggable_b.remove();
                  //交换
                  exch(this.items,current.outside,current.min)
                  //设置最小值
                  current.min = ++current.outside;
                  //外循环加一
                  current.inner = current.outside + 1;
                  ++this.menuKey;
                  clearInterval(ina);
                  this.sort();
                }else {
                  draggable_a.left += Math.floor(row/10);
                  draggable_b.left -= Math.floor(row/10);
                  conut++
                }
              },100 - this.intervalTime);
          }
        },
        computed: {
            //是否排序完成
            isSort() {
                return this.sortState === 3;
            },
            hasAnimation(){
                return this.$store.state.hasAnimation;
            },
            lineNum(){
                return this.$store.state.lineNum;
            }
        }
    }
</script>

<style scoped>

  .consoleDiv{
    height: 210px;
    overflow: auto;
  }
</style>
