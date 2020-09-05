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
      <SortMain ref="main"  :key="menuKey" :current="current" :items="items" method="quick3way" :demo-tag="demoTag" :sort-state="sortState" :now="now" />
    </el-main>
    <el-footer>
      <SortFooter :text-arr="textArr" method="quick3way" :stack="stack" @clear="clear" />
    </el-footer>
  </el-container>
</template>

<script>
    import {createArr, exch} from "../../util/util";
    import {PlainDraggable} from "../../util/plain-draggable-limit.min";
    import SortHeader from "./modules/SortHeader";
    import SortMain from "./modules/SortMain";
    import SortFooter from "./modules/SortFooter";
    export default {
        name: "quick3way"
        ,components: {
            SortHeader,
            SortMain,
            SortFooter
        }
        ,data() {
            return {
                demoTag:[
                    {text:"未排序元素",type:"info",effect:"plain"},
                    {text:"当前切分的元素范围",type:"warning",effect:"plain"},
                    {text:"等于切分元素的元素",type:"",effect:"plain"},
                    {text:"当前切分的元素",type:"warning",effect:"dark"},
                    {text:"左侧元素",type:"danger",effect:"plain"},
                    {text:"右侧元素",type:"danger",effect:"dark"},
                ],
                menuKey:1
                //当前值
                ,current: {
                    //左侧下标
                    lt: "",
                    //右侧下标
                    gt: "",
                    //游标
                    i: ""
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
                ,intervalID:-1
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
                    this.stack.unshift({lo:0,lt:"",gt:"",hi:length-1})
                    //设置当前值
                    this.changeCurrent();
                    //设置排序状态为排序中
                    this.sortState = 2;
                } else if (this.sortState === 2) {
                    //排序中
                    const cmp = this.items[current.i] - this.items[current.lt];
                    if (cmp < 0){
                        this.textArr.unshift("当前元素小于切分元素");
                        if (this.hasAnimation){
                            this.animation(current.i++,current.lt++)
                        }else {
                            exch(this.items,current.i++,current.lt++);
                            this.changeCurrent();
                            this.menuKey++;
                        }
                    } else if (cmp > 0){
                        this.textArr.unshift("当前元素大于切分元素");
                        if (this.hasAnimation){
                            this.animation(current.i,current.gt--)
                        }else {
                            exch(this.items,current.i,current.gt--);
                            this.changeCurrent();
                            this.menuKey++;
                        }
                    }else {
                        this.textArr.unshift("当前元素等于切分元素");
                        current.i++;
                        this.changeCurrent();
                        this.menuKey++;
                    }
                } else if (this.sortState === 3) {
                    //已排序
                    this.$message({
                        message: '排序已经完成',
                        type: 'warning'
                    });
                    this.stop();
                }
            }
            ,animation(a,b){
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
                this.intervalIDanimation = setInterval(()=>{
                    if (conut === 10){
                        draggable_a.left += row - 9*Math.floor(row/10);
                        draggable_b.left -= row - 9*Math.floor(row/10);
                        draggable_a.top -= 10;
                        draggable_b.top += 10;
                        draggable_a.remove();
                        draggable_b.remove();
                        exch(this.items,a,b);
                        this.changeCurrent();
                        this.menuKey++;
                        clearInterval(this.intervalIDanimation);
                        this.intervalIDanimation = '';
                        if (this.sortState !== 3){
                            this.sort();
                        }
                    }else {
                        draggable_a.left += Math.floor(row/10);
                        draggable_b.left -= Math.floor(row/10);
                        conut++
                    }
                },90 - this.intervalTime);
            }
            ,getType(index){
                if (this.sortState === 0){
                    return 'info'
                } else if (this.sortState === 3){
                    return 'success';
                }else {
                    if (index > this.current.lt && index < this.current.i) {
                        return "";
                    } else if (index === this.current.i || index === this.current.gt) {
                        return "danger";
                    } else if (index >= this.now.lo && index <= this.now.hi) {
                        return 'warning';
                    } else {
                        return "info";
                    }
                }
            },
            getEffect(index){
              if (this.sortState === 2 && index === this.current.lt || index === this.current.gt){
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
             */
            changeCurrent(){
                let current = this.current;
                if (this.sortState === 1) {
                    //设置初始值
                    current.i = this.now.lo + 1;
                    current.lt = this.now.lo;
                    current.gt = this.now.hi;
                    //复制数组
                    this.items.forEach(((value, index) =>
                        this.$set(this.oldArr,index,value)
                    ))
                } else {
                    //设置当前栈的切分下标
                    if (current.i > current.gt){
                        this.now.lt = current.lt;
                        this.now.gt = current.gt;
                        const lo = this.now.lo;
                        const hi = this.now.hi;
                        if (hi > current.gt + 1){
                            this.stack.unshift({lo:current.gt + 1,lt:"",gt:"",hi});
                        }
                        if (current.lt -1 > lo){
                            this.stack.unshift({lo,lt:"",gt:"",hi:current.lt -1});
                        }
                        while (this.stack.length > 0 && this.now.lt !== "" && this.now.gt !== ""){
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
                            current.lt = this.now.lo;
                            current.gt = this.now.hi;
                        }
                    }
                }
                this.menuKey++;
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
                this.stack.length = 0;
                ++this.menuKey;
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
            },
            now(){
                return this.stack[0];
            }
        }
    }
</script>

<style scoped>

</style>
