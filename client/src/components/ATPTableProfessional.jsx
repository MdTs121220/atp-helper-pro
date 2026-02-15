import React, { useState } from 'react';
import { Edit2, Save, Trash2, CheckCircle, GripVertical } from 'lucide-react';

const ATPTableProfessional = ({ data, onUpdateTP, onDeleteTP }) => {
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    if (!data || data.length === 0) return null;

    const handleEditClick = (tp) => {
        setEditingId(tp.id);
        setEditValues({ ...tp });
    };

    const handleSaveClick = () => {
        onUpdateTP(editingId, editValues);
        setEditingId(null);
        setEditValues({});
    };

    const handleChange = (field, value) => {
        setEditValues(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="overflow-x-auto rounded-tl-xl rounded-bl-xl shadow-sm border border-slate-200">
            <table className="w-full text-sm text-left text-slate-600 bg-white">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-3 w-12 text-center font-semibold border-b-2 border-slate-200">No</th>
                        <th className="px-4 py-3 w-20 text-center font-semibold border-b-2 border-slate-200">Kode</th>
                        <th className="px-4 py-3 min-w-[320px] font-semibold border-b-2 border-slate-200">Tujuan Pembelajaran (TP)</th>
                        <th className="px-4 py-3 w-48 font-semibold border-b-2 border-slate-200">Lingkup Materi</th>
                        <th className="px-4 py-3 w-20 text-center font-semibold border-b-2 border-slate-200">JP</th>
                        <th className="px-4 py-3 w-48 font-semibold border-b-2 border-slate-200">Indikator Asesmen</th>
                        <th className="px-4 py-3 w-20 text-center font-semibold border-b-2 border-slate-200">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {/* Group by Element if structure exists, else flat list */}
                    {data.map((item, index) => (
                        <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">

                            {/* No */}
                            <td className="px-4 py-4 text-center font-medium text-slate-400 align-top">
                                {index + 1}
                            </td>

                            {/* Kode */}
                            <td className="px-4 py-4 font-mono text-xs text-indigo-600 font-bold align-top pt-5">
                                {item.code}
                            </td>

                            {/* TP (Rich Content) */}
                            <td className="px-4 py-4 align-top">
                                {editingId === item.id ? (
                                    <textarea
                                        className="w-full p-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                                        rows={4}
                                        value={editValues.text}
                                        onChange={(e) => handleChange('text', e.target.value)}
                                    />
                                ) : (
                                    <div className="flex flex-col h-full justify-start">
                                        <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                                            {/* Highlight KKO */}
                                            {item.kko ? (
                                                <>
                                                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded mr-1">{item.kko}</span>
                                                    {item.text.replace(item.kko, '').trim()}
                                                </>
                                            ) : (
                                                item.text
                                            )}
                                        </p>
                                        <div className="mt-2">
                                            <span className="inline-flex items-center text-[10px] uppercase font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                                                {item.elementName || "Umum"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </td>

                            {/* Materi */}
                            <td className="px-4 py-4 align-top">
                                {editingId === item.id ? (
                                    <textarea
                                        className="w-full p-2 border border-indigo-300 rounded text-xs"
                                        rows={3}
                                        value={editValues.materi}
                                        onChange={(e) => handleChange('materi', e.target.value)}
                                    />
                                ) : (
                                    <div className="bg-orange-50 text-orange-800 p-2 rounded-lg border border-orange-100 text-xs font-medium leading-relaxed whitespace-pre-wrap">
                                        {item.materi || '-'}
                                    </div>
                                )}
                            </td>

                            {/* JP */}
                            <td className="px-4 py-4 text-center align-top pt-5">
                                {editingId === item.id ? (
                                    <input
                                        className="w-full p-1 border border-indigo-300 rounded text-center text-xs"
                                        value={editValues.alokasiWaktu}
                                        onChange={(e) => handleChange('alokasiWaktu', e.target.value)}
                                    />
                                ) : (
                                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                        {item.alokasiWaktu}
                                    </span>
                                )}
                            </td>

                            {/* KKTP */}
                            <td className="px-4 py-4 align-top">
                                {editingId === item.id ? (
                                    <textarea
                                        className="w-full p-2 border border-indigo-300 rounded text-xs"
                                        rows={3}
                                        value={editValues.assessment}
                                        onChange={(e) => handleChange('assessment', e.target.value)}
                                    />
                                ) : (
                                    <div className="flex items-start text-xs text-slate-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                                        <CheckCircle size={14} className="text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="leading-relaxed whitespace-pre-wrap text-emerald-900 font-medium">{item.assessment || '-'}</span>
                                    </div>
                                )}
                            </td>

                            {/* Aksi */}
                            <td className="px-4 py-4 text-center align-top pt-4">
                                {editingId === item.id ? (
                                    <button onClick={handleSaveClick} className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg shadow-sm">
                                        <Save size={16} />
                                    </button>
                                ) : (
                                    <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditClick(item)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg border border-transparent hover:border-indigo-100">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => onDeleteTP(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ATPTableProfessional;
