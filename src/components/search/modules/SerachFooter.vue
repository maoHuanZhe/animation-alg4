<template>
  <el-row :gutter="20">
    <el-col :xs="24" :sm="24" :md="getSpan()" :lg="getSpan()" :xl="getSpan()">
      <el-card class="box-card" shadow="hover">
        <div slot="header" style="text-align: center;">
          <span>console</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="clear">clear</el-button>
        </div>
        <div class="consoleDiv" style="text-align: left;">
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
          <code v-if="method==='SequentialSearch'">
                <pre>
private Node first;
private class Node {
  Key key;
  Value val;
  Node next;
  public Node(Key key, Value val, Node next){
    this.key = key;
    this.val = val;
    this.next = next;
  }
}
public Value get(Key key){
  for(Node x = first;x!=null;x = x.next)
    if(key.equals(x.key)) return x.val;
  return null;
}
public void put(Key key, Value val){
  for(Node x = first;x!=null;x = x.next)
    if(key.equals(x.key))  { x.val = val;return }
  first = new Node(key, val, first);
}
                </pre>
          </code>
          <code v-else-if="method==='BinarySearch'" >
                <pre>
private Key[] keys;
private Value[] vals;
private int N;
public int size() { return N; }
public Value get(Key key){
  if (N == 0) return null;
  int i = rank(key);
  if(i < N && keys[i].compareTo(key) == 0) return vals[i];
  else                                     return null;
}
public void put(Key key, Value val){
  int i = rank(key);
  if(i < N && keys[i].compareTo(key) == 0){
    vals[i] = val;
    return
  }
  for(int j = N;j>i;j--){
    keys[j] = keys[j-1];
    vals[j] = keys[j-1];
  }
  keys[i] = key;
  vals[i] = val;
  N++;
}
public int rank(Key key){
  int lo = 0, hi = N - 1;
  while (lo <=hi ){
    int mid = lo + (hi - lo) / 2;
    int cmp = key.compareTo(keys[mic]);
    if      (cmp < 0) hi = mid - 1;
    else if (cmp > 0) lo = mid + 1;
    else              return mid;
  }
  return lo;
}
                </pre>
          </code>
          <code v-else-if="method==='shell'" >
                <pre>
int N = a.length;
int h = 1;
while(h < N/3) h = 3*h + 1;
while(h >= 1) {
  for(int i = h;i < arr.size(); i++;){
    for(int j = i; j >=h && less(a[j-h],a[j]); j-=h;){
      exch(arr,j,j-h);
    }
  }
  h/=3;
}
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
            method:String
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
        }
    }
</script>

<style scoped>
  .consoleDiv{
    height: 210px;
    overflow: auto;
  }
</style>
