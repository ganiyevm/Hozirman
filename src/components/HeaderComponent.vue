  <template>
    <header class="header">
      <div class="header-content">
        <h1 class="title">{{ selectedCompanyName }}</h1>
        <p class="subtitle">Mini-приложение</p>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'HeaderComponent',
    props: {
      selectedCompanyName: {
        type: String,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .header {
    background: #6c7ce7;
    color: white;
    padding: 15px 20px;
    text-align: center;
    top: 0;
    z-index: 100;
    width: 100%;
    max-width: 100%;
    margin: 0;
    box-sizing: border-box;
  }
  
  .header-content {
    max-width: 400px;
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }
  
  .title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
    word-wrap: break-word;
    hyphens: auto;
  }
  
  .subtitle {
    font-size: 12px;
    opacity: 0.9;
    word-wrap: break-word;
  }
  
  @media (max-width: 480px) {
    .header {
      padding: 12px 15px;
    }
    
    .title {
      font-size: 16px;
      line-height: 1.2;
    }
    
    .subtitle {
      font-size: 11px;
    }
  }
  
  @media (max-width: 320px) {
    .header {
      padding: 10px 12px;
    }
    
    .title {
      font-size: 14px;
      line-height: 1.3;
    }
    
    .subtitle {
      font-size: 10px;
    }
  }
  
  @media (min-width: 768px) {
    .header {
      padding: 20px 25px;
    }
    
    .title {
      font-size: 20px;
    }
    
    .subtitle {
      font-size: 13px;
    }
  }
  
  @media (min-width: 1024px) {
    .title {
      font-size: 22px;
    }
    
    .subtitle {
      font-size: 14px;
    }
  }
  </style>