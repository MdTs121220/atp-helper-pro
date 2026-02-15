import React, { useState } from 'react';
import { GraduationCap, BookOpen, Heart, CheckCircle2, AlertTriangle, Cpu } from 'lucide-react';
import InfoModal from './InfoModal';

const Layout = ({ children, onLogout, ...args }) => {
    const [activeModal, setActiveModal] = useState(null); // 'guide', 'about', or null

    return (
        <div className="min-h-screen flex flex-col font-sans text-slate-800">
            {/* Fixed Background Mesh for continuity */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-300/20 rounded-full blur-[100px] opacity-40"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary-300/20 rounded-full blur-[100px] opacity-40"></div>
            </div>

            <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all duration-300">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="bg-gradient-to-br from-primary-500 to-secondary-600 p-2.5 rounded-xl text-white shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:scale-105">
                            <GraduationCap size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-primary-900 leading-none group-hover:from-primary-700 group-hover:to-secondary-700 transition-all duration-300">
                                ATP Helper Pro
                            </h1>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1 group-hover:text-primary-600 transition-colors">
                                Perangkat Ajar Kurikulum Merdeka
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-1">
                        <button
                            onClick={() => setActiveModal('guide')}
                            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
                        >
                            Panduan
                        </button>
                        <button
                            onClick={() => setActiveModal('about')}
                            className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all"
                        >
                            Tentang
                        </button>
                        <div className="w-px h-6 bg-slate-200 mx-2"></div>
                        <button
                            onClick={onLogout}
                            className="px-5 py-2 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-full shadow-lg shadow-rose-200 transition-all transform hover:scale-105 active:scale-95"
                        >
                            Keluar
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 pt-28 pb-12 max-w-5xl animate-fade-in">
                {children}
            </main>

            <footer className="bg-white/40 backdrop-blur-md border-t border-white/50 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="flex items-center justify-center text-slate-500 text-sm font-medium">
                        Dibuat dengan <Heart size={14} className="mx-1.5 text-secondary-500 fill-secondary-500 animate-pulse" /> untuk Guru Indonesia
                    </p>
                    <p className="text-xs text-slate-400 mt-2">© {new Date().getFullYear()} ATP Helper Pro. All rights reserved.</p>
                </div>
            </footer>

            {/* MODALS */}

            {/* Panduan Modal */}
            <InfoModal
                isOpen={activeModal === 'guide'}
                onClose={() => setActiveModal(null)}
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
                                <p className="text-xs mt-1">Lengkapi data guru, mapel, dan fase di panel kiri.</p>
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

            {/* Tentang Modal */}
            <InfoModal
                isOpen={activeModal === 'about'}
                onClose={() => setActiveModal(null)}
                title="Tentang ATP Helper Pro"
                type="about"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl mb-4">
                        <GraduationCap size={32} className="text-white" />
                    </div>

                    <div>
                        <h2 className="text-xl font-extrabold text-slate-800">ATP Helper Pro v2.0</h2>
                        <p className="text-xs text-indigo-600 font-bold bg-indigo-50 inline-block px-3 py-1 rounded-full mt-2">
                            Powered by Guru Biasa Saja
                        </p>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">
                        Aplikasi ini dikembangkan untuk membantu Bapak/Ibu Guru dalam menyusun administrasi pembelajaran (ATP) Kurikulum Merdeka dengan lebih cepat dan efisien.
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-left mt-6">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1 text-slate-800 font-bold text-xs">
                                <Cpu size={14} className="text-indigo-500" />
                                Teknologi
                            </div>
                            <p className="text-[10px] text-slate-500">React, TailwindCSS, Gemini AI</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-1 text-slate-800 font-bold text-xs">
                                <AlertTriangle size={14} className="text-amber-500" />
                                Disclaimer
                            </div>
                            <p className="text-[10px] text-slate-500">Hasil AI adalah referensi. Mohon verifikasi sesuai konteks sekolah.</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100">
                        <p className="text-xs text-slate-400">
                            Develop with <Heart size={10} className="inline text-red-500" /> by Antigravity
                        </p>
                    </div>
                </div>
            </InfoModal>

        </div>
    );
};

export default Layout;
