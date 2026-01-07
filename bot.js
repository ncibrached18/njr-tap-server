const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');

const token = "8267583139:AAGleIsF0fXHmfYxkuB9hYnNkYE-H-FwYrY";
const bot = new TelegramBot(token, { polling: true });

// ===== Telegram Bot =====
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "ابدأ اللعب 👇", {
    reply_markup: {
      inline_keyboard: [[
        {
          text: "▶️ START TAPPING",
          web_app: {
            url: "https://ncibrached18.github.io/njrbottelegrame/"
          }
        }
      ]]
    }
  });
});

// ===== HTTP Server =====
const app = express();
app.use(bodyParser.json());

app.post('/tap', (req, res) => {
  const { user_id, points } = req.body;

  console.log("🎯 TAP RECEIVED");
  console.log("User:", user_id);
  console.log("Points:", points);

  res.send({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🌍 Server running on port", PORT);
});

