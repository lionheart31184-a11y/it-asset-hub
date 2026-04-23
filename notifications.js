const https = require('https');
const http = require('http');

// SeaTalk Webhook URL — set via /api/notifications/config or env var
let webhookUrl = process.env.SEATALK_WEBHOOK_URL || '';

function setWebhookUrl(url) {
  webhookUrl = url;
}

function getWebhookUrl() {
  return webhookUrl;
}

function isConfigured() {
  return !!webhookUrl;
}

// Send a plain text message to the SeaTalk group via webhook
function sendMessage(content) {
  if (!webhookUrl) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ tag: 'text', text: { content } });
    const url = new URL(webhookUrl);
    const lib = url.protocol === 'https:' ? https : http;
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = lib.request(options, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => { console.log('[SeaTalk]', res.statusCode, raw); resolve(raw); });
    });
    req.on('error', err => { console.error('[SeaTalk] Error:', err.message); reject(err); });
    req.write(body);
    req.end();
  });
}

async function notifyNewHire(name, dept, joinDate) {
  const d = joinDate || 'N/A';
  await sendMessage(
    `[IT Asset Hub] New Hire Added\n` +
    `Name: ${name}\n` +
    `Dept: ${dept || 'N/A'}\n` +
    `Join Date: ${d}\n` +
    `IT Status: Pending`
  );
}

async function notifyCompletedOnboarding(name, dept) {
  await sendMessage(
    `[IT Asset Hub] Onboarding Completed\n` +
    `Name: ${name}\n` +
    `Dept: ${dept || 'N/A'}\n` +
    `Transferred to Headcount`
  );
}

module.exports = {
  setWebhookUrl,
  getWebhookUrl,
  isConfigured,
  sendMessage,
  notifyNewHire,
  notifyCompletedOnboarding,
};
