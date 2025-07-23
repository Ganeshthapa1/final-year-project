import { createRouter, createWebHistory } from "vue-router";
import api from "../services/api";
import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import ServicesView from "@/views/ServicesView.vue";
import AppointmentView from "@/views/AppointmentView.vue";
import ContactView from "@/views/ContactView.vue";
import PetCareTipsView from "@/views/PetCareTipsView.vue";
import AdminAppointmentsView from "@/views/AdminAppointmentsView.vue";
import AppointmentsView from "@/views/AppointmentsView.vue";
import PetsView from "@/views/PetsView.vue";
import ClientsView from "@/views/ClientsView.vue";
import InventoryView from "@/views/InventoryView.vue";
import DoctorsView from "@/views/DoctorsView.vue";
import LoginView from "@/views/LoginView.vue";
import authGuard from "@/middleware/authGuard";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomeView,
    meta: {
      title: "Home - {{settingsStore.websitename}}",
    },
  },
  {
    path: "/about",
    name: "About",
    component: AboutView,
    meta: {
      title: "About Us - {{settingsStore.websitename}}",
    },
  },
  {
    path: "/services",
    name: "Services",
    component: ServicesView,
    meta: {
      title: "Our Services - {{settingsStore.websitename}}",
    },
  },
  {
    path: "/appointment",
    name: "Appointment",
    component: AppointmentView,
    meta: {
      title: "Book Appointment - {{settingsStore.websitename}}",
    },
  },
  {
    path: "/contact",
    name: "Contact",
    component: ContactView,
    meta: {
      title: "Contact Us - {{settingsStore.websitename}}",
    },
  },
  {
    path: "/pet-care-tips",
    name: "PetCareTips",
    component: PetCareTipsView,
    meta: {
      title: "Pet Care Tips - {{settingsStore.websitename}}",
    },
  },
  {
    path: "/admin",
    name: "Dashboard",
    component: () => import("@/views/DashboardView.vue"),
    meta: {
      title: "Dashboard - {{settingsStore.websitename}}",
      requiresAuth: true,
    },
  },
  {
    path: "/admin/appointments",
    name: "AdminAppointments",
    component: AdminAppointmentsView,
    meta: {
      title: "Admin - Appointments - {{settingsStore.websitename}}",
      requiresAuth: true,
    },
  },
  {
    path: "/admin/pets",
    name: "Pets",
    component: PetsView,
    meta: {
      title: "Pets - {{settingsStore.websitename}}",
      requiresAuth: true,
    },
  },
  {
    path: "/admin/clients",
    name: "Clients",
    component: ClientsView,
    meta: {
      title: "Clients - {{settingsStore.websitename}}",
      requiresAuth: true,
    },
  },
  {
    path: "/admin/inventory",
    name: "Inventory",
    component: InventoryView,
    meta: {
      title: "Inventory - {{settingsStore.websitename}}",
      requiresAuth: true,
    },
  },
  {
    path: "/admin/doctors",
    name: "Doctors",
    component: DoctorsView,
    meta: {
      title: "Doctors - {{settingsStore.websitename}}",
      requiresAuth: true,
    },
  },
  {
    path: "/admin/inquiries",
    name: "Inquiries",
    component: () => import("@/views/InquiriesView.vue"),
    meta: {
      title: "Inquiries - {{settingsStore.websitename}}",
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      title: "Login - {{settingsStore.websitename}}",
    },
  },
  {
    path: "/admin/settings",
    name: "AdminSettings",
    component: () => import("@/views/AdminSettingsView.vue"),
    meta: {
      title: "Admin Settings - {{settingsStore.websitename}}",
      requiresAuth: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("auth_token");
  console.log(`Navigating to ${to.path}, token: ${token || "none"}`);

  // Check if the user is trying to access the login page while already authenticated
  if (to.name === "Login" && token && token !== "null") {
    try {
      await api.get("/auth/verify");
      console.log("User is already authenticated, redirecting to /admin");
      return next({ name: "Dashboard" });
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("auth_token");
      next();
    }
  }

  // Handle routes that require authentication
  if (to.meta.requiresAuth) {
    if (!token || token === "null") {
      console.log("No valid token, redirecting to Login");
      localStorage.removeItem("auth_token");
      return next({ name: "Login" });
    }

    try {
      await api.get("/auth/verify");
      console.log("Token verified, proceeding to route");
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("auth_token");
      return next({ name: "Login" });
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  document.title =
    to.meta.title?.replace("{{settingsStore.websitename}}", "VetPro") ||
    "VetPro";
});

export default router;
