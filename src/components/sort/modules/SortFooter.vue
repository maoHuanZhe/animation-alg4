<template>
  <el-row :gutter="20">
    <el-col :xs="24" :sm="24" :md="getSpan()" :lg="getSpan()" :xl="getSpan()">
      <el-card class="box-card" shadow="hover">
        <div slot="header" style="text-align: center;">
          <span>console</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="clear">clear</el-button>
        </div>
        <div class="consoleDiv" style="text-align: left;">
          <el-row v-if="method === 'select'">
            <el-col :span="8"><el-tag>i:{{current.outside}}</el-tag></el-col>
            <el-col :span="8"><el-tag>min:{{current.min}}</el-tag></el-col>
            <el-col :span="8"><el-tag>j:{{current.inner}}</el-tag></el-col>
          </el-row>
          <el-row v-else-if="method === 'insert'">
            <el-col :span="12"><el-tag>i:{{current.outside}}</el-tag></el-col>
            <el-col :span="12"><el-tag>j:{{current.inner}}</el-tag></el-col>
          </el-row>
          <el-row v-else-if="method === 'shell'">
            <el-col :span="6"><el-tag>N:{{current.N}}</el-tag></el-col>
            <el-col :span="6"><el-tag>h:{{current.h}}</el-tag></el-col>
            <el-col :span="6"><el-tag>i:{{current.outside}}</el-tag></el-col>
            <el-col :span="6"><el-tag>j:{{current.inner}}</el-tag></el-col>
          </el-row>
          <div v-for="(text,index)  in textArr" :key="index">
            <el-link :underline="false" type="primary">{{text}}</el-link>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="getSpan()" :lg="getSpan()" :xl="getSpan()">
      <el-card class="box-card" shadow="hover">
        <div slot="header" style="text-align: center;">
          <span>code</span>
        </div>
        <div class="consoleDiv">
          <code v-if="method==='select'">
                <pre>
<el-link :type="getType(1)" :class="getClass(1)" :underline="false">for(<el-link :type="getType2(1.1)" :underline="false">int i = 0;</el-link><el-link :type="getType2(1.2)" :underline="false">i < arr.size();</el-link> <el-link :type="getType2(1.3)" :underline="false">i++</el-link>){</el-link>
  <el-link :type="getType(2)" :class="getClass(2)" :underline="false">int min = i;</el-link>
  <el-link :type="getType(3)" :class="getClass(3)" :underline="false">for(<el-link :type="getType2(3.1)" :underline="false">int j = i + 1;</el-link> <el-link :type="getType2(3.2)" :underline="false">j < arr.size();</el-link> <el-link :type="getType2(3.3)" :underline="false">j++</el-link>){</el-link>
    <el-link :type="getType(4)" :class="getClass(4)" :underline="false">if(less(arr[j],arr[min])</el-link>
      <el-link :type="getType(5)" :class="getClass(5)" :underline="false">min = j;</el-link>
  <el-link :underline="false">}</el-link>
  <el-link :type="getType(6)" :class="getClass(6)" :underline="false">exch(arr,i,min);</el-link>
<el-link :underline="false">}</el-link>
                </pre>
          </code>
          <code v-else-if="method==='insert'" >
                <pre>
<el-link :type="getType(1)" :class="getClass(1)" :underline="false">for(<el-link :type="getType2(1.1)" :underline="false">int i = 1;</el-link> <el-link :type="getType2(1.2)" :underline="false">i < arr.size();</el-link> <el-link :type="getType2(1.3)" :underline="false">i++</el-link>){</el-link>
  <el-link :type="getType(2)" :class="getClass(2)" :underline="false">for(<el-link :type="getType2(2.1)" :underline="false">int j = i;</el-link> <el-link :type="getType2(2.2)" :underline="false">j > 0</el-link> && <el-link :type="getType2(2.3)" :underline="false">less(arr[j],arr[j-1];</el-link> <el-link :type="getType2(2.4)" :underline="false">j--</el-link>)</el-link>
    <el-link :type="getType(3)" :class="getClass(3)" :underline="false">exch(arr,j,j-1);</el-link>
<el-link :underline="false">}</el-link>
                </pre>
          </code>
          <code v-else-if="method==='shell'" >
                <pre>
<el-link :type="getType(1)" :class="getClass(1)" :underline="false">int N = a.length;</el-link>
<el-link :type="getType(2)" :class="getClass(2)" :underline="false">int h = 1;</el-link>
<el-link :type="getType(3)" :class="getClass(3)" :underline="false">while(<el-link :type="getType2(3.1)" :underline="false">h < N/3</el-link>) <el-link :type="getType2(3.2)" :underline="false">h = 3*h + 1;</el-link></el-link>
<el-link :type="getType(4)" :class="getClass(4)" :underline="false">while(h >= 1) {</el-link>
  <el-link :type="getType(5)" :class="getClass(5)" :underline="false">for(<el-link :type="getType2(5.1)" :underline="false">int i = h;</el-link> <el-link :type="getType2(5.2)" :underline="false">i < N;</el-link> <el-link :type="getType2(5.3)" :underline="false">i++</el-link>){</el-link>
    <el-link :type="getType(6)" :class="getClass(6)" :underline="false">for(<el-link :type="getType2(6.1)" :underline="false">int j = i;</el-link> <el-link :type="getType2(6.2)" :underline="false">j >=h</el-link> && <el-link :type="getType2(6.3)" :underline="false">less(a[j-h],a[j]);</el-link> <el-link :type="getType2(6.4)" :underline="false">j-=h</el-link>)</el-link>
      <el-link :type="getType(7)" :class="getClass(7)" :underline="false">exch(arr,j,j-h);</el-link>
  <el-link :underline="false">}</el-link>
  <el-link :type="getType(8)" :class="getClass(8)" :underline="false">h/=3;</el-link>
<el-link :underline="false">}</el-link>
                </pre>
          </code>
          <code v-else-if="method==='merge'" >
                <pre>
private static Comparable[] aux;
public static void sort(Comparable[] a){
  aux = new Comparable[a.length];
  sort(a,0,a.length-1);
}
private static void sort(Comparable[] a,int lo,int hi){
  if(lo >= hi)  return;
  int mid = lo + (hi -lo)/2;
  sort(a,lo,mid);
  sort(a,mid+1,hi);
  merge(a,lo,mid,hi);
}
private static void merge(Comparable[] a,int lo,int mid,int hi){
  int i = lo;
  int j = mid + 1;
  for(int k = lo;k<=hi;k++) aux[k] = a[k];
  for(int k = lo;k<=hi;k++){
    if(i>mid) a[k] = aux[j++];
    else if(j>hi) a[k] = aux[i++];
    else if(less(aux[i],aux[j]) a[k] = aux[i++];
    else a[k] = aux[j++];
  }
}
                </pre>
          </code>
          <code v-else-if="method==='mergeBU'" >
                <pre>
private static Comparable[] aux;
public static void sort(Comparable[] a){
  int N = a.length;
  aux = new Comparable[N];
  for(int sz = 1;sz < N;sz *= 2){
    for(int lo = 0; lo < N -sz; lo += 2*sz){
      merge(a,lo,lo+sz-1,Math.min(lo+2*sz-1,N-1));
}
private static void merge(Comparable[] a,int lo,int mid,int hi){
  int i = lo;
  int j = mid + 1;
  for(int k = lo;k<=hi;k++) aux[k] = a[k];
  for(int k = lo;k<=hi;k++){
    if(i>mid) a[k] = aux[j++];
    else if(j>hi) a[k] = aux[i++];
    else if(less(aux[i],aux[j]) a[k] = aux[i++];
    else a[k] = aux[j++];
}
                </pre>
          </code>
          <code v-else-if="method==='quick'" >
                <pre>
public static void sort(Comparable[] a){
  sort(a,0,a.length-1);
}
private static void sort(Comparable[] a,int lo,int hi){
  if(lo >= hi)  return;
  int j = pratition(a,lo,hi);
  sort(a,lo,j-1)
  sort(a,j+1,hi);
}
private static int pratition(Comparable[] a,int lo,int mid,int hi){
  int i = lo;
  int j = hi + 1;
  Comparable v = a[lo];
  while(true){
    while(less(a[++i],v)) if(i == hi) break;
    while(less(v,a[--j])) if(j == lo) break;
    if(i>=j) break;
    exch(a,i,j);
  }
  exch(a,lo,j);
  return j;
}
                </pre>
          </code>
          <code v-else-if="method==='quick3way'" >
                <pre>
public static void sort(Comparable[] a){
  sort(a,0,a.length-1);
}
private static void sort(Comparable[] a,int lo,int hi){
  if(lo >= hi)  return;
  int lt = lo,i = lo + 1,gt = hi;
  Comparable v = a[lo];
  while(i<=gt){
    int cmp = a[i].compareTo(v);
    if(cmp < 0) exch(a,i++,lt++);
    else if(cmp > 0) exch(a,i,gt--);
    else i++;
  }
  sort(a,lo,lt - 1)
  sort(a,gt + 1,hi);
}
                </pre>
          </code>
          <code v-else-if="method==='heap'" >
                <pre>
public static void sort(Comparable[] a){
  int N = a.length;
  for(int k = N/2;k>=1;k--) sink(a,k,N);
  while(N>1){
    exch(a,1,N--);
    sink(a,1,N);
  }
}
private void sink(Comparable[] a,int k,int N){
  while(2*k<=N){
    int j = 2*k;
    if(j < N && less(j,j+1)) j++;
    if(!less(k,j)) break;
    exch(k,j);
    k = j;
  }
}

                </pre>
          </code>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="getSpan()" :lg="getSpan()" :xl="getSpan()" v-if="method==='quick'">
      <el-card class="box-card" shadow="hover">
        <div slot="header" style="text-align: center;">
          <span>函数栈</span>
        </div>
        <div class="consoleDiv">
          <el-row>
            <el-col :span="8">
              <el-tag type="danger">lo</el-tag>
            </el-col>
            <el-col :span="8">
              <el-tag type="danger">j</el-tag>
            </el-col>
            <el-col :span="8">
              <el-tag type="danger">hi</el-tag>
            </el-col>
          </el-row>
          <el-row v-for="(args, index) in stack" :style="getStyle(index)">
            <el-col :span="8">
              <el-tag>{{args.lo}}</el-tag>
            </el-col>
            <el-col :span="8">
              <el-tag>{{args.j}}</el-tag>
            </el-col>
            <el-col :span="8">
              <el-tag>{{args.hi}}</el-tag>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="getSpan()" :lg="getSpan()" :xl="getSpan()" v-if="method==='merge'">
      <el-card class="box-card" shadow="hover">
        <div slot="header" style="text-align: center;">
          <span>函数栈</span>
        </div>
        <div class="consoleDiv">
          <el-row>
            <el-col :span="8">
              <el-tag type="danger">lo</el-tag>
            </el-col>
            <el-col :span="8">
              <el-tag type="danger">mid</el-tag>
            </el-col>
            <el-col :span="8">
              <el-tag type="danger">hi</el-tag>
            </el-col>
          </el-row>
          <el-row v-for="(args, index) in stack" :style="getStyle(index)">
            <el-col :span="8">
              <el-tag>{{args.lo}}</el-tag>
            </el-col>
            <el-col :span="8">
              <el-tag>{{args.mid}}</el-tag>
            </el-col>
            <el-col :span="8">
              <el-tag>{{args.hi}}</el-tag>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :md="getSpan()" :lg="getSpan()" :xl="getSpan()" v-if="method==='quick3way'">
      <el-card class="box-card" shadow="hover">
        <div slot="header" style="text-align: center;">
          <span>函数栈</span>
        </div>
        <div class="consoleDiv">
          <el-row>
            <el-col :span="6">
              <el-tag type="danger">lo</el-tag>
            </el-col>
            <el-col :span="6">
              <el-tag type="danger">lt</el-tag>
            </el-col>
            <el-col :span="6">
              <el-tag type="danger">gt</el-tag>
            </el-col>
            <el-col :span="6">
              <el-tag type="danger">hi</el-tag>
            </el-col>
          </el-row>
          <el-row v-for="(args, index) in stack" :style="getStyle(index)">
            <el-col :span="6">
              <el-tag>{{args.lo}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-tag>{{args.lt}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-tag>{{args.gt}}</el-tag>
            </el-col>
            <el-col :span="6">
              <el-tag>{{args.hi}}</el-tag>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
    export default {
        name: "SortFooter",
        props: {
            textArr:Array,
            stack:Array,
            method:String,
            line:Number,
            current:Object
        },
        methods:{
            clear(){
                this.$emit("clear");
            },
            getSpan(){
                if (this.method === "quick" || this.method === "quick3way" || this.method === "merge") {
                    return 8;
                }
                return 12;
            },
            getStyle(index){
                if (index === 0){
                    return "margin-top: 5px;background-color: lightsteelblue;";
                }
            },
            getType(index){
                if (index === Math.floor(this.line)){
                    return "primary"
                } else {
                    return "";
                }
            },
            getType2(index){
                if (index === this.line){
                    return "danger"
                } else {
                    return "";
                }
            },
            getClass(index){
              if (index === this.line){
                  return "lineSelected"
              } else {
                  return "";
              }
            },
        }
    }
</script>

<style scoped>
  .consoleDiv{
    height: 210px;
    overflow: auto;
  }
  .lineSelected{
    font-size: 16px;
    padding: 5px;
  }
</style>
