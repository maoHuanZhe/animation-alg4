<template>
  <el-row :gutter="10">
    <el-col :span="12">
      <el-input
          placeholder="输入一个数字或以逗号相隔的数组"
          v-model="input"
          @blur="create"
          clearable>
      </el-input>
    </el-col>
    <el-col :span="2">
      <el-button type="primary" @click="sort" icon="el-icon-video-play" :loading="intervalID!==-1">开始</el-button>
    </el-col>
    <el-col :span="7" v-if="!hasAnimation">
      <el-button type="primary" @click="stop" icon="el-icon-video-pause">暂停</el-button>
      <el-button type="primary" @click="step" icon="el-icon-video-pause">下一步</el-button>
      <el-button type="primary" @click="finished" icon="el-icon-finished">跳过</el-button>
      <el-button type="primary" @click="refresh" icon="el-icon-refresh-right">重置</el-button>
    </el-col>
    <el-col :span="2" v-if="!hasAnimation">
      <el-slider v-model="intervalTime" :min="1" :max="99" @change="changeInterval" style="width:100px;"></el-slider>
    </el-col>
  </el-row>
</template>

<script>
    export default {
        name: "SortHeader",
        props: {
            intervalID:Number,
            intervalTime:Number,
            textArr:Array,
            items:Array,
            oldArr:Array,
            current:Object,
            sortState:Number
        },
        data() {
          return {
              input:""
          }
        },
        computed: {
            hasAnimation(){
                return this.$store.state.hasAnimation;
            }
        },
        methods:{
            sort(){
                this.$emit("sort")
            },
            step(){
              this.$emit("step")
            },
            //暂停按钮
            stop(){
                this.$emit("stop")
            },
            //跳过按钮点击事件
            finished(){
                this.$emit("finished")
            },
            refresh(){
                this.$emit("refresh")
            },
            create(){
                this.$emit("create",this.input)
            },
            changeInterval(){
                this.$emit("changeInterval")
            },
        }
    }
</script>

<style scoped>

</style>
