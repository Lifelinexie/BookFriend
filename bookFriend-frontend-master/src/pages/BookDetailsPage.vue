<template>
  <van-sticky>
    <van-nav-bar
        left-arrow
        :left-text=book?.title
        @click-left="onClickLeft"
        @click-right="showShare = true"
    >
      <template #right>
        <van-icon name="share-o" />
      </template>
    </van-nav-bar>
  </van-sticky>
  <van-share-sheet
      v-model:show="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onSelect"
  />
  <div id="content">
    <div id="image">
      <van-image
      width="200" height="300"
      :src=book?.cover
      fit="contain"
      >
      </van-image>
    </div>
    <h3 style="text-align: center">{{ book?.title }}</h3>
    <van-divider />
    <div class="van-multi-ellipsis--l3" @click="show = true">
      <p style="text-indent: 30px">
        {{ book?.intro }}
      </p>
    </div>
    <van-popup v-model:show="show"  @click="show = false">
      <div class="wrapper" >
        <div class="block">
          <div style="margin: 10px">
            <span >简介:</span>
          </div>
          <div style="margin: 10px">
            <p style="text-indent: 30px">
              {{ book?.intro }}
            </p>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
  <van-tabbar v-model="active">
    <van-tabbar-item >
      <template v-if="!isJoinBookList">
        <van-button round type="primary" @click="addToBookList">
          加入书架
        </van-button>
      </template>
      <template v-if="isJoinBookList">
        <van-button disabled round color="#A8A8A8">
          已加入书架
        </van-button>
      </template>
    </van-tabbar-item>
    <van-tabbar-item>
      <template v-if="!isCreateTeam">
        <van-button round type="primary" @click="createTeam">
          创建队伍
        </van-button>
      </template>
      <template v-if="isCreateTeam">
        <van-button disabled round color="#A8A8A8">
          已创建队伍
        </van-button>
      </template>
    </van-tabbar-item>
    <van-tabbar-item>
      <van-button round type="primary">
        开始阅读
      </van-button>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {BookType} from "../models/book";
import {onMounted, ref} from "vue";
import {Toast} from "vant";
import myAxios from "../plugins/myAxios";
const router = useRouter();
const route = useRoute();
const show = ref(false);
const isJoinBookList = ref(false);
const isCreateTeam = ref(false);
const book = ref({
  bookId: 0,
  cover: '',
  title: 0,
  author: '',
  intro: ''
});
const bookId = route.query.bookId;
const showShare = ref(false);
const options = [
  { name: '微信', icon: 'wechat' },
  { name: '微博', icon: 'weibo' },
  { name: '复制链接', icon: 'link' },
  { name: '分享海报', icon: 'poster' },
  { name: '二维码', icon: 'qrcode' },
];

const onSelect = (option:any) => {
  Toast(option.name);
  showShare.value = false;
};

onMounted(async () => {
  await getBook()
  await isInBookList()
});
const getBook = async () => {

  const res = await myAxios.get("book/info",{params:{bookId: bookId}})
  console.log(res)
  console.log(typeof (bookId))
  console.log(typeof (res.data.bookId))
  if(res.code === 0){
    book.value = res.data
  }else{
    Toast.fail("暂无该书")
  }
}

const onClickLeft = () => {
  router.back()
}

const isInBookList = async ()=>{
  const formData = new FormData();
  formData.append("bookId",book.value.bookId)
  const res = await myAxios.post("/bookList/exist", formData);
  if(res.code === 0){
    isJoinBookList.value = true;
  }
}

const addToBookList = async () => {
  const formData = new FormData();
  formData.append("bookId",book.value.bookId)
  const res = await myAxios.post("/bookList/add", formData);
  if(res.code === 0){
    Toast.success("加入书架成功")
    isJoinBookList.value = true;
  }else{
    Toast.fail(res.description)
  }
}
const createTeam = () => {
  router.push({ path: '/team/add', query: { bookId: book.value.bookId, cover: book.value.bookId} });
}

</script>

<style scoped>

#content{
  display: flex;
  flex-direction: column;
  min-height: 500px;
}
#image{
  min-height: 300px;
  text-align: center;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 300px;
  background-color: #fff;
}

</style>