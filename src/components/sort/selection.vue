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
          <el-tag type="warning">当前最小元素</el-tag>
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
                ,intervalID:''
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
                              //交换
                              current.min = current.inner++;
                          } else {
                              this.textArr.unshift('当前值不小于最小值');
                              current.inner++;
                          }
                      } else {
                          //内循环结束
                          this.textArr.unshift("交换数据");
                          //交换
                          exch(this.items,current.outside,current.min)
                          //设置最小值
                          current.min = ++current.outside;
                          //外循环加一
                          current.inner = current.outside + 1;

                      }
                  } else {
                      //外循环结束
                      //排序完成
                      this.textArr.unshift("排序完成");
                      this.sortState = 3;
                      this.current = {};
                      this.stop();
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
                  if (index === this.current.min){
                      return 'warning';
                  } else if (index === this.current.outside || index === this.current.inner) {
                      return 'danger';
                  } else {
                      return "info";
                  }
              }
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
