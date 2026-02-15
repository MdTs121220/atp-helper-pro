import React from 'react';
import { User, School, Book, Layers, Users, Zap } from 'lucide-react';

const IdentityForm = ({ data, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    const handleToggle = (value) => {
        onChange('kondisi', value);
    };

    const isTerbatas = data.kondisi === 'terbatas';
    const accentColor = isTerbatas ? 'text-amber-600' : 'text-indigo-600';
    const ringColor = isTerbatas ? 'focus:border-amber-500' : 'focus:border-indigo-600';
    const labelColor = isTerbatas ? 'peer-focus:text-amber-600' : 'peer-focus:text-indigo-600';

    return (
        <div className="glass-panel p-6 animate-slide-up">
            <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                <div className={`p-2 rounded-lg ${isTerbatas ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                    <Users size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Identitas Sekolah</h2>
                    <p className="text-xs text-slate-500">Lengkapi data untuk kop perangkat ajar.</p>
                </div>
            </div>

            <div className="space-y-5">

                {/* Nama Guru */}
                <div className="relative">
                    <input
                        type="text"
                        id="namaGuru"
                        name="namaGuru"
                        value={data.namaGuru}
                        onChange={handleChange}
                        className={`floating-input peer ${ringColor}`}
                        placeholder=" "
                    />
                    <label htmlFor="namaGuru" className={`floating-label ${labelColor}`}>
                        Nama Guru
                    </label>
                </div>

                {/* Sekolah */}
                <div className="relative">
                    <input
                        type="text"
                        id="sekolah"
                        name="sekolah"
                        value={data.sekolah}
                        onChange={handleChange}
                        className={`floating-input peer ${ringColor}`}
                        placeholder=" "
                    />
                    <label htmlFor="sekolah" className={`floating-label ${labelColor}`}>
                        Satuan Pendidikan
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Mata Pelajaran */}
                    <div className="relative">
                        <input
                            type="text"
                            id="mapel"
                            name="mapel"
                            value={data.mapel}
                            onChange={handleChange}
                            className={`floating-input peer ${ringColor}`}
                            placeholder=" "
                        />
                        <label htmlFor="mapel" className={`floating-label ${labelColor}`}>
                            Mata Pelajaran
                        </label>
                    </div>

                    {/* Fase */}
                    <div className="relative">
                        <select
                            id="fase"
                            name="fase"
                            value={data.fase}
                            onChange={handleChange}
                            className={`floating-input ${ringColor} appearance-none`}
                        >
                            <option value="" disabled></option>
                            <option value="A">Fase A (Kls 1-2)</option>
                            <option value="B">Fase B (Kls 3-4)</option>
                            <option value="C">Fase C (Kls 5-6)</option>
                            <option value="D">Fase D (SMP)</option>
                            <option value="E">Fase E (SMA/SMK)</option>
                            <option value="F">Fase F (SMA/SMK)</option>
                        </select>
                        <label htmlFor="fase" className={`floating-label ${labelColor}`}>
                            Fase
                        </label>
                    </div>
                </div>

                {/* iOS Style Toggle for Sarpras */}
                <div className={`mt-6 p-4 rounded-xl border transition-all duration-300 ${isTerbatas ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`p-1.5 rounded-full ${isTerbatas ? 'bg-amber-200 text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                                {isTerbatas ? <Zap size={16} /> : <School size={16} />}
                            </div>
                            <div>
                                <span className={`block text-sm font-bold ${isTerbatas ? 'text-amber-800' : 'text-slate-700'}`}>
                                    {isTerbatas ? 'Sarana Terbatas (Mode Adaptif)' : 'Sarana Lengkap (Standar)'}
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Kondisi Sekolah</span>
                            </div>
                        </div>

                        {/* iOS Switch */}
                        <button
                            onClick={() => handleToggle(isTerbatas ? 'lengkap' : 'terbatas')}
                            className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isTerbatas ? 'bg-amber-500 focus:ring-amber-500' : 'bg-slate-300 focus:ring-slate-400'}`}
                        >
                            <span
                                className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-300 ${isTerbatas ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>
                    {isTerbatas && (
                        <p className="text-xs text-amber-700/80 mt-3 pl-11 leading-relaxed">
                            Sistem akan otomatis menyesuaikan KKO menjadi lebih sederhana/unplugged.
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default IdentityForm;
