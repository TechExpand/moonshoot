const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

// Replace with your actual Telegram Bot Token
const TOKEN = "7544453019:AAFKGezyFp6_U2J2eUfiyanvEvljv67tSEM";
const BOT_USERNAME = "@MoonShotCallers_Bot";

// GeckoTerminal API base URL
const GECKOTERMINAL_API_BASE_URL = "https://api.geckoterminal.com/api/v2/networks/{network_id}/pools/{pool_id}";

// Crypto tokens data that you want to share (example data)
const MOONSHOT_TOKENS = [
    {
        network_id: "eth",
        pool_id: "0x4628a0a564debfc8798eb55db5c91f2200486c24"
    },

    {
        network_id: "eth",
        pool_id: "0x78372C85f187324dD27464D644DbC7F6ae32377a"
    },


    {
        network_id: "eth",
        pool_id: "0x50CE218Bd3287667cC4D7973F77AE0f441308E68"
    },


    {
        network_id: "eth",
        pool_id: "0x5B77623753bF737153e78A9e7feF6543b29764c4"
    },

    {
        network_id: "eth",
        pool_id: "0xae74064E7670Ea437B70c37ff10853A0c2240079"
    },


];

// Commands
const startCommand = async (ctx) => {
    await ctx.reply('👋 Welcome to MoonShot Bot! 🚀\n\nI\'m here to help you track the next big tokens! 🌕');
};


// Helper function to delete a message after a delay
const deleteMessage = async (ctx, messageId, delay = 5000) => {
    await ctx.deleteMessage(messageId);
    await ctx.reply('👋 Welcome to MoonShot Bot! 🚀\n\nI\'m here to help you track the next big tokens! 🌕');
};

const callMoonshot = async (ctx) => {
    const chatId = ctx.chat?.id;
    let messages = [];

    for (let token of MOONSHOT_TOKENS) {
        const data = await fetchTokenData(token.network_id, token.pool_id);
        if (data) {

            const message = `🔍 *${data.name}*\n🔗 *Contract:* \`${data.address}\`\n💰 *Price:* $${data.price}\n📊 *Volume:* $${data.volume}\n💧 *Buy Transactions:* ${data.buy_transactions}\n📈 *Market Cap:* $${data.market_cap}\n📈 *Price Change:* ${data.price_change_percentage}\nBuy Token Now!!! >> https://nqswap.nebulaqprotocol.xyz`;
            messages.push(message);
        } else {
            messages.push(`❌ Failed to fetch data for ${token.name} 😢`);
        }
    }

    if (chatId) {
        await ctx.telegram.sendMessage(chatId, messages.join('\n\n'), { parse_mode: "Markdown" });
    }
};

const joinCommunity = async (ctx) => {
    const chatId = ctx.chat?.id;
    const communityLink = "https://t.me/+EQapHXPbQaA0ZWE0";
    const message = `👥 Join our amazing community on Telegram! 🎉\n\n👉 [Click Here to Join](${communityLink})`;

    if (chatId) {
        await ctx.telegram.sendMessage(chatId, message, { parse_mode: "Markdown" });
    }
};

const tradeMoonshots = async (ctx) => {
    const chatId = ctx.chat?.id;
    const tradeLink = "https://nqswap.nebulaqprotocol.xyz/";
    const message = `💸 Ready to trade MoonShots? 🚀\n\nStart trading now: [Trade Now](${tradeLink})`;

    if (chatId) {
        await ctx.telegram.sendMessage(chatId, message, { parse_mode: "Markdown" });
    }
};

const handleMessage = async (ctx) => {
    const messageType = ctx.chat?.type;
    const text = ctx.message.text || "";

    console.log(`👤 User (${ctx.chat?.id}) in ${messageType}: "${text}"`);

    if (messageType === 'group') {
        if (text.includes(BOT_USERNAME)) {
            const newText = text.replace(BOT_USERNAME, '').trim();
            const response = handleResponse(newText);
            await ctx.reply(response);
        } else {
            return;
        }
    } else {
        const response = handleResponse(text);
        await ctx.reply(response);
    }
};

const handleResponse = (text) => {
    return '🛠 I will respond to this message shortly! ⏳';
};

const errorHandling = (err) => {
    console.error(`⚠️ Error: ${err}`);
};
const formatNumber = (number) => {
    return number.toLocaleString();
};

const fetchTokenData = async (networkId, poolId) => {
    const url = `https://api.geckoterminal.com/api/v2/networks/${networkId}/pools/${poolId}`;
    // console.log(url)

    try {

        const response = await axios.get(url);
        const data = response.data?.data?.attributes;

        return {
            name: data?.name,
            address: data?.address,
            price: Number(data?.base_token_price_usd) >= 0.1 ? formatNumber(Number(data?.base_token_price_usd)) : Number(data?.base_token_price_usd),
            volume: formatNumber(Number(data?.volume_usd.h24)),
            market_cap: Number(data?.market_cap_usd) >= 0.1 ? formatNumber(Number(data?.market_cap_usd)) : Number(data?.market_cap_usd),
            price_change_percentage: `\nm5: ${data?.price_change_percentage.m5 + "%" + "\n"}h1:${data?.price_change_percentage.h1 + "%" + "\n"}h6: ${data?.price_change_percentage.h6 + "%" + "\n"}h24:${data?.price_change_percentage.h24 + "%" + "\n"}`,
            buy_transactions: formatNumber(Number(data?.transactions.h24.buys))
        };
    } catch (error) {
        console.error(`Error fetching token data: ${error}`);
        return null;
    }
};

const main = () => {
    const bot = new Telegraf(TOKEN);

    // Commands
    bot.command('start', startCommand);
    bot.command('call_moonshot', callMoonshot);
    bot.command('delete_moonshot', deleteMessage);
    bot.command('join_community', joinCommunity);
    bot.command('trade_moonshots', tradeMoonshots);

    // Messages
    bot.on('text', handleMessage);

    // Errors
    bot.catch(errorHandling);

    // Polling
    console.log('🔄 Polling......');
    bot.launch();
};

main();
