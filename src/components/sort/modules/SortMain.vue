<template>
  <div>
    <el-divider content-position="left">示例元素</el-divider>
    <el-row :gutter="20">
      <el-tag :size="getSize()" style="margin: 10px;" v-for="tag in demoTag" :type="tag.type" :effect="tag.effect" >{{ tag.text }}</el-tag>
    </el-row>
    <el-divider content-position="left">待排序数组</el-divider>
    <div style="background-color: gray;" ref="main">
      <el-tag class="tagClass" :ref="'tag'+index" :type="getType(index)" :effect="getEffect(index)" v-for="(item,index) in items" :key="item + '-' + index">{{item}}</el-tag>
    </div>
  </div>
</template>

<script>
    export default {
        name: "SortMain",
        props: {
            demoTag:Array,
            items:Array,
            method:String,
            sortState:Number,
            current:Object,
            now:Object
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
            getType(index){
                if (this.method === "select"){
                    if (this.sortState === 0){
                        return 'info'
                    } else if (this.sortState === 3){
                        return 'success';
                    }else {
                        if (index === this.current.min){
                            return 'warning';
                        } else if (index === this.current.outside || index === this.current.inner) {
                            return 'danger';
                        } else if (index < this.current.outside) {
                            return "success"
                        }else {
                            return "info";
                        }
                    }
                } else if (this.method === "insert") {
                    if (this.sortState === 0){
                        return 'info'
                    } else if (this.sortState === 3){
                        return 'success';
                    }else {
                        if (index === (this.current.inner -1 ) || index === this.current.inner) {
                            return 'danger';
                        } else if (index === this.current.outside){
                            return 'warning';
                        } else {
                            return "info";
                        }
                    }
                } else if (this.method === "shell") {
                    if (this.sortState === 0){
                        return 'info'
                    } else if (this.sortState === 3){
                        return 'success';
                    }else {
                        if (index === (this.current.inner -this.current.h ) || index === this.current.inner) {
                            return 'danger';
                        } else if (index === this.current.outside){
                            return 'warning';
                        } else {
                            return "info";
                        }
                    }
                } else if (this.method === "quick") {
                    if (this.sortState === 0){
                        return 'info'
                    } else if (this.sortState === 3){
                        return 'success';
                    }else {
                        if (index === this.current.i || index === this.current.j) {
                            return "danger";
                        } else if (index >= this.now.lo && index <= this.now.hi) {
                            return 'warning';
                        } else {
                            return "info";
                        }
                    }
                } else if (this.method === "quick3way"){
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
                } else if (this.method === "merge"){
                    if (this.sortState === 0){
                        return 'info'
                    } else if (this.sortState === 3){
                        return 'success';
                    }else {
                        if (index === this.current.k) {
                            return "danger";
                        } else if (index >= this.now.lo && index <= this.now.hi) {
                            return 'warning';
                        } else {
                            return "info";
                        }
                    }
                } else if (this.method === "mergeBU"){
                    if (this.sortState === 0){
                        return 'info'
                    } else if (this.sortState === 3){
                        return 'success';
                    }else {
                        if (index === this.current.k) {
                            return "danger";
                        } else if (index >= this.current.lo && index <= this.current.hi) {
                            return 'warning';
                        } else {
                            return "info";
                        }
                    }
                }
            },
            getEffect(index){
                if (this.method === "quick"){
                    if (this.sortState === 2 && index === this.now.lo || index === this.current.j){
                        return "dark";
                    }
                } else if (this.method === "quick3way"){
                    if (this.sortState === 2 && index === this.current.lt || index === this.current.gt){
                        return "dark";
                    }
                }
                return "plain";
            },
        }
    }
</script>

<style scoped>
  .tagClass{
    margin: 10px;
    width: 45px;
  }
</style>
