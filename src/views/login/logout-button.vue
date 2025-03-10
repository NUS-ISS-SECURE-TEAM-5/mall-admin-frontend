<template>
    <el-button type="primary" :loading="loading" @click="handleLogout">
        Log Out
    </el-button>
</template>

<script setup>
import { useAuth0 } from "@auth0/auth0-vue";

const { logout } = useAuth0();

const handleLogout = () =>
    logout({
        logoutParams: {
            returnTo: window.location.origin,
        }
    });
</script>