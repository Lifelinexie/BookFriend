<template>
    <van-nav-bar
        left-arrow
        @click-left="onClickLeft"
    >
    </van-nav-bar>
  <template v-if="bookList && bookList.length > 1">
    <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
        content-position="left"
    >书架:
    </van-divider>
  </template>
  <book-list-card-list v-if="bookList" :book-list="bookList" />
  <template v-if="books && books.length > 1">
    <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
        content-position="left"
    >书城:
    </van-divider>
  </template>
  <book-card-list  v-if="books" :books="books" />
  <user-card-list  v-if="userList" :user-list="userList" />
  <van-empty v-if="isEmpty" description="搜索结果为空" />

</template>

<script setup lang="ts">
import {onMounted, ref, watchEffect} from 'vue';
import {useRoute, useRouter} from "vue-router";
import UserCardList from "../components/UserCardList.vue";
import BookCardList from  "../components/BookCardList.vue";
import BookListCardList from "../components/BookListCardList.vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";

const route = useRoute();
const {searchVal} = route.query;
const {queryType} = route.query;
const userList = ref([]);
const books = ref([]);
const bookList = ref([]);
const router = useRouter();
const isEmpty = ref(false);

const onClickLeft = () => {
  router.back();
};

onMounted(async () => {
      // console.log("type:"+queryType)
      const listData = await myAxios.post('/search/all', {
        searchText: searchVal,
        type: queryType
      })
          .then(function (response) {
            console.log('/search/all succeed', response);
            return response?.data;
          })
          .catch(function (error) {
            console.error('/search/all error', error);
            Toast.fail('请求失败');
          });
      if (queryType == "book") {
        books.value = listData['dataList'];
      } else if (queryType == "user") {
        userList.value = listData['dataList'];
      } else if (queryType == "bookList") {
        bookList.value = listData['dataList'];
      }else{
        books.value = listData['books'];
        bookList.value = listData['bookList'];
      }
      if(userList.value.length < 1  && books.value.length < 1 && bookList.value.length < 1 ){
        isEmpty.value = true;
      }
    }
);

</script>

<style scoped>

</style>
