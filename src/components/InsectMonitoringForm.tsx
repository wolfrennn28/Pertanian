import React, { useState } from 'react';
import { X, Bug, AlertTriangle, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button, Card } from './ui';
import { createInsectMonitoring } from '../services/monitoringService';
import type { LandBlock } from '../types/database';
import { cn } from '../lib/utils';

interface InsectMonitoringFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    landBlocks: LandBlock[];
}

interface FormData {
    land_block_id: string;
    week_number: string;
    intensitas_serangan: string;
    serangga_ditemukan: string[];
    penyakit_ditemukan: string[];
    notes: string;
}

const commonInsects = [
    'Wereng Coklat', 'Wereng Hijau', 'Penggerek Batang', 'Walang Sangit',
    'Kepik Hijau', 'Ulat Grayak', 'Tikus Sawah', 'Keong Mas'
];

const commonDiseases = [
    'Blas', 'Hawar Daun Bakteri', 'Tungro', 'Busuk Batang',
    'Bercak Daun', 'Kerdil Rumput', 'Kerdil Kuning'
];

const InsectMonitoringForm: React.FC<InsectMonitoringFormProps> = ({ isOpen, onClose, onSuccess, landBlocks }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
    const [newInsect, setNewInsect] = useState('');
    const [newDisease, setNewDisease] = useState('');

    const [formData, setFormData] = useState<FormData>({
        land_block_id: '',
        week_number: '',
        intensitas_serangan: '',
        serangga_ditemukan: [],
        penyakit_ditemukan: [],
        notes: '',
    });

    const addInsect = (insect: string) => {
        if (insect && !formData.serangga_ditemukan.includes(insect)) {
            setFormData((prev) => ({
                ...prev,
                serangga_ditemukan: [...prev.serangga_ditemukan, insect],
            }));
        }
        setNewInsect('');
    };

    const removeInsect = (insect: string) => {
        setFormData((prev) => ({
            ...prev,
            serangga_ditemukan: prev.serangga_ditemukan.filter((i) => i !== insect),
        }));
    };

    const addDisease = (disease: string) => {
        if (disease && !formData.penyakit_ditemukan.includes(disease)) {
            setFormData((prev) => ({
                ...prev,
                penyakit_ditemukan: [...prev.penyakit_ditemukan, disease],
            }));
        }
        setNewDisease('');
    };

    const removeDisease = (disease: string) => {
        setFormData((prev) => ({
            ...prev,
            penyakit_ditemukan: prev.penyakit_ditemukan.filter((d) => d !== disease),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const result = await createInsectMonitoring({
                land_block_id: formData.land_block_id,
                week_number: parseInt(formData.week_number),
                intensitas_serangan: formData.intensitas_serangan ? parseFloat(formData.intensitas_serangan) : null,
                serangga_ditemukan: formData.serangga_ditemukan.length > 0 ? formData.serangga_ditemukan : null,
                penyakit_ditemukan: formData.penyakit_ditemukan.length > 0 ? formData.penyakit_ditemukan : null,
                notes: formData.notes || null,
            });

            if (result) {
                setSubmitResult({
                    success: true,
                    message: 'Data monitoring serangga berhasil disimpan!',
                });
                setTimeout(() => {
                    onSuccess?.();
                    onClose();
                    setSubmitResult(null);
                    setFormData({
                        land_block_id: '',
                        week_number: '',
                        intensitas_serangan: '',
                        serangga_ditemukan: [],
                        penyakit_ditemukan: [],
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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <Card className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Monitoring Serangga</h2>
                        <p className="text-sm text-gray-500">Pengamatan hama & penyakit (7 hari sekali)</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Land Block */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Lahan *</label>
                        <select
                            value={formData.land_block_id}
                            onChange={(e) => setFormData((prev) => ({ ...prev, land_block_id: e.target.value }))}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                            required
                        >
                            <option value="">-- Pilih Lahan --</option>
                            {landBlocks.map((block) => (
                                <option key={block.id} value={block.id}>{block.name} ({block.crop_type})</option>
                            ))}
                        </select>
                    </div>

                    {/* Week Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Minggu Ke- *</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.week_number}
                            onChange={(e) => setFormData((prev) => ({ ...prev, week_number: e.target.value }))}
                            placeholder="1"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                            required
                        />
                    </div>

                    {/* Attack Intensity */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <AlertTriangle className="w-4 h-4 inline-block mr-1" />
                            Intensitas Serangan (%)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={formData.intensitas_serangan}
                            onChange={(e) => setFormData((prev) => ({ ...prev, intensitas_serangan: e.target.value }))}
                            placeholder="0.0"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                        />
                    </div>

                    {/* Insects Found */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Bug className="w-4 h-4 inline-block mr-1" />
                            Serangga yang Ditemukan
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.serangga_ditemukan.map((insect) => (
                                <span key={insect} className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                                    {insect}
                                    <button type="button" onClick={() => removeInsect(insect)} className="hover:text-amber-900">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={newInsect}
                                onChange={(e) => setNewInsect(e.target.value)}
                                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                            >
                                <option value="">Pilih serangga...</option>
                                {commonInsects.filter(i => !formData.serangga_ditemukan.includes(i)).map((insect) => (
                                    <option key={insect} value={insect}>{insect}</option>
                                ))}
                            </select>
                            <Button type="button" variant="outline" size="sm" onClick={() => addInsect(newInsect)}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Diseases Found */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <AlertTriangle className="w-4 h-4 inline-block mr-1" />
                            Penyakit yang Ditemukan
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.penyakit_ditemukan.map((disease) => (
                                <span key={disease} className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                    {disease}
                                    <button type="button" onClick={() => removeDisease(disease)} className="hover:text-red-900">
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={newDisease}
                                onChange={(e) => setNewDisease(e.target.value)}
                                className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                            >
                                <option value="">Pilih penyakit...</option>
                                {commonDiseases.filter(d => !formData.penyakit_ditemukan.includes(d)).map((disease) => (
                                    <option key={disease} value={disease}>{disease}</option>
                                ))}
                            </select>
                            <Button type="button" variant="outline" size="sm" onClick={() => addDisease(newDisease)}>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                            placeholder="Catatan tambahan..."
                            rows={3}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none"
                        />
                    </div>

                    {submitResult && (
                        <div className={cn('p-4 rounded-xl text-sm',
                            submitResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')}>
                            {submitResult.message}
                        </div>
                    )}

                    <div className="flex gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
                        <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting} disabled={!isFormValid}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Data'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default InsectMonitoringForm;
