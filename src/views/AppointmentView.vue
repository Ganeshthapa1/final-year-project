<template>
  <div class="min-h-screen bg-white py-20">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16 animate-fade-in-up">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          Book an Appointment
        </h2>
        <p class="text-xl text-gray-600">
          Schedule a visit for your pet today. We're here to help with all your
          veterinary needs.
        </p>
      </div>

      <div class="bg-gray-50 rounded-lg p-8 animate-fade-in-up">
        <form @submit.prevent="submitAppointment" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Pet Owner Name *</label
              >
              <input
                v-model="form.client_name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                v-model="form.client_phone"
                type="tel"
                required
                @input="validatePhone"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': phoneError }"
                placeholder="Enter exactly 10 digits"
              />
              <!-- <p v-if="phoneError" class="text-sm text-red-500 mt-1">
                Phone number must be exactly 10 digits
              </p> -->
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Email Address</label
              >
              <input
                v-model="form.client_email"
                type="email"
                @input="validateEmail"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :class="{ 'border-red-500': emailError }"
                placeholder="your.email@gmail.com"
              />
              <p v-if="emailError" class="text-sm text-red-500 mt-1">
                Email must end with @gmail.com if provided
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Pet Name *</label
              >
              <input
                v-model="form.pet_name"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your pet's name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Pet Type *</label
              >
              <select
                v-model="form.pet_type"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select pet type</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="hamster">Hamster</option>
                <option value="guinea-pig">Guinea Pig</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Select Doctor *</label
              >
              <select
                v-model="form.doctor_id"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select doctor</option>
                <option
                  v-for="doctor in doctors.filter((d) => d.status === 'active')"
                  :key="doctor.id"
                  :value="doctor.id"
                >
                  {{ doctor.first_name }} {{ doctor.last_name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Preferred Date *</label
              >
              <input
                v-model="form.appointment_date"
                type="date"
                required
                :min="minDate"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Preferred Time *</label
              >
              <select
                v-model="form.appointment_time"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select time</option>
                <option value="09:00">9:00 AM</option>
                <option value="09:30">9:30 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="14:30">2:30 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="15:30">3:30 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="16:30">4:30 PM</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Service Needed *</label
              >
              <select
                v-model="form.service_type"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select service</option>
                <option value="checkup">General Checkup</option>
                <option value="vaccination">Vaccination</option>
                <option value="surgery">Surgery Consultation</option>
                <option value="dental">Dental Care</option>
                <option value="grooming">Grooming</option>
                <option value="emergency">Emergency</option>
                <option value="consultation">General Consultation</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Additional Notes</label
            >
            <textarea
              v-model="form.notes"
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please describe your pet's symptoms or any specific concerns..."
            ></textarea>
          </div>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <div class="spinner mr-2"></div>
              Booking Appointment...
            </span>
            <span v-else>Book Appointment</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAppointmentStore } from "@/stores/appointment";
import { useUIStore } from "@/stores/ui";
import { appointmentService } from "@/services/appointmentService";
import axios from "axios";

export default {
  name: "AppointmentView",
  setup() {
    const appointmentStore = useAppointmentStore();
    const uiStore = useUIStore();

    return {
      appointmentStore,
      uiStore,
    };
  },
  data() {
    return {
      isSubmitting: false,
      doctors: [],
      form: {
        client_name: "",
        client_phone: "",
        client_email: "",
        pet_name: "",
        pet_type: "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        service_type: "",
        notes: "",
      },
      phoneError: false,
      emailError: false,
    };
  },
  computed: {
    minDate() {
      const today = new Date();
      return today.toISOString().split("T")[0];
    },
  },
  async mounted() {
    await this.fetchDoctors();
  },
  methods: {
    async fetchDoctors() {
      try {
        const response = await axios.get("/api/doctor");
        this.doctors = response.data.data;
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    },
    async checkAvailability(doctor_id, date, time) {
      try {
        const response = await axios.post(
          "/api/appointment/check-availability",
          {
            doctor_id,
            appointment_date: date,
            appointment_time: time,
          }
        );
        return response.data.available;
      } catch (error) {
        console.error("Error checking availability:", error);
        this.uiStore.showSuccessMessage(
          "Error",
          "Failed to check doctor availability. Please try again."
        );
        return false;
      }
    },
    validatePhone() {
      const digits = this.form.client_phone.replace(/\D/g, '');
      this.phoneError = digits.length !== 10;
      if (digits.length > 10) {
        this.form.client_phone = digits.slice(0, 10);
      } else {
        this.form.client_phone = digits;
      }
      console.log("Phone input:", digits, "Error:", this.phoneError); // Debug log
    },
    validateEmail() {
      this.emailError = this.form.client_email && !this.form.client_email.endsWith("@gmail.com");
    },
    async submitAppointment() {
      this.isSubmitting = true;

      // Force re-validation before submission
      this.validatePhone();
      this.validateEmail();

      try {
        const isAvailable = await this.checkAvailability(
          this.form.doctor_id,
          this.form.appointment_date,
          this.form.appointment_time
        );

        if (!isAvailable) {
          this.uiStore.showSuccessMessage(
            "Error",
            "The selected doctor is not available at this date and time. Please choose a different time or doctor."
          );
          this.isSubmitting = false;
          return;
        }

        if (!this.form.client_phone || this.phoneError) {
          this.uiStore.showSuccessMessage("Error", "Phone number must be exactly 10 digits.");
          this.isSubmitting = false;
          return;
        }

        if (this.form.client_email && this.emailError) {
          this.uiStore.showSuccessMessage("Error", "Email must end with @gmail.com.");
          this.isSubmitting = false;
          return;
        }

        const appointmentData = {
          client_name: this.form.client_name,
          client_phone: this.form.client_phone,
          client_email: this.form.client_email || null,
          pet_name: this.form.pet_name,
          pet_type: this.form.pet_type,
          doctor_id: this.form.doctor_id,
          appointment_date: this.form.appointment_date,
          appointment_time: this.form.appointment_time,
          service_type: this.form.service_type,
          notes: this.form.notes,
          status: "scheduled",
        };

        console.log("Submitting appointment data:", appointmentData);

        const response = await appointmentService.bookAppointment(appointmentData);
        console.log("API response:", response);

        this.appointmentStore.addAppointment({ ...this.form });

        this.uiStore.showSuccessMessage(
          "Appointment Booked Successfully!",
          `Your appointment for ${this.form.pet_name} has been scheduled for ${this.form.appointment_date} at ${this.form.appointment_time}.`
        );

        this.resetForm();
        this.showSuccessWithRedirect();
      } catch (error) {
        console.error(
          "Error booking appointment:",
          error.response?.data || error.message
        );
        this.uiStore.showSuccessMessage(
          "Error",
          error.response?.data?.error ||
            "There was an error booking your appointment. Please try again."
        );
      } finally {
        this.isSubmitting = false;
      }
    },
    showSuccessWithRedirect() {
      const banner = document.createElement("div");
      banner.className =
        "fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-md";
      banner.innerHTML = `
        <div class="flex items-center justify-between">
          <span>Your appointment has been booked successfully!</span>
          <button onclick="window.location.href='/appointments'" class="bg-white text-green-500 px-3 py-1 rounded text-sm font-medium ml-4 hover:bg-gray-100">
            View Appointments
          </button>
        </div>
      `;

      document.body.appendChild(banner);

      setTimeout(() => {
        this.$router.push("/appointments");
        if (banner.parentNode) {
          banner.parentNode.removeChild(banner);
        }
      }, 3000);
    },
    resetForm() {
      this.form = {
        client_name: "",
        client_phone: "",
        client_email: "",
        pet_name: "",
        pet_type: "",
        doctor_id: "",
        appointment_date: "",
        appointment_time: "",
        service_type: "",
        notes: "",
      };
      this.phoneError = false;
      this.emailError = false;
    },
  },
};
</script>

<style scoped>
.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>