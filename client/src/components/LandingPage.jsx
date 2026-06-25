import React, { useState } from 'react';
import { ArrowRight, BookOpenCheck, CheckCircle2, Cpu, FileSpreadsheet, GraduationCap, ShieldCheck } from 'lucide-react';
import InfoModal from './InfoModal';

const LandingPage = ({ onStart }) => {
    const [showGuide, setShowGuide] = useState(false);

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
                <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-400 text-slate-950">
                        <GraduationCap size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-lg font-extrabold tracking-tight">ATP Helper Pro</p>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">PPA 2025 Ready</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowGuide(true)}
                    className="rounded-lg border border-white/15 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
                >
                    Panduan
                </button>
            </nav>

            <main className="relative overflow-hidden border-y border-white/10">
                <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '44px 44px' }} />

                <div className="relative mx-auto grid min-h-[calc(100vh-132px)] max-w-7xl grid-cols-1 items-center gap-10 px-5 py-12 lg:grid-cols-[0.92fr_1.08fr]">
                    <section className="max-w-3xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                            <BookOpenCheck size={15} />
                            CP ke TP dan ATP berbasis panduan resmi
                        </div>

                        <h1 className="text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
                            Susun ATP guru dari CP pemerintah dengan alur yang benar.
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                            Tempel CP lengkap beserta elemen dan sub-elemen. AI akan menganalisis CP, merumuskan TP, mengurutkan ATP, lalu menyiapkan KKTP serta asesmen formatif dan sumatif.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={onStart}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-300 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-white"
                            >
                                Mulai Menyusun
                                <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={() => setShowGuide(true)}
                                className="inline-flex items-center justify-center rounded-lg border border-white/15 px-6 py-3 text-sm font-bold text-white transition hover:border-white/40 hover:bg-white/10"
                            >
                                Lihat Alur Kerja
                            </button>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-emerald-300" />
                                Analisis elemen CP
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-emerald-300" />
                                KKTP dan asesmen
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-emerald-300" />
                                Export PDF/Excel
                            </div>
                        </div>
                    </section>

                    <section className="relative">
                        <div className="rounded-lg border border-white/15 bg-white/[0.06] p-3 shadow-2xl shadow-black/30 backdrop-blur">
                            <div className="rounded-md border border-white/10 bg-slate-900">
                                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">Preview ATP</p>
                                        <p className="mt-1 text-sm font-bold text-white">IPAS - Fase B</p>
                                    </div>
                                    <span className="rounded bg-emerald-400/15 px-2 py-1 text-[11px] font-bold text-emerald-200">AI aktif</span>
                                </div>
                                <div className="grid gap-3 p-4">
                                    <div className="rounded border border-cyan-300/20 bg-cyan-300/10 p-3">
                                        <p className="text-[11px] font-bold uppercase text-cyan-200">Analisis CP</p>
                                        <p className="mt-1 text-sm leading-6 text-slate-200">Elemen dan sub-elemen dibaca sebelum TP dirumuskan.</p>
                                    </div>
                                    {[
                                        ['B.1', 'Mengidentifikasi sumber daya alam di lingkungan sekitar.', 'Memahami'],
                                        ['B.2', 'Menjelaskan cara pelestarian sumber daya alam.', 'Mengaplikasi'],
                                        ['B.3', 'Menyajikan laporan sederhana hasil pengamatan.', 'Merefleksi']
                                    ].map(([code, text, phase]) => (
                                        <div key={code} className="grid grid-cols-[64px_1fr_110px] gap-3 rounded border border-white/10 bg-white/[0.04] p-3 text-sm">
                                            <span className="font-mono font-black text-cyan-200">{code}</span>
                                            <span className="text-slate-200">{text}</span>
                                            <span className="text-right text-xs font-bold text-amber-200">{phase}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 py-8 md:grid-cols-3">
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                    <Cpu className="mb-4 text-cyan-300" size={24} />
                    <h3 className="text-base font-extrabold text-white">Multi AI Engine</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Gemini, NVIDIA, atau endpoint OpenAI-compatible bisa diuji dari admin console.</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                    <ShieldCheck className="mb-4 text-emerald-300" size={24} />
                    <h3 className="text-base font-extrabold text-white">Sesuai PPA</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Formatif tidak dicampur ke nilai akhir, sumatif dikaitkan ke KKTP.</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                    <FileSpreadsheet className="mb-4 text-amber-300" size={24} />
                    <h3 className="text-base font-extrabold text-white">Siap Pakai</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Hasil dapat diedit, divalidasi guru, lalu diekspor ke Excel, PDF, atau teks.</p>
                </div>
            </section>

            <footer className="border-t border-white/10 px-5 py-5 text-center text-xs font-semibold text-slate-500">
                &copy; {new Date().getFullYear()} ATP Helper Pro - Dibuat untuk Guru Indonesia.
            </footer>

            <InfoModal isOpen={showGuide} onClose={() => setShowGuide(false)} title="Alur Penggunaan" type="guide">
                <div className="space-y-3 text-sm text-slate-600">
                    <p>1. Isi identitas sekolah, mapel, dan fase.</p>
                    <p>2. Tempel CP lengkap dari pemerintah, termasuk elemen dan sub-elemen.</p>
                    <p>3. Klik Susun TP & ATP untuk menjalankan AI.</p>
                    <p>4. Validasi hasil, sesuaikan JP/KKTP, lalu export.</p>
                    <p>5. Jika AI gagal, buka Admin AI di dashboard untuk uji dan ganti engine.</p>
                </div>
            </InfoModal>
        </div>
    );
};

export default LandingPage;
