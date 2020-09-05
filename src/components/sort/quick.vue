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
      <SortMain ref="main"  :key="menuKey" :current="current" :items="items" method="quick" :demo-tag="demoTag" :sort-state="sortState" :now="now" />
    </el-main>
    <el-footer>
      <SortFooter :text-arr="textArr" method="quick" :stack="stack" @clear="clear" />
    </el-footer>
  </el-container>
</template>

<script>
    import {less, createArr, exch} from "../../util/util";
    import {PlainDraggable} from "../../util/plain-draggable-limit.min";
    import SortHeader from "./modules/SortHeader";
    import SortMain from "./modules/SortMain";
    import SortFooter from "./modules/SortFooter";
    export default {
        name: "quick"
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
                    {text:"当前切分的元素",type:"warning",effect:"dark"},
                    {text:"左侧元素",type:"danger",effect:"plain"},
                    {text:"右侧元素",type:"danger",effect:"dark"},
                ]
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
                    let a;
                    const flag = current.i>=current.j;
                    if (flag){
                        //两个下标交叉以后 结束查找 交换元素 继续切分
                        this.textArr.unshift("将切分元素放到正确的位置");
                        a = this.now.lo;
                    }else {
                        this.textArr.unshift("交换元素 继续查找");
                        a = current.i;
                    }
                    if (this.hasAnimation){
                        this.animation(a,current.j,flag);
                    }else {
                        //将切分元素放到正确的位置
                        exch(this.items,a,current.j);
                        //设置当前值
                        this.changeCurrent(flag);
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
            ,animation(a,b,flag){
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
                    //设置当前值
                    this.changeCurrent(flag);
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
                    if (flag){
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
                    } else {
                        current.serachLeft = true;
                        current.serachRight = true;
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
