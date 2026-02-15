import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit3, Copy, Check, Clock, Box } from 'lucide-react';

const SortableRow = ({ id, tp, index, onDelete, onUpdate }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(tp.text);
    const [alokasiValue, setAlokasiValue] = useState(tp.alokasiWaktu || '2 JP');
    const [copied, setCopied] = useState(false);

    // Table row style for dragging
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        position: 'relative', // Needed for z-index
    };

    const handleSave = () => {
        onUpdate(id, 'text', editValue);
        onUpdate(id, 'alokasiWaktu', alokasiValue);
        setIsEditing(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(tp.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={`group transition-colors duration-200 ${isDragging ? 'bg-indigo-50 shadow-lg' : 'hover:bg-slate-50'
                }`}
        >
            {/* Drag Handle & No */}
            <td className="w-16 px-4 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-indigo-500 p-1 rounded hover:bg-indigo-50"
                    >
                        <GripVertical size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 w-6 text-center">
                        {index + 1}
                    </span>
                </div>
            </td>

            {/* Kode */}
            <td className="w-20 px-4 py-4 whitespace-nowrap">
                <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                    {tp.code || '-'}
                </span>
            </td>

            {/* Content (TP Text) */}
            <td className="px-4 py-4 w-full">
                {isEditing ? (
                    <div className="space-y-2">
                        <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-full text-sm border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 min-h-[60px]"
                            autoFocus
                        />
                        <div className="flex items-center space-x-2">
                            <Clock size={14} className="text-slate-400" />
                            <input
                                type="text"
                                value={alokasiValue}
                                onChange={(e) => setAlokasiValue(e.target.value)}
                                className="text-xs border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-1 w-24"
                            />
                            <button onClick={handleSave} className="ml-auto text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Simpan</button>
                            <button onClick={() => setIsEditing(false)} className="text-xs px-2 py-1 text-slate-500 hover:bg-slate-100 rounded">Batal</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed mb-1.5">{tp.text}</p>
                        <div className="flex flex-wrap gap-2">
                            {/* Badge: Mandiri vs Bantuan */}
                            {tp.competency?.toLowerCase().includes('simulasi') || tp.competency?.toLowerCase().includes('manual') ? (
                                <span className="badge badge-warning flex items-center">
                                    <Box size={10} className="mr-1" /> Adaptif
                                </span>
                            ) : (
                                <span className="badge badge-success flex items-center">
                                    <Check size={10} className="mr-1" /> Mandiri
                                </span>
                            )}

                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                {tp.material}
                            </span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200 flex items-center">
                                <Clock size={10} className="mr-1" /> {tp.alokasiWaktu}
                            </span>
                        </div>
                    </div>
                )}
            </td>

            {/* Actions */}
            <td className="px-4 py-4 whitespace-nowrap text-right">
                <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleCopy}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Salin TP"
                    >
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    >
                        <Edit3 size={14} />
                    </button>
                    <button
                        onClick={() => onDelete(id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

const ATPDraggableList = ({ items, onReorder, onDelete, onUpdate }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            onReorder(arrayMove(items, oldIndex, newIndex));
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center animate-fade-in mx-6 mt-6">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <Box size={32} className="text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">Belum ada Tujuan Pembelajaran.</p>
                <p className="text-xs text-slate-400 mt-1">Mulai generate TP melalui form di sebelah kiri.</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm mx-6 mt-6 animate-fade-in">
            <div className="overflow-x-auto">
                <table className="table-modern">
                    <thead>
                        <tr>
                            <th className="w-16 text-center">#</th>
                            <th className="w-20">Kode</th>
                            <th>Tujuan Pembelajaran</th>
                            <th className="text-right">Aksi</th>
                        </tr>
                    </thead>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map(item => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <tbody>
                                {items.map((item, index) => (
                                    <SortableRow
                                        key={item.id}
                                        id={item.id}
                                        tp={item}
                                        index={index}
                                        onDelete={onDelete}
                                        onUpdate={onUpdate}
                                    />
                                ))}
                            </tbody>
                        </SortableContext>
                    </DndContext>
                </table>
            </div>
        </div>
    );
};

export default ATPDraggableList;
