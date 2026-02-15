import React, { useState, useEffect } from 'react';
import { Shield, Lock, X, Check, RefreshCw } from 'lucide-react';

const SecurityCheck = ({ onSuccess, onCancel }) => {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState(false);

    // Generate random math problem
    const generateProblem = () => {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        setNum1(n1);
        setNum2(n2);
        setAnswer('');
        setError(false);
    };

    useEffect(() => {
        generateProblem();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (parseInt(answer) === num1 + num2) {
            onSuccess();
        } else {
            setError(true);
            setAnswer('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-fade-in p-4">
            <div className="glass-panel w-full max-w-md rounded-3xl p-8 relative animate-slide-up shadow-2xl">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors bg-white/50 p-1 rounded-full hover:bg-white"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-white rounded-full flex items-center justify-center mb-5 text-primary-600 shadow-md border-4 border-white">
                        <Shield size={36} />
                    </div>

                    <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Verifikasi Keamanan</h2>
                    <p className="text-slate-500 mb-6 text-sm px-4">
                        Untuk keamanan, mohon selesaikan perhitungan sederhana di bawah ini.
                    </p>

                    <div className="bg-white/60 border border-white rounded-2xl p-6 w-full mb-6 shadow-inner">
                        <div className="flex items-center justify-center space-x-4 text-3xl font-bold text-slate-700 font-mono">
                            <span>{num1}</span>
                            <span className="text-secondary-500">+</span>
                            <span>{num2}</span>
                            <span>=</span>
                            <div className="w-24">
                                <input
                                    type="number"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                    className={`w-full bg-white/80 border-b-2 text-center rounded-lg py-1 focus:outline-none focus:border-primary-500 transition-all ${error ? 'border-red-500 text-red-600 bg-red-50' : 'border-slate-300'}`}
                                    placeholder="?"
                                    autoFocus
                                />
                            </div>
                        </div>
                        {error && (
                            <p className="text-red-500 text-xs mt-3 font-bold bg-white/80 py-1 px-3 rounded-full inline-block shadow-sm animate-pulse">
                                Jawaban salah, coba lagi!
                            </p>
                        )}
                    </div>

                    <button
                        onClick={generateProblem}
                        className="mb-6 text-xs text-primary-600 font-bold hover:text-primary-800 flex items-center justify-center transition-colors uppercase tracking-wider"
                    >
                        <RefreshCw size={12} className="mr-1.5" /> Ganti Soal
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!answer}
                        className="w-full btn-primary py-3.5 rounded-xl font-bold text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <Lock size={18} className="mr-2" />
                        Verifikasi & Masuk
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SecurityCheck;
