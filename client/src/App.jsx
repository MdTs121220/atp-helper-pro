import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import IdentityForm from './components/IdentityForm';
import CPAnalysis from './components/CPAnalysis';
import ATPDraggableList from './components/ATPDraggableList';
import ATPTableProfessional from './components/ATPTableProfessional';
import MagicBoxInput from './components/MagicBoxInput';
import ExportMenu from './components/ExportMenu';
import LandingPage from './components/LandingPage';
import SecurityCheck from './components/SecurityCheck';
import { Sparkles } from 'lucide-react';

function App() {
  const [view, setView] = useState('landing');
  const [mode, setMode] = useState('magic'); // 'classic' or 'magic'
  const [identity, setIdentity] = useState(() => {
    const savedIdentity = localStorage.getItem('atp_identity');
    return savedIdentity ? JSON.parse(savedIdentity) : {
      namaGuru: '',
      sekolah: '',
      mapel: '',
      fase: '',
      kondisi: 'lengkap'
    };
  });

  const [tpList, setTpList] = useState(() => {
    const savedTpList = localStorage.getItem('atp_list');
    return savedTpList ? JSON.parse(savedTpList) : [];
  });
  const [analysisResult, setAnalysisResult] = useState(null);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('atp_identity', JSON.stringify(identity));
  }, [identity]);

  useEffect(() => {
    localStorage.setItem('atp_list', JSON.stringify(tpList));
  }, [tpList]);

  const handleIdentityChange = (name, value) => {
    setIdentity(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTP = (newTP) => {
    const phasePrefix = identity.fase || 'X';
    const nextIndex = tpList.length + 1;
    const code = `${phasePrefix}.${nextIndex}`;

    setTpList(prev => [...prev, { ...newTP, code }]);
  };

  // Magic Analysis Handler
  const handleMagicAnalysis = (result) => {
    setAnalysisResult(result);

    if (result.metadata?.fase || result.metadata?.mapel) {
      setIdentity(prev => ({
        ...prev,
        fase: result.metadata?.fase || prev.fase,
        mapel: result.metadata?.mapel || prev.mapel
      }));
    }

    // Check if result has the new structure (data_tp) or legacy structure (elemenList)
    if (result.data_tp) {
      const newTPs = result.data_tp.map((item, index) => ({
        id: Date.now() + index,
        code: item.kode || `${identity.fase || 'X'}.${index + 1}`,
        text: item.tp,
        materi: item.lingkup_materi,
        alokasiWaktu: item.jp,
        assessment: item.kktp || item.indikator,
        asesmenFormatif: item.asesmen_formatif,
        asesmenSumatif: item.asesmen_sumatif,
        alasanUrutan: item.alasan_urutan,
        pengalamanBelajar: item.pengalaman_belajar,
        level_kognitif: item.level_kognitif,
        elementName: item.elemen || 'Umum',
        subElementName: item.sub_elemen || '',
        kompetensi: item.kompetensi || '',
        konten: item.konten || '',
        kko: item.kompetensi || '',
        dateCreated: Date.now()
      }));

      setTpList(newTPs);
    } else {
      // --- LEGACY/OFFLINE STRUCTURE HANDLER ---

      // 1. Update Identity if detected
      if (result.fase || result.mataPelajaran) {
        setIdentity(prev => ({
          ...prev,
          fase: result.fase || prev.fase,
          mapel: result.mataPelajaran || prev.mapel
        }));
      }

      // 2. Clear old TPs and add new ones from all elements
      const newTPs = [];
      if (result.elemenList) {
        result.elemenList.forEach(element => {
          element.tps.forEach(tp => {
            newTPs.push({
              ...tp,
              elementName: element.name,
              // Ensure code is unique or re-indexed later
              dateCreated: Date.now()
            });
          });
        });
      }

      // Re-index codes globally for the table
      const reindexedTPs = newTPs.map((tp, index) => ({
        ...tp,
        code: `${result.fase || identity.fase || 'X'}.${index + 1}`
      }));

      setTpList(reindexedTPs);
    }
  };

  const handleReorderTP = (newOrder) => {
    const updatedOrder = newOrder.map((item, index) => ({
      ...item,
      code: `${identity.fase || 'X'}.${index + 1}`
    }));
    setTpList(updatedOrder);
  };

  const handleDeleteTP = (id) => {
    const newList = tpList.filter(item => item.id !== id);
    const reindexedList = newList.map((item, index) => ({
      ...item,
      code: `${identity.fase || 'X'}.${index + 1}`
    }));
    setTpList(reindexedList);
  };

  const handleUpdateTP = (id, newValues, value) => {
    if (typeof newValues === 'object') {
      setTpList(prev => prev.map(item => item.id === id ? { ...item, ...newValues } : item));
    } else {
      setTpList(prev => prev.map(item => item.id === id ? { ...item, [newValues]: value } : item));
    }
  };

  const handleStart = () => { setView('security'); };
  const handleSecuritySuccess = () => { setView('app'); };
  const handleSecurityCancel = () => { setView('landing'); };

  if (view === 'landing') return <LandingPage onStart={handleStart} />;

  return (
    <>
      {view === 'security' && (
        <SecurityCheck onSuccess={handleSecuritySuccess} onCancel={handleSecurityCancel} />
      )}

      {view === 'app' && (
        <Layout onLogout={() => setView('landing')}>
          <div className="animate-fade-in pb-24 relative">

            {/* Dashboard Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  Penyusunan ATP
                </h2>
                <p className="text-slate-500 mt-1">
                  Asisten Cerdas Penyusunan Alur Tujuan Pembelajaran.
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-slate-100 p-1 rounded-full">
                <button
                  onClick={() => setMode('classic')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mode === 'classic' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Manual / Klasik
                </button>
                <button
                  onClick={() => setMode('magic')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center ${mode === 'magic' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Sparkles size={12} className="mr-1" />
                  Magic Assistant
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* LEFT COLUMN: Input Panel */}
              <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                <IdentityForm data={identity} onChange={handleIdentityChange} />

                {mode === 'classic' ? (
                  <CPAnalysis onAddTP={handleAddTP} kondisi={identity.kondisi} />
                ) : (
                  <MagicBoxInput onAnalyze={handleMagicAnalysis} identity={identity} />
                )}
              </div>

              {/* RIGHT COLUMN: Result Preview */}
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px]">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">
                      {mode === 'magic' ? 'Hasil Analisis AI & Preview ATP' : 'Draf Alur Tujuan Pembelajaran'}
                    </h3>
                    <div className="flex space-x-2">
                      <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                      <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                      <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                    </div>
                  </div>

                  {mode === 'magic' && tpList.length > 0 ? (
                    <>
                      {analysisResult && (
                        <div className="px-6 py-4 border-b border-slate-100 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-500">Analisis CP</p>
                              <p className="mt-1 text-xs text-indigo-950 leading-relaxed">{analysisResult.analisis_kurikulum}</p>
                            </div>
                            <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">Logika ATP</p>
                              <p className="mt-1 text-xs text-emerald-950 leading-relaxed">{analysisResult.logika_alur || 'Urutan TP disusun dari prasyarat menuju penerapan dan refleksi.'}</p>
                            </div>
                            <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                              <p className="text-[10px] font-bold uppercase tracking-wide text-amber-600">Validasi Guru</p>
                              <p className="mt-1 text-xs text-amber-950 leading-relaxed">
                                {(analysisResult.catatan_validasi || []).slice(0, 2).join(' ') || 'Sesuaikan JP, konteks kelas, dan KKTP dengan kondisi satuan pendidikan.'}
                              </p>
                            </div>
                          </div>
                          {analysisResult.analisis_cp?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.analisis_cp.map((item, index) => (
                                <span key={`${item.elemen}-${index}`} className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-600">
                                  {item.elemen || 'Umum'}{item.sub_elemen ? ` / ${item.sub_elemen}` : ''}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      <ATPTableProfessional
                        data={tpList}
                        onUpdateTP={handleUpdateTP}
                        onDeleteTP={handleDeleteTP}
                      />
                    </>
                  ) : (
                    <ATPDraggableList
                      items={tpList}
                      onReorder={handleReorderTP}
                      onDelete={handleDeleteTP}
                      onUpdate={handleUpdateTP}
                    />
                  )}
                </div>
              </div>

            </div>

            <ExportMenu identity={identity} tpList={tpList} />

          </div>
        </Layout>
      )}
    </>
  );
}

export default App;
