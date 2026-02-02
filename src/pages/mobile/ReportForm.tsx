import React, { useState, useEffect } from 'react';
import { Send, Camera, MapPin, Cloud, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../../components/ui';
import { getTasks } from '../../services/taskService';
import { getLandBlocks } from '../../services/landBlockService';
import { createReport } from '../../services/reportService';
import type { Task, LandBlock } from '../../types/database';
import { cn } from '../../lib/utils';

interface ReportFormData {
    taskId: string;
    content: string;
    weatherCondition: string;
    issues: string[];
}

const weatherOptions = [
    { value: 'sunny', label: '☀️ Cerah', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'cloudy', label: '☁️ Berawan', color: 'bg-gray-100 text-gray-700' },
    { value: 'rainy', label: '🌧️ Hujan', color: 'bg-blue-100 text-blue-700' },
    { value: 'stormy', label: '⛈️ Badai', color: 'bg-purple-100 text-purple-700' },
];

const commonIssues = [
    'Hama terdeteksi',
    'Kekurangan air',
    'Genangan berlebih',
    'Tanaman layu',
    'Pupuk kurang',
    'Alat rusak',
];

const ReportForm: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [landBlocks, setLandBlocks] = useState<LandBlock[]>([]);

    const [formData, setFormData] = useState<ReportFormData>({
        taskId: '',
        content: '',
        weatherCondition: '',
        issues: [],
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [tasksData, landBlocksData] = await Promise.all([
                    getTasks(),
                    getLandBlocks(),
                ]);
                // Filter to show only non-completed tasks
                setTasks(tasksData.filter((t) => t.status !== 'completed'));
                setLandBlocks(landBlocksData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const selectedTask = tasks.find((t) => t.id === formData.taskId);
    const selectedLandBlock = selectedTask && selectedTask.land_block_id
        ? landBlocks.find((b) => b.id === selectedTask.land_block_id) || null
        : null;

    const handleIssueToggle = (issue: string) => {
        setFormData((prev) => ({
            ...prev,
            issues: prev.issues.includes(issue)
                ? prev.issues.filter((i) => i !== issue)
                : [...prev.issues, issue],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await createReport({
                task_id: formData.taskId || null,
                user_id: null, // Would come from auth in real app
                land_block_id: selectedTask?.land_block_id || null,
                content: formData.content,
                weather_condition: formData.weatherCondition || null,
                issues: formData.issues,
                images: [],
            });

            setIsSubmitted(true);

            // Reset after showing success
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({
                    taskId: '',
                    content: '',
                    weatherCondition: '',
                    issues: [],
                });
            }, 3000);
        } catch (error) {
            console.error('Error submitting report:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-4 animate-bounce">
                    <CheckCircle className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Laporan Terkirim!</h2>
                <p className="text-gray-500">Terima kasih atas laporannya.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Buat Laporan</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Laporkan progress atau kendala di lapangan
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Task Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pilih Tugas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {tasks.map((task) => {
                                const landBlock = task.land_block_id
                                    ? landBlocks.find((b) => b.id === task.land_block_id)
                                    : null;
                                const isSelected = formData.taskId === task.id;

                                return (
                                    <button
                                        key={task.id}
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({ ...prev, taskId: task.id }))
                                        }
                                        className={cn(
                                            'w-full p-3 rounded-xl text-left transition-all',
                                            isSelected
                                                ? 'bg-primary-50 border-2 border-primary-500 shadow-sm'
                                                : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                        )}
                                    >
                                        <p className="font-medium text-gray-900 line-clamp-1">
                                            {task.title}
                                        </p>
                                        {landBlock && (
                                            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                                                <MapPin className="w-3 h-3" />
                                                <span>{landBlock.name}</span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}

                            {tasks.length === 0 && (
                                <p className="text-center text-gray-500 py-4">
                                    Tidak ada tugas aktif
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Weather Condition */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Cloud className="w-5 h-5 text-sky-500" />
                            Kondisi Cuaca
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            {weatherOptions.map((weather) => (
                                <button
                                    key={weather.value}
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            weatherCondition: weather.value,
                                        }))
                                    }
                                    className={cn(
                                        'p-3 rounded-xl text-center font-medium transition-all',
                                        formData.weatherCondition === weather.value
                                            ? cn(weather.color, 'ring-2 ring-offset-2 ring-primary-500')
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    )}
                                >
                                    {weather.label}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Report Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Deskripsi Laporan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            value={formData.content}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, content: e.target.value }))
                            }
                            placeholder="Tuliskan detail laporan Anda di sini..."
                            rows={4}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />

                        {/* Photo Upload Placeholder */}
                        <button
                            type="button"
                            className="mt-3 w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors flex items-center justify-center gap-2"
                        >
                            <Camera className="w-5 h-5" />
                            <span className="text-sm font-medium">Tambah Foto</span>
                        </button>
                    </CardContent>
                </Card>

                {/* Issues */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            Kendala (Opsional)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {commonIssues.map((issue) => (
                                <button
                                    key={issue}
                                    type="button"
                                    onClick={() => handleIssueToggle(issue)}
                                    className={cn(
                                        'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                                        formData.issues.includes(issue)
                                            ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-500'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    )}
                                >
                                    {issue}
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isSubmitting}
                    disabled={!formData.taskId || !formData.content}
                    rightIcon={<Send className="w-4 h-4" />}
                >
                    Kirim Laporan
                </Button>
            </form>
        </div>
    );
};

export default ReportForm;
