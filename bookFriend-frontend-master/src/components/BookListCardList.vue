<template>
  <div id="BookListCard">
    <van-grid :column-num="3" icon-size="110px">
      <van-grid-item
          v-for="book in props.bookList"
          :key="book.bookId"
          @click="onClick(book)"
      >
        <van-image
        :src="book.cover"
        >
        </van-image>
        <div class="van-ellipsis" style="width: 80px; font-size: 14px">{{ book.title }}</div>
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