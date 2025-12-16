# Division Zero Bot - Portable Edition

Run the Discord bot from any Windows computer with just a pendrive!

## Setup (One-Time)

### 1. Download Node.js Portable

1. Go to: https://nodejs.org/dist/v20.18.1/node-v20.18.1-win-x64.zip
2. Download and extract
3. Rename the folder to `node-portable`
4. Place it inside this `dz_bot` folder

Your folder structure should look like:
```
dz_bot/
├── node-portable/
│   ├── node.exe
│   ├── npm.cmd
│   └── ...
├── index.js
├── package.json
├── .env
├── .env.example
└── START_BOT.bat
```

### 2. Configure .env

1. Copy `.env.example` to `.env`
2. Fill in all your Discord tokens and IDs

### 3. Install Dependencies (First Time Only)

Double-click `START_BOT.bat` - it will auto-install dependencies.

---

## Usage

### To Start the Bot:
1. Plug your pendrive into any Windows PC with internet
2. Double-click `START_BOT.bat`
3. Bot is now online!

### To Stop the Bot:
Press `Ctrl+C` in the console window.

---

## Important Notes

⚠️ **Never run multiple instances!** Only start the bot on ONE computer at a time.

⚠️ **Keep .env secret!** Don't share your .env file - it contains your bot token.

⚠️ **Internet required** The computer needs internet for the bot to connect to Discord.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Node.js not found" | Download and extract node-portable folder |
| ".env not found" | Copy .env.example to .env and fill in values |
| Bot not responding | Check internet connection and Discord token |
| Multiple responses | Kill all node.exe processes, start only one bot |

---

## Files Included

| File | Purpose |
|------|---------|
| `index.js` | Main bot code |
| `package.json` | Dependencies list |
| `.env.example` | Template for secrets |
| `.env` | Your actual secrets (create this) |
| `START_BOT.bat` | Double-click to run |
| `node-portable/` | Node.js runtime (download this) |

---

Built for Division Zero 🚀
