  <template>
    <div id="app">
      <router-view />
    </div>
  </template>
  
  <script>
  export default {
    name: 'App'
  }
  </script>
  
  <style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #app {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    min-height: 100vh;
    background: #f5f5f5;
    width: 100%;
    position: relative;
    overflow-x: hidden;
  }
  
  @media (max-width: 480px) {
    html {
      font-size: 14px;
    }
    
    #app {
      background: #f8f9fa;
      padding: 0;
    }
  }
  
  @media (max-width: 320px) {
    html {
      font-size: 13px;
    }
  }
  
  @media (min-width: 768px) {
    html {
      font-size: 16px;
    }
    
    #app {
      background: #f5f5f5;
    }
  }
  
  @media (min-width: 1024px) {
    html {
      font-size: 17px;
    }
    
    #app {
      background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
    }
  }
  
  @media (hover: none) and (pointer: coarse) {
    #app {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  
  @media (prefers-contrast: high) {
    #app {
      background: #ffffff;
      color: #000000;
    }
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .container-fluid {
    width: 100%;
    padding: 0 15px;
  }
  
  .row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15px;
  }
  
  .col {
    flex: 1;
    padding: 0 15px;
  }
  
  @media (max-width: 768px) {
    .container {
      padding: 0 15px;
    }
    
    .container-fluid {
      padding: 0 10px;
    }
    
    .row {
      margin: 0 -10px;
    }
    
    .col {
      padding: 0 10px;
    }
  }
  
  @media (max-width: 480px) {
    .container {
      padding: 0 10px;
    }
    
    .container-fluid {
      padding: 0 5px;
    }
    
    .row {
      margin: 0 -5px;
    }
    
    .col {
      padding: 0 5px;
    }
  }
  
  :focus {
    outline: 2px solid #6c7ce7;
    outline-offset: 2px;
  }
  
  :focus:not(:focus-visible) {
    outline: none;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  .loading {
    opacity: 0.6;
    pointer-events: none;
  }
  
  * {
    transition: all 0.2s ease-in-out;
  }
  
  @media print {
    #app {
      background: white !important;
      color: black !important;
    }
    
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }
  </style>