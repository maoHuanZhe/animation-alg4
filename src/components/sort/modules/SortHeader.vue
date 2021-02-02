<template>
  <el-row :gutter="10">
    <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
      <el-input
          placeholder="输入一个数字或以逗号相隔的数组"
          v-model="input"
          @blur="create"
          clearable>
      </el-input>
    </el-col>
    <el-col :xs="24" :sm="20" :md="10" :lg="10" :xl="10">
      <el-button :size="getSize()" type="primary" @click="sort" icon="el-icon-video-play" :loading="intervalID!==-1">开始</el-button>
      <el-button :size="getSize()" v-if="!hasAnimation" type="primary" @click="stop" icon="el-icon-video-pause">暂停</el-button>
      <el-button :size="getSize()" v-if="!hasAnimation" type="primary" @click="step" icon="el-icon-video-pause">下一步</el-button>
      <el-button class="hidden-xs-only" :size="getSize()" v-if="!hasAnimation" type="primary" @click="finished" icon="el-icon-finished">跳过</el-button>
      <el-button class="hidden-xs-only" :size="getSize()" v-if="!hasAnimation" type="primary" @click="refresh" icon="el-icon-refresh-right">重置</el-button>
    </el-col>
    <el-col :sm="4" :md="2" :lg="2" :xl="2" v-if="!hasAnimation" class="hidden-xs-only">
      <el-slider v-model="time" :min="1" :max="99" @change="changeInterval" style="width:100px;"></el-slider>
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
              input:"",
              time:99
          }
        },
        computed: {
            hasAnimation(){
                return this.$store.state.hasAnimation;
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
                this.$emit("changeInterval",this.time)
            },
        }
    }
</script>

<style scoped>

</style>
