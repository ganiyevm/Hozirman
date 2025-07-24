<template>
    <div class="toggle-container">
      <label class="toggle-label">{{ label }}</label>
      <div class="toggle-wrapper">
        <input
          type="checkbox"
          :checked="modelValue"
          @change="$emit('update:modelValue', $event.target.checked)"
          class="toggle-input"
        />
        <div class="toggle-slider"></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ToggleSwitch',
    props: {
      modelValue: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      }
    },
    emits: ['update:modelValue']
  }
  </script>
  
  <style scoped>
  .toggle-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .toggle-label {
    font-size: 14px;
    color: #374151;
    font-weight: 500;
  }
  
  .toggle-wrapper {
    position: relative;
  }
  
  .toggle-input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-slider {
    width: 48px;
    height: 28px;
    background: #d1d5db;
    border-radius: 28px;
    position: relative;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .toggle-slider::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    top: 4px;
    left: 4px;
    transition: transform 0.3s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .toggle-input:checked + .toggle-slider {
    background: #10b981;
  }
  
  .toggle-input:checked + .toggle-slider::before {
    transform: translateX(20px);
  }
  </style>