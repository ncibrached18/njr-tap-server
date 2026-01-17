const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// ===== Telegram =====
const token = "8267583139:AAGleIsF0fXHmfYxkuB9hYnNkYE-H-FwYrY";
const bot = new TelegramBot(token, { polling: true });

// ===== Firebase =====
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ===== Start =====
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id.toString();

  // إنشاء المستخدم لو غير موجود
  const userRef = db.collection("users").doc(userId);
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      points: 0,
      createdAt: Date.now(),
      username: msg.from.username || "",
    });
  }

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

// ===== WebApp Data (🔥 الأهم 🔥) =====
bot.on("message", async (msg) => {
  if (!msg.web_app_data) return;

  console.log("📩 WebApp data received");

  const data = JSON.parse(msg.web_app_data.data);
  const userId = msg.from.id.toString();
  const points = data.points;

  const userRef = db.collection("users").doc(userId);

  await userRef.update({
    points: admin.firestore.FieldValue.increment(points),
  });

  bot.sendMessage(msg.chat.id, `✅ تمت إضافة ${points} نقطة`);
});

// ===== Server (اختياري) =====
const app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("🌍 Server running on port 3000");
});
