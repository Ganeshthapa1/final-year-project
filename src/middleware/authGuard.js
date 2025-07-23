import axios from "axios";

export default async function authGuard(to, from, next) {
  const token = localStorage.getItem("auth_token");
  if (to.matched.some((record) => record.meta.isAdmin)) {
    if (!token) {
      return next({ path: "/login", query: { redirect: to.fullPath } });
    }
    try {
      await axios.get("/api/auth/me");
      next();
    } catch (error) {
      console.error("Auth guard error:", error);
      localStorage.removeItem("auth_token");
      return next({ path: "/login", query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
}
