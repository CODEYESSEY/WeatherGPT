require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const GROQ_KEY = process.env.GROQ_API_KEY;
console.log('GROQ KEY:', !!GROQ_KEY);
console.log('GEMINI KEY:', !!process.env.GEMINI_KEY);

// Groq route
app.post('/api/chat', async (req, res) => {
    try {
        const response = await fetch(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_KEY}`
                },
                body: JSON.stringify(req.body)
            }
        );
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Gemini route
app.post('/api/gemini', async (req, res) => {
    try {
        const GEMINI_KEY = process.env.GEMINI_KEY;

        if (!GEMINI_KEY) {
            return res.status(500).json({
                error: 'GEMINI_KEY is missing in .env'
            });
        }

        const prompt = req.body?.prompt;

        if (!prompt) {
            return res.status(400).json({
                error: 'Prompt is missing'
            });
        }

        const url =
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent';

        console.log('➡️ Sending request to Gemini...');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_KEY
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            })
        });

        const rawText = await response.text();

        console.log('Gemini HTTP status:', response.status);
        console.log('Gemini RAW response:', rawText);

        let data;

        try {
            data = JSON.parse(rawText);
        } catch {
            return res.status(500).json({
                error: 'Gemini returned non-JSON response',
                raw: rawText
            });
        }

        if (!response.ok) {
            return res.status(response.status).json({
                error: data?.error?.message || 'Gemini API request failed',
                status: data?.error?.status,
                details: data
            });
        }

        const text =
            data?.candidates?.[0]?.content?.parts
                ?.map(part => part.text || '')
                .join('')
                .trim();

        if (!text) {
            return res.status(500).json({
                error: 'Gemini returned no text',
                raw: data
            });
        }

        console.log('✅ Gemini response received');

        res.json({
            text: text
        });

    } catch (err) {
        console.error('❌ Gemini backend error:', err);

        res.status(500).json({
            error: err.message
        });
    }
});

app.listen(3001, () => {
    console.log('✅ WeatherGPT Backend running on port 3001');
});