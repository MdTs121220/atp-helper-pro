import React, { useState } from 'react';
import { BookOpenCheck, GraduationCap, LogOut, ShieldCheck } from 'lucide-react';
import InfoModal from './InfoModal';

const Layout = ({ children, onLogout }) => {
    const [activeModal, setActiveModal] = useState(null);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-cyan-300">
                            <GraduationCap size={23} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black leading-none tracking-tight text-slate-950">ATP Helper Pro</h1>
                            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">CP - TP - ATP</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveModal('guide')}
                            className="hidden rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 sm:inline-flex"
                        >
                            Panduan
                        </button>
                        <button
                            onClick={() => setActiveModal('about')}
                            className="hidden rounded-lg px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 sm:inline-flex"
                        >
                            Tentang
                        </button>
                        <button
                            onClick={onLogout}
                            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-bold text-white transition hover:bg-rose-600"
                        >
                            <LogOut size={16} />
                            Keluar
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-8">
                {children}
            </main>

            <footer className="border-t border-slate-200 bg-white px-4 py-5 text-center text-xs font-semibold text-slate-500">
                &copy; {new Date().getFullYear()} ATP Helper Pro. Dibuat untuk Guru Indonesia.
            </footer>

            <InfoModal isOpen={activeModal === 'guide'} onClose={() => setActiveModal(null)} title="Panduan Penggunaan" type="guide">
                <div className="space-y-4 text-sm leading-6 text-slate-600">
                    <div className="rounded-lg border border-cyan-100 bg-cyan-50 p-4">
                        <BookOpenCheck className="mb-2 text-cyan-700" size={20} />
                        <p className="font-bold text-slate-900">Input yang benar</p>
                        <p>Tempel CP lengkap dari pemerintah. Sertakan fase, mata pelajaran, elemen, sub-elemen, dan isi CP agar AI dapat menurunkan TP dan ATP secara akurat.</p>
                    </div>
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                        <ShieldCheck className="mb-2 text-emerald-700" size={20} />
                        <p className="font-bold text-slate-900">Validasi guru tetap wajib</p>
                        <p>AI membantu menyusun draft. Guru tetap menyesuaikan JP, konteks kelas, KKTP, dan teknik asesmen.</p>
                    </div>
                </div>
            </InfoModal>

            <InfoModal isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)} title="Tentang ATP Helper Pro" type="about">
                <div className="space-y-4 text-sm leading-6 text-slate-600">
                    <p>
                        ATP Helper Pro membantu guru menurunkan Capaian Pembelajaran menjadi Tujuan Pembelajaran dan Alur Tujuan Pembelajaran sesuai Panduan Pembelajaran dan Asesmen 2025.
                    </p>
                    <p>
                        Aplikasi mendukung beberapa engine AI dan menyediakan admin console untuk menguji koneksi AI.
                    </p>
                </div>
            </InfoModal>
        </div>
    );
};

export default Layout;
