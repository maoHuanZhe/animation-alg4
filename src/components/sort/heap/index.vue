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
      <div :key="menuKey">
        <node v-if="items.length > 0" :items="items" :index="0"></node>
      </div>
    </el-main>
    <el-footer height="290px">
    </el-footer>
  </el-container>
</template>

<script>
    import node from "./node"
    import {exch, less, createArr} from "../../../util/util";
    import SortHeader from "../modules/SortHeader";
    export default {
        name: "selection"
        ,components : {
            node,
            SortHeader
        }
        ,data() {
            return {
                imput: ''
                ,menuKey:1
                //当前值
                ,current: {
                    //外循环下标
                    outside: '',
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
                //判断排序状态
                if (this.sortState === 0){
                    //未排序状态
                    //设置排序状态为开始排序
                    this.sortState = 1;
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
                    current.outside = 1;
                    current.inner = 1;
                    //复制数组
                    this.items.forEach(((value, index) =>
                            this.$set(this.oldArr,index,value)
                    ))
                    //设置排序状态为排序中
                    this.sortState = 2;
                } else if (this.sortState === 2) {
                    //排序中
                    //比较当前值与前一个值的大小 小于就交换 不小于就结束循环
                    if (less(this.items[current.inner],this.items[current.inner - 1])) {
                        this.textArr.unshift('当前值小于前一个值');
                        //交换
                        exch(this.items,current.inner,current.inner-1);
                        this.changeCurrent(false);
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
                }
            },
            getType(index){
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
                if(flag){
                    //结束内循环
                    //判断外循环
                    if (current.outside < length) {
                        //外循环加一
                        current.inner = ++current.outside;
                    } else {
                        //外循环结束
                        //排序完成
                        this.textArr.unshift("排序完成");
                        this.sortState = 3;
                        this.current = {};
                        this.stop();
                    }
                } else {
                    if (current.inner > 0) {
                        //继续内循环
                        current.inner--;
                    } else {
                        //结束内循环
                        this.changeCurrent(true);
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

</style>
