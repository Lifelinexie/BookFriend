<template>
  <div id="register">
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
        <van-field
            v-model="checkPassword"
            type="password"
            name="checkPassword"
            label="密码"
            placeholder="请再次输入密码"
            :rules="[{ checkPass, message: '请再次填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          注册
        </van-button>
        <van-cell value="已有账号？点击登录" title="" to="/user/login"/>
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
const checkPassword = ref('');

const checkPass = ()=>{
  return userPassword === checkPassword;
}
const onSubmit = async () => {
  const res = await myAxios.post('/user/register', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    checkPassword: checkPassword.value
  })
  console.log(res, '用户注册');
  if (res.code === 0 && res.data) {
    Toast.success('注册成功');
    // 跳转到登录界面
    await router.push("/user/login")
  } else {
    Toast.fail('注册失败', res.description);
  }
};

</script>

<style scoped>
#register{
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
