<template>
  <van-nav-bar
      left-arrow
      :title="user?.userAccount"
      @click-left="onClickLeft"
  />
  <div style="text-align: center;margin: 10px"> 书架 </div>
  <book-list-card-list :book-list="bookList" :loading="loading"/>
  <van-empty v-if="!bookList || bookList.length < 1" description="暂无书籍"/>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {useRoute, useRouter} from "vue-router";
import BookListCardList from "../components/BookListCardList.vue";
const router = useRouter();
const isMatchMode = ref<boolean>(false);
const route = useRoute();
const {userId} = route.query;
const bookList = ref([]);
const loading = ref(true);
const user = ref();


const onClickLeft = () => {
  router.back()
}

/**
 * 加载数据
 */
const loadData = async () => {
  let res, ans;
  loading.value = true;
  res = await myAxios.get("/bookList/listBooksById",{params:{userId: userId}});
  ans = await myAxios.get("/user/getUserById", {params:{userId:userId}});
  console.log(user.value)
  if (res.code === 0) {
    bookList.value = res.data;
  }
  if (ans.code === 0){
    user.value = ans.data;
  }
  loading.value = false;
}

watchEffect(() => {
  loadData();
})

</script>

<style scoped>

</style>