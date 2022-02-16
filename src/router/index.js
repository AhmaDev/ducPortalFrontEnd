import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // AUTH ROUTES
  { path: '/dashboard', name: 'Login', component: () => import('../components/Login.vue') },
  { path: '/admin/dashboard/sections', name: 'Admin Lessons', component: () => import('../views/Sections.vue'), beforeEnter: (to, from, next) => checkAuth('Admin', to, from, next) },
  { path: '/:section/dashboard/section/:id', name: 'EditSection', component: () => import('../views/EditSection.vue'), beforeEnter: (to, from, next) => checkAuth('Website Editor', to, from, next) },
  { path: '/:section/dashboard/uploads', name: 'Upload', component: () => import('../components/Upload.vue'), beforeEnter: (to, from, next) => checkAuth('Website Editor', to, from, next) },
  { path: '/:section/dashboard/menu', name: 'Menu', component: () => import('../views/Menu.vue'), beforeEnter: (to, from, next) => checkAuth('Website Editor', to, from, next) },
  { path: '/admin/dashboard/users', name: 'Users', component: () => import('../views/Users.vue'), beforeEnter: (to, from, next) => checkAuth('Admin', to, from, next) },
  { path: '/:section/dashboard/new/post', name: 'NewPost', component: () => import('../views/NewPost.vue'), beforeEnter: (to, from, next) => checkAuth('Website Editor', to, from, next) },
  { path: '/:section/dashboard/new/page', name: 'NewPage', component: () => import('../views/NewPage.vue'), beforeEnter: (to, from, next) => checkAuth('Website Editor', to, from, next) },
  { path: '/:section/dashboard/edit/post/:id', name: 'EditPost', component: () => import('../views/NewPost.vue'), beforeEnter: (to, from, next) => checkAuth('Website Editor', to, from, next) },
  { path: '/:section/dashboard/edit/page/:id', name: 'EditPage', component: () => import('../views/NewPage.vue'), beforeEnter: (to, from, next) => checkAuth('Website Editor', to, from, next) },
  { path: '/:section/dashboard/posts', name: 'Posts', component: () => import('../views/Posts.vue'), beforeEnter: (to, from, next) => checkAuth('Website Editor', to, from, next) },
  { path: '/:section/dashboard/pages', name: 'Pages', component: () => import('../views/Pages.vue'), beforeEnter: (to, from, next) => checkAuth('Website Editor', to, from, next) },
  { path: '/:section/dashboard/staff', name: 'Staff', component: () => import('../views/Staff.vue'), beforeEnter: (to, from, next) => checkAuth('Website Editor', to, from, next) },
  { path: '/:section/dashboard/lessons', name: 'Lessons', component: () => import('../views/Lessons.vue'), beforeEnter: (to, from, next) => checkAuth('Website Editor', to, from, next) },
  { path: '/:section/dashboard/edit/staff/:id', name: 'EditStaff', component: () => import('../views/EditStaff.vue'), beforeEnter: (to, from, next) => checkAuth('Website Editor', to, from, next) },

  // GUEST ROUTES
  {
    path: '/:section', redirect: '/:section/home', name: 'Guest', component: Home, children: [
      { path: 'home', name: 'Guest Home', component: () => import('../views/guest/Home.guest.vue') },
      { path: 'staff', name: 'Guest Staff', component: () => import('../views/guest/Staff.guest.vue') },
      { path: 'staff/:id', name: 'Guest Staff Profile', component: () => import('../views/guest/Staff.profile.guest.vue') },
      { path: 'lessons', name: 'Guest Lessons', component: () => import('../views/guest/Lessons.guest.vue') },
      { path: 'post/:id', name: 'Guest Post', component: () => import('../views/guest/Post.guest.vue') },
      { path: 'page/:id', name: 'Guest Page', component: () => import('../views/guest/Page.guest.vue') },
    ]
  },

];

function checkAuth(role, to, from, next) {
  if (store.state.loginInfo != null) {
    if (store.state.loginInfo.roleName == role || store.state.loginInfo.roleName == 'Admin') {
      next();
    } else {
      next(false);
    }
  } else {
    next(false);
  }
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
