<template>

  <form action="/">
    <van-search
        v-model="searchText"
        show-action
        placeholder="请输入要搜索内容"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>
  <div class="section">

    <div class="history-header">
      <h4 >历史搜索</h4>
      <van-button plain style="border: none" type="primary"  @click="delHostClick">清空</van-button>
    </div>

    <van-tag style="margin-left: 10px ;margin-top: 5px; padding: 10px" size="large" color="#D8D8D8" text-color="#585858"
             @click="searchValClick(historyItem)" round v-for="(historyItem, index) in historySearch" :key="index">
      {{ historyItem }}
    </van-tag>

  </div>

  <div class="section">
    <h2>热门搜索</h2>
    <ul>
      <li v-for="(hotItem, index) in hotSearch" :key="index">{{ hotItem }}</li>
    </ul>
  </div>

<!--  <div class="section">-->
<!--    <h2>猜你喜欢</h2>-->
<!--    <ul>-->
<!--      <li v-for="(recommendItem, index) in recommend" :key="index">{{ recommendItem }}</li>-->
<!--    </ul>-->
<!--  </div>-->

 </template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useRoute, useRouter} from "vue-router";
import {Dialog, Toast} from "vant";
const router = useRouter()
const searchText = ref('');
const historySearch = ref([])
const route = useRoute();
const {type} = route.query;

const onSearch = (val: never) => {
  if(searchText.value.trim() !== ""){
    // 之前没有搜索记录，直接push到数组头部
    if(!historySearch.value.some(function (value) {
       return value == val;
    })){
      historySearch.value.unshift(val)
    }else{ // 有搜索记录，先删除，再push 到数组头部
      const i = historySearch.value.indexOf(val)
      historySearch.value.splice(i,1)
      historySearch.value.unshift(val)
    }
    if(historySearch.value.length > 5){
      historySearch.value.pop()
    }
  }else{
    Toast({
      message:"搜索内容不能为空",
      position: 'middle'
    })
    return
  }
  localStorage.setItem("historySearch",JSON.stringify(historySearch.value))
  router.push({ path: '/searchResult', query: { searchVal: val , queryType: type} });
}
const searchValClick = (val: undefined) => {
  console.log("type:"+type);
  router.push({ path: '/searchResult', query: { searchVal: val , queryType: type} });
}

onMounted(async () => {
  const historySearchStr = localStorage.getItem("historySearch")
  if(historySearchStr){
    historySearch.value = JSON.parse(historySearchStr)
  }
});

const delHostClick = async () => {
  Dialog.confirm({
    message: '确定要删除历史搜索吗？',
  }).then(() => {
    historySearch.value = []
    localStorage.removeItem("historySearch")
    Toast({
      message: '删除成功',
      position: 'bottom',
    });
  });
};
const onCancel = () => {
  router.back()
};

</script>

<style scoped>
.section {
  margin-top: 20px;
  margin-left: 12px;
  margin-right: 12px;
}

h2 {
  font-size: 16px;
  margin-bottom: 10px;
}
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 5px 0;
  border-bottom: 1px solid #ccc;
}
</style>
