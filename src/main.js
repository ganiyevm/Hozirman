import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/main.css'
import telegramApp from './telegram-web-app'

const app = createApp(App)


function loadTelegramWebApp() {
    return new Promise((resolve, reject) => {
        if (window.Telegram && window.Telegram.WebApp) {
            console.log('Telegram Web App already available');
            resolve(window.Telegram.WebApp);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-web-app.js';
        script.async = true;

        script.onload = () => {
            console.log('Telegram Web App script loaded successfully');
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.ready();
                window.Telegram.WebApp.expand();

                console.log('Telegram Web App initialized:', {
                    version: window.Telegram.WebApp.version,
                    platform: window.Telegram.WebApp.platform,
                    colorScheme: window.Telegram.WebApp.colorScheme,
                    user: window.Telegram.WebApp.initDataUnsafe?.user
                });

                resolve(window.Telegram.WebApp);
            } else {
                reject(new Error('Telegram Web App not available after script load'));
            }
        };

        script.onerror = () => {
            console.error('Failed to load Telegram Web App script');
            reject(new Error('Failed to load Telegram Web App script'));
        };

        document.head.appendChild(script);

        setTimeout(() => {
            reject(new Error('Telegram Web App script load timeout'));
        }, 5000);
    });
}



async function initApp() {
    try {
        console.log('Initializing application...');

        await loadTelegramWebApp()

        app.config.globalProperties.$telegram = telegramApp
        app.provide('telegram', telegramApp)

        console.log('Telegram Web App successfully integrated via telegramApp class');

    } catch (error) {
        console.warn('Running without Telegram Web App:', error.message);

        app.config.globalProperties.$telegram = telegramApp 
        app.provide('telegram', telegramApp)
    } finally {
        app.use(router).mount('#app');
        console.log('Vue application mounted');
    }
}


initApp();