import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const cleanJsonText = (value) => {
    if (!value) return '';
    const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const raw = fenced ? fenced[1] : value;
    const firstBrace = raw.indexOf('{');
    const lastBrace = raw.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) return raw.trim();
    return raw.slice(firstBrace, lastBrace + 1).trim();
};

const detectMetadata = (text, identity = {}) => {
    const fase = identity.fase || text.match(/Fase\s*[:\-]?\s*([A-F])/i)?.[1]?.toUpperCase() || '';
    const mapel =
        identity.mapel ||
        text.match(/Mata\s*Pelajaran\s*[:\-]\s*([^\n]+)/i)?.[1]?.trim() ||
        text.match(/Mapel\s*[:\-]\s*([^\n]+)/i)?.[1]?.trim() ||
        '';

    return { fase, mapel };
};

const splitCpBlocks = (text) => {
    const clean = text.replace(/\r\n/g, '\n').replace(/\t/g, ' ').trim();
    const elementRegex = /(?:^|\n)\s*(?:Elemen|Element)\s*[:\-]?\s*([^\n:]+)?/gi;
    const matches = [...clean.matchAll(elementRegex)];

    if (!matches.length) {
        return [{
            elemen: 'Umum',
            subElemen: '',
            cp: clean
        }];
    }

    return matches.map((match, index) => {
        const start = match.index + match[0].length;
        const end = matches[index + 1]?.index ?? clean.length;
        const block = clean.slice(start, end).trim();
        const firstLine = block.split('\n').find(Boolean)?.trim() || '';
        const elemen = (match[1] || firstLine || `Elemen ${index + 1}`).replace(/[:\-]+$/, '').trim();
        const subElemen =
            block.match(/Sub\s*Elemen\s*[:\-]\s*([^\n]+)/i)?.[1]?.trim() ||
            block.match(/Subelemen\s*[:\-]\s*([^\n]+)/i)?.[1]?.trim() ||
            '';

        return {
            elemen,
            subElemen,
            cp: block || elemen
        };
    }).filter((block) => block.cp.length > 10);
};

const verbHints = [
    'mengidentifikasi', 'menjelaskan', 'mendeskripsikan', 'membedakan', 'mengklasifikasikan',
    'menganalisis', 'mengaitkan', 'menerapkan', 'menggunakan', 'menyajikan', 'menyimpulkan',
    'mengevaluasi', 'merancang', 'menghasilkan', 'menciptakan', 'merefleksikan'
];

const pickVerb = (sentence, index) => {
    const lower = sentence.toLowerCase();
    const found = verbHints.find((verb) => lower.includes(verb));
    return found || verbHints[Math.min(index, verbHints.length - 1)];
};

const summarizeMaterial = (sentence, verb = '') => {
    let cleaned = sentence
        .replace(/Pada akhir fase\s+[A-F],?/i, '')
        .replace(/peserta didik|murid|siswa/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (verb) {
        cleaned = cleaned.replace(new RegExp(`^.*?${verb}\\s+`, 'i'), '').trim();
    }

    return cleaned.split(',')[0].split(' dan ')[0].slice(0, 90).trim() || 'Materi dari CP';
};

const buildOfflineDraft = (text, identity = {}) => {
    const metadata = detectMetadata(text, identity);
    const blocks = splitCpBlocks(text);
    const dataTp = [];

    blocks.forEach((block) => {
        const sentences = block.cp
            .split(/(?<=[.!?])\s+|\n+|;\s+/)
            .map((item) => item.trim())
            .filter((item) => item.length > 35)
            .slice(0, 4);

        const sourceSentences = sentences.length ? sentences : [block.cp.slice(0, 260)];

        sourceSentences.forEach((sentence) => {
            const index = dataTp.length;
            const verb = pickVerb(sentence, index);
            const material = summarizeMaterial(sentence, verb);
            const kodeFase = metadata.fase || 'Fase';
            const tpText = `Murid mampu ${verb} ${material} dalam konteks pembelajaran ${metadata.mapel || 'mata pelajaran terkait'}.`;

            dataTp.push({
                kode: `${kodeFase}.${index + 1}`,
                tp: tpText,
                elemen: block.elemen || 'Umum',
                sub_elemen: block.subElemen || '',
                lingkup_materi: material,
                kompetensi: verb,
                konten: material,
                jp: '4 JP',
                pengalaman_belajar: index % 3 === 0 ? 'Memahami' : index % 3 === 1 ? 'Mengaplikasi' : 'Merefleksi',
                kktp: `Murid menunjukkan bukti bahwa ia dapat ${verb} ${material} sesuai konteks CP.`,
                asesmen_formatif: 'Pertanyaan pemantik, observasi proses, cek pemahaman, atau umpan balik singkat selama pembelajaran.',
                asesmen_sumatif: 'Produk/kinerja/tes yang membandingkan capaian murid dengan KKTP pada tujuan pembelajaran ini.',
                level_kognitif: index < 2 ? 'Bloom C2-C3, SOLO multistruktural' : 'Bloom C4-C6, SOLO relasional',
                alasan_urutan: index < 2 ? 'Diletakkan awal karena membangun pemahaman dasar dari CP.' : 'Diletakkan setelah dasar karena menuntut aplikasi, analisis, atau refleksi.'
            });
        });
    });

    return {
        metadata: {
            mapel: metadata.mapel,
            fase: metadata.fase,
            jenjang: '',
            sumber_cp_ringkas: 'Draft fallback berbasis teks CP yang ditempel pengguna.'
        },
        analisis_kurikulum: 'AI tidak tersedia, sehingga aplikasi membuat draft awal dari struktur CP yang terbaca. Mohon gunakan sebagai bahan awal dan lakukan validasi pendidik.',
        analisis_cp: blocks.map((block) => ({
            elemen: block.elemen,
            sub_elemen: block.subElemen,
            kompetensi_inti: 'Diambil dari kata kerja/kemampuan utama dalam CP.',
            konten_inti: summarizeMaterial(block.cp),
            catatan: 'Perlu validasi manual karena dibuat tanpa layanan AI.'
        })),
        data_tp: dataTp.slice(0, 16),
        logika_alur: 'Urutan draft dimulai dari memahami konsep, mengaplikasikan dalam tugas, lalu merefleksikan atau menunjukkan bukti ketercapaian.',
        catatan_validasi: [
            'Pastikan setiap TP masih merujuk langsung ke CP pemerintah.',
            'Sesuaikan JP dengan kalender pendidikan dan kedalaman materi.',
            'Formatif digunakan untuk umpan balik, bukan digabungkan ke nilai akhir.'
        ],
        mode: 'offline_draft'
    };
};

const normalizeCode = (code, fase, index) => {
    const fallbackPrefix = fase || 'Fase';
    if (!code) return `${fallbackPrefix}.${index + 1}`;
    if (!fase) return code;

    const normalized = String(code).trim();
    return normalized.replace(/^[A-F](?=[.\-\s]?\d)/i, fase);
};

const normalizeResult = (json, originalText, identity = {}) => {
    if (!json || !Array.isArray(json.data_tp)) {
        throw new Error('Struktur AI tidak valid: data_tp wajib berupa array.');
    }

    const metadata = { ...detectMetadata(originalText, identity), ...(json.metadata || {}) };

    return {
        metadata,
        analisis_kurikulum: json.analisis_kurikulum || 'Analisis CP dan penyusunan TP/ATP berdasarkan Panduan Pembelajaran dan Asesmen 2025.',
        analisis_cp: Array.isArray(json.analisis_cp) ? json.analisis_cp : [],
        data_tp: json.data_tp.map((item, index) => ({
            kode: normalizeCode(item.kode, metadata.fase, index),
            tp: item.tp || item.tujuan_pembelajaran || '',
            elemen: item.elemen || 'Umum',
            sub_elemen: item.sub_elemen || item.subElemen || '',
            lingkup_materi: item.lingkup_materi || item.materi || item.konten || '-',
            kompetensi: item.kompetensi || '',
            konten: item.konten || item.lingkup_materi || '',
            jp: item.jp || item.alokasi_waktu || '4 JP',
            pengalaman_belajar: item.pengalaman_belajar || '',
            kktp: item.kktp || item.indikator || '',
            asesmen_formatif: item.asesmen_formatif || '',
            asesmen_sumatif: item.asesmen_sumatif || '',
            level_kognitif: item.level_kognitif || '',
            alasan_urutan: item.alasan_urutan || ''
        })).filter((item) => item.tp),
        logika_alur: json.logika_alur || '',
        catatan_validasi: Array.isArray(json.catatan_validasi) ? json.catatan_validasi : [],
        mode: json.mode || 'ai'
    };
};

const buildPrompt = (text, identity = {}) => {
    const metadata = detectMetadata(text, identity);

    return `
Anda adalah AI khusus penyusun Tujuan Pembelajaran (TP) dan Alur Tujuan Pembelajaran (ATP) untuk guru Indonesia.
Gunakan Panduan Pembelajaran dan Asesmen Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah Edisi Revisi 2025 sebagai dasar kerja.

KONTEKS PPA 2025 YANG WAJIB DIIKUTI:
- CP pemerintah masih umum sehingga harus dianalisis menjadi tujuan-tujuan pembelajaran yang dapat dicapai murid.
- Urutan kerja: analisis CP -> rumuskan TP -> urutkan TP menjadi ATP -> rancang asesmen dan KKTP.
- CP dapat memiliki elemen, sub-elemen, dan isi CP. Jangan hilangkan elemen/sub-elemen.
- TP harus berasal langsung dari CP, bukan dari topik acak atau contoh mapel lain.
- TP bukan daftar materi. TP memuat kompetensi yang dapat diamati, konten/lingkup materi, dan konteks belajar.
- ATP adalah TP yang diurutkan, bukan rincian kecil dari satu TP.
- Pengurutan ATP dapat memakai konkret ke abstrak, mudah ke sulit, prosedural, hierarki, kronologis, atau scaffolding sesuai karakter mapel.
- Asesmen formatif dipakai untuk umpan balik proses belajar dan tidak digabungkan menjadi nilai akhir.
- Asesmen sumatif dipakai untuk menilai pencapaian hasil belajar berdasarkan KKTP.
- Prinsip pembelajaran mendalam: berkesadaran, bermakna, menggembirakan.
- Pengalaman belajar: memahami, mengaplikasi, merefleksi.

DATA IDENTITAS OPSIONAL:
- Mata pelajaran: ${metadata.mapel || '-'}
- Fase: ${metadata.fase || '-'}
- Kondisi sarpras: ${identity.kondisi || '-'}

INPUT CP MENTAH:
"""${text}"""

TUGAS:
1. Ekstrak metadata fase, mapel, jenjang jika ada.
2. Pecah CP berdasarkan elemen dan sub-elemen yang tersedia.
3. Untuk setiap elemen/sub-elemen, analisis kompetensi inti dan konten inti.
4. Turunkan TP yang spesifik, tidak repetitif, tidak terlalu luas, dan tetap langsung bersumber dari CP.
5. Susun TP menjadi ATP yang logis satu fase/tahun. Beri alasan urutan per TP.
6. Buat KKTP, asesmen formatif, dan asesmen sumatif untuk tiap TP.
7. Beri estimasi JP realistis. Jangan semua baris otomatis 2 JP.

BATASAN KUALITAS:
- Jangan membuat materi yang tidak ada dasarnya dalam CP.
- Jangan memakai contoh hardcoded seperti jaringan komputer kecuali CP memang tentang itu.
- Jangan mengawali semua TP dengan kata yang sama.
- Gunakan istilah "Murid" atau "Peserta didik" secara konsisten.
- Jika CP terlalu pendek, buat catatan validasi bahwa guru perlu menambahkan CP lengkap.

KEMBALIKAN JSON MURNI SAJA, tanpa markdown:
{
  "metadata": {
    "mapel": "",
    "fase": "",
    "jenjang": "",
    "sumber_cp_ringkas": ""
  },
  "analisis_kurikulum": "",
  "analisis_cp": [
    {
      "elemen": "",
      "sub_elemen": "",
      "kompetensi_inti": "",
      "konten_inti": "",
      "catatan": ""
    }
  ],
  "data_tp": [
    {
      "kode": "A.1",
      "tp": "",
      "elemen": "",
      "sub_elemen": "",
      "lingkup_materi": "",
      "kompetensi": "",
      "konten": "",
      "jp": "4 JP",
      "pengalaman_belajar": "Memahami/Mengaplikasi/Merefleksi",
      "kktp": "",
      "asesmen_formatif": "",
      "asesmen_sumatif": "",
      "level_kognitif": "",
      "alasan_urutan": ""
    }
  ],
  "logika_alur": "",
  "catatan_validasi": []
}
`;
};

export const generateATP = async (req, res) => {
    try {
        const { text, identity = {} } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ error: 'Teks CP tidak boleh kosong.' });
        }

        const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

        if (apiKey) {
            const models = [
                'gemini-2.5-flash',
                'gemini-2.0-flash',
                'gemini-2.0-flash-lite',
                'gemini-flash-latest',
                'gemini-pro-latest'
            ];

            const prompt = buildPrompt(text, identity);
            const genAI = new GoogleGenerativeAI(apiKey);

            for (const modelName of models) {
                try {
                    console.log(`Trying Gemini model: ${modelName}...`);
                    const model = genAI.getGenerativeModel({
                        model: modelName,
                        generationConfig: {
                            temperature: 0.35,
                            topP: 0.9,
                            maxOutputTokens: 8192
                        }
                    });

                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const rawText = response.text();
                    const parsed = JSON.parse(cleanJsonText(rawText));
                    return res.json(normalizeResult(parsed, text, identity));
                } catch (err) {
                    console.error(`Gemini model ${modelName} failed:`, err.message);
                }
            }
        }

        console.log('Gemini unavailable. Returning CP-based offline draft.');
        return res.json(buildOfflineDraft(text, identity));
    } catch (error) {
        console.error('Fatal Controller Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
