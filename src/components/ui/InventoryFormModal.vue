<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg p-6 w-full max-w-md mx-2 animate-scale-in" @click.stop>
      <h2 class="text-lg font-semibold mb-4">{{ isEdit ? (isStock ? 'Add Stock' : 'Edit Item') : 'Add New Item' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div v-if="!isStock" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">Name</label>
              <input v-model="form.name" required class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Description</label>
              <input v-model="form.description" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Category</label>
              <select v-model="form.category" required class="w-full px-3 py-2 border rounded">
                <option value="">Select</option>
                <option value="Medications">Medications</option>
                <option value="Vaccines">Vaccines</option>
                <option value="Supplies">Supplies</option>
                <option value="Food">Food</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Min Stock</label>
              <input v-model.number="form.min_stock" type="number" min="10" class="w-full px-3 py-2 border rounded bg-gray-100" readonly />
            </div>
          </div>
          <!-- Right Column -->
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium mb-1">Price</label>
              <input v-model.number="form.price" type="number" min="0" step="0.01" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Expiry Date</label>
              <input v-model="form.expiry_date" type="date" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Quantity</label>
              <input v-model.number="form.quantity" type="number" min="0" class="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Status</label>
              <select v-model="form.status" class="w-full px-3 py-2 border rounded">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div v-else class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">Add Quantity</label>
            <input v-model.number="form.add_quantity" type="number" min="1" required class="w-full px-3 py-2 border rounded" />
          </div>
        </div>
        <div class="flex justify-end mt-6 space-x-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded bg-gray-100 text-gray-700">Cancel</button>
          <button type="submit" :disabled="loading" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
            {{ loading ? 'Saving...' : (isEdit ? (isStock ? 'Add Stock' : 'Update') : 'Add') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InventoryFormModal',
  props: {
    show: Boolean,
    isEdit: Boolean,
    isStock: Boolean,
    item: Object
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
        category: '',
        min_stock: 10, // Fixed value
        price: 0,
        expiry_date: '',
        status: 'active',
        quantity: 0,
        add_quantity: 1
      },
      loading: false
    }
  },
  watch: {
    item: {
      immediate: true,
      handler(newVal) {
        if (this.isEdit && newVal) {
          this.form = { ...newVal, add_quantity: 1 }
        } else {
          this.form = {
            name: '',
            description: '',
            category: '',
            min_stock: 10,
            price: 0,
            expiry_date: '',
            status: 'active',
            quantity: 0,
            add_quantity: 1
          }
        }
      }
    }
  },
  methods: {
    async handleSubmit() {
      this.loading = true
      try {
        if (this.isStock) {
          this.$emit('add-stock', { ...this.form })
        } else if (this.isEdit) {
          this.$emit('update', { ...this.form })
        } else {
          this.$emit('create', { ...this.form })
        }
      } finally {
        this.loading = false
      }
    }
  }
};
</script>
