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
      <SortMain ref="main"  :key="menuKey" :current="current" :items="items" method="shell" :demo-tag="demoTag" :sort-state="sortState" />
    </el-main>
    <el-footer>
      <SortFooter :text-arr="textArr" method="shell" @clear="clear" />
    </el-footer>
  </el-container>
</template>

<script>
    import {createArr, exch, less} from "../../util/util";
    import {PlainDraggable} from "../../util/plain-draggable-limit.min";
    import SortHeader from "./modules/SortHeader";
    import SortMain from "./modules/SortMain";
    import SortFooter from "./modules/SortFooter";
    export default {
        name: "selection"
        ,components:{
            SortHeader,
            SortMain,
            SortFooter
        }
        ,data() {
            return {
                demoTag:[
                    {text:"未排序元素",type:"info",effect:"plain"},
                    {text:"比较元素",type:"danger",effect:"plain"},
                    {text:"外循环元素",type:"warning",effect:"plain"}
                ],
                menuKey:1
                //当前值
                ,current: {
                    //外循环下标
                    outside: '',
                    //内循环下标
                    inner: '',
                    //循环序列
                    h: ''
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
                //定时器速度
                ,intervalTime:50
            }
        },
        methods:{
            step: function () {
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
                    //比较当前值与前一个值的大小 小于就交换 不小于就结束循环
                    if (less(this.items[current.inner],this.items[current.inner - current.h])) {
                        this.textArr.unshift('当前值小于前一个值');
                        if (this.hasAnimation){
                            this.animation(current.inner-current.h,current.inner);
                        }else {
                            //交换
                            exch(this.items,current.inner,current.inner-current.h);
                            this.changeCurrent(false);
                        }
                    } else {
                        this.textArr.unshift('当前值不小于前一个值');
                        this.changeCurrent(true);
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
                        this.changeCurrent(false);
                        clearInterval(this.intervalIDanimation);
                        this.intervalIDanimation = '';
                        if (!this.isStop){
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
                    if (index === this.current.min){
                        return 'warning';
                    } else if (index === this.current.outside || index === this.current.inner) {
                        return 'danger';
                    } else {
                        return "info";
                    }
                }
            },
            /**
             * 改变当前值
             * @param flag 是否结束当前循环
             */
            changeCurrent(flag){
                let current = this.current;
                const length = this.items.length;
                if (this.sortState === 1) {
                    current.h = 1;
                    while (current.h<length/3){
                        current.h = current.h * 3 + 1;
                    }
                    current.outside = current.h;
                    current.inner = current.h;
                    //复制数组
                    this.items.forEach(((value, index) =>
                            this.$set(this.oldArr,index,value)
                    ))
                } else {
                    if(flag){
                        //结束内循环
                        //判断外循环
                        if (current.outside < length) {
                            //外循环加一
                            current.inner = ++current.outside;
                        } else {
                            //外循环结束
                            //判断循环序列h的值是否为1
                            if (current.h === 1){
                                //排序完成
                                this.textArr.unshift("排序完成");
                                this.sortState = 3;
                                this.current = {};
                                this.stop();
                            } else {
                                current.h = Math.floor(current.h/3);
                                current.inner = current.h;
                                current.outside = current.h;
                            }
                        }
                    } else {
                        if (current.inner >= current.h) {
                            //继续内循环
                            current.inner -=current.h;
                        } else {
                            //结束内循环
                            this.changeCurrent(true);
                        }
                    }
                }
                this.menuKey++;
            },
            clear(){
                this.textArr = [];
            },
            create(input){
                this.refresh();
                createArr(input,this.items);
                this.menuKey++;
            },
            //暂停按钮
            stop(){
                clearInterval(this.intervalID);
                this.intervalID = -1;
            },
            //重置按钮
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
            },
            changeInterval(){
                this.stop();
                this.sort();
            },
            finished(){
                this.stop();
                while (this.items.length > 0 && !this.isSort){
                    this.step();
                }
            },
            sort(){
                this.intervalID = setInterval(this.step,1000 - this.intervalTime*10);
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
  .tagClass{
    margin: 10px;
  }
  .consoleDiv{
    height: 210px;
    overflow: auto;
  }
</style>
