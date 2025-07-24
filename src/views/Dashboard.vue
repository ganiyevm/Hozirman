<template>
  <div class="dashboard">
    <HeaderComponent :selectedCompanyName="selectedCompanyName" />

    <div class="container">
      <FilterDropdown
        :options="filterOptions"
        v-model="selectedFilter"
        @change="handleFilterChange"
      />

      <StatsGrid :stats="stats" @stat-click="handleStatClick" />
      <ChartComponent :data="chartData" :total="totalValue" />

      <div class="notification-section">
        <NotificationButton @click="sendNotification" />
        <ToggleSwitch
          v-model="notificationsEnabled"
          label="Xodim davomati xabarnomasi"
        />
      </div>

      <EmployeeSection
  ref="employeeSection"
  :employees="employees"
  @reload-employees="loadEmployees"
/>

    </div>
  </div>
</template>

<script>
import HeaderComponent from '@/components/HeaderComponent.vue'
import FilterDropdown from '@/components/FilterDropdown.vue'
import StatsGrid from '@/components/StatsGrid.vue'
import ChartComponent from '@/components/ChartComponent.vue'
import NotificationButton from '@/components/NotificationButton.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import EmployeeSection from '@/components/EmployeeSection.vue'
import {
  getCompanies,
  getAttendanceStats,
  getEmployeesAttendance, 
} from '@/services/employeeService'

export default {
  name: 'Dashboard',
  components: {
    HeaderComponent,
    FilterDropdown,
    StatsGrid,
    ChartComponent,
    NotificationButton,
    ToggleSwitch,
    EmployeeSection,
  },
  data() {
    return {
      companies: [],
      filterOptions: [{ value: 'all', label: 'Barcha kompaniyalar' }],
      selectedFilter: 'all',
      employees: [],
      isLoadingEmployees: false,
      stats: [],
      chartData: {
        labels: ['Ofisda', 'Ofisda emas', 'Kech qoldi', 'Ishdan ketgan'],
        datasets: [{ data: [0, 0, 0, 0]}]
      },
      totalValue: 0,
      notificationsEnabled: true,
    }
  },
  computed: {
    selectedCompanyName() {
      if (this.selectedFilter === 'all') return 'Davomat'
      const company = this.companies.find(c => c.id == this.selectedFilter)
      return company ? company.name : ''
    }
  },
  methods: {
    handleStatClick(stat) {
    let filterValue = 'all'
    if (stat.id === 1) filterValue = 'in-office'
    if (stat.id === 2) filterValue = 'absent'
    if (stat.id === 3) filterValue = 'late'
    if (stat.id === 4) filterValue = 'left'

    this.$refs.employeeSection.setFilter(filterValue)

    const listSection = document.getElementById('employee-section-list')
    if (listSection) {
      listSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  },
    async loadCompanies() {
      try {
        const res = await getCompanies(1, 100)
        this.companies = res.data.value.items
        this.filterOptions = [
          { value: 'all', label: 'Barcha kompaniyalar' },
          ...this.companies.map(c => ({ value: c.id, label: c.name }))
        ]
      } catch (e) {
        console.error('Companies load error:', e)
      }
    },
    async loadAttendanceData() {
      try {
        const res = await getAttendanceStats(this.selectedFilter)
        const val = res.data.value
        this.stats = [
          { id: 1, title: 'OFISDA', count: val.inOffice, color: 'green' },
          { id: 2, title: 'OFISDA EMAS', count: val.absent, color: 'red' },
          { id: 3, title: 'KECH QOLDI', count: val.late, color: 'yellow' },
          { id: 4, title: 'ISHDAN KETGAN', count: val.left, color: 'gray'  }
        ]
        this.chartData = {
          labels: ['Ofisda', 'Ofisda emas', 'Kech qoldi', 'Ishdan ketgan'],
          datasets: [{ data: [val.inOffice, val.absent, val.late, val.left] }]
        }
        this.totalValue = val.total || 0
      } catch (e) {
        console.error('Attendance load error:', e)
      }
    },
    async loadEmployees() {
      this.isLoadingEmployees = true
      try {
        const res = await getEmployeesAttendance({
          companyId: this.selectedFilter,
          pageNumber: 1,
          pageSize: 500 
        })
        this.employees = (res.data.value && Array.isArray(res.data.value.items))
          ? res.data.value.items
          : []
      } catch (e) {
        console.error('Employees load error:', e)
        this.employees = []
      } finally {
        this.isLoadingEmployees = false
      }
    },
    handleFilterChange() {
      this.loadAttendanceData()
      this.loadEmployees()
    },
    sendNotification() {
      if (!this.notificationsEnabled) return
      this.$toast?.success("Xabarnoma yuborildi")
    },
  },
  mounted() {
    this.loadCompanies()
    this.loadAttendanceData()
    this.loadEmployees()
    // Auto update
    this.intervalId = setInterval(() => {
      this.loadAttendanceData()
      this.loadEmployees()
    }, 30000)
  },
  beforeUnmount() {
    clearInterval(this.intervalId)
  }
}
</script>



<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
  width: 100%;
}

.container {
  max-width: 400px;
  margin: 0 auto;
  background: white;
  min-height: 100vh;
  position: relative;
  padding: 0 20px;
  box-sizing: border-box;
}

.notification-section {
  margin: 20px 0;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.error {
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0;
  font-size: 14px;
}

.success {
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 12px;
  border-radius: 8px;
  margin: 16px 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .dashboard {
    background: #f8f9fa;
  }
  
  .container {
    max-width: 100%;
    padding: 0 15px;
    margin: 0;
  }
  
  .notification-section {
    margin: 15px 0;
    padding: 12px;
    border-radius: 8px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 10px;
  }
  
  .notification-section {
    margin: 10px 0;
    padding: 10px;
    border-radius: 6px;
  }
  
  .error,
  .success {
    padding: 10px;
    font-size: 13px;
    margin: 12px 0;
  }
}

@media (max-width: 320px) {
  .container {
    padding: 0 8px;
  }
  
  .notification-section {
    margin: 8px 0;
    padding: 8px;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .container {
    max-width: 768px;
    padding: 0 30px;
  }
  
  .notification-section {
    margin: 25px 0;
    padding: 20px;
    border-radius: 15px;
  }
}

@media (min-width: 1024px) {
  .dashboard {
    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  }
  
  .container {
    max-width: 1240px;
    padding: 0 40px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    min-height: calc(100vh - 40px);
  }
  
  .notification-section {
    margin: 30px 0;
    padding: 25px;
    border-radius: 18px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
}

@media (min-width: 1440px) {
  .container {
    max-width: 1440px;
    padding: 0 50px;
  }
}

@media (orientation: landscape) and (max-height: 600px) {
  .container {
    padding: 0 20px;
  }
  
  .notification-section {
    margin: 10px 0;
    padding: 10px;
  }
}

@media (hover: none) and (pointer: coarse) {
  .container {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  
  .notification-section {
    margin: 20px 0;
    padding: 15px;
  }
}

/* Dark mode support */
/* @media (prefers-color-scheme: dark) {
  .dashboard {
    background: #121212;
  }
  
  .container {
    background: #1a1a1a;
    color: #ffffff;
  }
  
  .notification-section {
    background: #2a2a2a;
    border-color: #404040;
  }
  
  .error {
    background: #3f1f1f;
    border-color: #5f2f2f;
    color: #ff6b6b;
  }
  
  .success {
    background: #1f3f1f;
    border-color: #2f5f2f;
    color: #4ade80;
  }
} */

@media (prefers-contrast: high) {
  .container {
    border: 2px solid #000;
  }
  
  .notification-section {
    border: 2px solid #000;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@media print {
  .dashboard {
    background: white !important;
  }
  
  .container {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
  }
  
  .notification-section {
    border: 1px solid #000 !important;
    background: white !important;
  }
}
</style>