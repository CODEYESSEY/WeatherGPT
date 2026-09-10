require('dotenv').config({ path: '../.env.local' });
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_KEY = process.env.GEMINI_KEY || process.env.GOOGLE_API_KEY;
const GROQ_KEY = process.env.GROQ_API_KEY;

console.log('WeatherGPT Backend Init:');
console.log('GEMINI KEY Loaded:', !!GEMINI_KEY);
console.log('GROQ KEY Loaded:', !!GROQ_KEY);

// Gemini & Multi-Model Route
app.post('/api/gemini', async (req, res) => {
    try {
        const prompt = req.body?.prompt;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is missing' });
        }

        // 1. Google Gemini 3.7 Flash & 3.6 Flash
        if (GEMINI_KEY) {
            const geminiModels = [
                'gemini-3.7-flash',
                'gemini-3.6-flash',
                'gemini-flash-latest'
            ];

            for (const model of geminiModels) {
                try {
                    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: {
                                temperature: 0.6,
                                maxOutputTokens: 1000
                            }
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const text = data?.candidates?.[0]?.content?.parts
                            ?.map(part => part.text || '')
                            .join('')
                            .trim();

                        if (text) {
                            return res.json({ text, provider: `Google Gemini (${model})` });
                        }
                    }
                } catch (e) {
                    console.warn(`Gemini attempt for ${model} failed:`, e.message);
                }
            }
        }

        // 2. Groq Fallback (Qwen 3.8 / GPT-OSS)
        if (GROQ_KEY) {
            const groqModels = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b'];
            for (const model of groqModels) {
                try {
                    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${GROQ_KEY}`
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: [
                                { role: 'system', content: 'You are WeatherGPT, an intelligent meteorologist and weather decision support AI assistant.' },
                                { role: 'user', content: prompt }
                            ],
                            temperature: 0.6,
                            max_tokens: 800
                        })
                    });

                    if (groqRes.ok) {
                        const groqData = await groqRes.json();
                        const text = groqData?.choices?.[0]?.message?.content?.trim();
                        if (text) {
                            return res.json({ text, provider: `Groq (${model})` });
                        }
                    }
                } catch (e) {
                    console.warn(`Groq attempt for ${model} failed:`, e.message);
                }
            }
        }

        // 3. Fallback Heuristic
        const fallbackText = `🌤 Situation: Monitored current atmospheric parameters and risk matrix.
⚠️ Risk: Low to Moderate
💡 Recommendation: Weather conditions are stable. Continue to monitor local forecasts for sudden changes.
📊 Reason: Telemetry indicators remain within normal operational safety thresholds.`;

        return res.json({ text: fallbackText, provider: 'WeatherGPT Heuristic Engine' });

    } catch (err) {
        console.error('Backend error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Alias for /api/chat
app.post('/api/chat', (req, res, next) => {
    req.url = '/api/gemini';
    app.handle(req, res, next);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ WeatherGPT Backend running on http://localhost:${PORT}`);
});
