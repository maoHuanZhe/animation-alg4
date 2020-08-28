import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);
import home from "../components/home";
import sort from "../components/sort"
const routes = [
    {   path: '/',
        component: home ,
        children: [
            {   path: 'sort'
                ,component: sort
                ,children: [
                    {   path: 'selection'
                        ,component: () => import('../components/sort/selection')
                    }
                    ,{   path: 'insertion'
                        ,component: () => import('../components/sort/insertion')
                    }
                    ,{   path: 'shell'
                        ,component: () => import('../components/sort/shell')
                    }
                    ,{   path: 'merge'
                        ,component: () => import('../components/sort/merge')
                    }
                    ,{   path: 'mergeBU'
                        ,component: () => import('../components/sort/mergeBU')
                    }
                    ,{   path: 'quick'
                        ,component: () => import('../components/sort/quick')
                    }
                    ,{   path: 'quick3way'
                        ,component: () => import('../components/sort/quick3way')
                    }
                ]
            }
            ,{   path: 'search'
                ,component:  () => import('../components/search')
            }
        ]
    }

]
export default new VueRouter({
    routes
})
