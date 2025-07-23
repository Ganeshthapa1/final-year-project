<template>
  <AdminLayout>
    <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Inventory</h1>
      <div class="flex space-x-3">
        
        <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" @click="openCreateModal()">
          Add New Item
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <div class="w-6 h-6 bg-blue-600 rounded"></div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Items</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalItems }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <div class="w-6 h-6 bg-red-600 rounded"></div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Low Stock</p>
            <p class="text-2xl font-bold text-gray-900">{{ lowStockItems }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <div class="w-6 h-6 bg-yellow-600 rounded"></div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Expired</p>
            <p class="text-2xl font-bold text-gray-900">{{ expiredItems }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <div class="w-6 h-6 bg-green-600 rounded"></div>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Value</p>
            <p class="text-2xl font-bold text-gray-900">${{ totalValue }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-48">
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search inventory..." 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div class="flex-1 min-w-48">
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select 
            v-model="selectedCategory" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Medications">Medications</option>
            <option value="Vaccines">Vaccines</option>
            <option value="Supplies">Supplies</option>
            <option value="Food">Food</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div class="flex-1 min-w-48">
          <label class="block text-sm font-medium text-gray-700 mb-2">Stock Status</label>
          <select 
            v-model="selectedStockStatus" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Inventory Items</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in filteredInventoryItems" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="ml-0">
                    <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                    <div v-if="item.description" class="text-sm text-gray-500">{{ item.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getCategoryColor(item.category)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ item.category }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ item.quantity }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ parseFloat(item.price || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(item.expiry_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStockStatusColor(item)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ getStockStatus(item) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button @click="editItem(item)" class="text-blue-600 hover:text-blue-900">Edit</button>
                  <button @click="addStock(item)" class="text-green-600 hover:text-green-900">Add Stock</button>
                  <button @click="deleteItem(item)" class="text-red-600 hover:text-red-900">Remove</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <InventoryFormModal
      v-if="showModal"
      :show="showModal"
      :isEdit="isEdit"
      :isStock="isStock"
      :item="selectedItem"
      @close="closeModal"
      @create="createItem"
      @update="updateItem"
      @add-stock="addStockSubmit"
    />
  </div>
  </AdminLayout>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { inventoryService } from '../services/inventoryService'
import InventoryFormModal from '../components/ui/InventoryFormModal.vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'

export default {
  name: 'InventoryView',
  components: { 
    InventoryFormModal,
    AdminLayout
  },
  setup() {
    const inventoryItems = ref([])
    const stats = ref({
      totalItems: 0,
      lowStock: 0,
      expired: 0,
      totalValue: '0.00'
    })
    const loading = ref(false)
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const selectedStockStatus = ref('')
    const showModal = ref(false)
    const isEdit = ref(false)
    const isStock = ref(false)
    const selectedItem = ref(null)

    const filteredInventoryItems = computed(() => {
      let filtered = inventoryItems.value

      // Filter by search query
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query)
        )
      }

      // Filter by category
      if (selectedCategory.value) {
        filtered = filtered.filter(item => item.category === selectedCategory.value)
      }

      // Filter by stock status
      if (selectedStockStatus.value) {
        filtered = filtered.filter(item => {
          const stockStatus = getStockStatus(item)
          switch (selectedStockStatus.value) {
            case 'in-stock':
              return stockStatus === 'In Stock'
            case 'low-stock':
              return stockStatus === 'Low Stock'
            case 'out-of-stock':
              return stockStatus === 'Out of Stock'
            default:
              return true
          }
        })
      }

      return filtered
    })

    const fetchInventoryData = async () => {
      loading.value = true
      try {
        const [inventoryResponse, statsResponse] = await Promise.all([
          inventoryService.getAll(),
          inventoryService.getStats()
        ])
        
        inventoryItems.value = inventoryResponse.data || []
        stats.value = statsResponse.data || stats.value
      } catch (error) {
        console.error('Error fetching inventory data:', error)
      } finally {
        loading.value = false
      }
    }

    const getStockStatus = (item) => {
      if (item.quantity === 0) return 'Out of Stock'
      if (item.quantity <= (item.min_stock || 10)) return 'Low Stock'
      return 'In Stock'
    }

    const getStockStatusColor = (item) => {
      const status = getStockStatus(item)
      switch (status) {
        case 'Out of Stock':
          return 'bg-red-100 text-red-800'
        case 'Low Stock':
          return 'bg-yellow-100 text-yellow-800'
        case 'In Stock':
          return 'bg-green-100 text-green-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const getCategoryColor = (category) => {
      const colors = {
        'Medications': 'bg-blue-100 text-blue-800',
        'Vaccines': 'bg-purple-100 text-purple-800',
        'Supplies': 'bg-green-100 text-green-800',
        'Food': 'bg-orange-100 text-orange-800',
        'Accessories': 'bg-pink-100 text-pink-800'
      }
      return colors[category] || 'bg-gray-100 text-gray-800'
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString()
    }

    const openCreateModal = () => {
      isEdit.value = false
      isStock.value = false
      selectedItem.value = null
      showModal.value = true
    }
    const openEditModal = (item) => {
      isEdit.value = true
      isStock.value = false
      selectedItem.value = { ...item }
      showModal.value = true
    }
    const openAddStockModal = (item = null) => {
      isEdit.value = true
      isStock.value = true
      selectedItem.value = item || (filteredInventoryItems.value.length > 0 ? filteredInventoryItems.value[0] : null)
      showModal.value = true
    }
    const closeModal = () => {
      showModal.value = false
    }
    const createItem = async (data) => {
      // Defensive: ensure required fields
      if (!data.name || !data.category) {
        alert('Name and Category are required.');
        return;
      }
      // Set defaults for optional fields
      const payload = {
        name: data.name,
        description: data.description || '',
        category: data.category,
        min_stock: data.min_stock || 10,
        price: data.price || 0,
        expiry_date: data.expiry_date || null,
        status: data.status || 'active',
        quantity: data.quantity || 0
      };
      await inventoryService.create(payload);
      await fetchInventoryData();
      closeModal();
    }
    const updateItem = async (data) => {
      await inventoryService.update(selectedItem.value.id, data)
      await fetchInventoryData()
      closeModal()
    }
    const addStockSubmit = async (data) => {
      // Defensive: ensure add_quantity is a number
      const addQty = Number(data.add_quantity) || 0;
      if (!selectedItem.value || addQty <= 0) {
        closeModal();
        return;
      }
      // Only update quantity, keep other fields unchanged
      const updated = { ...selectedItem.value, quantity: Number(selectedItem.value.quantity) + addQty };
      await inventoryService.update(selectedItem.value.id, updated);
      await fetchInventoryData();
      closeModal();
    }

    // Make sure editItem and addStock are defined
    const editItem = (item) => {
      openEditModal(item)
    }
    const addStock = (item) => {
      openAddStockModal(item)
    }

    // Computed properties for stats
    const totalItems = computed(() => stats.value.totalItems)
    const lowStockItems = computed(() => stats.value.lowStock)
    const expiredItems = computed(() => stats.value.expired)
    const totalValue = computed(() => stats.value.totalValue)

    onMounted(() => {
      fetchInventoryData()
    })

    return {
      inventoryItems,
      filteredInventoryItems,
      loading,
      searchQuery,
      selectedCategory,
      selectedStockStatus,
      totalItems,
      lowStockItems,
      expiredItems,
      totalValue,
      getStockStatus,
      getStockStatusColor,
      getCategoryColor,
      formatDate,
      showModal,
      isEdit,
      isStock,
      selectedItem,
      openCreateModal,
      openEditModal,
      openAddStockModal,
      closeModal,
      createItem,
      updateItem,
      addStockSubmit,
      editItem,
      addStock
    }
  }
}
</script>