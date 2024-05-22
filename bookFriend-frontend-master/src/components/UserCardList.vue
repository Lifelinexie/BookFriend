<template>
  <div id="userCard">
      <van-card
          v-for="user in props.userList"
          :title="user.username"
          :thumb="user.avatarUrl"
      >
        <template #footer>
          <van-button size="mini">联系我</van-button>
        </template>
      </van-card>
  </div>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";

interface UserCardListProps {
  loading: boolean;
  userList: UserType[];
}

const props = withDefaults(defineProps<UserCardListProps>(), {
  loading: true,
  // @ts-ignore
  userList: [] as UserType[],
});

</script>

<style scoped>

</style>
