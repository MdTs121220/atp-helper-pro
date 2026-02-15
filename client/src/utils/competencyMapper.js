/**
 * Utility to map High-Tech/Complex verbs to Low-Tech/Manual/Unplugged verbs
 * when facility condition is limited.
 */

const competencyMap = {
    // IT / Digital Context
    'mempraktikkan': 'mensimulasikan',
    'mengoperasikan': 'menjelaskan fungsi',
    'membangun jaringan': 'membuat diagram jaringan',
    'mengkonfigurasi': 'merancang skema konfigurasi',
    'memprogram': 'menulis algoritma/pseudocode',
    'mendesain digital': 'membuat sketsa manual',
    'mengedit video': 'membuat storyboard',
    'mengakses internet': 'mencari referensi buku/offline',
    'menginstal': 'mengurutkan langkah instalasi',

    // Science / Experiment Context
    'melakukan eksperimen': 'mendemonstrasikan fenomena sederhana',
    'menggunakan mikroskop': 'mengamati gambar mikroskopis',
    'mengukur dengan alat digital': 'mengukur dengan alat manual/analog',

    // General / High Resource
    'memproduksi': 'merancang purwarupa',
    'menganalisis data digital': 'menganalisis data manual',
};

export const adjustCompetency = (competency, isLimited) => {
    if (!isLimited || !competency) return { adjusted: competency, isChanged: false };

    const lowerComp = competency.toLowerCase().trim();

    // Direct match
    if (competencyMap[lowerComp]) {
        return { adjusted: competencyMap[lowerComp], isChanged: true };
    }

    // Partial match search (e.g. "Mempraktikkan penggunaan..." -> "Mensimulasikan penggunaan...")
    for (const [key, value] of Object.entries(competencyMap)) {
        if (lowerComp.includes(key)) {
            // Replace the found verb with the low-tech version, preserving the rest of the sentence case-insensitively
            const regex = new RegExp(key, 'i');
            const adjusted = competency.replace(regex, value);
            return { adjusted, isChanged: true };
        }
    }

    return { adjusted: competency, isChanged: false };
};
