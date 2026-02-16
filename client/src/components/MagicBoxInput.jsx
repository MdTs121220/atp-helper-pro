import React, { useState } from 'react';
import { Wand2, Loader2, FileText, CheckCircle2, AlertCircle, RotateCcw } from 'lucide-react'; // Added RotateCcw
import { smartParser } from '../utils/smartParser';

const MagicBoxInput = ({ onAnalyze }) => {
    const [text, setText] = useState('');
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
        setDetectedData(null);
        setError(null);
        setIsAnalyzing(false);
    };

    const handleAnalyze = async () => {
        if (!text.trim()) {
            setError("Silakan tempel teks CP terlebih dahulu!");
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            // Use relative path - handled by Vite proxy locally and Vercel rewrites in production
            const response = await fetch('/api/atp/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
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
        <div className="glass-panel p-1 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>

            <div className="bg-white/50 p-6 rounded-xl backdrop-blur-sm relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                            <Wand2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800">The Magic Box</h3>
                            <p className="text-xs text-slate-500">Paste CP Anda di sini, AI akan menyusun ATP otomatis.</p>
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

                <div className="relative">
                    <textarea
                        value={text}
                        onChange={handleTextChange}
                        className={`w-full h-48 p-4 text-sm text-slate-700 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none shadow-inner ${error ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                        placeholder="Tempelkan teks Capaian Pembelajaran (CP) lengkap di sini..."
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
                                className="flex items-center space-x-2 px-4 py-2.5 rounded-full font-bold text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-all"
                                title="Reset"
                            >
                                <RotateCcw size={18} />
                                <span>Reset</span>
                            </button>
                        )}
                        <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || !text.trim()}
                            className={`flex items-center space-x-2 px-6 py-2.5 rounded-full font-bold text-white shadow-lg transition-all transform hover:scale-105 active:scale-95 ${!text.trim() || isAnalyzing
                                ? 'bg-slate-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
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
                                    <span>Generate ATP</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-pink-500 opacity-20 blur-xl rounded-2xl z-0 transition-opacity duration-500 group-hover:opacity-40"></div>
        </div>
    );
};

export default MagicBoxInput;
