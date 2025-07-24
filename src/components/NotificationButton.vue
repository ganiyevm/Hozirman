<template>
    <button 
      class="notification-btn"
      @click="handleClick"
      :disabled="loading"
    >
      <span v-if="loading" class="spinner"></span>
      {{ loading ? 'Yuborilmoqda...' : 'Xisоbоtni yuklash' }}
    </button>
  </template>
  
  <script>
  export default {
    name: 'NotificationButton',
    data() {
      return {
        loading: false
      }
    },
    methods: {
      async handleClick() {
        this.loading = true
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000))
          this.$emit('click')
        } finally {
          this.loading = false
        }
      }
    },
    emits: ['click']
  }
  </script>
  
  <style scoped>
  .notification-btn {
    width: 100%;
    padding: 14px 20px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  .notification-btn:hover:not(:disabled) {
    background: #4f46e5;
    transform: translateY(-1px);
  }
  
  .notification-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
  
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>