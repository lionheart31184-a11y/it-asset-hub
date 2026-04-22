const https = require('https');

// ── Notification config (env var + in-memory cache) ──────────────────────────
let botToken = process.env.TELEGRAM_BOT_TOKEN || '';
let subscribedChats = []; // [{chatId, label, active}]

// ── Telegram Bot API helper ───────────────────────────────────────────────────
function telegram(method, body = {}) {
  return new Promise((resolve, reject) => {
    if (!botToken) return reject(new Error('Bot token not configured'));
    const data = JSON.stringify(body);
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${botToken}/${method}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = https.request(options, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch { reject(new Error('Invalid response from Telegram')); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// ── Send a message to all active subscribers ─────────────────────────────────
async function sendMessage(text) {
  if (!botToken || subscribedChats.filter(c => c.active).length === 0) return;
  const active = subscribedChats.filter(c => c.active);
  await Promise.allSettled(active.map(chat =>
    telegram('sendMessage', { chat_id: chat.chatId, text, parse_mode: 'HTML' })
      .catch(err => console.error(`Telegram send failed for ${chat.chatId}:`, err.message))
  ));
}

// ── Broadcast with formatting helpers ────────────────────────────────────────
async function notifyNewHire(name, dept, joinDate, status = 'Pending') {
  await sendMessage(
    `<b>🆕 New Hire Onboarding</b>\n\n` +
    `👤 <b>${name}</b>\n` +
    `📁 ${dept || 'N/A'}\n` +
    `📅 Join: ${joinDate || 'N/A'}\n` +
    `📋 IT Status: <b>${status}</b>`
  );
}

async function notifyCompletedOnboarding(name, dept) {
  await sendMessage(
    `<b>✅ Onboarding Completed</b>\n\n` +
    `👤 <b>${name}</b>\n` +
    `📁 ${dept}\n` +
    `✅ Transferred to Headcount`
  );
}

async function notifyAssetAssigned(assetId, model, user, dept) {
  await sendMessage(
    `<b>🔗 Asset Assigned</b>\n\n` +
    `🖥️ <b>${assetId}</b> — ${model}\n` +
    `👤 Assigned to: <b>${user}</b>\n` +
    `📁 ${dept}`
  );
}

async function notifyAssetUnassigned(assetId, model) {
  await sendMessage(
    `<b>🔓 Asset Unassigned</b>\n\n` +
    `🖥️ <b>${assetId}</b> — ${model}\n` +
    `📋 Status: Available`
  );
}

async function notifyWarrantyAlert(assetId, model, warrantyDate, daysLeft) {
  await sendMessage(
    `<b>⚠️ Warranty Alert</b>\n\n` +
    `🖥️ <b>${assetId}</b> — ${model}\n` +
    `📅 Expires: ${warrantyDate}\n` +
    `⏰ <b>${daysLeft} days remaining</b>`
  );
}

async function notifyNewUser(username, role, createdBy) {
  await sendMessage(
    `<b>👥 New User Created</b>\n\n` +
    `👤 <b>${username}</b>\n` +
    `🎭 Role: <b>${role}</b>\n` +
    `by: ${createdBy}`
  );
}

// ── Get bot info ────────────────────────────────────────────────────────────────
async function getBotInfo() {
  if (!botToken) return null;
  try { return await telegram('getMe'); }
  catch { return null; }
}

// ── Handle /start and /getchatid commands ──────────────────────────────────────
async function handleCommand(command, chat) {
  if (command === '/start' || command === '/help') {
    await telegram('sendMessage', {
      chat_id: chat.id,
      text: `<b>IT Asset Hub Bot</b>\n\n` +
        `This bot sends notifications from your IT Asset Hub.\n\n` +
        `Commands:\n` +
        `• /getchatid — show your Chat ID\n` +
        `• /status — check bot status`,
      parse_mode: 'HTML'
    });
  } else if (command === '/getchatid') {
    await telegram('sendMessage', {
      chat_id: chat.id,
      text: `✅ Your Chat ID is: <b>${chat.id}</b>\n\nCopy this ID and paste it in your IT Asset Hub Settings page.`,
      parse_mode: 'HTML'
    });
  } else if (command === '/status') {
    const info = await getBotInfo();
    if (!info) {
      await telegram('sendMessage', { chat_id: chat.id, text: '❌ Bot token not configured' });
    } else {
      await telegram('sendMessage', {
        chat_id: chat.id,
        text: `✅ Bot is online\n<b>${info.result.username}</b>\nSubscribers: ${subscribedChats.filter(c=>c.active).length}`,
        parse_mode: 'HTML'
      });
    }
  }
}

// ── Webhook update handler (called from server) ───────────────────────────────
async function processUpdate(update) {
  if (!update.message) return;
  const msg = update.message;
  if (msg.text && msg.text.startsWith('/')) {
    await handleCommand(msg.text.trim(), msg.chat);
  }
}

// ── Poll Telegram for updates (long polling) ─────────────────────────────────
let polling = false;
let offset = 0;

async function startPolling() {
  if (!botToken || polling) return;
  polling = true;
  console.log('[Notifications] Telegram polling started');

  async function poll() {
    try {
      const updates = await telegram('getUpdates', { offset, timeout: 30 });
      if (updates.ok && updates.result.length > 0) {
        for (const u of updates.result) {
          offset = u.update_id + 1;
          await processUpdate(u);
        }
      }
    } catch(e) {
      if (!e.message.includes('timeout')) console.error('[Notifications] Poll error:', e.message);
    }
    if (polling) setTimeout(poll, 1000);
  }
  poll();
}

function stopPolling() { polling = false; }

// ── Config setters ─────────────────────────────────────────────────────────────
function setBotToken(token) {
  if (botToken !== token) {
    botToken = token;
    stopPolling();
    if (token) startPolling();
  }
}

function setSubscribedChats(list) {
  subscribedChats = list;
}

function isConfigured() {
  return !!botToken && subscribedChats.filter(c => c.active).length > 0;
}

module.exports = {
  sendMessage,
  notifyNewHire,
  notifyCompletedOnboarding,
  notifyAssetAssigned,
  notifyAssetUnassigned,
  notifyWarrantyAlert,
  notifyNewUser,
  getBotInfo,
  setBotToken,
  setSubscribedChats,
  isConfigured,
  startPolling
};