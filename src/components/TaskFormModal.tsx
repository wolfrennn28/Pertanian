import React, { useState, useEffect } from 'react';
import { X, Send, Clock, Bell, Calendar, MapPin, Users, AlertTriangle, Loader2 } from 'lucide-react';
import { Button, Card } from './ui';
import { getFarmers } from '../services/userService';
import { getLandBlocks } from '../services/landBlockService';
import { createTaskWithNotification } from '../services/notificationService';
import type { User, LandBlock, TaskType } from '../types/database';
import { cn } from '../lib/utils';

interface TaskFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (taskId: string) => void;
}

const taskTypes: { value: TaskType; label: string; emoji: string }[] = [
    { value: 'planting', label: 'Penanaman', emoji: '🌱' },
    { value: 'watering', label: 'Penyiraman', emoji: '💧' },
    { value: 'harvesting', label: 'Panen', emoji: '🌾' },
    { value: 'monitoring', label: 'Monitoring', emoji: '👁️' },
    { value: 'fertilizing', label: 'Pemupukan', emoji: '🧪' },
    { value: 'pest_control', label: 'Pengendalian Hama', emoji: '🐛' },
];

const priorities: { value: string; label: string; color: string }[] = [
    { value: 'low', label: 'Rendah', color: 'bg-gray-100 text-gray-700' },
    { value: 'medium', label: 'Sedang', color: 'bg-blue-100 text-blue-700' },
    { value: 'high', label: 'Tinggi', color: 'bg-amber-100 text-amber-700' },
    { value: 'urgent', label: 'Mendesak', color: 'bg-red-100 text-red-700' },
];

interface FormData {
    title: string;
    description: string;
    type: TaskType;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    deadline: string;
    landBlockId: string;
    assignedTo: string[];
    // Notification options
    sendNotification: boolean;
    notificationType: 'now' | 'scheduled';
    scheduledAt: string;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(true);
    const [farmers, setFarmers] = useState<User[]>([]);
    const [landBlocks, setLandBlocks] = useState<LandBlock[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        type: 'planting',
        priority: 'medium',
        deadline: '',
        landBlockId: '',
        assignedTo: [],
        sendNotification: true,
        notificationType: 'now',
        scheduledAt: '',
    });

    useEffect(() => {
        if (isOpen) {
            async function fetchData() {
                setLoading(true);
                try {
                    const [farmersData, landBlocksData] = await Promise.all([
                        getFarmers(),
                        getLandBlocks(),
                    ]);
                    setFarmers(farmersData);
                    setLandBlocks(landBlocksData);
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            }
            fetchData();
        }
    }, [isOpen]);

    const handleFarmerToggle = (farmerId: string) => {
        setFormData((prev) => ({
            ...prev,
            assignedTo: prev.assignedTo.includes(farmerId)
                ? prev.assignedTo.filter((id) => id !== farmerId)
                : [...prev.assignedTo, farmerId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const result = await createTaskWithNotification(
                {
                    title: formData.title,
                    description: formData.description,
                    type: formData.type,
                    priority: formData.priority,
                    deadline: new Date(formData.deadline).toISOString(),
                    landBlockId: formData.landBlockId,
                    assignedTo: formData.assignedTo,
                },
                {
                    sendNotification: formData.sendNotification,
                    sendNow: formData.notificationType === 'now',
                    scheduledAt: formData.notificationType === 'scheduled' ? formData.scheduledAt : undefined,
                }
            );

            setSubmitResult({
                success: true,
                message: result.notificationResult
                    ? `Tugas berhasil dibuat! ${result.notificationResult.message}`
                    : 'Tugas berhasil dibuat!',
            });

            // Reset form after success
            setTimeout(() => {
                onSuccess?.(result.task.id);
                onClose();
                setSubmitResult(null);
                setFormData({
                    title: '',
                    description: '',
                    type: 'planting',
                    priority: 'medium',
                    deadline: '',
                    landBlockId: '',
                    assignedTo: [],
                    sendNotification: true,
                    notificationType: 'now',
                    scheduledAt: '',
                });
            }, 2000);
        } catch (error) {
            setSubmitResult({
                success: false,
                message: 'Gagal membuat tugas. Silakan coba lagi.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        formData.title.trim() !== '' &&
        formData.deadline !== '' &&
        formData.landBlockId !== '' &&
        formData.assignedTo.length > 0 &&
        (!formData.sendNotification ||
            formData.notificationType === 'now' ||
            (formData.notificationType === 'scheduled' && formData.scheduledAt !== ''));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <Card className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-bold text-gray-900">Buat Tugas Baru</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="p-4 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Judul Tugas *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="Contoh: Penanaman Bibit Padi"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Jelaskan detail tugas..."
                                rows={3}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        {/* Task Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jenis Tugas
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {taskTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setFormData((prev) => ({ ...prev, type: type.value }))}
                                        className={cn(
                                            'p-3 rounded-xl text-center text-sm font-medium transition-all',
                                            formData.type === type.value
                                                ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        )}
                                    >
                                        <span className="text-lg">{type.emoji}</span>
                                        <p className="mt-1">{type.label}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Prioritas
                            </label>
                            <div className="flex gap-2">
                                {priorities.map((priority) => (
                                    <button
                                        key={priority.value}
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                priority: priority.value as FormData['priority'],
                                            }))
                                        }
                                        className={cn(
                                            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                                            formData.priority === priority.value
                                                ? cn(priority.color, 'ring-2 ring-offset-1 ring-primary-500')
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        )}
                                    >
                                        {priority.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline-block mr-1" />
                                Deadline *
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.deadline}
                                onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Land Block */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline-block mr-1" />
                                Lokasi Lahan *
                            </label>
                            <select
                                value={formData.landBlockId}
                                onChange={(e) => setFormData((prev) => ({ ...prev, landBlockId: e.target.value }))}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            >
                                <option value="">Pilih lahan...</option>
                                {landBlocks.map((block) => (
                                    <option key={block.id} value={block.id}>
                                        {block.name} ({block.crop_type} - {block.area} ha)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Assigned Farmers */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="w-4 h-4 inline-block mr-1" />
                                Petani yang Ditugaskan *
                            </label>
                            {farmers.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">Belum ada petani terdaftar</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {farmers.map((farmer) => (
                                        <button
                                            key={farmer.id}
                                            type="button"
                                            onClick={() => handleFarmerToggle(farmer.id)}
                                            className={cn(
                                                'flex items-center gap-3 p-3 rounded-xl text-left transition-all',
                                                formData.assignedTo.includes(farmer.id)
                                                    ? 'bg-primary-50 border-2 border-primary-500'
                                                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                            )}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-xs font-medium">
                                                {farmer.name.split(' ').map((n) => n[0]).join('')}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{farmer.name}</p>
                                                {farmer.telegram_chat_id ? (
                                                    <p className="text-xs text-gray-500">📱 Telegram aktif</p>
                                                ) : (
                                                    <p className="text-xs text-amber-600">⚠️ Belum ada Telegram</p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Notification Options */}
                        <div className="border-t border-gray-100 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Bell className="w-4 h-4 text-primary-600" />
                                    Kirim Notifikasi Telegram
                                </label>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({ ...prev, sendNotification: !prev.sendNotification }))
                                    }
                                    className={cn(
                                        'relative w-12 h-6 rounded-full transition-colors',
                                        formData.sendNotification ? 'bg-primary-500' : 'bg-gray-200'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow',
                                            formData.sendNotification ? 'left-7' : 'left-1'
                                        )}
                                    />
                                </button>
                            </div>

                            {formData.sendNotification && (
                                <div className="space-y-4 p-4 bg-primary-50 rounded-xl">
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, notificationType: 'now' }))}
                                            className={cn(
                                                'flex-1 flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-all',
                                                formData.notificationType === 'now'
                                                    ? 'bg-primary-500 text-white shadow-md'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                            )}
                                        >
                                            <Send className="w-4 h-4" />
                                            Kirim Sekarang
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, notificationType: 'scheduled' }))}
                                            className={cn(
                                                'flex-1 flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-medium transition-all',
                                                formData.notificationType === 'scheduled'
                                                    ? 'bg-primary-500 text-white shadow-md'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                            )}
                                        >
                                            <Clock className="w-4 h-4" />
                                            Jadwalkan
                                        </button>
                                    </div>

                                    {formData.notificationType === 'scheduled' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Waktu Pengiriman
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={formData.scheduledAt}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, scheduledAt: e.target.value }))
                                                }
                                                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            />
                                        </div>
                                    )}

                                    <p className="text-xs text-primary-700 flex items-start gap-1">
                                        <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                        Notifikasi akan dikirim ke petani yang memiliki Telegram Chat ID
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Submit Result */}
                        {submitResult && (
                            <div
                                className={cn(
                                    'p-4 rounded-xl text-sm',
                                    submitResult.success
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-red-50 text-red-700'
                                )}
                            >
                                {submitResult.message}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex-1"
                                isLoading={isSubmitting}
                                disabled={!isFormValid}
                                rightIcon={formData.sendNotification ? <Bell className="w-4 h-4" /> : undefined}
                            >
                                {formData.sendNotification
                                    ? formData.notificationType === 'now'
                                        ? 'Buat & Kirim Notifikasi'
                                        : 'Buat & Jadwalkan'
                                    : 'Buat Tugas'}
                            </Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default TaskFormModal;
