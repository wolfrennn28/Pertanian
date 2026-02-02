import React, { useState, useEffect } from 'react';
import {
    Users,
    Map,
    ClipboardList,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock,
    Leaf,
    ArrowUpRight,
    ArrowDownRight,
    Loader2,
    Plus,
    UserPlus,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, StatusBadge, Button } from '../../components/ui';
import FarmerFormModal from '../../components/FarmerFormModal';
import { getTasks, getTaskStats, type TaskStats } from '../../services/taskService';
import { getLandBlocks } from '../../services/landBlockService';
import { getFarmers, getAdmins } from '../../services/userService';
import type { Task, LandBlock, User } from '../../types/database';
import { cn, formatDate } from '../../lib/utils';

const Overview: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [landBlocks, setLandBlocks] = useState<LandBlock[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);
    const [stats, setStats] = useState<TaskStats & { totalLandBlocks: number; totalArea: number; totalFarmers: number; totalAdmins: number }>({
        totalTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        totalLandBlocks: 0,
        totalArea: 0,
        totalFarmers: 0,
        totalAdmins: 0,
    });

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [tasksData, landBlocksData, farmersData, adminsData, taskStats] = await Promise.all([
                    getTasks(),
                    getLandBlocks(),
                    getFarmers(),
                    getAdmins(),
                    getTaskStats(),
                ]);

                setTasks(tasksData);
                setLandBlocks(landBlocksData);
                setUsers([...farmersData, ...adminsData]);
                setStats({
                    ...taskStats,
                    totalLandBlocks: landBlocksData.length,
                    totalArea: landBlocksData.reduce((sum, b) => sum + b.area, 0),
                    totalFarmers: farmersData.length,
                    totalAdmins: adminsData.length,
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const statCards = [
        {
            title: 'Total Lahan',
            value: stats.totalLandBlocks,
            subtitle: `${stats.totalArea.toFixed(1)} hektar`,
            icon: <Map className="w-6 h-6" />,
            color: 'from-primary-500 to-primary-600',
            trend: '+2',
            trendUp: true,
        },
        {
            title: 'Total Petani',
            value: stats.totalFarmers,
            subtitle: `${stats.totalAdmins} admin`,
            icon: <Users className="w-6 h-6" />,
            color: 'from-sky-500 to-sky-600',
            trend: '+1',
            trendUp: true,
        },
        {
            title: 'Tugas Aktif',
            value: stats.pendingTasks + stats.inProgressTasks,
            subtitle: `${stats.completedTasks} selesai`,
            icon: <ClipboardList className="w-6 h-6" />,
            color: 'from-amber-500 to-amber-600',
            trend: '-3',
            trendUp: false,
        },
        {
            title: 'Tugas Terlambat',
            value: stats.overdueTasks,
            subtitle: 'Perlu perhatian',
            icon: <AlertTriangle className="w-6 h-6" />,
            color: 'from-red-500 to-red-600',
            trend: '+1',
            trendUp: true,
            trendBad: true,
        },
    ];

    const recentTasks = tasks.slice(0, 5);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">
                        Selamat datang kembali! Berikut ringkasan aktivitas pertanian Anda.
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsFarmerModalOpen(true)}
                    className="flex items-center gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Tambah Petani
                </Button>
            </div>

            {/* Farmer Form Modal */}
            <FarmerFormModal
                isOpen={isFarmerModalOpen}
                onClose={() => setIsFarmerModalOpen(false)}
                onSuccess={() => {
                    // Refresh data after adding farmer
                    getFarmers().then(farmersData => {
                        getAdmins().then(adminsData => {
                            setUsers([...farmersData, ...adminsData]);
                            setStats(prev => ({ ...prev, totalFarmers: farmersData.length, totalAdmins: adminsData.length }));
                        });
                    });
                }}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <Card key={stat.title} variant="elevated" className="overflow-hidden">
                        <CardContent>
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                                </div>
                                <div
                                    className={cn(
                                        'w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br shadow-lg',
                                        stat.color
                                    )}
                                >
                                    {stat.icon}
                                </div>
                            </div>

                            {/* Trend */}
                            <div className="flex items-center gap-1 mt-4">
                                {stat.trendUp ? (
                                    <ArrowUpRight
                                        className={cn(
                                            'w-4 h-4',
                                            stat.trendBad ? 'text-red-500' : 'text-emerald-500'
                                        )}
                                    />
                                ) : (
                                    <ArrowDownRight
                                        className={cn(
                                            'w-4 h-4',
                                            stat.trendBad ? 'text-emerald-500' : 'text-red-500'
                                        )}
                                    />
                                )}
                                <span
                                    className={cn(
                                        'text-sm font-medium',
                                        stat.trendUp
                                            ? stat.trendBad
                                                ? 'text-red-600'
                                                : 'text-emerald-600'
                                            : stat.trendBad
                                                ? 'text-emerald-600'
                                                : 'text-red-600'
                                    )}
                                >
                                    {stat.trend}
                                </span>
                                <span className="text-sm text-gray-500">dari bulan lalu</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Tasks */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-primary-600" />
                            Tugas Terbaru
                        </CardTitle>
                        <a
                            href="/dashboard/planner"
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Lihat Semua →
                        </a>
                    </CardHeader>
                    <CardContent>
                        {recentTasks.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <ClipboardList className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                <p>Belum ada tugas</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div
                                                className={cn(
                                                    'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                                                    task.status === 'completed'
                                                        ? 'bg-emerald-100'
                                                        : task.status === 'overdue'
                                                            ? 'bg-red-100'
                                                            : task.status === 'in_progress'
                                                                ? 'bg-sky-100'
                                                                : 'bg-amber-100'
                                                )}
                                            >
                                                {task.status === 'completed' ? (
                                                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                ) : task.status === 'overdue' ? (
                                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                                ) : (
                                                    <Clock className="w-5 h-5 text-amber-600" />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {task.title}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(task.deadline)}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge status={task.status} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Land Blocks Status */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Map className="w-5 h-5 text-primary-600" />
                            Status Lahan
                        </CardTitle>
                        <a
                            href="/dashboard/map"
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Lihat Peta →
                        </a>
                    </CardHeader>
                    <CardContent>
                        {landBlocks.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Leaf className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                <p>Belum ada lahan</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {landBlocks.map((block) => (
                                    <div
                                        key={block.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                                <Leaf className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{block.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {block.crop_type} • {block.area} ha
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge status={block.status} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Aksi Cepat</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: <ClipboardList className="w-6 h-6" />, label: 'Buat Tugas', color: 'bg-primary-100 text-primary-600' },
                            { icon: <Map className="w-6 h-6" />, label: 'Tambah Lahan', color: 'bg-sky-100 text-sky-600' },
                            { icon: <Users className="w-6 h-6" />, label: 'Tambah Petani', color: 'bg-amber-100 text-amber-600' },
                            { icon: <TrendingUp className="w-6 h-6" />, label: 'Lihat Laporan', color: 'bg-emerald-100 text-emerald-600' },
                        ].map((action) => (
                            <button
                                key={action.label}
                                className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', action.color)}>
                                    {action.icon}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Overview;
