require('dotenv').config();  // Load environment variables securely
const { Telegraf } = require('telegraf');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('telegraf-ratelimit');

// Load sensitive data from environment variables and verify
const TOKEN = process.env.TELEGRAM_TOKEN;
const BOT_USERNAME = process.env.BOT_USERNAME || "@MoonShotCallers_Bot";

if (!TOKEN) {
    throw new Error("⚠️ Telegram token is missing. Ensure TELEGRAM_TOKEN is set in .env");
}

// Helper function to format numbers with commas
const formatNumber = (number) => number.toLocaleString();

// Initialize Express application
const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for bot to prevent abuse
const limitConfig = {
    window: 3000, // Limit one action every 3 seconds
    limit: 1,
    onLimitExceeded: (ctx) => ctx.reply('⚠️ Too many requests! Please slow down.'),
};

// GeckoTerminal API base URL
const GECKOTERMINAL_API_BASE_URL = "https://api.geckoterminal.com/api/v2/networks/{network}/pools/{address}";

// Start command
const startCommand = async (ctx) => {
    await ctx.reply('👋 Welcome to MoonShot Bot! 🚀\n\nI\'m here to help you track the next big tokens! 🌕');
};

// Helper function to format pool data message
const formatPoolMessage = (data) => {
    const name = data.name || "Unknown Token";
    const address = data.address || "N/A";
    const price = data.price !== undefined ? `$${data.price}` : "Data not available";
    const volume = data.volume !== undefined ? `$${data.volume}` : "Data not available";
    const marketCap = data.market_cap !== undefined ? `$${data.market_cap}` : "Data not available";
    const priceChange = data.price_change_percentage || "Data not available";
    const buyTransactions = data.buy_transactions !== undefined ? data.buy_transactions : "Data not available";

    return `🔍 *${name}*\n🔗 *Contract:* \`${address}\`\n💰 *Price:* ${price}\n📊 *Volume:* ${volume}\n💧 *Buy Transactions:* ${buyTransactions}\n📈 *Market Cap:* ${marketCap}\n📈 *Price Change:* ${priceChange}\n💸 [Trade Link](https://nqswap.nebulaqprotocol.xyz)`;
};

// Function to fetch pool data from GeckoTerminal API with better error handling
const fetchPoolData = async (network, poolAddress) => {
    const url = GECKOTERMINAL_API_BASE_URL
        .replace("{network}", network)
        .replace("{address}", poolAddress);

    console.log(`Fetching data from: ${url}`);

    try {
        const response = await axios.get(url);
        const data = response.data?.data?.attributes;

        if (!data) {
            console.warn(`⚠️ Data for pool ${poolAddress} is missing or undefined.`);
            return null;
        }

        return {
            name: data.name || "Unknown",
            address: data.address || "N/A",
            price: data.base_token_price_usd ? formatNumber(Number(data.base_token_price_usd)) : undefined,
            volume: data.volume_usd_h24 ? formatNumber(Number(data.volume_usd_h24)) : undefined,
            market_cap: data.market_cap_usd ? formatNumber(Number(data.market_cap_usd)) : undefined,
            price_change_percentage: data.price_change_percentage_5m || data.price_change_percentage_1h || data.price_change_percentage_6h || data.price_change_percentage_24h
                ? `m5: ${data.price_change_percentage_5m || "N/A"}%, h1: ${data.price_change_percentage_1h || "N/A"}%, h6: ${data.price_change_percentage_6h || "N/A"}%, h24: ${data.price_change_percentage_24h || "N/A"}%`
                : "Data not available",
            buy_transactions: data.transactions_24h?.buys ? formatNumber(Number(data.transactions_24h.buys)) : undefined
        };
    } catch (error) {
        console.error(`❌ Error fetching pool data for ${poolAddress}: ${error.message}`);
        return null;
    }
};

// Moonshot pool information
const callMoonshot = async (ctx) => {
    try {
        const pools = [
            { network: 'eth', address: '0xa6Cc3C2531FdaA6Ae1A3CA84c2855806728693e8' }, 
            { network: 'eth', address: '0x93236881Cbe546de9d46750316942D0821dF6ce2' },
            { network: 'eth', address: '' }, 
            { network: 'eth', address: '0xa6Cc3C2531FdaA6Ae1A3CA84c2855806728693e8' }, 
            { network: 'eth', address: '0xa6Cc3C2531FdaA6Ae1A3CA84c2855806728693e8' }, 
        ];

        const messages = await Promise.all(pools.map(async (pool) => {
            const data = await fetchPoolData(pool.network, pool.address);
            return data ? formatPoolMessage(data) : `❌ Failed to fetch data for pool: ${pool.address} 😢`;
        }));

        if (ctx.chat?.id) {
            await ctx.telegram.sendMessage(ctx.chat.id, messages.join('\n\n'), { parse_mode: "Markdown" });
        }
    } catch (error) {
        console.error("⚠️ Error in callMoonshot:", error);
        await ctx.reply("⚠️ Unable to retrieve Moonshot data.");
    }
};

// Join community command
const joinCommunity = async (ctx) => {
    const communityLink = "https://t.me/+EQapHXPbQaA0ZWE0";
    const message = `👥 Join our Telegram community! 🎉\n\n👉 [Join Here](${communityLink})`;
    await ctx.reply(message, { parse_mode: "Markdown" });
};

// Trade Moonshots command
const tradeMoonshots = async (ctx) => {
    const tradeLink = "https://nqswap.nebulaqprotocol.xyz/";
    const message = `💸 Ready to trade MoonShots? 🚀\n\n👉 [Trade Now](${tradeLink})`;
    await ctx.reply(message, { parse_mode: "Markdown" });
};

// Launch the bot with commands and error handling
const main = async () => {
    const bot = new Telegraf(TOKEN);
    bot.use(rateLimit(limitConfig));

    bot.command('start', startCommand);
    bot.command('call_moonshot', callMoonshot);
    bot.command('join_community', joinCommunity);
    bot.command('trade_moonshots', tradeMoonshots);

    bot.catch((err) => console.error(`⚠️ Bot error: ${err.message}`));
    console.log('🔄 Bot polling started...');
    bot.launch();
};

// Start Express server
const PORT = process.env.PORT || 3000;
app.get('/api', (req, res) => {
    res.send('MoonShot bot API is active.');
});

app.listen(PORT, () => {
    console.log(`🌐 Express server running on port ${PORT}`);
});

// Start the bot
main();
