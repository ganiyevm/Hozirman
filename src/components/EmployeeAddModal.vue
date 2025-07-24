<!-- <template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Yangi xodim qo'shish</h3>
        <button @click="close" class="close-btn">×</button>
      </div>
      
      <form @submit.prevent="submitForm" class="employee-form">
        <div class="form-group">
          <label for="firstName">Ism *</label>
          <input 
            id="firstName"
            v-model="form.firstName" 
            type="text" 
            required
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
            required
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
            required
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
            required
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
            required
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
import { addEmployee, getCompanies } from '@/services/employeeService'
export default {
  name: 'EmployeeAddModal',
  emits: ['close', 'add-employee'],
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
    const res = await getCompanies(1, 100)
    this.companies = res.data.value?.items || []
  },
  methods: {
    async submitForm() {
      if (this.isLoading) return
      this.isLoading = true

      try {
        const selectedWorkDays = this.workDays.map(day => ({
          day: day.day,
          startTime: day.startTime.length === 5 ? day.startTime + ':00' : day.startTime,
          endTime: day.endTime.length === 5 ? day.endTime + ':00' : day.endTime,
          isDayOff: !day.selected
        }))
        let imageBase64 = this.form.photoPreview || null

        const payload = {
          companyId: this.form.companyId,
          employeeNumber: this.form.employeeNumber,
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          middleName: this.form.middleName,
          phoneNumber: this.form.phoneNumber,
          image: imageBase64, 
          workDays: selectedWorkDays
        }

        const res = await addEmployee(payload) 
        this.$emit('add-employee', res.data.value)
        this.close()
        this.$toast?.success("Xodim qo‘shildi")
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || "Xatolik yuz berdi")
      } finally {
        this.isLoading = false
      }
    },
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
</style> -->

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Yangi xodim qo'shish</h3>
        <button @click="close" class="close-btn">×</button>
      </div>
      
      <!-- Step Progress -->
      <div class="step-progress">
        <div class="step-item" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <div class="step-number">1</div>
          <div class="step-label">Ma'lumotlar</div>
        </div>
        <div class="step-item" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <div class="step-number">2</div>
          <div class="step-label">Ish vaqti</div>
        </div>
        <div class="step-item" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
          <div class="step-number">3</div>
          <div class="step-label">Tushlik</div>
        </div>
        <div class="step-item" :class="{ active: currentStep >= 4, completed: currentStep > 4 }">
          <div class="step-number">4</div>
          <div class="step-label">Maoshi</div>
        </div>
      </div>

      <form @submit.prevent="submitForm" class="employee-form">
        
        <!-- Step 1: Ma'lumotlar -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="step-title">Xodim Qo'shish</div>
          
          <!-- Photo Upload -->
          <div class="photo-upload-wrapper">
            <label class="photo-upload-circle">
              <input
                type="file"
                accept="image/*"
                @change="handlePhotoUpload"
                class="file-input"
              />
              <template v-if="form.photoPreview">
                <img :src="form.photoPreview" alt="Xodim rasmi" class="circle-img" />
                <!-- Cancel tugmasi tashqarida -->
                <button type="button" class="remove-btn" @click.stop="removePhoto">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="#ef4444"/>
                    <path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </button>
              </template>
              <template v-else>
                <svg class="camera-icon" width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path d="M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="#2563eb" stroke-width="1.8"/>
                  <rect x="3" y="7" width="18" height="12" rx="3" stroke="#2563eb" stroke-width="1.5"/>
                  <path d="M9 7V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" stroke="#2563eb" stroke-width="1.5"/>
                </svg>
              </template>
            </label>
          </div>

          <div class="form-group">
            <label for="firstName">Ismi *</label>
            <input 
              id="firstName"
              v-model="form.firstName" 
              type="text" 
              required
              placeholder="Xodim ismini kiriting"
              class="form-input"
              :class="{ 'input-error': errors.firstName }"
            />
            <p v-if="errors.firstName" class="input-error-text">{{ errors.firstName }}</p>
          </div>

          <div class="form-group">
            <label for="employeeNumber">Xodim IDsi *</label>
            <input 
              id="employeeNumber"
              v-model="form.employeeNumber"
              type="text"
              placeholder="ID kiriting"
              class="form-input"
              :class="{ 'input-error': errors.employeeNumber }"
            />
            <p v-if="errors.employeeNumber" class="input-error-text">{{ errors.employeeNumber }}</p>
          </div>
          
          <div class="form-group">
            <label for="lastName">Familiyasi *</label>
            <input 
              id="lastName"
              v-model="form.lastName" 
              type="text" 
              required
              placeholder="Xodim familiyasi kiriting"
              class="form-input"
              :class="{ 'input-error': errors.lastName }"
            />
            <p v-if="errors.lastName" class="input-error-text">{{ errors.lastName }}</p>
          </div>

          <div class="form-group">
            <label for="middleName">Otasining ismi *</label>
            <input 
              id="middleName"
              v-model="form.middleName" 
              type="text" 
              required
              placeholder="Otasining ismini kiriting"
              class="form-input"
              :class="{ 'input-error': errors.middleName }"
            />
            <p v-if="errors.middleName" class="input-error-text">{{ errors.middleName }}</p>
          </div>
          
          <div class="form-group">
            <label for="phoneNumber">Telefon raqami *</label>
            <div class="phone-input-group">
              <span class="country-code">+998</span>
              <input
                id="phoneNumber"
                v-model="form.phoneNumber"
                type="tel"
                maxlength="9"
                placeholder="901234567"
                class="form-input phone-input"
                :class="{ 'input-error': errors.phoneNumber }"
                @input="onPhoneInput"
                @blur="validatePhone"
                required
              />
            </div>
            <p v-if="errors.phoneNumber" class="input-error-text">{{ errors.phoneNumber }}</p>
          </div>
          
          <div class="form-group">
            <label for="companyId">Kompaniya *</label>
            <select 
              id="companyId"
              v-model="form.companyId" 
              required
              class="form-select"
              :class="{ 'input-error': errors.companyId }"
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
            <p v-if="errors.companyId" class="input-error-text">{{ errors.companyId }}</p>
          </div>
        </div>

        <!-- Step 2: Ish vaqti -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="step-title">Ish vaqti</div>
          
          <div class="schedule-tabs">
            <button 
              type="button" 
              class="tab-btn"
              :class="{ active: scheduleType === 'odatiy' }"
              @click="scheduleType = 'odatiy'"
            >
              Odatiy
            </button>
            <button 
              type="button" 
              class="tab-btn"
              :class="{ active: scheduleType === 'maxsus' }"
              @click="scheduleType = 'maxsus'"
            >
              Maxsus
            </button>
            <button 
              type="button" 
              class="tab-btn"
              :class="{ active: scheduleType === 'erkin' }"
              @click="scheduleType = 'erkin'"
            >
              Erkin
            </button>
          </div>

          <div v-if="scheduleType === 'odatiy'" class="schedule-content">
            <div class="form-group">
              <label>Dam olish kunlari</label>
              <div class="work-days">
                <div 
                  v-for="(day, index) in workDays" 
                  :key="index"
                  class="day-item"
                  :class="{ 'off-day': !day.selected }"
                >
                  <span class="day-name">{{ day.name }}</span>
                  <button 
                    type="button"
                    @click="toggleDay(index)"
                    class="day-toggle"
                    :class="{ active: day.selected }"
                  >
                    {{ day.selected ? 'Ish' : 'Dam' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Boshlanish vaqti *</label>
              <input 
                v-model="defaultStartTime" 
                type="time" 
                class="form-input time-input"
                :class="{ 'input-error': errors.startTime }"
                @change="updateAllWorkDays"
              />
              <p v-if="errors.startTime" class="input-error-text">{{ errors.startTime }}</p>
            </div>

            <div class="form-group">
              <label>Tugash vaqti *</label>
              <input 
                v-model="defaultEndTime" 
                type="time" 
                class="form-input time-input"
                :class="{ 'input-error': errors.endTime }"
                @change="updateAllWorkDays"
              />
              <p v-if="errors.endTime" class="input-error-text">{{ errors.endTime }}</p>
            </div>

            <p v-if="errors.workDays" class="input-error-text">{{ errors.workDays }}</p>
          </div>

          <div v-if="scheduleType === 'maxsus'" class="schedule-content">
            <div 
              v-for="(day, index) in workDays" 
              :key="index"
              class="day-schedule"
            >
              <div class="day-header">
                <span class="day-name">{{ day.name }}</span>
                <button 
                  type="button"
                  @click="toggleDay(index)"
                  class="day-toggle"
                  :class="{ active: day.selected }"
                >
                  {{ day.selected ? 'Ish' : 'Dam' }}
                </button>
              </div>
              <div v-if="day.selected" class="time-inputs">
                <div class="time-group">
                  <label>Boshlanish vaqti</label>
                  <input 
                    v-model="day.startTime" 
                    type="time" 
                    class="time-input"
                  />
                </div>
                <div class="time-group">
                  <label>Tugash vaqti</label>
                  <input 
                    v-model="day.endTime" 
                    type="time" 
                    class="time-input"
                  />
                </div>
              </div>
            </div>
            <p v-if="errors.workDays" class="input-error-text">{{ errors.workDays }}</p>
          </div>
        </div>

<!-- Step 3: Tushlik -->
<div v-if="currentStep === 3" class="step-content">
  <div class="step-title">Tushlik vaqti holati</div>

  <div class="form-group">
    <select v-model="lunch.type" class="form-select">
      <option value="">Tushlik vaqti holatini tanlang</option>
      <option v-for="opt in lunchTypeOptions" :value="opt.value">{{ opt.text }}</option>
    </select>
    <p v-if="errors.lunchType" class="input-error-text">{{ errors.lunchType }}</p>
  </div>

  <!-- Ma'lum bir vaqt orasida -->
  <div v-if="lunch.type === 'interval'" class="form-group-row">
    <div class="form-group">
      <label>Tushlik boshlanish vaqti</label>
      <input v-model="lunch.start" type="time" class="form-input" />
      <p v-if="errors.lunchStart" class="input-error-text">{{ errors.lunchStart }}</p>
    </div>
    <div class="form-group">
      <label>Tushlik tugash vaqti</label>
      <input v-model="lunch.end" type="time" class="form-input" />
      <p v-if="errors.lunchEnd" class="input-error-text">{{ errors.lunchEnd }}</p>
    </div>
  </div>

<!-- Step 4: Maoshi -->
<div v-if="currentStep === 4" class="step-content">
  <div class="step-title">Maosh</div>

  <div class="form-group">
    <label>Maosh turi *</label>
    <select v-model="salary.type" class="form-select">
      <option value="">Tanlang</option>
      <option v-for="opt in salaryTypeOptions" :value="opt.value">{{ opt.text }}</option>
    </select>
    <p v-if="errors.salaryType" class="input-error-text">{{ errors.salaryType }}</p>
  </div>

  <div class="form-group">
    <label>
      {{ salary.type === 'oylik' ? "Har bir oy uchun maosh" :
         salary.type === 'kunlik' ? "Har bir kun uchun maosh" :
         "Har bir soat uchun maosh" }} *
    </label>
    <div class="salary-input-group">
      <input v-model="salary.amount" type="number" placeholder="Maoshni kiriting..." class="form-input salary-input" />
      <span class="currency">so'm</span>
    </div>
    <p v-if="errors.salaryAmount" class="input-error-text">{{ errors.salaryAmount }}</p>
  </div>

  <div class="form-group">
    <label>Jarima har daqiqaga</label>
    <div class="salary-input-group">
      <input v-model="salary.penalty" type="number" placeholder="Jarima har daqiqaga yozing..." class="form-input salary-input" />
      <span class="currency">so'm</span>
    </div>
    <p v-if="errors.salaryPenalty" class="input-error-text">{{ errors.salaryPenalty }}</p>
  </div>

  <div class="form-group">
    <label>Bonus</label>
    <div class="salary-input-group">
      <input v-model="salary.bonus" type="number" placeholder="Bonus miqdorini kiriting..." class="form-input salary-input" />
      <span class="currency">so'm</span>
    </div>
    <p v-if="errors.salaryBonus" class="input-error-text">{{ errors.salaryBonus }}</p>
  </div>
</div>

</div>


<!-- Step 4: Maoshi -->
<div v-if="currentStep === 4" class="step-content">
  <div class="step-title">Maosh</div>

  <div class="form-group">
    <label>Maosh turi *</label>
    <select v-model="salary.type" class="form-select">
      <option value="">Tanlang</option>
      <option v-for="opt in salaryTypeOptions" :value="opt.value">{{ opt.text }}</option>
    </select>
    <p v-if="errors.salaryType" class="input-error-text">{{ errors.salaryType }}</p>
  </div>

  <div class="form-group">
    <label>
      {{ salary.type === 'oylik' ? "Har bir oy uchun maosh" :
         salary.type === 'kunlik' ? "Har bir kun uchun maosh" :
         "Har bir soat uchun maosh" }} *
    </label>
    <div class="salary-input-group">
      <input v-model="salary.amount" type="number" placeholder="Maoshni kiriting..." class="form-input salary-input" />
      <span class="currency">so'm</span>
    </div>
    <p v-if="errors.salaryAmount" class="input-error-text">{{ errors.salaryAmount }}</p>
  </div>

  <div class="form-group">
    <label>Jarima har daqiqaga</label>
    <div class="salary-input-group">
      <input v-model="salary.penalty" type="number" placeholder="Jarima har daqiqaga yozing..." class="form-input salary-input" />
      <span class="currency">so'm</span>
    </div>
    <p v-if="errors.salaryPenalty" class="input-error-text">{{ errors.salaryPenalty }}</p>
  </div>

  <div class="form-group">
    <label>Bonus</label>
    <div class="salary-input-group">
      <input v-model="salary.bonus" type="number" placeholder="Bonus miqdorini kiriting..." class="form-input salary-input" />
      <span class="currency">so'm</span>
    </div>
    <p v-if="errors.salaryBonus" class="input-error-text">{{ errors.salaryBonus }}</p>
  </div>
</div>

        
        <div class="form-actions">
          <button 
            v-if="currentStep > 1"
            type="button" 
            @click="prevStep" 
            class="prev-btn"
            :disabled="isLoading"
          >
            Orqaga
          </button>
          <button 
            type="button" 
            @click="close" 
            class="cancel-btn"
            :disabled="isLoading"
          >
            Bekor qilish
          </button>
          <button 
            v-if="currentStep < 4"
            type="button" 
            @click="nextStep" 
            class="next-btn"
            :disabled="isLoading"
          >
            Keyingisi
          </button>
          <button 
            v-else
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
import { addEmployee, getCompanies } from '@/services/employeeService'

export default {
  name: 'EmployeeAddModal',
  emits: ['close', 'add-employee'],
  data() {
    return {
      currentStep: 1,
      isLoading: false,
      scheduleType: 'odatiy',
      companies: [],
      defaultStartTime: '09:00',
      defaultEndTime: '18:00',
      errors: {}, // Xatoliklar uchun
      form: {
        companyId: '',
        employeeNumber: '',
        firstName: '',
        lastName: '',
        middleName: '',
        phoneNumber: '',
        hourlyRate: '',
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
      ],
      lunch: {
      type: '',          // 'none', 'interval', 'duration'
      start: '',
      end: '',
      duration: '',      // 30, 60, 90, 120 (min)
    },
    lunchTypeOptions: [
      { value: 'none', text: "Tushlik vaqti yo‘q" },
      { value: 'interval', text: "Ma'lum bir vaqt orasida" },
      { value: 'duration', text: "Ma'lum bir vaqt davomida" }
    ],
    lunchDurationOptions: [30, 60, 90, 120],
    salary: {
      type: '',       // 'oylik', 'kunlik', 'soatlik'
      amount: '',
      penalty: '',
      bonus: ''
    },
    salaryTypeOptions: [
      { value: 'oylik', text: 'Oylik' },
      { value: 'kunlik', text: 'Kunlik' },
      { value: 'soatlik', text: 'Soatlik' }
    ],
    }
  },
  async mounted() {
    const res = await getCompanies(1, 100)
    this.companies = res.data.value?.items || []
  },
  methods: {
    // VALIDATSIYA METODLARI
    validateStep1() {
      this.errors = {}
      
      if (!this.form.firstName.trim()) {
        this.errors.firstName = "Ism kiritish majburiy"
      }
      
      if (!this.form.lastName.trim()) {
        this.errors.lastName = "Familiya kiritish majburiy"
      }
      if (!this.form.middleName.trim()) {
        this.errors.middleName = "Otasining ismi kiritish majburiy"
      }
      
      if (!this.form.employeeNumber.trim()) {
        this.errors.employeeNumber = "Xodim IDsi kiritish majburiy"
      }
      
      if (!this.form.phoneNumber || this.form.phoneNumber.length !== 9) {
        this.errors.phoneNumber = "Telefon raqami 9 ta raqam bo'lishi shart"
      }
      
      if (!this.form.companyId) {
        this.errors.companyId = "Kompaniyani tanlash majburiy"
      }
      
      return Object.keys(this.errors).length === 0
    },

    validateStep2() {
      this.errors = {}
      
      const hasWorkDay = this.workDays.some(day => day.selected)
      if (!hasWorkDay) {
        this.errors.workDays = "Kamida bitta ish kuni tanlash kerak"
        return false
      }
      
      if (this.scheduleType === 'odatiy') {
        if (!this.defaultStartTime) {
          this.errors.startTime = "Boshlanish vaqti kiritish majburiy"
        }
        if (!this.defaultEndTime) {
          this.errors.endTime = "Tugash vaqti kiritish majburiy"
        }
        if (this.defaultStartTime && this.defaultEndTime && this.defaultStartTime >= this.defaultEndTime) {
          this.errors.endTime = "Tugash vaqti boshlanish vaqtidan kech bo'lishi kerak"
        }
      }
      
      return Object.keys(this.errors).length === 0
    },

    validateStep3() {
  this.errors = {};
  if (!this.lunch.type) {
    this.errors.lunchType = "Tushlik vaqti holatini tanlang";
    return false;
  }
  if (this.lunch.type === 'interval') {
    if (!this.lunch.start) this.errors.lunchStart = "Boshlanish vaqtini kiriting";
    if (!this.lunch.end) this.errors.lunchEnd = "Tugash vaqtini kiriting";
    if (this.lunch.start && this.lunch.end && this.lunch.start >= this.lunch.end) {
      this.errors.lunchEnd = "Tugash vaqti boshlanishidan kech bo‘lishi kerak";
    }
    return Object.keys(this.errors).length === 0;
  }
  if (this.lunch.type === 'duration') {
    if (!this.lunch.duration) this.errors.lunchDuration = "Tushlik davomiyligini tanlang";
    return Object.keys(this.errors).length === 0;
  }
  return true; // Agar 'none' bo‘lsa
},
validateStep4() {
  this.errors = {};
  if (!this.salary.type) this.errors.salaryType = "Maosh turini tanlang";
  if (!this.salary.amount || Number(this.salary.amount) <= 0) this.errors.salaryAmount = "Maosh miqdorini kiriting";
  if (this.salary.penalty && Number(this.salary.penalty) < 0) this.errors.salaryPenalty = "Jarima musbat son bo‘lishi kerak";
  if (this.salary.bonus && Number(this.salary.bonus) < 0) this.errors.salaryBonus = "Bonus musbat son bo‘lishi kerak";
  return Object.keys(this.errors).length === 0;
},


    // TELEFON VALIDATSIYA
    onPhoneInput(e) {
      let digits = e.target.value.replace(/\D/g, '').slice(0, 9)
      this.form.phoneNumber = digits
      
      if (this.errors.phoneNumber && digits.length === 9) {
        delete this.errors.phoneNumber
      }
    },
    
    validatePhone() {
      if (this.form.phoneNumber && this.form.phoneNumber.length !== 9) {
        this.errors.phoneNumber = "Telefon raqami 9 ta raqam bo'lishi shart"
      } else if (this.errors.phoneNumber) {
        delete this.errors.phoneNumber
      }
    },

    // STEP METODLARI
    nextStep() {
      let isValid = false
      
      switch (this.currentStep) {
        case 1:
          isValid = this.validateStep1()
          break
        case 2:
          isValid = this.validateStep2()
          break
        case 3:
          isValid = this.validateStep3()
          break
        case 4:
          isValid = this.validateStep4()
          break  
        default:
          isValid = true
      }
      
      if (isValid && this.currentStep < 4) {
        this.currentStep++
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },

    toggleDay(index) {
      this.workDays[index].selected = !this.workDays[index].selected
      
      // Agar xatolik mavjud bo'lsa va ish kuni tanlansa, xatolikni olib tashlash
      if (this.errors.workDays && this.workDays.some(day => day.selected)) {
        delete this.errors.workDays
      }
    },

    updateAllWorkDays() {
      this.workDays.forEach(day => {
        if (day.selected) {
          day.startTime = this.defaultStartTime
          day.endTime = this.defaultEndTime
        }
      })
    },

    getWorkDaysSummary() {
      return this.workDays
        .filter(day => day.selected)
        .map(day => day.name)
        .join(', ')
    },

    async submitForm() {
      if (this.isLoading) return
      
      // Yakuniy validatsiya
      if (!this.validateStep1() || !this.validateStep2() || !this.validateStep3() || !this.validateStep4()) {
        this.$toast?.error("Ma'lumotlarni to'liq va to'g'ri to'ldiring")
        return
      }
      
      this.isLoading = true

      try {
        const selectedWorkDays = this.workDays.map(day => ({
          day: day.day,
          startTime: day.startTime.length === 5 ? day.startTime + ':00' : day.startTime,
          endTime: day.endTime.length === 5 ? day.endTime + ':00' : day.endTime,
          isDayOff: !day.selected
        }))
        let imageBase64 = this.form.photoPreview || null

        const payload = {
          companyId: this.form.companyId,
          employeeNumber: this.form.employeeNumber,
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          middleName: this.form.middleName,
          phoneNumber: '+998' + this.form.phoneNumber,
          // hourlyRate: this.form.hourlyRate,
          image: imageBase64,
          workDays: selectedWorkDays
        }

     const res = await addEmployee(payload) 
        this.$emit('add-employee', res.data.value)
        this.close()
        this.$toast?.success("Xodim qo‘shildi")
      } catch (e) {
        this.$toast?.error(e.response?.data?.message || "Xatolik yuz berdi")
      } finally {
        this.isLoading = false
      }
    },

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
  width: 100%;
  max-width: 100%;
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

.step-progress {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
}

.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 15px;
  right: -50%;
  width: 100%;
  height: 2px;
  background: #e5e7eb;
  z-index: 1;
}

.step-item.completed:not(:last-child)::after {
  background: #10b981;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 5px;
  position: relative;
  z-index: 2;
}

.step-item.active .step-number {
  background: #3b82f6;
  color: white;
}

.step-item.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

.step-item.active .step-label {
  color: #3b82f6;
  font-weight: 600;
}

.employee-form {
  padding: 24px;
}

.step-content {
  min-height: 300px;
}

.step-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
  color: #1f2937;
}

.photo-section {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.photo-upload-center {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.photo-preview {
  position: relative;
  display: inline-block;
  margin-bottom: 10px;
}

.preview-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #3b82f6;
}

.photo-placeholder {
  width: 120px;
  height: 120px;
  border: 3px dashed #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  margin-bottom: 10px;
}

.camera-icon {
  font-size: 40px;
  color: #9ca3af;
}

.file-input {
  display: none;
}

.upload-btn-small {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: #3b82f6;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 18px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.phone-input-group {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}

.country-code {
  background: #f3f4f6;
  padding: 12px 15px;
  border-right: 1px solid #d1d5db;
  font-weight: 500;
  color: #374151;
}

.phone-input {
  border: none;
  border-radius: 0;
  flex: 1;
}

.phone-input:focus {
  box-shadow: none;
}

.phone-input-group:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.salary-input-group {
  display: flex;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
}

.salary-input {
  border: none;
  border-radius: 0;
  flex: 1;
}

.currency {
  background: #f3f4f6;
  padding: 12px 15px;
  border-left: 1px solid #d1d5db;
  font-weight: 500;
  color: #374151;
}

.salary-input-group:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.schedule-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.tab-btn:hover:not(.active) {
  background: #f3f4f6;
}

.work-days {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.day-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.day-item.off-day {
  background: #fef2f2;
  border-color: #fecaca;
}

.day-name {
  font-weight: 500;
  color: #374151;
}

.day-toggle {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.day-toggle.active {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.day-schedule {
  margin-bottom: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 15px;
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.time-inputs {
  display: flex;
  gap: 15px;
}

.time-group {
  flex: 1;
}

.time-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 12px;
  color: #6b7280;
}

.time-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.confirm-btn {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}

.confirm-btn:hover {
  background: #2563eb;
}

.coming-soon {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.prev-btn, .cancel-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.prev-btn:hover:not(:disabled), .cancel-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.next-btn, .submit-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.next-btn:hover:not(:disabled), .submit-btn:hover:not(:disabled) {
  background: #2563eb;
}

.prev-btn:disabled, .cancel-btn:disabled, .next-btn:disabled, .submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .modal-content {
    width: 95%;
    max-height: 95vh;
  }
  
  .step-progress {
    padding: 15px;
  }
  
  .step-item {
    font-size: 12px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .prev-btn, .cancel-btn, .next-btn, .submit-btn {
    width: 100%;
  }
  
  .time-inputs {
    flex-direction: column;
    gap: 10px;
  }
}

.photo-upload-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 28px;
}
.photo-upload-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2.5px solid #2563eb;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
  overflow: hidden;
}
.photo-upload-circle:hover {
  border-color: #1d4ed8;
}
.file-input {
  display: none;
}
.camera-icon {
  display: block;
  margin: 0 auto;
}
.circle-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}
.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 2;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: filter 0.18s;
}
.remove-btn:hover svg circle {
  filter: brightness(0.9);
}
.input-error {
  border-color: #ef4444 !important;
}

.input-error-text {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.summary {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
}

.summary-item {
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.summary-item:last-child {
  border-bottom: none;
}

</style>