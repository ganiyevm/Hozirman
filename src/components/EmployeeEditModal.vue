<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Xodim ma'lumotlarini tahrirlash</h3>
        <button @click="close" class="close-btn">×</button>
      </div>
      
      <form @submit.prevent="submitForm" class="employee-form">
        <div class="form-group">
          <label for="firstName">Ism *</label>
          <input 
            id="firstName"
            v-model="form.firstName" 
            type="text" 
            placeholder="Ismni kiriting"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="lastName">Familiya *</label>
          <input 
            id="lastName"
            v-model="form.lastName" 
            type="text" 
            placeholder="Familiyani kiriting"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="middleName">Otasining ismi</label>
          <input 
            id="middleName"
            v-model="form.middleName" 
            type="text" 
            placeholder="Otasining ismini kiriting"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="employeeNumber">Xodim ID *</label>
          <input 
            id="employeeNumber"
            v-model="form.employeeNumber" 
            type="text" 
            placeholder="Xodim ID kiriting"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="phoneNumber">Telefon raqami *</label>
          <input 
            id="phoneNumber"
            v-model="form.phoneNumber" 
            type="tel" 
            placeholder="+998901234567"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="photo">Xodim rasmi</label>
          <div class="photo-upload">
            <input 
              id="photo"
              ref="fileInput"
              type="file" 
              accept="image/*"
              @change="handlePhotoUpload"
              class="file-input"
            />
            <div class="photo-preview" v-if="form.photoPreview">
              <img :src="form.photoPreview" alt="Xodim rasmi" class="preview-image" />
              <button type="button" @click="removePhoto" class="remove-photo">×</button>
            </div>
            <button 
              type="button" 
              @click="$refs.fileInput.click()" 
              class="upload-btn"
              v-if="!form.photoPreview"
            >
              📷 Rasm tanlash
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label for="companyId">Kompaniya *</label>
          <select 
            id="companyId"
            v-model="form.companyId" 
            class="form-select"
          >
            <option value="">Kompaniyani tanlang</option>
            <option 
              v-for="company in companies" 
              :key="company.id" 
              :value="company.id"
            >
              {{ company.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Ish kunlari</label>
          <div class="work-days">
            <div 
              v-for="(day, index) in workDays" 
              :key="index"
              class="day-item"
            >
              <input 
                type="checkbox" 
                :id="`day-${index}`"
                v-model="day.selected"
              />
              <label :for="`day-${index}`">{{ day.name }}</label>
              <div v-if="day.selected" class="time-inputs">
                <input 
                  v-model="day.startTime" 
                  type="time" 
                  class="time-input"
                />
                <span>-</span>
                <input 
                  v-model="day.endTime" 
                  type="time" 
                  class="time-input"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button 
            type="button" 
            @click="close" 
            class="cancel-btn"
            :disabled="isLoading"
          >
            Bekor qilish
          </button>
          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Saqlanmoqda...' : 'Saqlash' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { updateEmployee, getCompanies, getEmployeeById } from '@/services/employeeService'

export default {
  name: 'EmployeeEditModal',
  emits: ['close', 'update-employee'],
  props: {
    employeeId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      companies: [],
      form: {
        companyId: '',
        employeeNumber: '',
        firstName: '',
        lastName: '',
        middleName: '',
        phoneNumber: '',
        image: null,
        photoPreview: null
      },
      workDays: [
        { day: 1, name: 'Dushanba', selected: true, startTime: '09:00', endTime: '18:00' },
        { day: 2, name: 'Seshanba', selected: true, startTime: '09:00', endTime: '18:00' },
        { day: 3, name: 'Chorshanba', selected: true, startTime: '09:00', endTime: '18:00' },
        { day: 4, name: 'Payshanba', selected: true, startTime: '09:00', endTime: '18:00' },
        { day: 5, name: 'Juma', selected: true, startTime: '09:00', endTime: '18:00' },
        { day: 6, name: 'Shanba', selected: false, startTime: '09:00', endTime: '18:00' },
        { day: 0, name: 'Yakshanba', selected: false, startTime: '09:00', endTime: '18:00' }
      ]
    }
  },
  async mounted() {
    await this.loadData()
  },
  methods: {
    async loadData() {
    try {
      this.isLoading = true
      const companiesRes = await getCompanies(1, 100)
      this.companies = companiesRes.data.value?.items || []
      const employeeRes = await getEmployeeById(this.employeeId)
      const employee = employeeRes.data.value
      if (employee) {
        this.form = {
          companyId: employee.companyId || '',
          employeeNumber: employee.employeeNumber || '',
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          middleName: employee.middleName || '',
          phoneNumber: employee.phoneNumber || '',
          image: null,
          photoPreview: employee.image || null
        }
        if (employee.workDays && employee.workDays.length) {
          this.workDays = this.workDays.map(day => {
            const workDay = employee.workDays.find(wd => wd.day === day.day)
            if (workDay) {
              return {
                ...day,
                selected: !workDay.isDayOff,
                startTime: workDay.startTime ? workDay.startTime.slice(0, 5) : '09:00',
                endTime: workDay.endTime ? workDay.endTime.slice(0, 5) : '18:00'
              }
            }
            return day
          })
        }
      }
    } catch (err) {
      this.$toast?.error('Xodim ma’lumotlarini yuklashda xatolik: ' + (err.response?.data?.message || err.message))
    } finally {
      this.isLoading = false
    }
  },
    
    async submitForm() {
  this.isLoading = true
  try {
    const selectedWorkDays = this.workDays.map(day => ({
      day: day.day,
      startTime: day.startTime.length === 5 ? day.startTime + ':00' : day.startTime,
      endTime: day.endTime.length === 5 ? day.endTime + ':00' : day.endTime,
      isDayOff: !day.selected
    }))
    const payload = {
      id: this.employeeId, 
      companyId: this.form.companyId,
      employeeNumber: this.form.employeeNumber,
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      middleName: this.form.middleName,
      phoneNumber: this.form.phoneNumber,
      image: this.form.photoPreview,
      workDays: selectedWorkDays
    }
    console.log('Yuborilayotgan payload:', payload)

    await updateEmployee(this.employeeId, payload)
    this.$emit('update-employee')
    this.close()
    this.$toast?.success("Xodim ma'lumotlari yangilandi")
  } catch (e) {
    console.error('Xatolik:', e)
    this.$toast?.error(e.response?.data?.message || "Xatolik yuz berdi")
  } finally {
    this.isLoading = false
  }
}
,


    
    handlePhotoUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        this.form.photoPreview = e.target.result
      }
      reader.readAsDataURL(file)
    },
    
    removePhoto() {
      this.form.image = null
      this.form.photoPreview = null
    },
    
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
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

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #6b7280;
}

.close-btn:hover {
  background: #f3f4f6;
}

.employee-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-input, .form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.work-days {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  background: #f9fafb;
}

.day-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.day-item:last-child {
  margin-bottom: 0;
}

.day-item input[type="checkbox"] {
  width: auto;
}

.day-item label {
  min-width: 100px;
  margin: 0;
  font-size: 14px;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-input {
  width: 80px;
  padding: 4px 6px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
}

.photo-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.file-input {
  display: none;
}

.photo-preview {
  position: relative;
  display: inline-block;
}

.preview-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
}

.remove-photo {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.upload-btn {
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  color: #6b7280;
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-btn:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.submit-btn {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #4338ca;
}

.submit-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-btn, .submit-btn {
    width: 100%;
  }
}
</style>