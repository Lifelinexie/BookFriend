<template>
  <div id="login">
    <div id="center">
      <van-image
          width="150"
          height="150"
          :src="logo"
      />
    </div>
    <van-row justify="center">
      <h4>"书友——不仅是与书为友，还是与人为友"</h4>
    </van-row>
    <van-form @submit="onSubmit" style="margin: 14px;padding-top: 20px">
      <van-cell-group inset>
        <van-field
            v-model="userAccount"
            name="userAccount"
            label="账号"
            placeholder="请输入账号"
            :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
            v-model="userPassword"
            type="password"
            name="userPassword"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
        <van-cell value="还没有账号？点击注册" title="" to="/user/register"/>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import logo from '../assets/logo.png';

const router = useRouter();
const route = useRoute();

const userAccount = ref('');
const userPassword = ref('');

const onSubmit = async () => {

  if(userPassword.value.length < 8){
    Toast.fail("用户密码长度小于8")
    return
  }
  if(userAccount.value.length < 4){
    Toast.fail("用户账号长度小于4")
    return
  }

  const res = await myAxios.post('/user/login', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
  })
  console.log(res, '用户登录');
  if (res.code === 0 && res.data) {
    Toast.success('登录成功');
    // 跳转到之前的页面
    const redirectUrl = route.query?.redirect as string ?? '/';
    window.location.href = redirectUrl;
  } else {
    Toast.fail('登录失败');
  }
};


</script>

<style scoped>
#login{
  padding-top: 60px;
  margin-left: -20px;
  min-width: 380px;
}
#center{
  justify-content: center;
  margin-top: 10px;
  display: flex;
}
</style>
