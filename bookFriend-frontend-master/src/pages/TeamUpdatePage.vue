<template>
  <div id="teamAddPage">
    <van-form >
      <van-nav-bar
          title="更新队伍"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
      >

      </van-nav-bar>
      <van-cell-group inset>
        <van-field
            v-model="addTeamData.name"
            name="name"
            label="队伍名"
            placeholder="请输入队伍名"
            :rules="[{ required: true, message: '请输入队伍名' }]"
        />
        <van-field
            v-model="addTeamData.description"
            rows="4"
            autosize
            label="队伍描述"
            type="textarea"
            placeholder="请输入队伍描述"
        />
        <van-field
            is-link
            readonly
            name="datetimePicker"
            label="过期时间"
            :placeholder="addTeamData.expireTime ?? '点击选择过期时间'"
            @click="showPicker = true"
        />
        <div id="addBook" style="display: flex; margin: 15px" @click="show = true">
          <van-image style="width: 90px; height: 120px;"
                     :src="addTeamData.avatarUrl"
          >
          </van-image>
          <div style="line-height: 120px; margin-left: 10px">
            选择书籍
          </div>
        </div>
        <van-popup
            v-model:show="show"
            closeable
            close-icon-position="top-left"
            position="bottom"
            :style="{ height: '100%'}"
        >
          <van-nav-bar title="选择书籍"></van-nav-bar>
          <van-search v-model="searchValue"
                      placeholder="搜索书城"
                      @search="onSearch"
                      @update:model-value="onSearch"
          />
          <template v-if="searchValue.length < 1">
            <h4 style="margin-left: 10px">书架</h4>
          </template>
          <van-radio-group v-model="addTeamData.bookId">
            <div
                style="display: flex;margin: 10px"
                v-for="book in books"
                @click="select(book.bookId, book.cover)"
            >
              <van-image style="width: 60px; height: 80px;"
                         :src="book.cover"
              >
              </van-image>
              <div style="width: 70%; margin-left: 20px">
                <h4 class="van-ellipsis" style="height: 30%; margin: 5px">{{ book.title }}</h4>
                <p style="font-size: small; text-indent: 5px">{{ book.author }}</p>
              </div>
              <van-radio :name="book.bookId" />
            </div>
          </van-radio-group>
          <van-button
              type="primary"
              style="width: 100%;"
              @click="show = false"
          >
            完成</van-button>
        </van-popup>
        <van-popup v-model:show="showPicker" position="bottom">
          <van-datetime-picker
              v-model="addTeamData.expireTime"
              @confirm="showPicker = false"
              type="datetime"
              title="请选择过期时间"
              :min-date="minDate"
          />
        </van-popup>
        <van-field name="stepper" label="最大人数">
          <template #input>
            <van-stepper v-model="addTeamData.maxNum" max="10" min="3"/>
          </template>
        </van-field>
        <van-field name="radio" label="队伍状态">
          <template #input>
            <van-radio-group v-model="addTeamData.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
            v-if="Number(addTeamData.status) === 2"
            v-model="addTeamData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入队伍密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button @click="onSubmit"  round block type="primary" native-type="submit">
          更新
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";

const router = useRouter();
const route = useRoute();

// 展示日期选择器
const showPicker = ref(false);

const minDate = new Date();
const initFormData = {
  "name": "",
  "description": "",
  "expireTime": null,
  "maxNum": 3,
  "bookId": 0,
  "password": "",
  "avatarUrl": "",
  "status": 0,
}
const id = route.query.id;
const show = ref(false);
const searchValue = ref("");
const books = ref([]);

const select = (id: number, cover: string) => {
  addTeamData.value.bookId = id;
  addTeamData.value.avatarUrl = cover;
}
const listBooks = async () => {
  const ans = await myAxios.get('/bookList/listBooks');
  if(ans.code === 0){
    books.value = ans.data;
  }else{
    Toast.fail(ans.description)
  }
}

const onSearch = async () => {
  if(searchValue.value.length < 1){
    listBooks();
    return;
  }
  const listData = await myAxios.post('/search/all', {
    searchText: searchValue.value,
    type: 'book'
  })
      .then(function (response) {
        console.log('/search/all succeed', response);
        return response?.data;
      })
      .catch(function (error) {
        console.error('/search/all error', error);
        Toast.fail('搜索失败');
      });

  books.value = listData['dataList'];
}

// 需要用户填写的表单数据
const addTeamData = ref({...initFormData})
const onClickLeft = () => {
  router.back()
}
// 获取之前的队伍信息
onMounted(async () => {
  if (Number(id) <= 0) {
    Toast.fail('加载队伍失败');
    return;
  }
  const res = await myAxios.get("/team/get", {
    params: {
      id,
    }
  });
  if (res?.code === 0) {
    addTeamData.value = res.data;
  } else {
    Toast.fail('加载队伍失败，请刷新重试');
  }
  listBooks()
}
)

// 提交
const onSubmit = async () => {
  const postData = {
    ...addTeamData.value,
    status: Number(addTeamData.value.status)
  }
  // todo 前端参数校验
  const res = await myAxios.post("/team/update", postData);
  if (res?.code === 0 && res.data){
    Toast.success('更新成功');
    router.push({
      path: '/team',
      replace: true,
    });
  } else {
    Toast.success('更新失败');
  }
}
</script>

<style scoped>
#teamPage {

}
</style>
