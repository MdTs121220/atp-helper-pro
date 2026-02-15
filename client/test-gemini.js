import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const logFile = 'gemini-diagnostic.txt';
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message) {
    console.log(message);
    logStream.write(message + '\n');
}

log("---------------------------------------------------");
log("🔍 DIAGNOSTIK GEMINI API - LIST MODELS - " + new Date().toISOString());
log("---------------------------------------------------");

if (!API_KEY) {
    log("❌ ERROR: GEMINI_API_KEY tidak ditemukan di .env");
    process.exit(1);
}

log("✅ API Key detected (Length: " + API_KEY.length + ")");

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        log("👉 Fetching available models from Google API...");
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            log("❌ API Returned Error:");
            log(JSON.stringify(data.error, null, 2));
        } else if (data.models) {
            log("✅ Available Models:");
            data.models.forEach(m => {
                const supported = m.supportedGenerationMethods?.includes("generateContent") ? "✅" : "❌";
                log(`   - ${m.name} [${supported} generateContent]`);
            });
        } else {
            log("⚠️ No models found or unexpected format.");
            log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        log("❌ Fetch Error: " + error.message);
    }

    log("---------------------------------------------------");
}

listModels();
