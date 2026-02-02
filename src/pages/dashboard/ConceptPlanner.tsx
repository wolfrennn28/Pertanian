import React, { useState, useEffect } from 'react';
import {
    CalendarDays,
    Plus,
    Filter,
    ChevronLeft,
    ChevronRight,
    Clock,
    Users,
    MapPin,
    Loader2,
} from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Button,
    Badge,
    StatusBadge,
    TaskTypeBadge,
    PriorityBadge,
} from '../../components/ui';
import TaskFormModal from '../../components/TaskFormModal';
import { getTasks } from '../../services/taskService';
import { getLandBlocks, getLandBlockById } from '../../services/landBlockService';
import { getUsers } from '../../services/userService';
import type { Task, LandBlock, User } from '../../types/database';
import { cn, formatDate } from '../../lib/utils';

// Get current week dates
const getWeekDates = (offset: number = 0) => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + 1 + offset * 7); // Start from Monday

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        weekDates.push(date);
    }
    return weekDates;
};

const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const ConceptPlanner: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [landBlocks, setLandBlocks] = useState<LandBlock[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [viewMode, setViewMode] = useState<'week' | 'list'>('week');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [tasksData, landBlocksData, usersData] = await Promise.all([
                    getTasks(),
                    getLandBlocks(),
                    getUsers(),
                ]);
                setTasks(tasksData);
                setLandBlocks(landBlocksData);
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const refreshTasks = async () => {
        const tasksData = await getTasks();
        setTasks(tasksData);
    };

    const weekDates = getWeekDates(weekOffset);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get tasks for a specific date
    const getTasksForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        return tasks.filter((task) => {
            const taskDate = new Date(task.deadline).toISOString().split('T')[0];
            return taskDate === dateStr;
        });
    };

    // Get all tasks for the week
    const getWeekTasks = () => {
        const startDate = weekDates[0];
        const endDate = weekDates[6];
        return tasks.filter((task) => {
            const taskDate = new Date(task.deadline);
            return taskDate >= startDate && taskDate <= endDate;
        });
    };

    const weekTasks = getWeekTasks();

    const getMonthYear = () => {
        const firstDate = weekDates[0];
        const lastDate = weekDates[6];
        if (firstDate.getMonth() === lastDate.getMonth()) {
            return `${monthNames[firstDate.getMonth()]} ${firstDate.getFullYear()}`;
        }
        return `${monthNames[firstDate.getMonth()]} - ${monthNames[lastDate.getMonth()]} ${lastDate.getFullYear()}`;
    };

    const getLandBlockForTask = (landBlockId: string | null) => {
        if (!landBlockId) return null;
        return landBlocks.find(b => b.id === landBlockId) || null;
    };

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Perencanaan Tugas</h1>
                    <p className="text-gray-500 mt-1">
                        Kelola dan jadwalkan tugas pertanian
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
                        Filter
                    </Button>
                    <Button
                        variant="primary"
                        leftIcon={<Plus className="w-4 h-4" />}
                        onClick={() => setIsTaskModalOpen(true)}
                    >
                        Buat Tugas
                    </Button>
                </div>
            </div>

            {/* View Toggle & Week Navigation */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                        {/* View Toggle */}
                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('week')}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                    viewMode === 'week'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                )}
                            >
                                <CalendarDays className="w-4 h-4 inline-block mr-2" />
                                Mingguan
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                    viewMode === 'list'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                )}
                            >
                                Daftar
                            </button>
                        </div>

                        {/* Week Navigation */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setWeekOffset((prev) => prev - 1)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="text-center min-w-[150px]">
                                <p className="font-semibold text-gray-900">{getMonthYear()}</p>
                                <p className="text-sm text-gray-500">
                                    {weekDates[0].getDate()} - {weekDates[6].getDate()}
                                </p>
                            </div>
                            <button
                                onClick={() => setWeekOffset((prev) => prev + 1)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setWeekOffset(0)}
                                className="ml-2"
                            >
                                Hari Ini
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {viewMode === 'week' ? (
                /* Weekly Calendar View */
                <Card>
                    <CardContent className="p-0">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b border-gray-100">
                            {weekDates.map((date, index) => {
                                const isToday = date.toDateString() === today.toDateString();
                                const isSelected = selectedDate?.toDateString() === date.toDateString();
                                const dayTasks = getTasksForDate(date);

                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            'p-4 text-center border-r border-gray-100 last:border-r-0 cursor-pointer transition-colors',
                                            isSelected && 'bg-primary-50',
                                            !isSelected && 'hover:bg-gray-50'
                                        )}
                                        onClick={() => setSelectedDate(date)}
                                    >
                                        <p className="text-sm text-gray-500 mb-1">{dayNames[index]}</p>
                                        <div
                                            className={cn(
                                                'w-10 h-10 rounded-full flex items-center justify-center mx-auto font-bold',
                                                isToday && 'bg-primary-500 text-white',
                                                !isToday && isSelected && 'bg-primary-100 text-primary-700',
                                                !isToday && !isSelected && 'text-gray-900'
                                            )}
                                        >
                                            {date.getDate()}
                                        </div>
                                        {dayTasks.length > 0 && (
                                            <Badge variant="primary" size="sm" className="mt-2">
                                                {dayTasks.length} tugas
                                            </Badge>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tasks for Week */}
                        <div className="grid grid-cols-7 min-h-[400px]">
                            {weekDates.map((date, index) => {
                                const dayTasks = getTasksForDate(date);
                                const isToday = date.toDateString() === today.toDateString();

                                return (
                                    <div
                                        key={index}
                                        className={cn(
                                            'p-2 border-r border-gray-100 last:border-r-0',
                                            isToday && 'bg-primary-50/30'
                                        )}
                                    >
                                        <div className="space-y-2">
                                            {dayTasks.map((task) => (
                                                <TaskCard key={task.id} task={task} landBlock={getLandBlockForTask(task.land_block_id)} compact />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                /* List View */
                <Card>
                    <CardContent>
                        <div className="space-y-4">
                            {weekTasks.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <CalendarDays className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className="font-medium">Tidak ada tugas minggu ini</p>
                                </div>
                            ) : (
                                weekTasks.map((task) => <TaskCard key={task.id} task={task} landBlock={getLandBlockForTask(task.land_block_id)} />)
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Task Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Ringkasan Minggu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Total Tugas</span>
                                <span className="font-bold text-gray-900">{weekTasks.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Menunggu</span>
                                <span className="font-bold text-amber-600">
                                    {weekTasks.filter((t) => t.status === 'pending').length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Dikerjakan</span>
                                <span className="font-bold text-sky-600">
                                    {weekTasks.filter((t) => t.status === 'in_progress').length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Selesai</span>
                                <span className="font-bold text-emerald-600">
                                    {weekTasks.filter((t) => t.status === 'completed').length}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Beban Kerja Petani</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {users.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center">Belum ada petani</p>
                            ) : (
                                users
                                    .filter((u) => u.role === 'farmer')
                                    .slice(0, 4)
                                    .map((farmer) => {
                                        const farmerTasks = weekTasks.filter((t) =>
                                            t.assigned_to?.includes(farmer.id)
                                        );
                                        return (
                                            <div key={farmer.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-medium">
                                                        {farmer.name.split(' ').map((n) => n[0]).join('')}
                                                    </div>
                                                    <span className="text-sm text-gray-700">{farmer.name}</span>
                                                </div>
                                                <Badge variant={farmerTasks.length > 3 ? 'warning' : 'default'}>
                                                    {farmerTasks.length} tugas
                                                </Badge>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Lahan Aktif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {landBlocks.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center">Belum ada lahan</p>
                            ) : (
                                landBlocks
                                    .filter((b) => b.status === 'active' || b.status === 'harvesting')
                                    .slice(0, 4)
                                    .map((block) => {
                                        const blockTasks = weekTasks.filter((t) => t.land_block_id === block.id);
                                        return (
                                            <div key={block.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                                                        <MapPin className="w-4 h-4 text-primary-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{block.name}</p>
                                                        <p className="text-xs text-gray-500">{block.crop_type}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="success" size="sm">
                                                    {blockTasks.length} tugas
                                                </Badge>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Task Form Modal */}
            <TaskFormModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                onSuccess={(taskId) => {
                    console.log('Task created:', taskId);
                    refreshTasks();
                }}
            />
        </div>
    );
};

interface TaskCardProps {
    task: Task;
    landBlock?: LandBlock | null;
    compact?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, landBlock, compact = false }) => {
    if (compact) {
        return (
            <div
                className={cn(
                    'p-2 rounded-lg text-xs cursor-pointer transition-all hover:shadow-md',
                    task.status === 'completed'
                        ? 'bg-emerald-100 border-l-2 border-emerald-500'
                        : task.status === 'overdue'
                            ? 'bg-red-100 border-l-2 border-red-500'
                            : task.status === 'in_progress'
                                ? 'bg-sky-100 border-l-2 border-sky-500'
                                : 'bg-amber-100 border-l-2 border-amber-500'
                )}
            >
                <p className="font-medium text-gray-900 line-clamp-2">{task.title}</p>
                {landBlock && (
                    <p className="text-gray-500 mt-1 truncate">{landBlock.name}</p>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="flex items-start gap-4">
                <div className="flex flex-col gap-2">
                    <TaskTypeBadge type={task.type} />
                    <PriorityBadge priority={task.priority} />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(task.deadline)}</span>
                        </div>
                        {landBlock && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{landBlock.name}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{task.assigned_to?.length || 0} petani</span>
                        </div>
                    </div>
                </div>
            </div>
            <StatusBadge status={task.status} />
        </div>
    );
};

export default ConceptPlanner;
