<template>
  <div class="filter-section">
    <h3 class="section-title">
      Xodimlarning {{ todayDate }} statistikasi
    </h3>
    <div class="dropdown-wrapper">
      <select 
        class="dropdown"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option 
          v-for="option in options" 
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="dropdown-icon">
        <svg width="12" height="8" viewBox="0 0 12 8">
          <path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterDropdown',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      todayDate: this.formatDate(new Date())
    }
  },
  methods: {
    formatDate(date) {
      const oylar = [
        'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
        'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
      ]
      const kun = date.getDate()
      const oy = oylar[date.getMonth()]
      return `${kun}-${oy}`
    }
  }
}
</script>

<style scoped>
.filter-section {
  margin-bottom: 20px;
}
.section-title {
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}
.dropdown-wrapper {
  position: relative;
}
.dropdown {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  appearance: none;
  cursor: pointer;
}
.dropdown:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
.dropdown-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6b7280;
}
</style>
