<template>
  <van-search placeholder="" @click="search" />
    <van-nav-bar
    left-text="书架"
    right-text="选择"
    @click-right="onClickRight"
    />
  <book-list-card-list :book-list="bookList" :loading="loading"/>
  <van-empty v-if="!bookList || bookList.length < 1" description="暂无书籍"/>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {useRouter} from "vue-router";
import BookListCardList from "../components/BookListCardList.vue";
const router = useRouter();
const isMatchMode = ref<boolean>(false);

const bookList = ref([]);
const loading = ref(true);

const search = () => {
  router.push({path:'/search', query: { type: "all" }} ) // type 本来是 bookList
}

const onClickRight = () => {
  Toast.success("点击")
}

/**
 * 加载数据
 */
const loadData = async () => {
  let res;
  loading.value = true;
  res = await myAxios.get("/bookList/listBooks");

  if (res.code === 0) {
    bookList.value = res.data;
  }
  loading.value = false;
}

watchEffect(() => {
  loadData();
})

</script>

<style scoped>

</style>