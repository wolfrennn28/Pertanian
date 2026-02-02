import React, { useState } from 'react';
import { X, MapPin, Crop, Ruler, Droplet, Mountain, Loader2 } from 'lucide-react';
import { Button, Card } from './ui';
import { createLandBlock } from '../services/landBlockService';
import type { LandBlockStatus } from '../types/database';
import { cn } from '../lib/utils';

interface LandBlockFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const statusOptions: { value: LandBlockStatus; label: string }[] = [
    { value: 'preparation', label: 'Persiapan' },
    { value: 'active', label: 'Aktif' },
    { value: 'harvesting', label: 'Panen' },
    { value: 'fallow', label: 'Bera' },
];

const cropOptions = ['Padi', 'Jagung', 'Cabai', 'Kedelai', 'Tomat', 'Lainnya'];

interface FormData {
    name: string;
    lat: string;
    lng: string;
    area: string;
    crop_type: string;
    status: LandBlockStatus;
    soil_type: string;
    irrigation_type: string;
}

const LandBlockFormModal: React.FC<LandBlockFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        lat: '',
        lng: '',
        area: '',
        crop_type: 'Padi',
        status: 'preparation',
        soil_type: '',
        irrigation_type: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const result = await createLandBlock({
                name: formData.name,
                lat: parseFloat(formData.lat),
                lng: parseFloat(formData.lng),
                area: parseFloat(formData.area),
                crop_type: formData.crop_type,
                status: formData.status,
                soil_type: formData.soil_type || null,
                irrigation_type: formData.irrigation_type || null,
            });

            if (result) {
                setSubmitResult({
                    success: true,
                    message: 'Lahan berhasil ditambahkan!',
                });
                setTimeout(() => {
                    onSuccess?.();
                    onClose();
                    setSubmitResult(null);
                    setFormData({
                        name: '',
                        lat: '',
                        lng: '',
                        area: '',
                        crop_type: 'Padi',
                        status: 'preparation',
                        soil_type: '',
                        irrigation_type: '',
                    });
                }, 1500);
            } else {
                setSubmitResult({
                    success: false,
                    message: 'Gagal menambahkan lahan. Silakan coba lagi.',
                });
            }
        } catch (error) {
            setSubmitResult({
                success: false,
                message: 'Gagal menambahkan lahan. Silakan coba lagi.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        formData.name.trim() !== '' &&
        formData.lat.trim() !== '' &&
        formData.lng.trim() !== '' &&
        formData.area.trim() !== '' &&
        !isNaN(parseFloat(formData.lat)) &&
        !isNaN(parseFloat(formData.lng)) &&
        !isNaN(parseFloat(formData.area));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <Card className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <h2 className="text-xl font-bold text-gray-900">Tambah Lahan</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Lahan *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Contoh: Blok A1"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Coordinates */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline-block mr-1" />
                                Latitude *
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={formData.lat}
                                onChange={(e) => setFormData((prev) => ({ ...prev, lat: e.target.value }))}
                                placeholder="-6.123456"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Longitude *
                            </label>
                            <input
                                type="number"
                                step="any"
                                value={formData.lng}
                                onChange={(e) => setFormData((prev) => ({ ...prev, lng: e.target.value }))}
                                placeholder="106.123456"
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Ruler className="w-4 h-4 inline-block mr-1" />
                            Luas (Hektar) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.area}
                            onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
                            placeholder="0.5"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Crop Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Crop className="w-4 h-4 inline-block mr-1" />
                            Jenis Tanaman
                        </label>
                        <select
                            value={formData.crop_type}
                            onChange={(e) => setFormData((prev) => ({ ...prev, crop_type: e.target.value }))}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            {cropOptions.map((crop) => (
                                <option key={crop} value={crop}>{crop}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status Lahan
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {statusOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, status: option.value }))}
                                    className={cn(
                                        'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                                        formData.status === option.value
                                            ? 'bg-primary-500 text-white shadow-md'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    )}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Soil Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mountain className="w-4 h-4 inline-block mr-1" />
                            Jenis Tanah
                        </label>
                        <input
                            type="text"
                            value={formData.soil_type}
                            onChange={(e) => setFormData((prev) => ({ ...prev, soil_type: e.target.value }))}
                            placeholder="Contoh: Tanah Liat"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Irrigation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Droplet className="w-4 h-4 inline-block mr-1" />
                            Jenis Irigasi
                        </label>
                        <input
                            type="text"
                            value={formData.irrigation_type}
                            onChange={(e) => setFormData((prev) => ({ ...prev, irrigation_type: e.target.value }))}
                            placeholder="Contoh: Irigasi Teknis"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tambah Lahan'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default LandBlockFormModal;
