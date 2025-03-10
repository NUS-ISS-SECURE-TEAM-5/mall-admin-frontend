<template>
    <el-button type="primary" :loading="loading" @click="login">
        Login
    </el-button>
  </template>
  
  <script setup>
  import { useAuth0 } from "@auth0/auth0-vue";
  
  const { loginWithRedirect } = useAuth0();
  const login = () => {
  loginWithRedirect({
    // appState: {
    //   target: "/",
    // },
    // authorizationParams: {
    //   screen_hint: "signup",
    // }
  });
};
  </script>