import React, { useState } from 'react';
import { Wand2, Loader2, FileText, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react'; // Added RotateCcw
import { smartParser } from '../utils/smartParser';

const MagicBoxInput = ({ onAnalyze, identity, aiConfig }) => {
    const [text, setText] = useState('');
    const [cpMeta, setCpMeta] = useState({
        elemen: '',
        subElemen: ''
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectedData, setDetectedData] = useState(null);
    const [error, setError] = useState(null);

    const handleTextChange = (e) => {
        const newVal = e.target.value;
        setText(newVal);
        setError(null);

        // Quick debounce for auto-detection preview (Client-side regex still useful for instant feedback)
        if (newVal.length > 50) {
            const preview = smartParser(newVal);
            if (preview.fase || preview.mataPelajaran) {
                setDetectedData(preview);
            }
        } else {
            setDetectedData(null);
        }
    };

    const handleReset = () => {
        setText('');
        setCpMeta({ elemen: '', subElemen: '' });
        setDetectedData(null);
        setError(null);
        setIsAnalyzing(false);
    };

    const handleAnalyze = async () => {
        if (!cpMeta.elemen.trim()) {
            setError("Elemen CP wajib diisi agar TP/ATP tidak menjadi umum.");
            return;
        }

        if (!text.trim()) {
            setError("Silakan tempel isi CP terlebih dahulu!");
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            // Use relative path - handled by Vite proxy locally and Vercel rewrites in production
            const response = await fetch('/api/atp/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, identity, cpMeta, aiConfig })
            });

            const data = await response.json();

            if (response.ok) {
                onAnalyze(data);
                setDetectedData(data); // Update preview with real AI data
            } else {
                console.error("API Error:", data);
                setError(data.error || "Gagal menganalisis CP. Periksa koneksi backend.");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Gagal menghubungi server AI. Pastikan server backend berjalan (port 3000).");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="relative z-10 p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="rounded-lg bg-slate-950 p-2 text-cyan-300">
                            <Wand2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">AI Penyusun TP & ATP</h3>
                            <p className="text-xs text-slate-500">Isi elemen dan sub-elemen di sini, lalu tempel isi CP saja.</p>
                        </div>
                    </div>
                    {detectedData && (
                        <div className="flex space-x-2 animate-fade-in">
                            {detectedData.fase && (
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 flex items-center">
                                    <CheckCircle2 size={12} className="mr-1" /> Fase {detectedData.fase}
                                </span>
                            )}
                            {detectedData.mataPelajaran && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200 flex items-center">
                                    <CheckCircle2 size={12} className="mr-1" /> {detectedData.mataPelajaran}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                                Elemen CP <span className="text-red-500">*</span>
                            </span>
                            <input
                                type="text"
                                value={cpMeta.elemen}
                                onChange={(event) => {
                                    setCpMeta(prev => ({ ...prev, elemen: event.target.value }));
                                    setError(null);
                                }}
                                className={`w-full rounded-lg border bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 ${error && !cpMeta.elemen.trim() ? 'border-red-300' : 'border-slate-200'}`}
                                placeholder="Contoh: Pemahaman IPAS"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                                Sub Elemen <span className="font-bold normal-case text-slate-400">(jika ada)</span>
                            </span>
                            <input
                                type="text"
                                value={cpMeta.subElemen}
                                onChange={(event) => setCpMeta(prev => ({ ...prev, subElemen: event.target.value }))}
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                                placeholder="Contoh: Sumber daya alam"
                            />
                        </label>
                    </div>

                    <div className="rounded-lg border border-cyan-100 bg-cyan-50 px-3 py-2 text-xs leading-5 text-cyan-900">
                        Kotak di bawah cukup isi <strong>teks CP</strong>. Jangan perlu ulangi elemen/sub-elemen jika sudah diisi di atas.
                    </div>

                    <div className="relative">
                    <textarea
                        value={text}
                        onChange={handleTextChange}
                        className={`h-56 w-full resize-none rounded-lg border bg-slate-50 p-4 text-sm leading-6 text-slate-700 shadow-inner transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 ${error ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        placeholder="Tempel isi CP di sini. Contoh: Pada akhir fase F, peserta didik mampu memahami keteladanan tokoh-tokoh agama..."
                    ></textarea>

                    {error && (
                        <div className="absolute bottom-16 left-4 right-4 bg-red-100 text-red-600 text-xs p-2 rounded flex items-center animate-fade-in">
                            <AlertCircle size={14} className="mr-1.5" />
                            {error}
                        </div>
                    )}

                    <div className="absolute bottom-4 right-4 flex space-x-2">
                        {text.trim() && (
                            <button
                                onClick={handleReset}
                                disabled={isAnalyzing}
                                className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-100"
                                title="Reset"
                            >
                                <RotateCcw size={18} />
                                <span>Reset</span>
                            </button>
                        )}
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !text.trim() || !cpMeta.elemen.trim()}
                            className={`flex items-center space-x-2 rounded-lg px-6 py-2.5 font-bold text-white shadow-lg transition-all ${!text.trim() || !cpMeta.elemen.trim() || isAnalyzing
                                ? 'bg-slate-300 cursor-not-allowed'
                                : 'bg-slate-950 hover:bg-cyan-700'
                                }`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>Menganalisis...</span>
                                </>
                            ) : (
                                <>
                                    <Wand2 size={18} />
                                    <span>Susun TP & ATP</span>
                                </>
                            )}
                        </button>
                    </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default MagicBoxInput;
