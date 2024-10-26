# MoonShot Telegram Bot

🚀 **MoonShot Bot** is a Telegram bot built to help users track trending cryptocurrency tokens and their market data, including price, volume, and more, using the GeckoTerminal API.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
- [Available Commands](#available-commands)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features
- Fetches real-time market data for specified cryptocurrency pools.
- Displays information such as price, volume, market cap, and price changes.
- Rate limiting to prevent spamming.
- Easily configurable and secure with environment variables.

## Prerequisites
1. **Node.js** (v14 or higher): [Download and install Node.js](https://nodejs.org/)
2. **Telegram Bot Token**: Obtain a token by creating a bot on Telegram using [BotFather](https://core.telegram.org/bots#botfather).
3. **GeckoTerminal API**: You’ll need access to the GeckoTerminal API.

## Setup
1. **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/moonshot-telegram-bot.git
    cd moonshot-telegram-bot
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Create Environment Variables**:
    - Create a `.env` file in the root directory and add your API keys (see [Environment Variables](#environment-variables) for details).

## Environment Variables
In your project root, create a `.env` file to securely store sensitive information:
```plaintext
- TELEGRAM_TOKEN=your_telegram_bot_token
- GECKO_API_BASE_URL=https://api.geckoterminal.com/api/v2

##Folder Structure
```plaintext
moonshot-telegram-bot/
├── src/
│   ├── commands.js       # Contains bot command handlers
│   ├── config.js         # Loads environment variables and performs basic checks
│   ├── fetchData.js      # Contains functions to fetch data from GeckoTerminal API
│   └── index.js          # Main server and bot initialization
└── .env                  # Environment variables file
└── README.md             # Project documentation

##Usage
1. **Run the bot locally**:

```bash
node src/index.js
```

2. **Start interacting with the bot on Telegram**:

Open Telegram and search for your bot by username.
Use the commands listed below to start fetching cryptocurrency data.

##Available Commands
**Command	Description**
/start	Start the bot and receive a welcome message.
/call_moonshot	Fetch and display data for trending tokens.
/join_community	Provides a link to join the Telegram community.
/trade_moonshots	Provides a link to start trading MoonShots.

##Deployment
To deploy the bot on a server:

1. **Ensure that your server has Node.js installed.**
2. **Clone the repository and set up environment variables on the server.**
3. **Use a process manager like PM2 to keep the bot running**:
```bash
pm2 start src/index.js --name moonshot-telegram-bot
```
##Contributing
1. **Fork the repository**.
2. **Create a new branch**:
```bash
git checkout -b feature-branch
```
3. **Make your changes and commit**:
```bash
git commit -m "Description of changes"
```
4. **Push to the branch**:
```bash
git push origin feature-branch
```
5. **Create a pull request**.

##License
This project is licensed under the MIT License. See the LICENSE file for details.

```vbnet

This `README.md` file provides a structured, step-by-step guide for users and contributors. Let me know if there are further modifications you’d like!
```
