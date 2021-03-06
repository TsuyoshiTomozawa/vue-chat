import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import UserList from '../views/UserList.vue'
import ChatBoard from '../views/ChatBoard.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
// import firebase from "@/firebase/firebase";

Vue.use(VueRouter)

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    },
    {
        path: '/',
        name: 'UserList',
        component: UserList,
        meta: {requiresAuth: true},
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/chat',
        name: 'ChatBoard',
        component: ChatBoard
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth) {
        const user = sessionStorage.getItem('user')
        console.log(JSON.parse(user))
        if (user) {
            //ログイン中
            next();
        } else {
            //未ログイン
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }

        // firebase.auth().onAuthStateChanged((user) => {
        //   if (user) {
        //     //ログイン中
        //     next();
        //   } else {
        //     //未ログイン
        //     next({
        //       path: '/login',
        //       query: { redirect: to.fullPath }
        //     })
        //   }
        // });
    } else {
        next();
    }
});


export default router

