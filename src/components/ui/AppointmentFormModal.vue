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
        {{ isEdit ? "Edit Appointment" : "Add New Appointment" }}
      </h2>
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Pet *</label>
            <select
              v-model="form.pet_id"
              required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Pet</option>
              <option v-for="pet in pets" :key="pet.id" :value="pet.id">
                {{ pet.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Doctor *</label>
            <select
              v-model="form.doctor_id"
              required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Select Doctor</option>
              <option
                v-for="doctor in doctors"
                :key="doctor.id"
                :value="doctor.id"
              >
                {{ doctor.first_name }} {{ doctor.last_name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Date *</label>
            <input
              v-model="form.appointment_date"
              type="date"
              required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              :min="new Date().toISOString().substr(0, 10)"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Time *</label>
            <input
              v-model="form.appointment_time"
              type="time"
              required
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Reason</label>
            <input
              v-model="form.reason"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select
              v-model="form.status"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Notes</label>
            <textarea
              v-model="form.notes"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            ></textarea>
          </div>
        </div>
        <div v-if="error" class="mt-4 text-red-600 text-sm">{{ error }}</div>
        <div class="flex justify-end mt-6 space-x-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || !form.pet_id || !form.doctor_id"
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
import { ref, watch, computed, onMounted } from "vue";
import { usePetStore } from "@/stores/pet";
import { useDoctorStore } from "@/stores/doctor";
import { useAppointmentStore } from "@/stores/appointment";

const props = defineProps({
  show: Boolean,
  isEdit: Boolean,
  appointment: Object,
});

const emit = defineEmits(["close", "create"]);

const petStore = usePetStore();
const doctorStore = useDoctorStore();
const appointmentStore = useAppointmentStore();

const form = ref({
  pet_id: "",
  doctor_id: "",
  appointment_date: "",
  appointment_time: "",
  reason: "",
  status: "scheduled",
  notes: "",
});
const loading = ref(false);
const error = ref(null);
const selectedAppointment = ref(null);
const pets = computed(() => petStore.pets);
const doctors = computed(() => doctorStore.doctors);

watch(
  () => props.appointment,
  (newVal) => {
    if (props.isEdit && newVal) {
      form.value = {
        pet_id: newVal.pet_id ? String(newVal.pet_id) : "",
        doctor_id: newVal.doctor_id ? String(newVal.doctor_id) : "",
        appointment_date: newVal.appointment_date || "",
        appointment_time: newVal.appointment_time
          ? newVal.appointment_time.split(":").slice(0, 2).join(":")
          : "",
        reason: newVal.reason || "",
        status: newVal.status || "scheduled",
        notes: newVal.notes || "",
      };
      selectedAppointment.value = newVal;
    } else {
      form.value = {
        pet_id: "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        reason: "",
        status: "scheduled",
        notes: "",
      };
      selectedAppointment.value = null;
    }
  },
  { immediate: true }
);

onMounted(async () => {
  await petStore.fetchPets();
  await doctorStore.fetchDoctors();
});

async function handleSubmit() {
  if (!form.value.pet_id) {
    error.value = "Please select a pet";
    return;
  }
  if (!form.value.doctor_id) {
    error.value = "Please select a doctor";
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    const payload = {
      pet_id: parseInt(form.value.pet_id),
      doctor_id: parseInt(form.value.doctor_id),
      appointment_date: form.value.appointment_date,
      appointment_time: form.value.appointment_time
        .split(":")
        .slice(0, 2)
        .join(":"), // Ensure HH:mm format
      reason: form.value.reason || null,
      status: form.value.status,
      notes: form.value.notes || null,
    };
    if (props.isEdit) {
      await updateAppointment(payload);
    } else {
      await emit("create", payload);
    }
  } catch (err) {
    error.value =
      err.message || "An error occurred while saving the appointment";
  } finally {
    loading.value = false;
  }
}

async function updateAppointment(data) {
  const success = await appointmentStore.updateAppointmentInBackend(
    selectedAppointment.value.id,
    data
  );
  if (success) {
    emit("close");
    selectedAppointment.value = null;
  } else {
    error.value = "Failed to update appointment";
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
