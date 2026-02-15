import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Zap, Sparkles, LayoutTemplate, Star, Heart, GraduationCap } from 'lucide-react';
import InfoModal from './InfoModal';

const LandingPage = ({ onStart }) => {
    const [showGuide, setShowGuide] = useState(false);

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-900 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Top Right Blob */}
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-secondary-200/40 to-primary-200/40 rounded-full blur-[120px] animate-pulse-slow"></div>
                {/* Bottom Left Blob */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-accent-200/40 to-primary-200/40 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="flex items-center space-x-3 font-bold text-xl text-slate-800 glass-panel px-5 py-3 rounded-2xl border border-white/40 shadow-xl shadow-indigo-500/10 hover:scale-105 transition-transform cursor-default">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2 rounded-xl shadow-lg ring-2 ring-white/50">
                        <GraduationCap size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <span className="tracking-tight block leading-none text-slate-900">ATP Helper</span>
                        <span className="text-[10px] text-indigo-600 font-extrabold tracking-widest uppercase block mt-0.5">Professional Edition</span>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 flex-grow container mx-auto px-6 flex flex-col items-center justify-center text-center pb-20 mt-10">

                {/* NEW TAGLINE */}
                <div className="mb-8 animate-bounce-slow">
                    <span className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-black tracking-widest px-6 py-2.5 rounded-full shadow-lg shadow-orange-500/30 uppercase border-2 border-white ring-2 ring-orange-200 transform hover:scale-105 transition-transform cursor-default relative overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            <Heart size={12} className="fill-white animate-pulse" />
                            FREE BUAT GURU INDONESIA
                            <Heart size={12} className="fill-white animate-pulse" />
                        </span>
                    </span>
                </div>

                {/* Edisi Badge (Fixed Visibility) */}
                <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span className="text-xs font-bold text-indigo-700 tracking-wide uppercase">
                        Edisi Kurikulum Merdeka 2025
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 animate-slide-up leading-[1.1]">
                    Sederhanakan <br />
                    <span className="text-gradient drop-shadow-sm">Perangkat Ajar Anda</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600/90 max-w-2xl mb-12 animate-slide-up font-medium leading-relaxed" style={{ animationDelay: '0.1s' }}>
                    Platform cerdas untuk Guru Indonesia. Turunkan CP ke TP dan susun ATP yang adaptif dengan tampilan modern.
                </p>

                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 animate-slide-up relative z-20" style={{ animationDelay: '0.2s' }}>
                    <button
                        onClick={onStart}
                        className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg shadow-2xl shadow-primary-600/30 hover:shadow-primary-600/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center">
                            Mulai Penyusunan
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </span>
                        {/* Button Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 opacity-100 group-hover:scale-105 transition-transform duration-500"></div>
                    </button>

                    <button
                        onClick={() => setShowGuide(true)}
                        className="px-8 py-4 bg-white/50 backdrop-blur-sm text-slate-700 border border-white/60 rounded-full font-semibold hover:bg-white hover:text-primary-700 transition-all shadow-sm hover:shadow-md"
                    >
                        Pelajari Panduan
                    </button>
                </div>

                {/* Feature Cards */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl w-full animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                            <Zap size={120} />
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-white rounded-2xl flex items-center justify-center text-primary-600 mb-6 shadow-sm border border-primary-50">
                            <Zap size={28} />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-slate-800">Cepat & Otomatis</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Analisis kalimat Capaian Pembelajaran (CP) dan generate Tujuan Pembelajaran (TP) instan.</p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                            <ShieldCheck size={120} />
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-secondary-100 to-white rounded-2xl flex items-center justify-center text-secondary-600 mb-6 shadow-sm border border-secondary-50">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-slate-800">Adaptif Kondisi</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Penyusunan TP yang menyesuaikan dengan kondisi sarana sekolah (Lengkap/Terbatas).</p>
                    </div>

                    <div className="glass-card p-8 rounded-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                            <Sparkles size={120} />
                        </div>
                        <div className="w-14 h-14 bg-gradient-to-br from-accent-100 to-white rounded-2xl flex items-center justify-center text-accent-600 mb-6 shadow-sm border border-accent-50">
                            <Sparkles size={28} />
                        </div>
                        <h3 className="font-bold text-xl mb-3 text-slate-800">Ekspor Premium</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">Hasil akhir siap cetak dalam format PDF profesional atau Excel yang rapi.</p>
                    </div>
                </div>
            </main>

            <footer className="relative z-10 py-6 text-center text-slate-500 text-sm font-medium">
                &copy; {new Date().getFullYear()} ATP Helper Pro. Dibuat dengan <Star size={12} className="inline text-yellow-500 fill-yellow-500 mx-0.5" /> untuk Pendidikan Indonesia.
            </footer>

            {/* GUIDE MODAL */}
            <InfoModal
                isOpen={showGuide}
                onClose={() => setShowGuide(false)}
                title="Panduan Penggunaan"
                type="guide"
            >
                <div className="space-y-4 text-slate-600">
                    <p className="text-sm">Ikuti langkah mudah menyusun ATP Otomatis:</p>
                    <ol className="space-y-3">
                        <li className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white">1</span>
                            <div>
                                <h4 className="font-bold text-indigo-900 text-sm">Isi Identitas</h4>
                                <p className="text-xs mt-1">Lengkapi data guru, mapel, dan fase di panel kiri setelah masuk.</p>
                            </div>
                        </li>
                        <li className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white">2</span>
                            <div>
                                <h4 className="font-bold text-purple-900 text-sm">Masukkan CP (Magic Box)</h4>
                                <p className="text-xs mt-1">Copy-paste teks <strong>Capaian Pembelajaran (CP)</strong> beserta <strong>Elemen dan Deskripsi</strong>-nya ke dalam Magic Box.</p>
                            </div>
                        </li>
                        <li className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="flex-shrink-0 w-6 h-6 bg-pink-100 text-pink-700 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white">3</span>
                            <div>
                                <h4 className="font-bold text-pink-900 text-sm">Klik Analisis AI</h4>
                                <p className="text-xs mt-1">Biarkan AI menganalisis TP, Materi, dan kriteria asesmen secara otomatis.</p>
                            </div>
                        </li>
                        <li className="flex gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <span className="flex-shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white">4</span>
                            <div>
                                <h4 className="font-bold text-emerald-900 text-sm">Edit & Export</h4>
                                <p className="text-xs mt-1">Sesuaikan hasil jika perlu, lalu unduh sebagai <strong>Excel</strong> atau <strong>PDF</strong>.</p>
                            </div>
                        </li>
                    </ol>
                </div>
            </InfoModal>
        </div>
    );
};

export default LandingPage;
