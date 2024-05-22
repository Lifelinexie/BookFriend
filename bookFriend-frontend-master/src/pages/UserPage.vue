<template>
  <template v-if="user">
    <div id="userPage">
      <van-nav-bar
          title="我的"
          @click-left="onClickLeft"
          @click-right="onClickRight"
      >
        <template #left>
          <van-badge :content="applyFriendsCount" v-if="applyFriendsCount>0">
            <van-icon name="envelop-o" size="22" />
          </van-badge>
          <van-icon v-if="applyFriendsCount<=0" name="envelop-o" size="22" />
        </template>
        <template #right>
          <van-icon name="ellipsis" size="22" />
        </template>
      </van-nav-bar>
      <div style="display: flex;justify-content: center; align-content: center">
        <van-uploader :after-read="uploadPicture">
          <van-image
              :src="user?.avatarUrl"
              width="125"
              height="125"
              round
              radius="15"
          >
          </van-image>
        </van-uploader>

      </div>
      <div style="text-align: center;margin: 10px"> {{ user?.userAccount }} </div>
      <mini-book-list-card v-if="bookList" :book-list="bookList"></mini-book-list-card>
      <van-empty image-size="80" v-if="bookList.length < 1">暂无书籍</van-empty>
      <div style="margin: 13px">
        <van-button color="#E0E0E0" block @click="lookOtherBookList(user.id)">查看书架</van-button>
      </div>
      <van-cell icon="more-o" title="修改信息" is-link to="/user/update" />
      <van-cell icon="friends-o" title="关注" is-link to="/follow" ></van-cell>
      <div style="margin: 13px">
        <van-button block type="primary" @click="onClick">
          退出登录
        </van-button>
      </div>

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
const applyFriendsCount = ref(0);
const recordId = ref([]);
import qs from 'qs';


onMounted(async () => {
  user.value = await getCurrentUser();
  loadData();
  applyFriendsCount.value = await onChange()
})

const lookOtherBookList = (id: number) => {
  router.push({path:"/otherBookList", query:{userId:id}});
}
const onChange = async () => {
  // await getRecord()
  let res = await myAxios.get("/application/getRecordCount")
  // console.log(res)
  return applyFriendsCount.value = res.data

}

const loadData = async () => {
  let res;
  if(!userId){
    res = await myAxios.get("/bookList/listBooks");
  }else{
    res = await myAxios.get("/bookList/listBooksById",{params:{userId: userId}});
  }
  if (res.code === 0) {
    bookList.value = res.data;
  }
}

const onClickLeft = async () => {
  const read = await myAxios.get("/application/read", {
    params: {
      ids: recordId.value
    }, paramsSerializer: function(params) {
      return qs.stringify(params, {indices: false})
    }
  })
  if (read) {
    recordId.value.length = 0
    applyFriendsCount.value = 0
  }
  await router.push("/apply")
}

const onClick = async () => {
  const ans =  await myAxios.post("/user/logout");
  if(ans.code === 0){
    Toast.success("退出登录")
    router.push({path:"/user/login"})
  }
}
const getRecord =async () => {
  const res = await myAxios.get("/application/getRecords")
  var records = res.data
  console.log(res)
  records.forEach((record: { status: number; id: never; }) => {
    if (record.status == 0) {
      recordId.value.push(record.id)
    }
  })
}
const uploadPicture = (file: any) => {

  let formData = new FormData();
  formData.append('picture', file.file);
  const ans = myAxios.post('/file/upload',
      formData,
      {headers:{ 'Content-Type': 'multipart/form-data' }}
  ).then((ans) => {
    console.log(ans.data)
    user.value.avatarUrl = ans.data
  })
}



const toEdit = (editKey: string, editName: string, currentValue: string) => {
  router.push({
    path: '/user/edit',
    query: {
      editKey,
      editName,
      currentValue,
    }
  })
}
</script>

<style scoped>
#userPage{

}

</style>
