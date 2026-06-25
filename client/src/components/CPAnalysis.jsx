import React, { useState } from 'react';
import { Sparkles, Split, ArrowDown, Type, Zap, Check } from 'lucide-react';
import { adjustCompetency } from '../utils/competencyMapper';

const CPAnalysis = ({ onAddTP, kondisi }) => {
    const [cpText, setCpText] = useState('');
    const [splitMode, setSplitMode] = useState(false);
    const [competency, setCompetency] = useState('');
    const [material, setMaterial] = useState('');
    const [suggestionActive, setSuggestionActive] = useState(false);

    // Logic to adjust competency automatically when typing or blurring
    const handleCompetencyChange = (val) => {
        setCompetency(val);
        const { isChanged } = adjustCompetency(val, kondisi === 'terbatas');
        setSuggestionActive(isChanged);
    };

    const handleGenerate = () => {
        if (!competency || !material) return;

        // Final check logic
        const { adjusted } = adjustCompetency(competency, kondisi === 'terbatas');

        const newTP = {
            id: Date.now().toString(),
            text: `Peserta didik mampu ${adjusted.toLowerCase()} ${material.toLowerCase()}.`,
            competency: adjusted,
            material,
            alokasiWaktu: '2 JP' // Default
        };

        onAddTP(newTP);
        // Reset fields but keep CP text
        setCompetency('');
        setMaterial('');
        setSuggestionActive(false);
    };

    return (
        <div className="animate-slide-up overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
                <h2 className="text-lg font-bold text-slate-800 flex items-center">
                    <div className="mr-3 rounded-lg bg-slate-950 p-2 text-cyan-300 shadow-sm">
                        <Split size={20} />
                    </div>
                    Analisis Capaian Pembelajaran
                </h2>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Capaian Pembelajaran (CP) Asli</label>
                    <div className="relative group">
                        <textarea
                            className="input-modern min-h-[100px] resize-y"
                            placeholder="Tempelkan teks CP lengkap di sini..."
                            value={cpText}
                            onChange={(e) => setCpText(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center mb-6">
                    {!splitMode && (
                        <button
                            onClick={() => setSplitMode(true)}
                    className="flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        >
                            <ArrowDown size={18} className="mr-2" />
                            Mulai Breakdown & Analisis
                        </button>
                    )}
                </div>

                {splitMode && (
                    <div className="space-y-6 animate-fade-in relative">

                        <div className="group relative rounded-lg border border-slate-200 bg-slate-50 p-5 transition-all hover:border-cyan-200">
                            <label className="block text-xs font-bold text-teal-700 uppercase tracking-wider mb-2 flex items-center">
                                <span className="w-2 rounded-full h-2 bg-teal-500 mr-2"></span>
                                Kompetensi (Kata Kerja)
                                {suggestionActive && (
                                    <span className="ml-auto text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full flex items-center animate-pulse">
                                        <Zap size={10} className="mr-1" /> Adjusted for Low-Tech
                                    </span>
                                )}
                            </label>
                            <input
                                type="text"
                                value={competency}
                                onChange={(e) => handleCompetencyChange(e.target.value)}
                                className="input-modern font-medium text-slate-700"
                                placeholder="Contoh: Menjelaskan, Menganalisis..."
                            />
                            <p className="text-xs text-teal-600/70 mt-2 font-medium">
                                {suggestionActive
                                    ? "Saran: Kata kerja telah disesuaikan agar lebih ramah sarana terbatas."
                                    : "Ambil Kata Kerja Operasional (KKO) dari CP."}
                            </p>
                        </div>

                        <div className="group rounded-lg border border-slate-200 bg-slate-50 p-5 transition-all hover:border-cyan-200">
                            <label className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 flex items-center">
                                <span className="w-2 rounded-full h-2 bg-indigo-500 mr-2"></span>
                                Lingkup Materi
                            </label>
                            <input
                                type="text"
                                value={material}
                                onChange={(e) => setMaterial(e.target.value)}
                                className="input-modern font-medium text-slate-700"
                                placeholder="Contoh: Sifat-sifat bunyi..."
                            />
                            <p className="text-xs text-indigo-600/70 mt-2 font-medium">
                                Ambil topik atau konten utama.
                            </p>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={!competency || !material}
                            className="group flex w-full items-center justify-center rounded-lg bg-slate-950 py-3.5 text-base font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
                        >
                            <Sparkles size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                            Generate ke Tabel ATP
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CPAnalysis;
