import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

export const generateATP = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'Teks CP tidak boleh kosong.' });

        // --- GOOGLE GEMINI STRATEGY ---
        const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

        if (apiKey) {
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
                    const genAI = new GoogleGenerativeAI(apiKey);
                    const model = genAI.getGenerativeModel({ model: modelName });

                    const prompt = `
### ROLE: LEAD CURRICULUM ARCHITECT (KEMENTERIAN PENDIDIKAN - REVISI 2025)
Tugas Anda adalah membedah Capaian Pembelajaran (CP) menjadi Tujuan Pembelajaran (TP) yang atomik dan menyusunnya menjadi Alur Tujuan Pembelajaran (ATP) yang logis.

### INPUT TEXT:
"${text}"

TOLONG EKSTRAK "Fase", "Elemen", dan "Deskripsi CP" dari teks di atas jika ada, lalu buat ATP.

### ATURAN PENULISAN (CRITICAL RULES):
1. **DILARANG REPETISI:** Jangan menggunakan kata pembuka yang sama di setiap baris TP. Variasikan kata kerja dan struktur kalimat.
2. **ATOMISASI MATERI:** Bedah Deskripsi CP menjadi unit-unit kecil. Satu TP hanya boleh fokus pada SATU sub-materi spesifik.
3. **RUMUS TP:** [Kata Kerja Operasional/KKO] + [Materi Inti] + [Konteks Implementasi].
4. **URUTAN ATP:** Susun dari yang paling mudah (Konkret) ke yang paling sulit (Abstrak).

### FORMAT OUTPUT (WAJIB JSON MURNI):
{
  "analisis_kurikulum": "Penjelasan singkat pendekatan untuk Fase dan Mapel ini.",
  "data_tp": [
    {
      "kode": "Kode (Misal: F.1, F.2)",
      "tp": "Rumusan TP yang bervariatif dan spesifik",
      "lingkup_materi": "Nama Sub-Materi",
      "jp": "Estimasi JP (Angka String, misal '6 JP')",
      "indikator": "Cara menguji keberhasilan siswa",
      "level_kognitif": "Bloom C2-C6 & SOLO Level",
      "elemen": "Nama Elemen (Jika ada, atau 'Umum')"
    }
  ],
  "logika_alur": "Alasan pengurutan materi ini."
}
                    `;

                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    let textRes = response.text();

                    // Clean markdown
                    textRes = textRes.replace(/```json/g, '').replace(/```/g, '').trim();

                    // Validate JSON before sending
                    const json = JSON.parse(textRes);

                    // Normalize for frontend if needed, but we will handle mapping on client too.
                    // For safety, ensure data_tp exists
                    if (!json.data_tp) {
                        throw new Error("Invalid structure: missing data_tp");
                    }

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

        // --- OFFLINE MODE / FALLBACK ---
        console.log("Gemini failed or missing key. Activating Offline Simulation Mode.");

        // Attempt to extract some context from the input text
        const detectedFaseOffline = text.match(/Fase\s+([A-F])/i)?.[1] || "F";

        // Mock data in new format
        const mockATP = {
            analisis_kurikulum: "Mode Offline: Simulasi ATP berdasarkan struktur kurikulum standar karena koneksi AI tidak tersedia.",
            data_tp: [
                {
                    kode: `${detectedFaseOffline}.1`,
                    tp: `Menganalisis prinsip dasar sistem jaringan komputer dan telekomunikasi (Simulasi Offline)`,
                    lingkup_materi: "Prinsip Dasar Jaringan",
                    jp: "6 JP",
                    indikator: "Peserta didik mampu menjelaskan prinsip kerja jaringan",
                    level_kognitif: "C4 (Analisis)",
                    elemen: "Perencanaan Jaringan"
                },
                {
                    kode: `${detectedFase}.2`,
                    tp: `Merancang topologi jaringan sederhana menggunakan aplikasi simulasi`,
                    lingkup_materi: "Perancangan Topologi",
                    jp: "8 JP",
                    indikator: "Peserta didik mampu membuat desain topologi yang valid",
                    level_kognitif: "C6 (Mencipta)",
                    elemen: "Perencanaan Jaringan"
                },
                {
                    kode: `${detectedFase}.3`,
                    tp: `Menerapkan konfigurasi dasar pada perangkat router dan switch`,
                    lingkup_materi: "Konfigurasi Perangkat",
                    jp: "12 JP",
                    indikator: "Peserta didik mampu melakukan konfigurasi dasar CLI",
                    level_kognitif: "P3 (Presisi)",
                    elemen: "Teknologi Jaringan"
                }
            ],
            logika_alur: "Pengurutan dari konsep abstrak ke praktikum konkret (Simulasi)."
        };

        res.json(mockATP);

    } catch (error) {
        console.error('Fatal Controller Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
