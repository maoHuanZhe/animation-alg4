import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import home from "../components/home";

const routes = [
    {   path: '/',
        redirect: '/selection',//设置默认指向的路径
        component: home ,
        meta:{
            // 页面标题title
            title: '首页'
        },
        children: [
            {   path: 'selection'
                ,component: () => import('../components/sort/selection')
                ,meta:{
                    // 页面标题title
                    title: '选择排序'
                }
            }
            ,{   path: 'insertion'
                ,component: () => import('../components/sort/insertion')
                ,meta:{
                    // 页面标题title
                    title: '插入排序'
                }
            }
            ,{   path: 'shell'
                ,component: () => import('../components/sort/shell')
                ,meta:{
                    // 页面标题title
                    title: '希尔排序'
                }
            }
            ,{   path: 'merge'
                ,component: () => import('../components/sort/merge')
                ,meta:{
                    // 页面标题title
                    title: '归并排序'
                }
            }
            ,{   path: 'mergeBU'
                ,component: () => import('../components/sort/mergeBU')
                ,meta:{
                    // 页面标题title
                    title: '自底向上的归并排序'
                }
            }
            ,{   path: 'quick'
                ,component: () => import('../components/sort/quick')
                ,meta:{
                    // 页面标题title
                    title: '快速排序'
                }
            }
            ,{   path: 'quick3way'
                ,component: () => import('../components/sort/quick3way')
                ,meta:{
                    // 页面标题title
                    title: '三分快速排序'
                }
            }
            ,{   path: 'heap'
                ,component: () => import('../components/sort/heap')
                ,meta:{
                    // 页面标题title
                    title: '堆排序'
                }
            }
            ,{   path: 'search'
                ,component:  () => import('../components/search')
            }
        ]
    }

]
let router = new VueRouter({
    routes
});

export default router
