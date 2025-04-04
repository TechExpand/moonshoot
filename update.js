require('dotenv').config();

const { Telegraf } = require('telegraf');
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('telegraf-ratelimit');

// Load sensitive data from environment variables and verify
const TOKEN = process.env.TELEGRAM_TOKEN;
const BOT_USERNAME = process.env.BOT_USERNAME || "@MoonShotCallers_Bot";
const ADMIN_USER_ID = process.env.ADMIN_USER_ID; // Replace with your admin's user ID

if (!TOKEN || !ADMIN_USER_ID) {
  throw new Error("⚠️ Telegram token or admin user ID is missing. Ensure TELEGRAM_TOKEN and ADMIN_USER_ID are set in .env");
}

// ... (Rest of your code)

// Middleware to check if the user is authorized
const authorizeAdmin = async (ctx, next) => {
  if (ctx.from.id !== parseInt(ADMIN_USER_ID)) {
    return ctx.reply("You are not authorized to use this command.");
  }
  await next();
};

// Update address command (only accessible to the admin)
bot.command('update_address', authorizeAdmin, async (ctx) => {
  // Your logic for updating the address pool goes here
  console.log('Admin is updating the address pool.');
  // ... (Code to update the address pool)
  ctx.reply('Address pool updated successfully.');
});

// ... (Rest of your code)