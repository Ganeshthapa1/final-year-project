<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      class="bg-white rounded-lg p-6 w-full max-w-md mx-2 animate-scale-in"
      @click.stop
    >
      <h2 class="text-lg font-semibold mb-4">
        {{ isView ? "View Client" : isEdit ? "Edit Client" : "Add New Client" }}
      </h2>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name *</label>
            <input
              v-model="form.name"
              :disabled="isView"
              required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email *</label>
            <input
              v-model="form.email"
              :disabled="isView"
              type="email"
              required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Phone</label>
            <input
              v-model="form.phone"
              :disabled="isView"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Address</label>
            <input
              v-model="form.address"
              :disabled="isView"
              required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div v-if="error" class="mt-4 text-red-600 text-sm">{{ error }}</div>
        <div class="flex justify-end mt-6 space-x-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {{ isView ? "Close" : "Cancel" }}
          </button>
          <button
            v-if="!isView"
            type="submit"
            :disabled="loading || !form.name || !form.email"
            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
          >
            {{ loading ? "Saving..." : isEdit ? "Update" : "Add" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useClientStore } from "@/stores/client";

const props = defineProps({
  show: Boolean,
  isEdit: Boolean,
  isView: Boolean,
  client: Object,
});

const emit = defineEmits(["close", "create", "update"]);

const clientStore = useClientStore();

const form = ref({
  name: "",
  email: "",
  phone: "",
  address: "",
});
const loading = ref(false);
const error = ref(null);

watch(
  () => props.client,
  (newVal) => {
    if ((props.isEdit || props.isView) && newVal) {
      form.value = {
        name: newVal.name || "",
        email: newVal.email || "",
        phone: newVal.phone || "",
        address: newVal.address || "",
      };
    } else {
      form.value = {
        name: "",
        email: "",
        phone: "",
        address: "",
      };
    }
  },
  { immediate: true }
);

async function handleSubmit() {
  if (!form.value.name) {
    error.value = "Please enter a name";
    return;
  }
  if (!form.value.email) {
    error.value = "Please enter an email";
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone || null,
      address: form.value.address || null,
    };
    if (props.isEdit) {
      const success = await clientStore.updateClient(props.client.id, payload);
      if (success) {
        emit("update", payload);
        emit("close");
      } else {
        error.value = "Failed to update client";
      }
    } else {
      await emit("create", payload);
      emit("close");
    }
  } catch (err) {
    error.value = err.message || "An error occurred while saving the client";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}
@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
