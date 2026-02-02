import React, { useState } from 'react';
import { X, User, Mail, Phone, MessageCircle, Loader2 } from 'lucide-react';
import { Button, Card } from './ui';
import { createUser } from '../services/userService';
import { cn } from '../lib/utils';

interface FarmerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface FormData {
    name: string;
    email: string;
    phone: string;
    telegram_chat_id: string;
}

const FarmerFormModal: React.FC<FarmerFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        telegram_chat_id: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const result = await createUser({
                name: formData.name,
                email: formData.email,
                phone: formData.phone || null,
                telegram_chat_id: formData.telegram_chat_id || null,
                role: 'farmer',
            });

            if (result) {
                setSubmitResult({
                    success: true,
                    message: 'Petani berhasil ditambahkan!',
                });
                setTimeout(() => {
                    onSuccess?.();
                    onClose();
                    setSubmitResult(null);
                    setFormData({ name: '', email: '', phone: '', telegram_chat_id: '' });
                }, 1500);
            } else {
                setSubmitResult({
                    success: false,
                    message: 'Gagal menambahkan petani. Silakan coba lagi.',
                });
            }
        } catch (error) {
            setSubmitResult({
                success: false,
                message: 'Gagal menambahkan petani. Silakan coba lagi.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.name.trim() !== '' && formData.email.trim() !== '' && formData.email.includes('@');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <Card className="relative z-10 w-full max-w-md bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Tambah Petani</h2>
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
                            <User className="w-4 h-4 inline-block mr-1" />
                            Nama Lengkap *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Masukkan nama lengkap"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline-block mr-1" />
                            Email *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="contoh@email.com"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline-block mr-1" />
                            No. Telepon
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            placeholder="08xxxxxxxxxx"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    {/* Telegram */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MessageCircle className="w-4 h-4 inline-block mr-1" />
                            Telegram Chat ID
                        </label>
                        <input
                            type="text"
                            value={formData.telegram_chat_id}
                            onChange={(e) => setFormData((prev) => ({ ...prev, telegram_chat_id: e.target.value }))}
                            placeholder="ID Chat Telegram"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Untuk notifikasi via Telegram Bot</p>
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
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tambah Petani'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default FarmerFormModal;
