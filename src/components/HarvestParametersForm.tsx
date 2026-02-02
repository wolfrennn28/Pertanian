import React, { useState } from 'react';
import { X, Wheat, Scale, Droplets, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button, Card } from './ui';
import { createHarvestParameters } from '../services/harvestService';
import type { LandBlock } from '../types/database';
import { cn } from '../lib/utils';

interface HarvestParametersFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    landBlocks: LandBlock[];
}

interface FormData {
    land_block_id: string;
    berat_1000_butir: string;
    jumlah_bulir_per_malai: string;
    gabah_beras_per_malai: string;
    gabah_kering_panen: string;
    brangkasan_segar: string;
    brangkasan_kering: string;
    kadar_air_panen: string;
    warna_gabah: string;
    kerontokan: string;
    kerebahan: string;
    texture_nasi: string;
    kadar_amilosa: string;
    indeks_glikemik: string;
    rata_rata_hasil: string;
    ketahanan_hama: string;
    ketahanan_penyakit: string;
    potensi_hasil: string;
    bentuk_gabah: string;
    notes: string;
}

const kerontokanOptions = ['Sangat Mudah', 'Mudah', 'Sedang', 'Sulit', 'Sangat Sulit'];
const kerebahanOptions = ['Sangat Tahan', 'Tahan', 'Agak Tahan', 'Agak Rebah', 'Rebah'];
const textureOptions = ['Pulen', 'Sedang', 'Pera'];
const bentukOptions = ['Bulat', 'Sedang', 'Ramping'];
const ketahananOptions = ['Sangat Rentan', 'Rentan', 'Agak Tahan', 'Tahan', 'Sangat Tahan'];

const HarvestParametersForm: React.FC<HarvestParametersFormProps> = ({ isOpen, onClose, onSuccess, landBlocks }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>('yield');

    const [formData, setFormData] = useState<FormData>({
        land_block_id: '',
        berat_1000_butir: '',
        jumlah_bulir_per_malai: '',
        gabah_beras_per_malai: '',
        gabah_kering_panen: '',
        brangkasan_segar: '',
        brangkasan_kering: '',
        kadar_air_panen: '',
        warna_gabah: '',
        kerontokan: '',
        kerebahan: '',
        texture_nasi: '',
        kadar_amilosa: '',
        indeks_glikemik: '',
        rata_rata_hasil: '',
        ketahanan_hama: '',
        ketahanan_penyakit: '',
        potensi_hasil: '',
        bentuk_gabah: '',
        notes: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const result = await createHarvestParameters({
                land_block_id: formData.land_block_id,
                berat_1000_butir: formData.berat_1000_butir ? parseFloat(formData.berat_1000_butir) : null,
                jumlah_bulir_per_malai: formData.jumlah_bulir_per_malai ? parseInt(formData.jumlah_bulir_per_malai) : null,
                gabah_beras_per_malai: formData.gabah_beras_per_malai ? parseInt(formData.gabah_beras_per_malai) : null,
                gabah_kering_panen: formData.gabah_kering_panen ? parseFloat(formData.gabah_kering_panen) : null,
                brangkasan_segar: formData.brangkasan_segar ? parseFloat(formData.brangkasan_segar) : null,
                brangkasan_kering: formData.brangkasan_kering ? parseFloat(formData.brangkasan_kering) : null,
                kadar_air_panen: formData.kadar_air_panen ? parseFloat(formData.kadar_air_panen) : null,
                warna_gabah: formData.warna_gabah || null,
                kerontokan: formData.kerontokan || null,
                kerebahan: formData.kerebahan || null,
                texture_nasi: formData.texture_nasi || null,
                kadar_amilosa: formData.kadar_amilosa ? parseFloat(formData.kadar_amilosa) : null,
                indeks_glikemik: formData.indeks_glikemik ? parseFloat(formData.indeks_glikemik) : null,
                rata_rata_hasil: formData.rata_rata_hasil ? parseFloat(formData.rata_rata_hasil) : null,
                ketahanan_hama: formData.ketahanan_hama || null,
                ketahanan_penyakit: formData.ketahanan_penyakit || null,
                potensi_hasil: formData.potensi_hasil ? parseFloat(formData.potensi_hasil) : null,
                bentuk_gabah: formData.bentuk_gabah || null,
                notes: formData.notes || null,
            });

            if (result) {
                setSubmitResult({
                    success: true,
                    message: 'Data parameter panen berhasil disimpan!',
                });
                setTimeout(() => {
                    onSuccess?.();
                    onClose();
                    setSubmitResult(null);
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

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const SectionHeader = ({ id, title, icon: Icon }: { id: string; title: string; icon: React.ComponentType<{ className?: string }> }) => (
        <button
            type="button"
            onClick={() => toggleSection(id)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
        >
            <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Icon className="w-4 h-4" />
                {title}
            </span>
            {expandedSection === id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
    );

    const isFormValid = formData.land_block_id !== '';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <Card className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Parameter Panen</h2>
                        <p className="text-sm text-gray-500">18 parameter data hasil panen</p>
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
                                <option key={block.id} value={block.id}>{block.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Yield Section */}
                    <SectionHeader id="yield" title="Data Hasil (Yield)" icon={Wheat} />
                    {expandedSection === 'yield' && (
                        <div className="space-y-3 pl-4 border-l-2 border-primary-200">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-600">Berat 1000 Butir (gram)</label>
                                    <input type="number" step="0.01" value={formData.berat_1000_butir}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, berat_1000_butir: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Rata-rata Hasil (ton/ha)</label>
                                    <input type="number" step="0.01" value={formData.rata_rata_hasil}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, rata_rata_hasil: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Jumlah Bulir per Malai</label>
                                    <input type="number" value={formData.jumlah_bulir_per_malai}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, jumlah_bulir_per_malai: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Gabah Beras per Malai</label>
                                    <input type="number" value={formData.gabah_beras_per_malai}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, gabah_beras_per_malai: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Potensi Hasil (ton/ha)</label>
                                    <input type="number" step="0.01" value={formData.potensi_hasil}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, potensi_hasil: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Weight Section */}
                    <SectionHeader id="weight" title="Berat & Kadar Air" icon={Scale} />
                    {expandedSection === 'weight' && (
                        <div className="space-y-3 pl-4 border-l-2 border-primary-200">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-600">Gabah Kering Panen</label>
                                    <input type="number" step="0.01" value={formData.gabah_kering_panen}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, gabah_kering_panen: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Kadar Air Panen (%)</label>
                                    <input type="number" step="0.1" value={formData.kadar_air_panen}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, kadar_air_panen: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Brangkasan Segar</label>
                                    <input type="number" step="0.01" value={formData.brangkasan_segar}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, brangkasan_segar: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Brangkasan Kering</label>
                                    <input type="number" step="0.01" value={formData.brangkasan_kering}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, brangkasan_kering: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quality Section */}
                    <SectionHeader id="quality" title="Kualitas Gabah & Nasi" icon={Droplets} />
                    {expandedSection === 'quality' && (
                        <div className="space-y-3 pl-4 border-l-2 border-primary-200">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-600">Warna Gabah</label>
                                    <input type="text" value={formData.warna_gabah}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, warna_gabah: e.target.value }))}
                                        placeholder="Kuning Keemasan"
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Bentuk Gabah</label>
                                    <select value={formData.bentuk_gabah}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, bentuk_gabah: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm">
                                        <option value="">Pilih</option>
                                        {bentukOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Kerontokan</label>
                                    <select value={formData.kerontokan}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, kerontokan: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm">
                                        <option value="">Pilih</option>
                                        {kerontokanOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Kerebahan</label>
                                    <select value={formData.kerebahan}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, kerebahan: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm">
                                        <option value="">Pilih</option>
                                        {kerebahanOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Texture Nasi</label>
                                    <select value={formData.texture_nasi}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, texture_nasi: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm">
                                        <option value="">Pilih</option>
                                        {textureOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Kadar Amilosa (%)</label>
                                    <input type="number" step="0.1" value={formData.kadar_amilosa}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, kadar_amilosa: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Indeks Glikemik</label>
                                    <input type="number" step="0.1" value={formData.indeks_glikemik}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, indeks_glikemik: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Ketahanan Hama</label>
                                    <select value={formData.ketahanan_hama}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, ketahanan_hama: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm">
                                        <option value="">Pilih</option>
                                        {ketahananOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600">Ketahanan Penyakit</label>
                                    <select value={formData.ketahanan_penyakit}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, ketahanan_penyakit: e.target.value }))}
                                        className="w-full p-2 bg-gray-50 border rounded-lg text-sm">
                                        <option value="">Pilih</option>
                                        {ketahananOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Catatan</label>
                        <textarea value={formData.notes} rows={2}
                            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                            className="w-full p-2 bg-gray-50 border rounded-xl text-sm mt-1" />
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
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Parameter'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default HarvestParametersForm;
