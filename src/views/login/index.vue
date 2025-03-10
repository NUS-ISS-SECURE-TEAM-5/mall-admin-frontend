<template>
  <div>
    <el-card class="login-form-layout">
      <div style="text-align: center">
        <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
      </div>
      <h2 class="login-title color-main">mall-admin-web</h2>
      <el-form-item style="text-align: center; margin-bottom: 60px">
        <div class="nav-bar__buttons">
          <template v-if="!isAuthenticated">
            <SignupButton />
            <LoginButton />
          </template>
          <template v-if="isAuthenticated">
            <LogoutButton />
          </template>
        </div>
      </el-form-item>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
  </div>
</template>

<script setup>
import login_center_bg from '@/assets/images/login_center_bg.png';
import { ref } from 'vue';
import { useAuth0 } from "@auth0/auth0-vue";
import LogoutButton from './logout-button.vue';
import LoginButton from './login-button.vue';

const { isAuthenticated } = useAuth0();

const loading = ref(false);
const dialogVisible = ref(false);

const dialogConfirm = () => {
  dialogVisible.value = false;
};

</script>

<style scoped>
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 140px auto;
  border-top: 10px solid #409EFF;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #409EFF;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
</style>