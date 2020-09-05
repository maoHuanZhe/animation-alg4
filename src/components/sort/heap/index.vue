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
      <el-divider content-position="left">示例元素</el-divider>
      <el-row :gutter="20">
        <el-tag :size="getSize()" style="margin: 10px;" v-for="tag in demoTag" :type="tag.type" :effect="tag.effect" >{{ tag.text }}</el-tag>
      </el-row>
      <el-divider content-position="left">待排序数组</el-divider>
      <div :key="menuKey">
        <node :current="current" :sort-state="sortState" v-if="items.length > 0" :items="items" :index="0"></node>
      </div>
    </el-main>
    <el-footer>
      <SortFooter :text-arr="textArr" method="heap" @clear="clear" />
    </el-footer>
  </el-container>
</template>

<script>
    import node from "./node"
    import {exch, less, createArr} from "../../../util/util";
    import SortHeader from "../modules/SortHeader";
    import SortFooter from "../modules/SortFooter";
    export default {
        name: "selection"
        ,components : {
            node,
            SortHeader,
            SortFooter
        }
        ,data() {
            return {
                demoTag:[
                    {text:"未排序元素",type:"info",effect:"plain"},
                    {text:"较大子元素",type:"danger",effect:"plain"},
                    {text:"下沉元素",type:"warning",effect:"plain"},
                    {text:"已排序元素",type:"success",effect:"plain"}
                ],
                menuKey:1
                //当前值
                ,current: {
                  //堆是否有序
                  heapIsSort:false
                  //是否比较两个子元素
                  ,childrenIsLess:false
                  //当前有效数组长度
                  ,N: 0
                  //当前下沉元素
                  ,k:0
                  //较大的子元素
                  ,j:0
                  //初始下沉元素
                  ,firstK:0
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
            getSize(){
                const size = this.$store.state.size;
                if (size === 'xs'){
                    return "mini"
                } else if (size === 'xl'){
                    return "medium"
                } else {
                    return "small"
                }
            },
            sort(){
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
                    this.changeCurrent();
                    //复制数组
                    this.items.forEach(((value, index) =>
                      this.$set(this.oldArr,index,value)
                    ))
                    //设置排序状态为排序中
                    this.sortState = 2;
                } else if (this.sortState === 2) {
                    //排序中
                    //判断堆是否有序
                    if (!current.heapIsSort){
                        //堆未排序
                        //判断是否比较两个子元素
                        if (current.childrenIsLess){
                            //子元素已比较
                            //比较当前下沉元素与子元素
                            if (less(this.items[current.k],this.items[current.j])){
                                this.textArr.unshift('下沉元素与较大子元素交换');
                                //当前下沉元素小于子元素
                                //交换
                                exch(this.items,current.k,current.j);
                                this.changeCurrent(false);
                            } else {
                                this.textArr.unshift('本次下沉结束');
                                //当前下沉元素不小于子元素
                                // 结束下沉
                                this.changeCurrent(true);
                            }
                        } else {
                            //子元素未比较 比较两个子元素
                            if (current.j < current.N -1 && less(this.items[current.j],this.items[current.j+1])){
                                this.textArr.unshift('当前子元素小于另一个元素');
                                //当前子元素小于另一个元素
                                current.j++;
                                this.menuKey++;
                            } else {
                                this.textArr.unshift('当前子元素不小于另一个元素');
                            }
                            current.childrenIsLess = true;
                        }
                    } else {
                        this.textArr.unshift('将根节点交换到当前数组末尾');
                        //堆已排序
                        exch(this.items,0,--current.N);
                        if (current.N>1){
                            current.k = 0;
                            current.j = 1
                            current.firstK = 0;
                            current.heapIsSort = false;
                            current.childrenIsLess = false;
                        } else {
                            this.textArr.unshift('排序完成');
                            this.current = {};
                            this.sortState = 3;
                            this.stop();
                        }
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
            /**
             * 改变当前值
             */
            changeCurrent(flag){
                let current = this.current;
                const length = this.items.length;
                if (this.sortState === 1){
                    //设置初始值
                    current.heapIsSort=false;
                    current.childrenIsLess=false;
                    current.N=length;
                    current.k=Math.floor(length/2) - 1;
                    current.j = current.k * 2 + 1;
                    current.firstK=current.k;
                } else {
                  if (flag){
                      //结束当前元素的下沉
                      current.firstK--;
                  } else {
                      //继续下沉
                      current.k = current.j;
                      if (current.k * 2 >= current.N -1){
                          //结束当前元素的下沉
                          current.firstK--;
                      } else {
                          current.j = current.k * 2 + 1;
                          current.childrenIsLess=false;
                          return;
                      }
                  }
                  if (current.firstK<0){
                      //堆下沉结束
                      current.heapIsSort = true;
                  } else {
                      current.k = current.firstK;
                      current.j = current.k * 2 + 1;
                      current.childrenIsLess=false;
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
