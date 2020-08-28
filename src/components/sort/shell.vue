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
          <el-tag type="danger" >比较元素</el-tag>
        </el-col>
        <el-col :span="4">
          <el-tag type="success" >已排序元素</el-tag>
        </el-col>
      </el-row>
      <div :key="menuKey">
        <el-tag class="tagClass" :type="getType(index)" v-for="(item,index) in items" :key="item + '-' + index">{{item}}</el-tag>
      </div>
    </el-main>
    <el-footer height="290px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card" shadow="hover">
            <div slot="header">
              <span>console</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="clear">clear</el-button>
            </div>
            <div class="consoleDiv" style="text-align: left;">
              原数组：{{oldArr.join(',')}}
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
for(int i = 1;i < arr.size(); i++;){
  for(int j = i; j > 0 && less(a[j-1],a[j]); j--;){
    exch(arr,j,j-1);
  }
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
    export default {
        name: "selection"
        ,data() {
            return {
                imput: ''
                ,menuKey:1
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
                    //比较当前值与前一个值的大小 小于就交换 不小于就结束循环
                    if (less(this.items[current.inner],this.items[current.inner - current.h])) {
                        this.textArr.unshift('当前值小于前一个值');
                        //交换
                        exch(this.items,current.inner,current.inner-current.h);
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
  .currentNum{
    color: red;
  }
  .consoleDiv{
    height: 210px;
    overflow: auto;
  }
</style>
