const TelegramBot = require('node-telegram-bot-api');

const token = '8090349288:AAEIz18mH01Cd8pLmuoGWAPRpyFrf2kjF5g';

const bot = new TelegramBot(token, { polling: true });

const webAppUrl = 'https://b7b062806d01.ngrok-free.app';

console.log('🤖 Telegram bot ishga tushdi...');

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    const keyboard = {
        inline_keyboard: [[
            {
                text: '📊 Dashboard ochish',
                web_app: { url: webAppUrl }
            }
        ]]
    };
    
    const welcomeMessage = `
Hi Tech Lab davomat botiga xush kelibsiz. 🤖

👋 Salom ${msg.from.first_name}!

Bu dashboard orqali:
📈 Statistikalarni ko'rishingiz
👥 Xodimlar ma'lumotlarini boshqarishingiz
📊 Hisobotlarni ko'rishingiz mumkin

Boshlash uchun pastdagi tugmani bosing:
    `;
    
    bot.sendMessage(chatId, welcomeMessage, {
        reply_markup: keyboard,
        parse_mode: 'HTML'
    });
});

bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;
    
    const keyboard = {
        inline_keyboard: [[
            {
                text: '📊 Statistikani',
                web_app: { url: webAppUrl }
            }
        ], [
            {
                text: '📋 Yordam',
                callback_data: 'help'
            },
            {
                text: '⚙️ Sozlamalar',
                callback_data: 'settings'
            }
        ]]
    };
    
    bot.sendMessage(chatId, '📋 Menu:', {
        reply_markup: keyboard
    });
});

bot.on('callback_query', (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    
    switch(data) {
        case 'help':
            bot.sendMessage(message.chat.id, `
📋 <b>Yordam</b>

<b>Buyruqlar:</b>
/start - Botni ishga tushirish
/menu - Asosiy menu
/help - Yordam

<b>Dashboard imkoniyatlari:</b>
• Xodimlar statistikasi
• Grafik va jadvallar
• Ma'lumotlarni filtrlash
• Real-time yangilanishlar
            `, { parse_mode: 'HTML' });
            break;
            
        case 'settings':
            bot.sendMessage(message.chat.id, `
⚙️ <b>Sozlamalar</b>

• Tilni o'zgartirish
• Bildirishnomalar
• Mavzu sozlamalari

Dashboard ichida sozlamalar bo'limiga o'ting.
            `, { parse_mode: 'HTML' });
            break;
    }
    
    bot.answerCallbackQuery(callbackQuery.id);
});

bot.on('web_app_data', (msg) => {
    const chatId = msg.chat.id;
    const data = JSON.parse(msg.web_app.data);
    
    console.log('Web App dan kelgan ma\'lumot:', data);
    
    bot.sendMessage(chatId, `
✅ <b>Ma'lumot qabul qilindi!</b>

📊 Dashboard'dan kelgan ma'lumot:
<code>${JSON.stringify(data, null, 2)}</code>
    `, { parse_mode: 'HTML' });
});

bot.on('error', (error) => {
    console.error('❌ Bot xatoligi:', error);
});

bot.getMe().then((info) => {
    console.log(`✅ Bot ishlamoqda: @${info.username}`);
    console.log(`🌐 Web App URL: ${webAppUrl}`);
});

module.exports = bot;