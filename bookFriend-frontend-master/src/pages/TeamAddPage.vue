<template>
  <div id="teamAddPage">
    <van-form @submit="onSubmit">
      <van-nav-bar
          title="创建队伍"
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
          :src="picture"
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
        <van-button  round block type="primary" native-type="submit">
          提交
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

const picture = ref("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALoAAAEMCAIAAAD8iDt6AAAE40lEQVR4Xu3djVIaWRSF0bz/6ymNYX7UyTxGgtPQyhwb8LgTYoGsVadQ2mtZDV9d2qTUL0/wbl/mB+C451zW6/Xr43CA3YXDDu4gciEgFxp1m/k/l4Obz8x6O6/e3775/rSZeryO9ZeyvnVgdxmOWwx34wzbWSyHcYbFapyb5TBOPT6ttP6y1r88z6/UNg7nMj/EtZILgffkcjc/xLWaxSAX3iIXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISCXo9bbuX/4ZzHcTTMMw8PDw3zdNZHLUXLZJ5ejplweHr9tW1mNIxe5HPV6d5HLhlwa9cVonPHufMU1kUtDLpVcGnKp5NKQSyWXhlwquTTkUsmlIZdKLg25VHJpyKWSS0MulVwacqnk0pBLJZeGXCq5NORSyaUhl0ouDblUctn5sZ05uVRy2ZFLTy4NuVRyacilkktDLpVcGnKp5NKQSyWXhlyqT5LL9CNkv4NcKrk0juWyXv+mL3jWPkku47N42nl4/Dbe/n3/uLxbjZUMy6/j7e3dH4uvf+7WjB+dlp1q5md1fj5JLnUD+PW5XSz3D45zs1yN856VPzfzszo/F5rL/B/s9x/6j5lp1znV1DM6T5edy+4CYv+hv8R5dYpn6bJz2dl/6D9gxq1l/+XpV6ae0Xn6JLnsXzaeaqZL3d2Md+9fLoTH+evx33H2P+vnpp7RebrQXD7O/ZFvpK+TXBpyqeTSkEsll4ZcKrk05FLJpSGXSi4NuVRyacilkktDLpVcGnKp5NKQSyWXhlwquTTkUsmlIZdKLg25VHJpyKWSS0MulVwacqnk0pBLJZeGXCq5NORSyaUhl0ouDblUcmnIpZJLY/or9bufhZZLvSuXObtLJZeGXCq5NORSyaUhl0oujZrL7WIpl3pXLnPTL0msszl4lb/H8GkvBrk82wVxMJerJRcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciEgFwJyISAXAnIhIBcCciFw8lx+bGb9tJl3sf5t57V+WKzqSrlY/5aT58JndvIXIz4zuRCQCwG5EJALAbkQOJzLer355nq6lcs1mxrYOZxLJRd25MK7HHypOZjLUYvhbpxhO4vlMM6wWI1zsxzGqcenldZf1vqX53n6lGe1jQO5vKH+V8Pz+9s33582U4/Xsf5S1lezi5hJlgtXTi4E5EJALgT+AyQYG5bD5eIjAAAAAElFTkSuQmCC")
const router = useRouter();
const route = useRoute();
// 展示日期选择器
const showPicker = ref(false);
const show = ref(false);
const searchValue = ref("");
const books = ref([]);
const bookId = route.query.bookId;
const cover = route.query.cover;
const initFormData = {
  "name": "",
  "description": "",
  "expireTime": null,
  "maxNum": 3,
  "bookId": 0,
  "password": "",
  "avatarUrl": picture.value,
  "status": 0,
}

const minDate = new Date();


// 需要用户填写的表单数据
const addTeamData = ref({...initFormData})

// 提交
const onSubmit = async () => {
  const postData = {
    ...addTeamData.value,
    status: Number(addTeamData.value.status)
  }
  // todo 前端参数校验
  const res = await myAxios.post("/team/add", postData);
  if (res?.code === 0 && res.data){
    Toast.success('添加成功');
    router.push({
      path: '/team',
      replace: true,
    });
  } else {
    Toast.fail('添加失败:'+res.description);
  }
}
const onClickLeft = () => {
  router.back()
}

// 单选器
const select = (id: number, cover: string) => {
  addTeamData.value.bookId = id;
  picture.value = cover;
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

const init = () => {
  if(bookId){
    addTeamData.value.bookId = bookId;
  }
  if(cover){
    console.log(cover)
    addTeamData.value.avatarUrl = cover;
    picture.value = cover;
  }
}

onMounted(async () => {
  init()
  listBooks()
});


</script>

<style scoped>
#teamPage {

}
</style>
