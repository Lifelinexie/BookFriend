<template>
  <div id="BookListCard" style="margin: 15px">
    <div style="text-align: left;margin: 10px"> 书架 </div>
    <van-grid :column-num="3" icon-size="80px">
      <van-grid-item
          v-for="(book, index) in props.bookList"
          :key="book.bookId"
          v-show="index < 3"
          @click="onClick(book)"
      >
        <van-image
            :src="book.cover"
        >
        </van-image>
        <div class="van-ellipsis" style="width: 60px; font-size: 14px">{{ book.title }}</div>
      </van-grid-item>
    </van-grid>

  </div>
</template>

<script setup lang="ts">
import {BookType} from "../models/book";
import {useRouter} from "vue-router";
const router = useRouter();
interface BookListCardProps {
  loading: boolean;
  bookList: BookType[];
}

const props = withDefaults(defineProps<BookListCardProps>(), {
  loading: false,
  // @ts-ignore
  bookList: [] as BookType[],
});
const onClick = (books: BookType) => {
  router.push({ path: '/bookDetails', query: { bookId: books.bookId } });
}

</script>

<style scoped>

</style>