<template>
  <template v-if="user">
    <div id="userPage">
      <van-sticky>
        <van-nav-bar
          :title="user.username + ' 的主页'"
          left-arrow
          @click-left="onClickLeft"
          @click-right="onClickRight"
      >
        <template #right>
          <van-icon name="chat-o" size="24" />
        </template>
      </van-nav-bar>
      </van-sticky>

      <div style="display: flex;justify-content: center; align-content: center">
        <van-uploader :after-read="uploadPicture">
          <van-image
              :src="user?.avatarUrl"
              width="150"
              height="150"
              round
              radius="15"
          >
          </van-image>
        </van-uploader>

      </div>
      <div style="margin: 13px">
        <van-button v-if="followState === 0" round block icon="plus" type="primary" @click="showDialog=true">
          关注
        </van-button>
        <van-button v-if="followState === 1"
                    color="#E0E0E0" round
                    block icon="success"
                    type="primary"
                    @click="showPopup = true">
          已关注
        </van-button>
        <van-button v-if="followState === 2"
                    color="#E0E0E0"
                    round icon="exchange"
                    block type="primary"
                    @click="showPopup = true">
          互相关注
        </van-button>
      </div>
      <mini-book-list-card v-if="bookList" :book-list="bookList"></mini-book-list-card>
      <van-empty image-size="80" v-if="bookList.length < 1">暂无书籍</van-empty>
      <div style="margin: 13px">
        <van-button round color="#E0E0E0" block @click="lookOtherBookList(user.id)">查看书架</van-button>
      </div>
      <van-dialog
          v-model:show="showDialog"
          show-cancel-button
          title="发送关注请求"
          :message = "'向 ' + user.username +' 发送关注请求，经TA确认后可以关注'"
          confirm-button-text="发送请求"
          confirm-button-color="#1E90FF"
          @confirm="follow(user.id)"
      >

      </van-dialog>
      <van-popup v-model:show="showPopup" position="bottom" :style="{ height: '20%' }" >
        <h4 style="color:red;text-align: center" @click="unfollow(user.id)">
          取消关注
        </h4>
        <van-divider></van-divider>
        <h4 style="text-align: center" @click="showPopup=false">
          关闭
        </h4>
      </van-popup>
    </div>
  </template>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";
import MiniBookListCard from "../components/MiniBookListCard.vue"
const route = useRoute();
const {userId} = route.query;
const user = ref();
const bookList = ref([]);
const router = useRouter();
const showDialog= ref(false);
const followState = ref(0);
const showPopup = ref(false);

const onClickLeft = () => {
  router.back()
}
const unfollow = async (userId: any) => {
  const res = await myAxios.get("/follow/unFollow", {
    params: {
      userId:userId
    },
  });
  if (res.data){
    showPopup.value=false;
    Toast.success("取消关注")
  }
}
const follow = async (userId: any) => {
  const res = await myAxios.post("/application/add", {
    "receiveId": userId,
  });
  if (res.code === 0){
    Toast.success("已发送申请")
  }
}
onMounted(async () => {
  var res = await myAxios.get("/user/getUserById", {params: {userId: userId}});
  user.value = res.data
  await getFollowState(userId)
})

const lookOtherBookList = (id: number) => {
  router.push({path:"/otherBookList", query:{userId:id}});
}

const getFollowState = async (userId: any) => {
  const res = await myAxios.get("/follow/getState", {
    params: {
      userId:userId
    },
  });
  followState.value = res.data;
}

const onClickRight = () => {
  router.push({
    path: "/chat",
    query: {
      id: user.value.id,
      username: user.value.username,
      userType: 1
    }
  })
}

</script>

<style scoped>
#userPage{

}

</style>