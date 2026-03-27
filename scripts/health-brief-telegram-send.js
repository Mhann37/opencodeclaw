#!/usr/bin/env node

/**
 * Send health brief to Telegram
 * Reads from daily-health-brief.md and sends via fetch to Telegram API
 */

const fs = require('fs');
const path = require('path');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = '8593559681';
const BRIEF_FILE = '/var/lib/openclaw/.openclaw/workspace/daily-health-brief.md';

async function sendToTelegram() {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN not set');
    process.exit(1);
  }
  
  if (!fs.existsSync(BRIEF_FILE)) {
    console.error('❌ Brief file not found');
    process.exit(1);
  }
  
  const message = fs.readFileSync(BRIEF_FILE, 'utf-8');
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
    
    const data = await response.json();
    
    if (data.ok) {
      console.log('✓ Telegram delivery successful');
      process.exit(0);
    } else {
      console.error('❌ Telegram error:', data.description);
      process.exit(1);
    }
  } catch (e) {
    console.error('❌ Send failed:', e.message);
    process.exit(1);
  }
}

sendToTelegram();
