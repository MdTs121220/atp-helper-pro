import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ExportMenu = ({ identity, tpList }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isDataEmpty = tpList.length === 0;

    // Helper to format data structure
    const getFormattedData = () => {
        return tpList.map((tp, index) => ({
            no: index + 1,
            kode: tp.code || `${identity.fase || 'X'}.${index + 1}`,
            tujuanPembelajaran: tp.text,
            lingkupMateri: tp.materi || tp.material || '-', // Handle both keys
            alokasiWaktu: tp.alokasiWaktu || '2 JP',
            elemen: tp.elementName || 'Umum',
            subElemen: tp.subElementName || '',
            pengalamanBelajar: tp.pengalamanBelajar || '',
            kktp: tp.assessment || '-',
            asesmenFormatif: tp.asesmenFormatif || '-',
            asesmenSumatif: tp.asesmenSumatif || '-',
            alasanUrutan: tp.alasanUrutan || '-'
        }));
    };

    const handleExportExcel = () => {
        if (isDataEmpty) return;
        try {
            const workbook = XLSX.utils.book_new();

            const identityData = [
                ['IDENTITAS PERANGKAT AJAR'],
                ['Nama Guru', identity.namaGuru],
                ['Satuan Pendidikan', identity.sekolah],
                ['Mata Pelajaran', identity.mapel],
                ['Fase', identity.fase],
                ['Kondisi Sarpras', identity.kondisi === 'terbatas' ? 'Terbatas (Perlu Penyesuaian)' : 'Lengkap'],
                [''],
                ['ALUR TUJUAN PEMBELAJARAN (ATP)']
            ];

            const tableHeader = [['No', 'Kode TP', 'Elemen', 'Sub Elemen', 'Tujuan Pembelajaran', 'Lingkup Materi', 'JP', 'Pengalaman Belajar', 'KKTP', 'Asesmen Formatif', 'Asesmen Sumatif', 'Alasan Urutan']];
            const tableBody = getFormattedData().map(item => [
                item.no,
                item.kode,
                item.elemen,
                item.subElemen,
                item.tujuanPembelajaran,
                item.lingkupMateri,
                item.alokasiWaktu,
                item.pengalamanBelajar,
                item.kktp,
                item.asesmenFormatif,
                item.asesmenSumatif,
                item.alasanUrutan
            ]);

            const worksheet = XLSX.utils.aoa_to_sheet([...identityData, ...tableHeader, ...tableBody]);

            // Adjusted widths
            const wscols = [
                { wch: 5 },  // No
                { wch: 10 }, // Kode
                { wch: 22 }, // Elemen
                { wch: 22 }, // Sub Elemen
                { wch: 50 }, // TP
                { wch: 25 }, // Materi
                { wch: 8 },  // JP
                { wch: 18 }, // Pengalaman
                { wch: 35 }, // KKTP
                { wch: 35 }, // Formatif
                { wch: 35 }, // Sumatif
                { wch: 35 }  // Urutan
            ];
            worksheet['!cols'] = wscols;

            XLSX.utils.book_append_sheet(workbook, worksheet, 'ATP');
            XLSX.writeFile(workbook, `ATP_${identity.mapel}_${identity.fase}.xlsx`);
            setIsOpen(false);
        } catch (error) {
            console.error("Excel Export Failed:", error);
            alert("Gagal mengunduh Excel. Silakan coba lagi.");
        }
    };

    const handleExportPDF = () => {
        if (isDataEmpty) return;
        try {
            const doc = new jsPDF({ orientation: 'landscape' }); // Landscape for more space

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('ALUR TUJUAN PEMBELAJARAN (ATP)', 148, 15, { align: 'center' });

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            let yPos = 25;
            const lineHeight = 5;

            doc.text(`Nama Guru: ${identity.namaGuru}`, 14, yPos); yPos += lineHeight;
            doc.text(`Satuan Pendidikan: ${identity.sekolah}`, 14, yPos); yPos += lineHeight;
            doc.text(`Mata Pelajaran: ${identity.mapel}`, 14, yPos); yPos += lineHeight;
            doc.text(`Fase: ${identity.fase}`, 14, yPos); yPos += lineHeight;

            autoTable(doc, {
                startY: yPos + 10,
                head: [['No', 'Kode', 'Elemen', 'Tujuan Pembelajaran', 'Materi', 'JP', 'KKTP', 'Asesmen', 'Urutan']],
                body: getFormattedData().map(item => [
                    item.no,
                    item.kode,
                    item.subElemen ? `${item.elemen} / ${item.subElemen}` : item.elemen,
                    item.tujuanPembelajaran,
                    item.lingkupMateri,
                    item.alokasiWaktu,
                    item.kktp,
                    `Formatif: ${item.asesmenFormatif}\nSumatif: ${item.asesmenSumatif}`,
                    item.alasanUrutan
                ]),
                theme: 'grid',
                headStyles: {
                    fillColor: [79, 70, 229],
                    textColor: 255,
                    fontSize: 9,
                    halign: 'center',
                    valign: 'middle'
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 4,
                    valign: 'top', // Better for multi-line
                    overflow: 'linebreak'
                },
                columnStyles: {
                    0: { cellWidth: 10, halign: 'center' },
                    1: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
                    2: { cellWidth: 34 },
                    3: { cellWidth: 58 },
                    4: { cellWidth: 32 },
                    5: { cellWidth: 14, halign: 'center' },
                    6: { cellWidth: 42 },
                    7: { cellWidth: 50 },
                    8: { cellWidth: 36 }
                },
                didDrawPage: function () {
                    doc.setFontSize(8);
                    doc.text('Dicetak otomatis dari ATP Helper Pro', 14, doc.internal.pageSize.height - 10);
                }
            });

            doc.save(`ATP_${identity.mapel}_${identity.fase}.pdf`);
            setIsOpen(false);
        } catch (error) {
            console.error("PDF Export Failed:", error);
            alert("Gagal mengunduh PDF. Cek console untuk detail.");
        }
    };

    const handleExportTXT = () => {
        if (isDataEmpty) return;
        let content = `ALUR TUJUAN PEMBELAJARAN (ATP)\n\nNama Guru: ${identity.namaGuru}\nSatuan Pendidikan: ${identity.sekolah}\nMata Pelajaran: ${identity.mapel}\nFase: ${identity.fase}\nKondisi: ${identity.kondisi}\n\nDaftar TP:\n----------\n`;
        getFormattedData().forEach(item => {
            content += `[${item.kode}] - ${item.tujuanPembelajaran}\n`;
            content += `   Elemen: ${item.elemen}${item.subElemen ? ` / ${item.subElemen}` : ''}\n`;
            content += `   Materi: ${item.lingkupMateri} | Waktu: ${item.alokasiWaktu} | Pengalaman: ${item.pengalamanBelajar || '-'}\n`;
            content += `   KKTP: ${item.kktp}\n`;
            content += `   Formatif: ${item.asesmenFormatif}\n`;
            content += `   Sumatif: ${item.asesmenSumatif}\n`;
            content += `   Alasan Urutan: ${item.alasanUrutan}\n\n`;
        });
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; link.download = `ATP_${identity.mapel}_${identity.fase}.txt`; link.click(); URL.revokeObjectURL(url);
        setIsOpen(false);
    };

    if (isDataEmpty) return null;

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-3">
            {/* Expanded Options */}
            {isOpen && (
                <div className="flex flex-col space-y-3 mb-2 animate-slide-up">
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center justify-end group"
                    >
                        <span className="bg-white px-3 py-1 rounded-lg shadow-sm text-xs font-bold text-slate-600 mr-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Unduh Excel (.xlsx)
                        </span>
                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-emerald-600 transition-colors">
                            <FileSpreadsheet size={20} />
                        </div>
                    </button>

                    <button
                        onClick={handleExportPDF}
                        className="flex items-center justify-end group"
                    >
                        <span className="bg-white px-3 py-1 rounded-lg shadow-sm text-xs font-bold text-slate-600 mr-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Unduh PDF (.pdf)
                        </span>
                        <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-rose-600 transition-colors">
                            <FileText size={20} />
                        </div>
                    </button>

                    <button
                        onClick={handleExportTXT}
                        className="flex items-center justify-end group"
                    >
                        <span className="bg-white px-3 py-1 rounded-lg shadow-sm text-xs font-bold text-slate-600 mr-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Unduh Text (.txt)
                        </span>
                        <div className="w-12 h-12 bg-slate-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-slate-600 transition-colors">
                            <File size={20} />
                        </div>
                    </button>
                </div>
            )}

            {/* Main FAB Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 ${isOpen ? 'bg-slate-800 rotate-45' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
                <Download size={28} className="text-white" />
            </button>
        </div>
    );
};

export default ExportMenu;
