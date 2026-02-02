import React, { useState } from 'react';
import { X, Ruler, Leaf, Sprout, Loader2 } from 'lucide-react';
import { Button, Card } from './ui';
import { createWeeklyMonitoring } from '../services/monitoringService';
import type { LandBlock } from '../types/database';
import { cn } from '../lib/utils';

interface WeeklyMonitoringFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    landBlocks: LandBlock[];
}

interface FormData {
    land_block_id: string;
    week_number: string;
    tinggi_tanaman: string;
    jumlah_anakan: string;
    jumlah_daun: string;
    jumlah_anakan_produktif: string;
    notes: string;
}

const WeeklyMonitoringForm: React.FC<WeeklyMonitoringFormProps> = ({ isOpen, onClose, onSuccess, landBlocks }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    const [formData, setFormData] = useState<FormData>({
        land_block_id: '',
        week_number: '',
        tinggi_tanaman: '',
        jumlah_anakan: '',
        jumlah_daun: '',
        jumlah_anakan_produktif: '',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const result = await createWeeklyMonitoring({
                land_block_id: formData.land_block_id,
                week_number: parseInt(formData.week_number),
                tinggi_tanaman: formData.tinggi_tanaman ? parseFloat(formData.tinggi_tanaman) : null,
                jumlah_anakan: formData.jumlah_anakan ? parseInt(formData.jumlah_anakan) : null,
                jumlah_daun: formData.jumlah_daun ? parseInt(formData.jumlah_daun) : null,
                jumlah_anakan_produktif: formData.jumlah_anakan_produktif ? parseInt(formData.jumlah_anakan_produktif) : null,
                notes: formData.notes || null,
            });

            if (result) {
                setSubmitResult({
                    success: true,
                    message: 'Data monitoring mingguan berhasil disimpan!',
                });
                setTimeout(() => {
                    onSuccess?.();
                    onClose();
                    setSubmitResult(null);
                    setFormData({
                        land_block_id: '',
                        week_number: '',
                        tinggi_tanaman: '',
                        jumlah_anakan: '',
                        jumlah_daun: '',
                        jumlah_anakan_produktif: '',
                        notes: '',
                    });
                }, 1500);
            } else {
                setSubmitResult({
                    success: false,
                    message: 'Gagal menyimpan data. Silakan coba lagi.',
                });
            }
        } catch (error) {
            setSubmitResult({
                success: false,
                message: 'Gagal menyimpan data. Silakan coba lagi.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.land_block_id !== '' && formData.week_number !== '';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <Card className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Monitoring Mingguan</h2>
                        <p className="text-sm text-gray-500">Pengukuran tanaman (7 hari sekali)</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Land Block */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pilih Lahan *
                        </label>
                        <select
                            value={formData.land_block_id}
                            onChange={(e) => setFormData((prev) => ({ ...prev, land_block_id: e.target.value }))}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        >
                            <option value="">-- Pilih Lahan --</option>
                            {landBlocks.map((block) => (
                                <option key={block.id} value={block.id}>
                                    {block.name} ({block.crop_type})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Week Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minggu Ke- *
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.week_number}
                            onChange={(e) => setFormData((prev) => ({ ...prev, week_number: e.target.value }))}
                            placeholder="1"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Plant Height */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Ruler className="w-4 h-4 inline-block mr-1" />
                            Tinggi Tanaman (cm)
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.tinggi_tanaman}
                            onChange={(e) => setFormData((prev) => ({ ...prev, tinggi_tanaman: e.target.value }))}
                            placeholder="0.0"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Number of Tillers */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Sprout className="w-4 h-4 inline-block mr-1" />
                            Jumlah Anakan
                        </label>
                        <input
                            type="number"
                            value={formData.jumlah_anakan}
                            onChange={(e) => setFormData((prev) => ({ ...prev, jumlah_anakan: e.target.value }))}
                            placeholder="0"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Number of Leaves */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Leaf className="w-4 h-4 inline-block mr-1" />
                            Jumlah Daun
                        </label>
                        <input
                            type="number"
                            value={formData.jumlah_daun}
                            onChange={(e) => setFormData((prev) => ({ ...prev, jumlah_daun: e.target.value }))}
                            placeholder="0"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Productive Tillers */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Sprout className="w-4 h-4 inline-block mr-1" />
                            Jumlah Anakan Produktif
                        </label>
                        <input
                            type="number"
                            value={formData.jumlah_anakan_produktif}
                            onChange={(e) => setFormData((prev) => ({ ...prev, jumlah_anakan_produktif: e.target.value }))}
                            placeholder="0"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Catatan
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                            placeholder="Catatan tambahan..."
                            rows={3}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Submit Result */}
                    {submitResult && (
                        <div
                            className={cn(
                                'p-4 rounded-xl text-sm',
                                submitResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
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
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Data'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default WeeklyMonitoringForm;
