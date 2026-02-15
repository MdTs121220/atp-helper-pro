import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export const generateATP = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'Teks CP tidak boleh kosong.' });

        // --- GOOGLE GEMINI STRATEGY ---
        if (process.env.GEMINI_API_KEY) {
            // Updated models based on diagnostic test
            const models = [
                "gemini-2.0-flash",
                "gemini-2.0-flash-lite",
                "gemini-flash-latest",
                "gemini-pro-latest"
            ];

            for (const modelName of models) {
                try {
                    console.log(`Trying Gemini model: ${modelName}...`);
                    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                    const model = genAI.getGenerativeModel({ model: modelName });

                    const prompt = `
                      Kamu adalah pakar kurikulum SMK TKJ. Analisis CP ini: "${text}".
                      Ekstrak ATP dalam format JSON murni:
                      {
                        "mataPelajaran": "Mapel",
                        "fase": "Fase",
                        "elemenList": [{ "name": "Elemen", "tps": [{ "text": "TP", "kko": "KKO", "materi": "Materi", "alokasiWaktu": "JP", "assessment": "Asesmen" }] }]
                      }
                    `;

                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    let textRes = response.text();

                    // Clean markdown
                    textRes = textRes.replace(/```json/g, '').replace(/```/g, '').trim();

                    // Validate JSON before sending
                    const json = JSON.parse(textRes);
                    res.json(json);
                    return; // Success!

                } catch (err) {
                    console.error(`Gemini Model ${modelName} Failed:`, err.message);
                    // Continue to next model
                }
            }
        }

        // --- OFFLINE MODE / FALLBACK ---
        console.log("Gemini failed or missing key. Activating Offline Simulation Mode.");

        // Attempt to extract some context from the input text
        const detectedFase = text.match(/Fase\s+([A-F])/i)?.[1] || "F";
        const detectedMapel = text.match(/Mata\s+Pelajaran\s+[:\s]+([^\n.,]+)/i)?.[1] || "Teknik Jaringan Komputer dan Telekomunikasi (Mode Offline)";

        // Split text into potential elements based on newlines or periods if it's long enough
        const potentialElements = text.split(/\n+/).filter(line => line.length > 20).slice(0, 3);
        const elementsToUse = potentialElements.length > 0 ? potentialElements : [
            "Perencanaan dan Pengalamatan Jaringan",
            "Teknologi Jaringan Kabel dan Nirkabel"
        ];

        const mockATP = {
            mataPelajaran: detectedMapel,
            fase: detectedFase,
            note: "Data ini adalah simulasi karena Koneksi AI Bermasalah. Silakan edit.",
            elemenList: elementsToUse.map((elemName, index) => ({
                name: elemName,
                tps: [
                    {
                        text: `Peserta didik mampu memahami dan menganalisis ${elemName} sesuai standar industri.`,
                        kko: "memahami",
                        materi: elemName,
                        alokasiWaktu: "6 JP",
                        assessment: "Tes Tertulis"
                    },
                    {
                        text: `Peserta didik mampu menerapkan konfigurasi pada ${elemName} dengan perangkat nyata.`,
                        kko: "menerapkan",
                        materi: `Praktikum ${elemName}`,
                        alokasiWaktu: "8 JP",
                        assessment: "Uji Kinerja"
                    }
                ]
            }))
        };

        res.json(mockATP);

    } catch (error) {
        console.error('Fatal Controller Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
