<template>
 <div id="books">
   <van-skeleton title avatar :row="3" :loading="props.loading"  >
     <van-card
         v-for="book in props.books"
         :title="book.title"
         :desc="book.intro"
         :thumb="book.cover"
         :price="book.author"
         currency="作者:"
         @click="onClick(book)"
     >
     </van-card>
   </van-skeleton>
 </div>
</template>

<script setup lang="ts">
import {BookType} from "../models/book";
import {useRouter} from "vue-router";
const router = useRouter();
interface BooksProps {
  loading: boolean;
  books: BookType[];
}

const props = withDefaults(defineProps<BooksProps>(), {
  loading: false,
  // @ts-ignore
  books: [] as BookType[],
});
const onClick = (books: BookType) => {
  router.push({ path: '/bookDetails', query: { bookId: books.bookId } });
}



</script>

<style scoped>

</style>