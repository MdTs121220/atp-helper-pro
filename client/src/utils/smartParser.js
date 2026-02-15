export const smartParser = (text) => {
    const result = {
        mataPelajaran: '',
        fase: '',
        elemenList: []
    };

    // 1. Detect Metadata (Fase & Mapel)
    const faseMatch = text.match(/Fase\s+([A-F])/i);
    if (faseMatch) result.fase = faseMatch[1].toUpperCase();

    const mapelMatch = text.match(/Mata Pelajaran\s+:\s*([^\n]+)/i) || text.match(/Mapel\s+:\s*([^\n]+)/i);
    if (mapelMatch) result.mataPelajaran = mapelMatch[1].trim();

    // 2. Split by Elements (Heuristic: Look for "Elemen" keyword or bold-like headers if pasted from rich text, 
    // but since we have raw text, we rely on "Elemen" prefix or just newlines with specific patterns)
    // Simple heuristic: Split by "Elemen [Name]" or just newlines if no clear structure.

    // Clean up text first
    const cleanText = text.replace(/\r\n/g, '\n');

    // Try to find blocks starting with "Elemen"
    const elementBlocks = cleanText.split(/(?=Elemen\s+:|Elemen\s+[A-Z])/g).filter(block => block.trim().length > 10);

    if (elementBlocks.length === 0) {
        // If no explicit "Elemen", treat whole text as one generic element
        result.elemenList.push(analyzeBlock('Umum', cleanText));
    } else {
        elementBlocks.forEach(block => {
            // Extract Element Name
            const titleMatch = block.match(/(?:Elemen\s+(?:.*?)[:\n]\s*)([^\n]+)/i);
            const elementName = titleMatch ? titleMatch[1].trim() : 'Elemen Umum';

            // Analyze the content of this block
            result.elemenList.push(analyzeBlock(elementName, block));
        });
    }

    return result;
};

// Internal function to analyze a text block and extract TPs
const analyzeBlock = (elementName, text) => {
    const blockResult = {
        name: elementName,
        tps: []
    };

    // Split into sentences or bullet points
    const sentences = text.split(/(?:\.|\n|;)\s+/).filter(s => s.trim().length > 10);

    sentences.forEach((sentence, index) => {
        // Heuristic: Check if sentence starts with KKO (Operational Verb)
        const kko = detectKKO(sentence);
        if (kko) {
            const materi = sentence.replace(new RegExp(`^.*?${kko}\\s+`, 'i'), '').trim();
            blockResult.tps.push({
                id: Date.now() + Math.random(),
                code: `${elementName.substring(0, 3).toUpperCase()}.${index + 1}`,
                text: sentence.trim(),
                kko: kko,
                materi: materi,
                assessment: suggestAssessment(kko),
                alokasiWaktu: '2 JP' // Default
            });
        }
    });

    return blockResult;
};

// Minimal Dictionary of KKO (Bloom's Taxonomy)
const kkoDictionary = [
    'menjelaskan', 'menganalisis', 'mengevaluasi', 'menciptakan', 'merancang',
    'memahami', 'mengidentifikasi', 'menerapkan', 'menghitung', 'menguraikan',
    'menyebutkan', 'membedakan', 'mendemonstrasikan', 'mengoperasikan', 'memperbaiki',
    'menyimpulkan', 'merumuskan', 'menggabungkan', 'mengorganisir', 'membangun',
    'peserta didik mampu', 'siswa mampu', 'mampu' // Phrases to catch
];

const detectKKO = (sentence) => {
    const lower = sentence.toLowerCase();

    // Basic heuristic: check if sentence contains KKO words
    // Priority to longer matches?
    const found = kkoDictionary.find(word => lower.includes(word));
    return found || null;
};

const suggestAssessment = (kko) => {
    if (!kko) return 'Tes Tertulis';
    const lower = kko.toLowerCase();

    if (['menciptakan', 'merancang', 'membangun', 'membuat'].some(w => lower.includes(w))) return 'Project Based Learning (PjBL) / Produk';
    if (['mendemonstrasikan', 'mengoperasikan', 'mempraktikkan'].some(w => lower.includes(w))) return 'Uji Kinerja / Praktik';
    if (['menganalisis', 'mengevaluasi', 'menyimpulkan'].some(w => lower.includes(w))) return 'Studi Kasus / Esai';
    if (['menjelaskan', 'menyebutkan', 'mengidentifikasi'].some(w => lower.includes(w))) return 'Tes Lisan / Tertulis';

    return 'Observasi / Formatif';
};
