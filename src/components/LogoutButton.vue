<template>
  <button @click="handleLogout" class="logout-btn">Logout</button>
</template>

<script>
import api from "../services/api";
import { useRouter } from "vue-router";

export default {
  name: "LogoutButton",
  setup() {
    const router = useRouter();
    return { router };
  },
  methods: {
    async handleLogout() {
      try {
        await api.post("/login/logout");
        localStorage.removeItem("auth_token");
        console.log("Logged out, token removed");
        await this.router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    },
  },
};
</script>

<style scoped>
.logout-btn {
  padding: 10px 20px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.logout-btn:hover {
  background-color: #d9363e;
}
</style>
