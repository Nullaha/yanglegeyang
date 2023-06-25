import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from 'vue-router'



const routes:RouteRecordRaw[] = [
  {
    path:'/',
    component:()=>import('../pages/home.vue'),
  },
  {
    path:'/game',
    component:()=>import('../pages/game.vue'),
  },
  {
    path:'/config',
    component:()=>import('../pages/config.vue'),
  }
];

const router = createRouter({
  routes,
  history:createWebHashHistory(),
})

export default router
