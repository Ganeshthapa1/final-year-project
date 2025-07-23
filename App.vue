<template>
  <div id="app">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg fixed w-full top-0 z-50 transition-all duration-300" :class="{ 'bg-white/95 backdrop-blur-sm': scrolled }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <Heart class="h-8 w-8 text-blue-600 mr-2" />
              <span class="text-xl font-bold text-gray-800">{{settingsStore.websitename}}</span>
            </div>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <a v-for="item in navItems" :key="item.name" 
                 @click="setActiveSection(item.id)"
                 :class="{ 'text-blue-600 border-b-2 border-blue-600': activeSection === item.id }"
                 class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer transition-all duration-200">
                {{ item.name }}
              </a>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-700 hover:text-blue-600">
              <Menu v-if="!mobileMenuOpen" class="h-6 w-6" />
              <X v-else class="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t">
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a v-for="item in navItems" :key="item.name"
             @click="setActiveSection(item.id); mobileMenuOpen = false"
             :class="{ 'text-blue-600 bg-blue-50': activeSection === item.id }"
             class="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium cursor-pointer transition-all duration-200">
            {{ item.name }}
          </a>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-16">
      <!-- Home Section -->
      <section v-if="activeSection === 'home'" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="animate-fade-in-left">
              <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Professional 
                <span class="text-blue-600">Veterinary Care</span>
                for Your Beloved Pets
              </h1>
              <p class="text-xl text-gray-600 mb-8">
                Comprehensive veterinary services with state-of-the-art facilities and compassionate care for all your furry family members.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <button @click="setActiveSection('appointment')" 
                        class="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200">
                  Book Appointment
                </button>
                <button @click="setActiveSection('services')"
                        class="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200">
                  Our Services
                </button>
              </div>
            </div>
            <div class="animate-fade-in-right">
              <div class="relative">
                <img src="https://sdmntpreastus.oaiusercontent.com/files/00000000-58f4-61f9-acfc-4ff9df672114/raw?se=2025-07-09T08%3A31%3A58Z&sp=r&sv=2024-08-04&sr=b&scid=4a14cba8-4e69-52d6-a39c-e97f69429baf&skoid=02b7f7b5-29f8-416a-aeb6-99464748559d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-08T21%3A28%3A43Z&ske=2025-07-09T21%3A28%3A43Z&sks=b&skv=2024-08-04&sig=FNQb7zVolGK1tGCEqd4L%2B/dk5lOe7fjdPfZF%2BnmMLfo%3D">
                <div class="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg animate-bounce-slow">
                  <div class="flex items-center">
                    <Award class="h-8 w-8 text-yellow-500 mr-3" />
                    <div>
                      <p class="font-semibold text-gray-800">Award Winning</p>
                      <p class="text-sm text-gray-600">Veterinary Clinic</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="bg-white py-16">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div v-for="stat in stats" :key="stat.label" class="text-center animate-count-up">
                <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{{ stat.value }}</div>
                <div class="text-gray-600">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- About Us Section -->
      <section v-if="activeSection === 'about'" class="min-h-screen bg-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 animate-fade-in-up">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">About {{settingsStore.websitename}}</h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
             {{ settingsStore.about }}
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div class="animate-fade-in-left">
              <!-- <img src="" alt="Our clinic" class="rounded-lg shadow-lg"> -->
            </div>
            <div class="animate-fade-in-right">
              <h3 class="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p class="text-gray-600 mb-6">
                We believe every pet deserves the highest quality medical care. Our team of experienced veterinarians and support staff work together to ensure your pets receive comprehensive, compassionate care in a comfortable environment.
              </p>
              <div class="space-y-4">
                <div class="flex items-center">
                  <CheckCircle class="h-6 w-6 text-green-500 mr-3" />
                  <span class="text-gray-700">24/7 Emergency Care Available</span>
                </div>
                <div class="flex items-center">
                  <CheckCircle class="h-6 w-6 text-green-500 mr-3" />
                  <span class="text-gray-700">State-of-the-art Medical Equipment</span>
                </div>
                <div class="flex items-center">
                  <CheckCircle class="h-6 w-6 text-green-500 mr-3" />
                  <span class="text-gray-700">Experienced Veterinary Team</span>
                </div>
                <div class="flex items-center">
                  <CheckCircle class="h-6 w-6 text-green-500 mr-3" />
                  <span class="text-gray-700">Comprehensive Pet Care Services</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Section -->
          <div class="animate-fade-in-up">
            <h3 class="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div v-for="member in teamMembers" :key="member.name" 
                   class="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                <img :src="member.image" :alt="member.name" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover">
                <h4 class="text-xl font-semibold text-gray-900 mb-2">{{ member.name }}</h4>
                <p class="text-blue-600 font-medium mb-3">{{ member.role }}</p>
                <p class="text-gray-600 text-sm">{{ member.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Services Section -->
      <section v-if="activeSection === 'services'" class="min-h-screen bg-gray-50 py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 animate-fade-in-up">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive veterinary services to keep your pets healthy and happy throughout their lives.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="service in services" :key="service.name"
                 class="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up">
              <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
                <component :is="service.icon" class="h-8 w-8 text-blue-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ service.name }}</h3>
              <p class="text-gray-600 mb-4">{{ service.description }}</p>
              <ul class="space-y-2">
                <li v-for="feature in service.features" :key="feature" class="flex items-center text-sm text-gray-600">
                  <CheckCircle class="h-4 w-4 text-green-500 mr-2" />
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Appointment Section -->
      <section v-if="activeSection === 'appointment'" class="min-h-screen bg-white py-20">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 animate-fade-in-up">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">Book an Appointment</h2>
            <p class="text-xl text-gray-600">
              Schedule a visit for your pet today. We're here to help with all your veterinary needs.
            </p>
          </div>

          <div class="bg-gray-50 rounded-lg p-8 animate-fade-in-up">
            <form @submit.prevent="submitAppointment" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pet Owner Name</label>
                  <input v-model="appointmentForm.ownerName" type="text" required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input v-model="appointmentForm.phone" type="tel" required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
                  <input v-model="appointmentForm.petName" type="text" required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Pet Type</label>
                  <select v-model="appointmentForm.petType" required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select pet type</option>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="bird">Bird</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <input v-model="appointmentForm.date" type="date" required
                         class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                  <select v-model="appointmentForm.time" required
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Service Needed</label>
                <select v-model="appointmentForm.service" required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select service</option>
                  <option value="checkup">General Checkup</option>
                  <option value="vaccination">Vaccination</option>
                  <option value="surgery">Surgery</option>
                  <option value="dental">Dental Care</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea v-model="appointmentForm.notes" rows="4"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Please describe your pet's symptoms or any specific concerns..."></textarea>
              </div>
              <button type="submit" 
                      class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200">
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section v-if="activeSection === 'contact'" class="min-h-screen bg-gray-50 py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 animate-fade-in-up">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p class="text-xl text-gray-600">
              Get in touch with us for any questions or concerns about your pet's health.
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Contact Information -->
            <div class="animate-fade-in-left">
              <div class="bg-white rounded-lg p-8 shadow-lg">
                <h3 class="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                <div class="space-y-6">
                  <div class="flex items-start">
                    <MapPin class="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h4 class="font-semibold text-gray-900">Address</h4>
                      <p class="text-gray-600">{{ settingsStore.address }}<br>{{ settingsStore.district }}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <Phone class="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h4 class="font-semibold text-gray-900">Phone</h4>
                      <p class="text-gray-600">{{ settingsStore.phone }}</p>
                      <p class="text-sm text-gray-500">Emergency: (555) 123-4568</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <Mail class="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h4 class="font-semibold text-gray-900">Email</h4>
                      <p class="text-gray-600">{{ settingsStore.email }}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <Clock class="h-6 w-6 text-blue-600 mr-4 mt-1" />
                    <div>
                      <h4 class="font-semibold text-gray-900">Hours</h4>
                      <div class="text-gray-600 space-y-1">
                        <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 4:00 PM</p>
                        <p>Sunday: Emergency Only</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="animate-fade-in-right">
              <div class="bg-white rounded-lg p-8 shadow-lg">
                <h3 class="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
                <form @submit.prevent="submitContact" class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input v-model="contactForm.name" type="text" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input v-model="contactForm.email" type="email" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <input v-model="contactForm.subject" type="text" required
                           class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea v-model="contactForm.message" rows="5" required
                              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"></textarea>
                  </div>
                  <button type="submit"
                          class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pet Care Tips Section -->
      <section v-if="activeSection === 'tips'" class="min-h-screen bg-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16 animate-fade-in-up">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">Pet Care Tips</h2>
            <p class="text-xl text-gray-600">
              Expert advice to keep your pets healthy and happy at home.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="tip in petCareTips" :key="tip.title"
                 class="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up">
              <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4">
                <component :is="tip.icon" class="h-8 w-8 text-blue-600" />
              </div>
              <h3 class="text-xl font-semibold text-gray-900 mb-3">{{ tip.title }}</h3>
              <p class="text-gray-600 mb-4">{{ tip.description }}</p>
              <ul class="space-y-2">
                <li v-for="point in tip.tips" :key="point" class="flex items-start text-sm text-gray-600">
                  <CheckCircle class="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {{ point }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div class="flex items-center mb-4">
              <Heart class="h-8 w-8 text-blue-400 mr-2" />
              <span class="text-xl font-bold">{{settingsStore.websitename}}</span>
            </div>
            <p class="text-gray-400 mb-4">
              Providing exceptional veterinary care with compassion and expertise for over 15 years.
            </p>
            <div class="flex space-x-4">
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <span class="text-xs font-bold">f</span>
              </div>
              <div class="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
                <span class="text-xs font-bold">t</span>
              </div>
              <div class="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-700 transition-colors">
                <span class="text-xs font-bold">i</span>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a @click="setActiveSection('home')" class="text-gray-400 hover:text-white cursor-pointer transition-colors">Home</a></li>
              <li><a @click="setActiveSection('about')" class="text-gray-400 hover:text-white cursor-pointer transition-colors">About Us</a></li>
              <li><a @click="setActiveSection('services')" class="text-gray-400 hover:text-white cursor-pointer transition-colors">Services</a></li>
              <li><a @click="setActiveSection('appointment')" class="text-gray-400 hover:text-white cursor-pointer transition-colors">Book Appointment</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Services</h3>
            <ul class="space-y-2">
              <li><span class="text-gray-400">General Checkups</span></li>
              <li><span class="text-gray-400">Vaccinations</span></li>
              <li><span class="text-gray-400">Surgery</span></li>
              <li><span class="text-gray-400">Emergency Care</span></li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-4">Contact Info</h3>
            <div class="space-y-2 text-gray-400">
              <p>{{ settingsStore.address }}</p>
              <p>{{ settingsStore.district }}</p>
              <p>{{ settingsStore.phone }}</p>
              <p>{{ settingsStore.email }}</p>
            </div>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {{ new Date().getFullYear() }} {{settingsStore.websitename}}. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md mx-4 animate-scale-in">
        <div class="text-center">
          <CheckCircle class="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ successMessage.title }}</h3>
          <p class="text-gray-600 mb-6">{{ successMessage.message }}</p>
          <button @click="showSuccessModal = false"
                  class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  Heart, Menu, X, Award, CheckCircle, MapPin, Phone, Mail, Clock,
  Stethoscope, Syringe, Scissors, Shield, Users, Activity
} from 'lucide-vue-next'
import { useSettingsStore } from '@/stores/settings';
import doctorService from '@/services/doctorService'; // Import the doctorService

export default {
  name: 'VeterinaryApp',
  components: {
    Heart, Menu, X, Award, CheckCircle, MapPin, Phone, Mail, Clock,
    Stethoscope, Syringe, Scissors, Shield, Users, Activity
  },
  setup() {
    const settingsStore = useSettingsStore();
    window.addEventListener('settings-updated', () => {
      settingsStore.websiteName = settingsStore.websiteName;
      settingsStore.address = settingsStore.address;
      settingsStore.district = settingsStore.district;
      settingsStore.phone = settingsStore.phone;
      settingsStore.email = settingsStore.email;
    });
    return { settingsStore };
  },
  data() {
    return {
      activeSection: 'home',
      mobileMenuOpen: false,
      scrolled: false,
      showSuccessModal: false,
      successMessage: { title: '', message: '' },
      navItems: [
        { name: 'Home', id: 'home' },
        { name: 'About Us', id: 'about' },
        { name: 'Services', id: 'services' },
        { name: 'Book Appointment', id: 'appointment' },
        { name: 'Pet Care Tips', id: 'tips' },
        { name: 'Contact Us', id: 'contact' }
      ],
      stats: [
        { value: '15+', label: 'Years Experience' },
        { value: '5000+', label: 'Happy Pets' },
        { value: '24/7', label: 'Emergency Care' },
        { value: '10+', label: 'Expert Vets' }
      ],
      teamMembers: [], // Will be filled dynamically
      services: [
        {
          name: 'General Checkups',
          icon: 'Stethoscope',
          description: 'Comprehensive health examinations to keep your pet in optimal condition.',
          features: ['Physical examination', 'Health assessment', 'Preventive care advice', 'Early disease detection']
        },
        {
          name: 'Vaccinations',
          icon: 'Syringe',
          description: 'Essential vaccinations to protect your pet from common diseases.',
          features: ['Core vaccines', 'Non-core vaccines', 'Vaccination schedules', 'Immunity testing']
        },
        {
          name: 'Surgery',
          icon: 'Scissors',
          description: 'Advanced surgical procedures performed by experienced veterinary surgeons.',
          features: ['Spay/neuter procedures', 'Soft tissue surgery', 'Orthopedic surgery', 'Emergency surgery']
        },
        {
          name: 'Emergency Care',
          icon: 'Shield',
          description: '24/7 emergency veterinary services for urgent pet health situations.',
          features: ['24/7 availability', 'Critical care', 'Emergency surgery', 'Intensive monitoring']
        },
        {
          name: 'Dental Care',
          icon: 'Activity',
          description: 'Complete dental health services to maintain your pet\'s oral hygiene.',
          features: ['Dental cleaning', 'Tooth extraction', 'Oral surgery', 'Dental X-rays']
        },
        {
          name: 'Wellness Programs',
          icon: 'Users',
          description: 'Comprehensive wellness programs tailored to your pet\'s life stage.',
          features: ['Puppy/kitten care', 'Senior pet care', 'Nutrition counseling', 'Behavioral advice']
        }
      ],
      petCareTips: [
        {
          title: 'Nutrition & Diet',
          icon: 'Heart',
          description: 'Proper nutrition is essential for your pet\'s health and longevity.',
          tips: [
            'Feed age-appropriate, high-quality pet food',
            'Maintain consistent feeding schedules',
            'Monitor portion sizes to prevent obesity',
            'Provide fresh water daily',
            'Avoid feeding human food that can be toxic'
          ]
        },
        {
          title: 'Exercise & Activity',
          icon: 'Activity',
          description: 'Regular exercise keeps pets physically and mentally healthy.',
          tips: [
            'Provide daily exercise appropriate for your pet\'s breed',
            'Engage in interactive play sessions',
            'Take dogs for regular walks',
            'Provide mental stimulation with puzzle toys',
            'Adjust activity levels based on age and health'
          ]
        },
        {
          title: 'Preventive Care',
          icon: 'Shield',
          description: 'Prevention is better than cure when it comes to pet health.',
          tips: [
            'Schedule regular veterinary checkups',
            'Keep vaccinations up to date',
            'Use flea and tick prevention',
            'Maintain dental hygiene',
            'Monitor for changes in behavior or appetite'
          ]
        }
      ],
      appointmentForm: {
        ownerName: '',
        phone: '',
        petName: '',
        petType: '',
        date: '',
        time: '',
        service: '',
        notes: ''
      },
      contactForm: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  },
  async mounted() {
    window.addEventListener('scroll', this.handleScroll)
    // Fetch doctors for team section
    try {
      const response = await doctorService.getAll();
      this.teamMembers = (response.data || []).map(doc => ({
        name: `Dr. ${doc.first_name} ${doc.last_name}`.trim(),
        role: doc.specialization || 'Veterinarian',
        image: doc.profile_image || '/placeholder.svg?height=200&width=200',
        description: doc.bio || doc.description || '',
        email: doc.email,
        phone: doc.phone
      }));
    } catch (e) {
      // fallback or error handling
      this.teamMembers = [];
    }
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    setActiveSection(section) {
      this.activeSection = section
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    handleScroll() {
      this.scrolled = window.scrollY > 50
    },
    submitAppointment() {
      // Simulate form submission
      this.successMessage = {
        title: 'Appointment Booked!',
        message: 'Your appointment has been successfully scheduled. We will contact you soon to confirm the details.'
      }
      this.showSuccessModal = true
      this.resetAppointmentForm()
    },
    submitContact() {
      // Simulate form submission
      this.successMessage = {
        title: 'Message Sent!',
        message: 'Thank you for contacting us. We will get back to you within 24 hours.'
      }
      this.showSuccessModal = true
      this.resetContactForm()
    },
    resetAppointmentForm() {
      this.appointmentForm = {
        ownerName: '',
        phone: '',
        petName: '',
        petType: '',
        date: '',
        time: '',
        service: '',
        notes: ''
      }
    },
    resetContactForm() {
      this.contactForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounceCustom {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.animate-fade-in-left {
  animation: fadeInLeft 0.8s ease-out;
}

.animate-fade-in-right {
  animation: fadeInRight 0.8s ease-out;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

.animate-bounce-slow {
  animation: bounceCustom 3s infinite;
}

.animate-count-up {
  animation: fadeInUp 0.8s ease-out;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Focus styles for accessibility */
input:focus, select:focus, textarea:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3B82F6;
}
</style>
