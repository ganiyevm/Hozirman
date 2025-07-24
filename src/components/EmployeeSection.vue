
<template>
  <div class="employee-section-list" id="employee-section-list">
    <div class="header">
      <h2>Xodimlar</h2>
      <button @click="openAddModal" class="add-button" :disabled="isLoading">
        Xodim qo'shish
      </button>
    </div>
    <div class="filter-row">
      <select v-model="selectedFilter" class="filter-select">
        <option v-for="f in filterOptions" :key="f.value" :value="f.value">
          {{ f.label }}
        </option>
      </select>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Qidirish"
        class="search-input"
      />
    </div>
    <div v-if="isLoading" class="loading">Ma'lumotlar yuklanmoqda...</div>
    <div v-else-if="paginatedEmployees.length === 0" class="empty-state">
      <p>Natija topilmadi</p>
    </div>
    <div v-else class="employee-list-listview">
      <div
        v-for="(emp, idx) in paginatedEmployees"
        :key="getEmployeeKey(emp)"
        class="employee-row"
        :class="{ even: idx % 2 === 1 }"
      >
        <div class="employee-info" @click="openEditModal(emp.employee)">
          <div class="employee-avatar">
            <img 
              v-if="getEmployeeImageUrl(emp.employee)" 
              :src="getEmployeeImageUrl(emp.employee)" 
              :alt="getFullName(emp.employee)"
              class="avatar-image"
              @error="handleImageError"
            />
            <div v-else class="avatar-placeholder">
              {{ getInitials(emp.employee) }}
            </div>
          </div>
          <div class="fio">{{ getFullName(emp.employee) }}</div>
          <div class="attendance">
            <span>Keldi: {{ formatTime(emp.checkInTime) }}</span>
            <span>| Ketdi: {{ formatTime(emp.checkOutTime) }}</span>
          </div>
          <div class="work-time">
            Ish vaqti: {{ getWorkTime(emp) }}
          </div>
          <div class="status-badge" :class="getStatusClass(emp)">
            {{ getStatusText(emp) }}
          </div>
        </div>
        <div class="actions">
          <button 
            @click.stop="openEditModal(emp.employee)" 
            class="edit-btn"
            title="Tahrirlash"
          >
          🖋️
          </button>
          <button 
            @click.stop="confirmDelete(emp.employee)" 
            class="delete-btn"
            title="O'chirish"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <div class="pagination-info">
        {{ startItem }} - {{ endItem }} / {{ totalItems }} ta natija
      </div>
      <div class="pagination-controls">
        <button 
          @click="goToPage(1)" 
          :disabled="currentPage === 1"
          class="pagination-btn"
          title="Birinchi sahifa"
        >
          «
        </button>
        <button 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="pagination-btn"
          title="Oldingi sahifa"
        >
          ‹
        </button>
        
        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="['page-btn', { active: page === currentPage }]"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
          title="Keyingi sahifa"
        >
          ›
        </button>
        <button 
          @click="goToPage(totalPages)" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
          title="Oxirgi sahifa"
        >
          »
        </button>
      </div>
      <div class="items-per-page">
        <label>Sahifada:</label>
        <select v-model="itemsPerPage" @change="onItemsPerPageChange" class="items-select">
          <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>

    <EmployeeAddModal
      v-if="showAddModal"
      @close="closeAddModal"
      @add-employee="handleAddEmployee"
    />

    <EmployeeEditModal
      v-if="showEditModal && selectedEmployee"
      :employee-id="selectedEmployee.id"
      @close="closeEditModal"
      @update-employee="handleUpdateEmployee"
    />

    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="delete-modal">
        <h3>Xodimni o'chirish</h3>
        <p>
          <strong>{{ getFullName(employeeToDelete) }}</strong> xodimini o'chirishni xohlaysizmi?
          <br>
          <span class="warning">Bu amal qaytarilmaydi!</span>
        </p>
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="cancel-btn">
            Bekor qilish
          </button>
          <button @click="handleDeleteEmployee" class="confirm-delete-btn" :disabled="isDeleting">
            {{ isDeleting ? "O'chirilmoqda..." : "O'chirish" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EmployeeAddModal from './EmployeeAddModal.vue'
import EmployeeEditModal from './EmployeeEditModal.vue'
import { deleteEmployee, getEmployeeImageUrl } from '@/services/employeeService'

export default {
  name: 'EmployeeSectionListView',
  components: { EmployeeAddModal, EmployeeEditModal },
  props: {
    employees: { type: Array, default: () => [] }
  },
  data() {
    return {
      searchQuery: '',
      selectedFilter: 'all',
      isLoading: false,
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
      selectedEmployee: null,
      employeeToDelete: null,
      isDeleting: false,
      currentPage: 1,
      itemsPerPage: 10,
      itemsPerPageOptions: [5, 10, 20, 50, 100],
      filterOptions: [
        { value: 'all', label: 'Barchasi' },
        { value: 'in-office', label: 'Ofisda' },
        { value: 'absent', label: 'Ofisda emas' },
        { value: 'late', label: 'Kech qolgan' },
        { value: 'left', label: 'Ishdan ketgan' },
        { value: 'day-off', label: 'Dam olishda' }
      ]
    }
  },
  computed: {
    filteredEmployees() {
      let filtered = this.employees
      if (this.selectedFilter !== 'all') {
        filtered = filtered.filter(emp => this.getEmployeeStatus(emp) === this.selectedFilter)
      }
      const q = this.searchQuery.trim().toLowerCase()
      if (q) {
        filtered = filtered.filter(emp => {
          const e = emp.employee || {}
          const fio = `${e.firstName || ''} ${e.lastName || ''} ${e.middleName || ''}`.toLowerCase()
          return fio.includes(q)
        })
      }
      return filtered
    },
    totalItems() {
      return this.filteredEmployees.length
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },
    startItem() {
      return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1
    },
    endItem() {
      const end = this.currentPage * this.itemsPerPage
      return end > this.totalItems ? this.totalItems : end
    },
    paginatedEmployees() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredEmployees.slice(start, end)
    },
    visiblePages() {
      const pages = []
      const maxVisible = 7
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(this.totalPages, start + maxVisible - 1)
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  watch: {
    selectedFilter() {
      this.currentPage = 1
    },
    searchQuery() {
      this.currentPage = 1
    },
    totalPages(newVal) {
      if (this.currentPage > newVal && newVal > 0) {
        this.currentPage = newVal
      }
    }
  },
  methods: {
    setFilter(val) {
    this.selectedFilter = val
    },
    getFullName(emp) {
      if (!emp) return ''
      return [emp.firstName, emp.lastName].filter(Boolean).join(' ')
    },
    getInitials(emp) {
      if (!emp) return '?'
      const firstName = emp.firstName || ''
      const lastName = emp.lastName || ''
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || '?'
    },
    getEmployeeImageUrl(employee) {
      return getEmployeeImageUrl(employee)
    },
    handleImageError(event) {
      event.target.style.display = 'none'
      const placeholder = event.target.nextElementSibling
      if (placeholder) placeholder.style.display = 'flex'
    },
    formatTime(utcString) {
      if (!utcString) return '--:--'
      try {
        return new Date(utcString).toLocaleTimeString('uz-UZ', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Tashkent'
        })
      } catch {
        return '--:--'
      }
    },
    getWorkTime(emp) {
      if (emp.employee && emp.employee.workDays && emp.employee.workDays.length) {
        const now = new Date()
        let today = now.getDay()
        const workDay = emp.employee.workDays.find(d => d.day === today)
        if (workDay) {
          return `${workDay.startTime?.slice(0,5) || '--:--'} - ${workDay.endTime?.slice(0,5) || '--:--'}`
        }
      }
      return '--:-- - --:--'
    },
    getEmployeeStatus(emp) {
      if (emp.isDayOff) return 'day-off'
      if (emp.isLate && !emp.isAbsent) return 'late'
      if (emp.isAbsent && !emp.isDayOff) return 'left'
      if (!emp.isLate && !emp.isAbsent && !emp.isDayOff) return 'in-office'
      return 'absent'
    },
    getStatusClass(emp) {
      const status = this.getEmployeeStatus(emp)
      return {
        'status-in-office': status === 'in-office',
        'status-absent': status === 'absent',
        'status-late': status === 'late',
        'status-left': status === 'left',
        'status-day-off': status === 'day-off'
      }
    },
    getStatusText(emp) {
      const status = this.getEmployeeStatus(emp)
      return {
        'in-office': 'Officeda',
        'absent': 'Ofisda emas',
        'late': 'Kech qolgan',
        'left': 'Ishdan ketgan',
        'day-off': 'Dam olishda'
      }[status] || 'Nomaʼlum'
    },
    getEmployeeKey(emp) {
      return emp.id || emp.employee?.id || Math.random().toString(36).substr(2, 9)
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    onItemsPerPageChange() {
      this.currentPage = 1
    },
    
    openAddModal() { this.showAddModal = true },
    closeAddModal() { this.showAddModal = false },
    handleAddEmployee(newEmployee) {
      this.showAddModal = false
      this.$emit('reload-employees')
    },
    openEditModal(employee) {
      if (!employee || !employee.id) return
      this.selectedEmployee = employee
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
      this.selectedEmployee = null
    },
    handleUpdateEmployee(updatedEmployee) {
      this.showEditModal = false
      this.selectedEmployee = null
      this.$emit('reload-employees')
    },
    
    confirmDelete(employee) {
      if (!employee || !employee.id) return
      this.employeeToDelete = employee
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
      this.employeeToDelete = null
      this.isDeleting = false
    },
    async handleDeleteEmployee() {
      if (!this.employeeToDelete || this.isDeleting) return
      this.isDeleting = true
      try {
        await deleteEmployee(this.employeeToDelete.id)
        this.$toast?.success(`${this.getFullName(this.employeeToDelete)} xodimi o'chirildi`)
        this.closeDeleteModal()
        this.$emit('reload-employees')
      } catch (error) {
        this.$toast?.error('Xodimni o\'chirishda xatolik: ' + (error.response?.data?.message || error.message))
      } finally {
        this.isDeleting = false
      }
    }
  }
}
</script>

<style scoped>
.employee-section-list {
  background: #f9f9f9;
  padding: 24px;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.add-button {
  background: #4F46E5;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.add-button:hover:not(:disabled) {
  background: #4338ca;
}

.filter-row {
  display: flex;
  gap: 10px;
  margin-bottom: 18px;
}

.filter-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 15px;
}

.search-input {
  flex: 1;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 15px;
}

.employee-list-listview {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.employee-row {
  background: #fff;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.employee-row:hover {
  background: #f8fafc;
}

.employee-row.even {
  background: #f8fafc;
}

.employee-row.even:hover {
  background: #f1f5f9;
}

.employee-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 10px;
  cursor: pointer;
}

.employee-avatar {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  position: relative;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.fio {
  flex: 1.2;
  font-weight: 600;
}

.attendance {
  flex: 1.2;
  font-size: 14px;
  color: #444;
  gap: 8px;
}

.work-time {
  flex: 1;
  font-size: 14px;
  color: #555;
}

.status-badge {
  min-width: 78px;
  text-align: center;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  background: #DCFCE7;
  color: #166534;
}

.status-absent   { background: #FEE2E2; color: #DC2626; }
.status-late     { background: #FEF3C7; color: #D97706; }
.status-left     { background: #F3F4F6; color: #6B7280; }
.status-day-off  { background: #C7D5F5; color: #1D4ED8; }

.actions {
  display: flex;
  gap: 8px;
  padding: 14px 16px;
  opacity: 0;
  transition: opacity 0.2s;
}

.employee-row:hover .actions {
  opacity: 1;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.edit-btn:hover {
  background: #f3f4f6;
}

.delete-btn:hover {
  background: #fee2e2;
}

.empty-state {
  text-align: center;
  padding: 32px;
  color: #888;
}

.loading {
  padding: 32px;
  text-align: center;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  padding: 16px 0;
  border-top: 1px solid #e5e7eb;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.pagination-btn:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 4px;
  margin: 0 8px;
}

.page-btn {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  min-width: 36px;
  transition: all 0.2s;
}

.page-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.page-btn.active {
  background: #4F46E5;
  border-color: #4F46E5;
  color: white;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.items-select {
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.delete-modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.delete-modal h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.delete-modal p {
  margin: 0 0 24px 0;
  line-height: 1.6;
  color: #4b5563;
}

.warning {
  color: #dc2626;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.confirm-delete-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-delete-btn:hover:not(:disabled) {
  background: #b91c1c;
}

.confirm-delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


@media (max-width: 768px) {
  .employee-section-list {
    padding: 12px;
  }
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .filter-row {
    flex-direction: column;
    gap: 8px;
  }
  .employee-info {
    font-size: 14px;
    gap: 12px;
    padding: 10px 6px;
  }
  .pagination {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
    padding: 10px 0;
  }
  .pagination-info {
    font-size: 13px;
    margin-bottom: 6px;
  }
}

@media (max-width: 650px) {
  .employee-section-list {
    padding: 6px;
    min-height: unset;
  }
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    margin-bottom: 12px;
  }
  .add-button {
    width: 100%;
    padding: 10px;
    font-size: 15px;
  }
  .filter-row {
    flex-direction: column;
    gap: 6px;
    margin-bottom: 10px;
  }
  .filter-select,
  .search-input {
    font-size: 14px;
    width: 100%;
    padding: 8px 8px;
    box-sizing: border-box;
  }
  .employee-list-listview {
    gap: 4px;
  }
  .employee-row {
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 8px;
    border-radius: 10px;
    margin-bottom: 8px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 2px 6px rgba(0,0,0,0.01);
  }
  .employee-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 7px;
    padding: 10px 10px 2px 10px;
    font-size: 15px;
    width: 100%;
  }
  .employee-avatar {
    width: 44px;
    height: 44px;
    margin-bottom: 6px;
  }
  .fio,
  .attendance,
  .work-time {
    flex: unset;
    width: 100%;
  }
  .status-badge {
    font-size: 13px;
    padding: 3px 7px;
    min-width: 68px;
    margin-top: 3px;
  }
  .actions {
    width: 100%;
    justify-content: flex-end;
    opacity: 1;
    padding: 8px 12px 4px 12px;
    border-top: 1px solid #f3f4f6;
  }
  .edit-btn, .delete-btn {
    font-size: 18px;
    padding: 7px 10px;
  }
  .empty-state,
  .loading {
    padding: 18px;
    font-size: 15px;
  }
  /* Pagination mobile */
  .pagination-controls,
  .page-numbers {
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    gap: 4px;
    margin-top: 5px;
  }
  .pagination-btn,
  .page-btn {
    min-width: 28px;
    padding: 6px 6px;
    font-size: 13px;
  }
  .items-per-page {
    justify-content: center;
    gap: 4px;
    font-size: 13px;
  }
  .items-select {
    font-size: 13px;
    padding: 3px 6px;
  }
  /* Modal responsive */
  .delete-modal {
    max-width: 96vw;
    padding: 12px;
  }
}

/* 500px dan kichik - eng kichik telefonlar uchun */
@media (max-width: 500px) {
  .employee-section-list {
    padding: 3px;
  }
  .add-button {
    padding: 8px 0;
    font-size: 14px;
    border-radius: 7px;
  }
  .header {
    font-size: 18px;
  }
  .employee-avatar {
    width: 36px;
    height: 36px;
  }
  .empty-state,
  .loading {
    padding: 10px;
    font-size: 13px;
  }
}

/* 400px dan kichik */
@media (max-width: 400px) {
  .employee-section-list {
    padding: 2px;
  }
  .delete-modal {
    padding: 6px;
  }
  .add-button {
    padding: 7px 0;
    font-size: 13px;
  }
}

</style>