<template>
  <el-container>
    <el-collapse style="padding-bottom: 20px">
      <el-collapse-item title="选择排序">
        <VueMarkdown :source="htmlMD"></VueMarkdown>
      </el-collapse-item>
    </el-collapse>
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
    <el-footer>
      <SortFooter :text-arr="textArr" method="select" :current="current" :line="line" @clear="clear" />
    </el-footer>
  </el-container>
</template>

<script>
    import {exch, less, createArr} from "../../util/util";
    import {PlainDraggable} from "../../util/plain-draggable-limit.min"
    import SortHeader from "./modules/SortHeader";
    import SortMain from "./modules/SortMain";
    import SortFooter from "./modules/SortFooter";
    import VueMarkdown from "vue-markdown";
    import axios from "axios";
    export default {
        name: "selection"
        ,components: {
            SortHeader,
            SortMain,
            SortFooter,
            VueMarkdown
        }
        ,data() {
            return {
                line:0,
                resetj:false,
                htmlMD:'',
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
                ,intervalTime:99
            }
        },
        methods:{
          sort(){
              this.intervalID = setInterval(()=>{
                  this.step();
              },1000 - this.intervalTime*10);
          }
          ,step: function () {
              let current = this.current;
              let line = this.line;
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
                //复制数组
                this.items.forEach(((value, index) =>
                        this.$set(this.oldArr,index,value)
                ))
                this.line = 1.1;
              } else if (this.sortState === 1) {
                  //开始排序状态
                  //设置当前值
                  if (line === 1.1){
                      current.outside = 0;
                      this.line = 1.2;
                      //设置排序状态为排序中
                      this.sortState = 2;
                  }
              } else if (this.sortState === 2) {
                  //排序中
                  switch (line) {
                    case 1.2:
                        if (current.outside < length) {
                            this.line = 2;
                        } else {
                            //排序完成
                            this.textArr.unshift("排序完成");
                            this.$message({
                                message: '排序完成',
                                type: 'success'
                            });
                            this.sortState = 3;
                            this.current = {};
                            this.line = 0;
                            this.stop();
                        }
                        this.menuKey++;
                        break;
                    case 1.3:
                        current.outside++;
                        this.line = 1.2;
                        this.menuKey++;
                        break;
                    case 2:
                        current.min = current.outside;
                        this.line = 3.1;
                        this.menuKey++;
                        break;
                    case 3.1:
                        current.inner = current.outside + 1;
                        this.line = 3.2;
                        this.menuKey++;
                        break;
                    case 3.2:
                        if (current.inner < length) {
                            this.line = 4;
                        } else {
                            this.line = 6;
                        }
                        this.menuKey++;
                        break;
                    case 3.3:
                        current.inner++;
                        this.line = 3.2;
                        this.menuKey++;
                        break;
                    case 4:
                        if (less(this.items[current.inner],this.items[current.min])) {
                            this.textArr.unshift('当前值小于最小值');
                            this.line++;
                        } else {
                            this.textArr.unshift('当前值不小于最小值');
                            this.line = 3.3;
                        }
                        this.menuKey++;
                        break;
                    case 5:
                        current.min = current.inner;
                        this.line = 3.3;
                        this.menuKey++;
                        break;
                    case 6:
                        this.textArr.unshift("交换数据");
                        if (this.hasAnimation){
                            this.animation(current.outside,current.min);
                        }else {
                            exch(this.items,current.outside,current.min)
                            this.line = 1.3;
                            this.menuKey++;
                        }
                        break;
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
          changeInterval(time){
              this.intervalTime = time;
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
                this.line = 0;
                ++this.menuKey;
          }
          ,animation(a,b){
              let current = this.current;
              if (a === b){
                this.line = 1;
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
                  this.line = 1;
                  this.menuKey++;
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
        },
        created() {
            const url = `./md/sort-selecttion.md`;
            axios.get(url).then((response) => {
                this.htmlMD = response.data;
            });
        }
    }
</script>

<style scoped>

</style>
