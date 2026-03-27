#!/usr/bin/env node

/**
 * StrengthInsight Upload Trigger Handler
 * 
 * When you upload strengthinsight-*.json to Telegram, this automatically:
 * 1. Saves it to the workspace
 * 2. Generates a fresh health brief
 * 3. Sends the brief back to you
 * 
 * Hook: Listens for document uploads with "strength" in filename or JSON content
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const WORKSPACE = '/var/lib/openclaw/.openclaw/workspace';
const MEDIA_DIR = path.join(WORKSPACE, '.openclaw/media/inbound');
const STRENGTH_DIR = path.join(WORKSPACE, 'research');

/**
 * Check if uploaded file is StrengthInsight export
 */
function isStrengthInsightFile(filename) {
  return filename.includes('strengthinsight') || 
         filename.includes('strength_insight') ||
         filename.endsWith('.json');
}

/**
 * Generate brief asynchronously
 */
function generateBrief(filePath) {
  return new Promise((resolve, reject) => {
    const generator = spawn('node', [
      path.join(WORKSPACE, 'scripts/health-brief-generator.js'),
      '--strength-path', filePath
    ], {
      env: {
        ...process.env,
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
        TELEGRAM_CHAT_ID: '8593559681'
      }
    });

    let stdout = '';
    let stderr = '';

    generator.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    generator.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    generator.on('close', (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(`Generator failed: ${stderr}`));
      }
    });
  });
}

/**
 * Main handler
 */
async function handleUpload(filePath) {
  console.log(`📤 Received upload: ${filePath}`);

  if (!isStrengthInsightFile(path.basename(filePath))) {
    console.log('ℹ️  Not a StrengthInsight file, skipping.');
    return;
  }

  try {
    // Copy to research dir for archival
    const filename = path.basename(filePath);
    const destPath = path.join(STRENGTH_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, destPath);
      console.log(`✅ Archived to ${destPath}`);
    }

    // Generate brief
    console.log('🏃 Generating health brief...');
    await generateBrief(filePath);
    
    console.log('✅ Brief sent to Telegram');
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    // Send error to Telegram
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const msg = `❌ Health brief generation failed:\n${error.message}`;
      console.log(`Would send to Telegram: ${msg}`);
    }
  }
}

// Test mode or actual invocation
if (process.argv[2]) {
  handleUpload(process.argv[2]).catch(console.error);
} else {
  console.log('Usage: node strength-upload-trigger.js <file-path>');
}

module.exports = { handleUpload, isStrengthInsightFile };
