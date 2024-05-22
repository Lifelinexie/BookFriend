<template>
  <van-nav-bar
      left-arrow
      @click-left="onClickLeft"
      title="关注列表"
  >
  </van-nav-bar>
  <van-search
      v-model="searchText"
      show-action
      placeholder="请输入要搜索的用户"
      @search="onSearch"
      @cancel="onCancel"
      @focus="onFocus"
      @blur="isShow = true"
  />
  <van-tabs v-if="isShow" color="#3300FF" swipeable  v-model:active="active" @change="onTabChange">
    <van-tab name="1" title="我关注的">
      <template #title>
        我关注的
      </template>
    </van-tab>
    <van-tab name="2" title="关注我的">
      <template #title>
        关注我的
      </template>
    </van-tab>
  </van-tabs>
  <div class="follow-list">
    <div class="follow-group">
      <ul class="follow-items" v-if="active==='1'">
        <van-empty v-if="status.myFollow?.length<=0" description="暂未关注书友"/>
        <li v-else v-if="status.myFollow?.length > 0" v-for="user in status.myFollow" :key="user.id"
            class="follow-item">
          <div class="avatar-container">
            <img @click="showUser(user.id)" :src="user?.avatarUrl||defaultPicture"
                 class="avatar">
          </div>
          <div @click="showUser(user.id)" class="follow-info">
            <div class="follow-apply">
              <p class="follow-name">{{
                  user.username.length < 12 ? user.username : user.username.slice(0, 12) + '...'
                }}</p>
            </div>
          </div>
          <div style="padding-right: 10px;">
            <van-button round icon="success" style="width: 80px;" @click="showPopup = true" size="small"
                        v-if="user.state===1" type="primary">已关注
            </van-button>
            <van-button round icon="exchange" style="width: 100px;" @click="showPopup = true" size="small"
                        v-if="user.state===2" type="primary">互相关注
            </van-button>
          </div>
          <van-popup v-model:show="showPopup" position="bottom" :style="{ height: '20%' }" >
            <h4 style="color:red;text-align: center" @click="unfollow(user.id)">
              取消关注
            </h4>
            <van-divider></van-divider>
            <h4 style="text-align: center" @click="showPopup=false">
              关闭
            </h4>
          </van-popup>
        </li>
      </ul>
      <ul class="follow-items" v-else>
        <van-empty v-if="status.followMy?.length<=0" description="暂无书友关注"/>
        <li v-else v-if="status.followMy?.length > 0" v-for="user in status.followMy" :key="user.id"
            class="follow-item">
          <div class="avatar-container">
            <img @click="showUser(user.id)" :src="user?.avatarUrl||defaultPicture"
                 class="avatar">
          </div>
          <div @click="showUser(user.id)" class="follow-info">
            <div class="follow-apply">
              <p class="follow-name">{{
                  user.username.length < 12 ? user.username : user.username.slice(0, 12) + '...'
                }}</p>
            </div>
          </div>
          <div style="padding-right: 10px;">
            <van-button round icon="plus" style="width: 80px;" @click="showDialog=true" size="small"
                        v-if="user.state===1" type="primary">关注
            </van-button>
            <van-button round icon="exchange" style="width: 100px;" @click="showPopup=true" size="small"
                        v-if="user.state===2" type="primary">互相关注
            </van-button>
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
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {defaultPicture} from "../common/userCommon";
import myAxios from "../plugins/myAxios";
import {Dialog, Toast} from "vant";
import {getCurrentUser} from "../services/user";
const showPopup = ref(false)
const showDialog = ref(false)
const searchText = ref('');
const isShow = ref(true)
const router = useRouter()
const status = ref({
  loginUser: {},
  followMy: [],
  myFollow: []
})

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
  init()
}
const follow = async (userId: any) => {
  const res = await myAxios.post("/application/add", {
    "receiveId": userId,
  });
  if (res.code === 0){
    Toast.success("已发送申请")
  }
  init()
}


const onSearch = (val: never) => {
  if(searchText.value.trim() === ""){
    Toast({
      message:"搜索内容不能为空",
      position: 'middle'
    })
    return
  }
  router.push({ path: '/searchResult', query: { searchVal: val , queryType: 'user'} });
}

const active = ref("1");
const onTabChange = async (name: string) => {
  var res;
  if (name === "1") {
    res = await myAxios.get("/follow/getFollowMy")
    status.value.followMy = res.data;
  }
  if (name === "2") {
    res = await myAxios.get("/follow/getMyFollow")
    status.value.myFollow = res.data;
  }
}
const onClickLeft = () => {
  router.back()
}

const init = async () => {
  let ans, res;
  ans = await myAxios.get("/follow/getFollowMy").then()
  status.value.followMy = ans.data;
  res = await myAxios.get("/follow/getMyFollow")
  status.value.myFollow = res.data;
}

onMounted(async () => {
  status.value.loginUser = await getCurrentUser();
  await init();
})

const onCancel = () => {
  isShow.value = true;
};
const onFocus = () => {
  isShow.value = false;
}

const showUser = (id: any) => {
  router.push({
    path: '/user/show',
    query: {
      userId: id
    }
  })
}
</script>

<style scoped>
.apply {
  font-size: 14px;
  color: #999;
  width: 80px
}

.follow-list {
  padding: 10px;
}

.follow-group {
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
}

.follow-items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.follow-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e6e6e6;
}

.avatar-container {
  width: 40px;
  height: 40px;
  min-width: 40px !important;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.avatar {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.follow-info {
  margin-left: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.follow-apply {
  display: flex;
  align-items: self-start;
  flex-direction: column;
}

.follow-name {
  font-size: 14px;

}

</style>