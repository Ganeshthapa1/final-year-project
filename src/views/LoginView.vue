<template>
  <div class="login-bg">
    <div class="login-card">
      <div class="login-logo">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          width="48"
          height="48"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
      <h2 class="login-title">Welcome Back</h2>
      <p class="login-subtitle">Sign in to your account</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="login-field">
          <input
            v-model="form.email"
            type="email"
            id="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="login-field">
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="login-btn"
          style="color: #151414; padding: 12px 24px; border: 1px solid #a5b4fc"
        >
          <span v-if="loading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
        <div v-if="errorMessage" class="login-error">
          <p>{{ errorMessage }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from "../services/api";

export default {
  name: "LoginView",
  data() {
    return {
      form: {
        email: "",
        password: "",
        remember: false,
      },
      showPassword: false,
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = "";
      try {
        if (!this.form.email || !this.form.password) {
          throw new Error("Please fill in all fields");
        }

        // Call backend login API
        const response = await api.post("/login", {
          email: this.form.email,
          password: this.form.password,
        });
        console.log(response);
        if (response.token) {
          localStorage.setItem("auth_token", response.token);
          console.log("Token stored:", localStorage.getItem("auth_token"));
          // Redirect to admin dashboard

          this.$router.push("/admin");
        } else {
          throw new Error("Invalid login response");
        }
      } catch (error) {
        this.errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Login failed. Please try again.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, offwhite, #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  background: rgba(147, 112, 112, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 2rem 2rem 1.5rem 2rem;
  max-width: 350px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  text-align: center;
}
.login-logo {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}
.login-title {
  color: #151414;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}
.login-subtitle {
  color: #151414;
  margin-bottom: 1.5rem;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.login-field input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #a5b4fc;
  background: rgba(255, 255, 255, 0.15);
  color: #312e81;
  font-size: 1rem;
}
.show-password-btn {
  margin-top: 0.5rem;
  background: none;
  border: 2px solid #a5b4fc;
  color: #151414;
  cursor: pointer;
  font-size: 0.9rem;
}
.login-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #fff;
}
.login-link {
  color: #a5b4fc;
  text-decoration: underline;
  cursor: pointer;
}
.login-btn {
  background: linear-gradient(90deg);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  margin-top: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}
.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.login-error {
  background: #fee2e2;
  color: #b91c1c;
  border-radius: 6px;
  padding: 0.5rem;
  margin-top: 0.5rem;
}
.login-footer {
  margin-top: 1.5rem;
  color: #fff;
  font-size: 0.95rem;
}
</style>
