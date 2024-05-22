<template>
  <div id="content">
    <router-view />
  </div>
  <van-tabbar route v-if="$route.meta.keepAlive">
    <van-tabbar-item to="/" icon-prefix="iconfont icon" icon="read" name="read">阅读</van-tabbar-item>
    <van-tabbar-item to="/bookList" icon-prefix="iconfont icon" icon="bookList" name="bookList">书架</van-tabbar-item>
    <van-tabbar-item to="/team" icon="home-o" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user" icon="user-o" name="user">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {ref} from "vue";
import routes from "../config/route";

const router = useRouter();
const DEFAULT_TITLE = '书友';
const title = ref(DEFAULT_TITLE);
/**
 * 根据路由切换标题
 */
router.beforeEach((to, from) => {
  const toPath = to.path;
  const route = routes.find((route) => {
    return toPath == route.path;
  })
  title.value = route?.title ?? DEFAULT_TITLE;
})

const onClickLeft = () => {
  router.back();
};

const onClickRight = () => {
  router.push('/search')
};

</script>

<style scoped>
#content {
  padding-bottom: 50px;
}
</style>
