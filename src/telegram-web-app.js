export class TelegramWebApp {
    constructor() {
      this.tg = window.Telegram?.WebApp || null
      this.init()
    }
  
    init() {
      if (this.tg) {
        this.tg.ready()
        
        this.tg.MainButton.text = "Yuborish"
        this.tg.MainButton.color = "#6366f1"
        
        this.setTheme()
      
        this.tg.BackButton.onClick(() => {
          this.tg.close()
        })
      }
    }
  
    setTheme() {
      if (this.tg) {
        const theme = this.tg.colorScheme
        document.documentElement.setAttribute('data-theme', theme)
        
        const root = document.documentElement
        if (theme === 'dark') {
          root.style.setProperty('--bg-color', this.tg.themeParams.bg_color || '#1a1a1a')
          root.style.setProperty('--text-color', this.tg.themeParams.text_color || '#ffffff')
        } else {
          root.style.setProperty('--bg-color', this.tg.themeParams.bg_color || '#ffffff')
          root.style.setProperty('--text-color', this.tg.themeParams.text_color || '#000000')
        }
      }
    }
  
    showMainButton(callback) {
      if (this.tg) {
        this.tg.MainButton.show()
        this.tg.MainButton.onClick(callback)
      }
    }
  
    hideMainButton() {
      if (this.tg) {
        this.tg.MainButton.hide()
      }
    }
  
    showAlert(message) {
      if (this.tg) {
        this.tg.showAlert(message)
      } else {
        alert(message)
      }
    }
  
    showConfirm(message, callback) {
      if (this.tg) {
        this.tg.showConfirm(message, callback)
      } else {
        const result = confirm(message)
        callback(result)
      }
    }
  
    hapticFeedback(type = 'impact') {
      if (this.tg?.HapticFeedback) {
        switch (type) {
          case 'impact':
            this.tg.HapticFeedback.impactOccurred('medium')
            break
          case 'notification':
            this.tg.HapticFeedback.notificationOccurred('success')
            break
          case 'selection':
            this.tg.HapticFeedback.selectionChanged()
            break
        }
      }
    }
  
    sendData(data) {
      if (this.tg) {
        this.tg.sendData(JSON.stringify(data))
      }
    }
  
    close() {
      if (this.tg) {
        this.tg.close()
      }
    }
  
    getUserData() {
      if (this.tg) {
        return {
          id: this.tg.initDataUnsafe?.user?.id,
          first_name: this.tg.initDataUnsafe?.user?.first_name,
          last_name: this.tg.initDataUnsafe?.user?.last_name,
          username: this.tg.initDataUnsafe?.user?.username,
          language_code: this.tg.initDataUnsafe?.user?.language_code
        }
      }
      return null
    }
  }
  
  // Initialize and export instance
  const telegramApp = new TelegramWebApp()
  export default telegramApp