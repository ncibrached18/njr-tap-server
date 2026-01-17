const TelegramBot = require("node-telegram-bot-api");
const admin = require("firebase-admin");

// ===== Firebase Init =====
const serviceAccount = require("./firebaseKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ===== Telegram Bot =====
const token = "PUT_YOUR_NEW_TOKEN_HERE";
const bot = new TelegramBot(token, { polling: true });

// ===== /start =====
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // إنشاء المستخدم إذا لم يكن موجود
  const ref = db.collection("users").doc(String(userId));
  const doc = await ref.get();

  if (!doc.exists) {
    await ref.set({
      points: 0,
      createdAt: Date.now(),
    });
  }

  bot.sendMessage(chatId, "ابدأ اللعب 👇", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "▶️ START TAPPING",
            web_app: {
              url: "https://ncibrached18.github.io/njrbottelegrame/",
            },
          },
        ],
      ],
    },
  });
});

// ===== Receive WebApp Data =====
bot.on("message", async (msg) => {
  if (!msg.web_app_data) return;

  const data = JSON.parse(msg.web_app_data.data);
  const userId = msg.from.id;
  const earnedPoints = data.points;

  const ref = db.collection("users").doc(String(userId));
  const doc = await ref.get();

  let totalPoints = earnedPoints;

  if (doc.exists) {
    totalPoints += doc.data().points;
  }

  await ref.set(
    {
      points: totalPoints,
      updatedAt: Date.now(),
    },
    { merge: true }
  );

  bot.sendMessage(
    msg.chat.id,
    `💰 ربحت ${earnedPoints} نقطة\n📊 مجموعك الآن: ${totalPoints}`
  );
});
