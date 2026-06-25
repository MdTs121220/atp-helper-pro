import React, { useState } from 'react';
import { CheckCircle2, KeyRound, Loader2, Lock, Save, ServerCog, TestTube2, XCircle } from 'lucide-react';

const DEFAULT_CONFIG = {
    provider: 'openai-compatible',
    baseUrl: 'https://integrate.api.nvidia.com/v1',
    model: 'minimaxai/minimax-m3',
    apiKey: ''
};

const savedConfigKey = 'atp_ai_admin_config';
const savedSessionKey = 'atp_ai_admin_session';

const AdminAISettings = ({ onConfigChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem(savedSessionKey) === 'true');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginWarning, setLoginWarning] = useState('');
    const [config, setConfig] = useState(() => {
        const saved = localStorage.getItem(savedConfigKey);
        return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    });
    const [testState, setTestState] = useState({ status: 'idle', message: '' });

    const updateConfig = (field, value) => {
        const next = { ...config, [field]: value };
        if (field === 'provider' && value === 'gemini') {
            next.baseUrl = '';
            next.model = next.model || 'gemini-2.5-flash';
        }
        if (field === 'provider' && value === 'openai-compatible' && !next.baseUrl) {
            next.baseUrl = DEFAULT_CONFIG.baseUrl;
            next.model = next.model || DEFAULT_CONFIG.model;
        }
        setConfig(next);
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoginError('');
        setLoginWarning('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await response.json();

            if (!response.ok) {
                setLoginError(data.error || 'Login admin gagal.');
                return;
            }

            localStorage.setItem(savedSessionKey, 'true');
            setIsLoggedIn(true);
            setPassword('');
            if (data.usingDefault) setLoginWarning(data.message);
        } catch (error) {
            setLoginError(error.message);
        }
    };

    const saveConfig = () => {
        localStorage.setItem(savedConfigKey, JSON.stringify(config));
        onConfigChange(config);
        setTestState({ status: 'success', message: 'Konfigurasi tersimpan di browser admin ini.' });
    };

    const clearConfig = () => {
        localStorage.removeItem(savedConfigKey);
        const next = DEFAULT_CONFIG;
        setConfig(next);
        onConfigChange(null);
        setTestState({ status: 'idle', message: 'Konfigurasi override dihapus.' });
    };

    const logout = () => {
        localStorage.removeItem(savedSessionKey);
        setIsLoggedIn(false);
        onConfigChange(null);
        setIsOpen(false);
    };

    const testEngine = async () => {
        setTestState({ status: 'loading', message: 'Menguji koneksi AI...' });

        try {
            const response = await fetch('/api/ai/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            const data = await response.json();

            if (!response.ok || !data.ok) {
                setTestState({ status: 'error', message: data.error || 'AI engine belum merespons dengan benar.' });
                return;
            }

            setTestState({
                status: 'success',
                message: `${data.provider} aktif memakai model ${data.model}.`
            });
        } catch (error) {
            setTestState({ status: 'error', message: error.message });
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
                <ServerCog size={15} />
                Admin AI
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-950 px-6 py-4 text-white">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Admin Console</p>
                                <h2 className="text-xl font-extrabold">AI Engine Settings</h2>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="rounded-lg bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white">
                                <XCircle size={20} />
                            </button>
                        </div>

                        {!isLoggedIn ? (
                            <form onSubmit={handleLogin} className="space-y-5 p-6">
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                    Login admin dipakai untuk menguji dan mengaktifkan override engine AI di browser ini.
                                </div>
                                <label className="block">
                                    <span className="mb-2 block text-sm font-bold text-slate-700">Password Admin</span>
                                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3">
                                        <Lock size={18} className="text-slate-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            className="w-full bg-transparent px-3 py-3 text-sm outline-none"
                                            placeholder="Masukkan password admin"
                                        />
                                    </div>
                                </label>
                                {loginError && <p className="text-sm font-semibold text-red-600">{loginError}</p>}
                                <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700">
                                    <KeyRound size={18} />
                                    Masuk Admin
                                </button>
                            </form>
                        ) : (
                            <div className="p-6">
                                {loginWarning && (
                                    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-900">
                                        {loginWarning}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Provider</span>
                                        <select
                                            value={config.provider}
                                            onChange={(event) => updateConfig('provider', event.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold outline-none focus:border-indigo-500"
                                        >
                                            <option value="openai-compatible">NVIDIA / OpenAI Compatible</option>
                                            <option value="gemini">Google Gemini</option>
                                        </select>
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Model</span>
                                        <input
                                            value={config.model}
                                            onChange={(event) => updateConfig('model', event.target.value)}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
                                            placeholder="minimaxai/minimax-m3"
                                        />
                                    </label>

                                    <label className="block md:col-span-2">
                                        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Base URL</span>
                                        <input
                                            value={config.baseUrl}
                                            onChange={(event) => updateConfig('baseUrl', event.target.value)}
                                            disabled={config.provider === 'gemini'}
                                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                                            placeholder="https://integrate.api.nvidia.com/v1"
                                        />
                                    </label>

                                    <label className="block md:col-span-2">
                                        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">API Key</span>
                                        <textarea
                                            value={config.apiKey}
                                            onChange={(event) => updateConfig('apiKey', event.target.value.trim())}
                                            rows={3}
                                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-500"
                                            placeholder="Tempel API key NVIDIA/Gemini di sini"
                                        />
                                    </label>
                                </div>

                                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
                                    Untuk TP/ATP gunakan model chat/text seperti <strong>minimaxai/minimax-m3</strong>. Model OCR seperti nemotron-ocr-v2 lebih cocok untuk ekstraksi teks gambar/PDF, bukan penyusunan ATP langsung.
                                </div>

                                {testState.message && (
                                    <div className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm font-semibold ${testState.status === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : testState.status === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                                        {testState.status === 'success' ? <CheckCircle2 size={18} /> : testState.status === 'error' ? <XCircle size={18} /> : <Loader2 size={18} className="animate-spin" />}
                                        {testState.message}
                                    </div>
                                )}

                                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <button onClick={logout} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
                                        Logout
                                    </button>
                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        <button onClick={clearConfig} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50">
                                            Hapus Override
                                        </button>
                                        <button onClick={testEngine} disabled={testState.status === 'loading'} className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60">
                                            {testState.status === 'loading' ? <Loader2 size={17} className="animate-spin" /> : <TestTube2 size={17} />}
                                            Uji AI
                                        </button>
                                        <button onClick={saveConfig} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-700">
                                            <Save size={17} />
                                            Simpan & Aktifkan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminAISettings;
