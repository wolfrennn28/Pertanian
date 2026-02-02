import React, { useState, useEffect } from 'react';
import { Clock, MapPin, ChevronRight, Filter, Loader2 } from 'lucide-react';
import { Card, StatusBadge, PriorityBadge, TaskTypeBadge, Button } from '../../components/ui';
import { getTasks } from '../../services/taskService';
import { getLandBlocks } from '../../services/landBlockService';
import type { Task, TaskStatus, LandBlock } from '../../types/database';
import { getDaysUntil, cn } from '../../lib/utils';

const statusFilters: { value: TaskStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'in_progress', label: 'Dikerjakan' },
    { value: 'completed', label: 'Selesai' },
    { value: 'overdue', label: 'Terlambat' },
];

const TaskList: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [landBlocks, setLandBlocks] = useState<LandBlock[]>([]);
    const [activeFilter, setActiveFilter] = useState<TaskStatus | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);

    // For demo purposes, showing all tasks
    // In a real app, this would come from auth context
    // const currentUserId = null;

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [tasksData, landBlocksData] = await Promise.all([
                    getTasks(),
                    getLandBlocks(),
                ]);
                setTasks(tasksData);
                setLandBlocks(landBlocksData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Filter tasks
    const userTasks = tasks.filter(
        (task) =>
            (activeFilter === 'all' || task.status === activeFilter)
    );

    const getLandBlockForTask = (landBlockId: string | null): LandBlock | null => {
        if (!landBlockId) return null;
        return landBlocks.find(b => b.id === landBlockId) || null;
    };

    const getDeadlineColor = (deadline: string) => {
        const days = getDaysUntil(deadline);
        if (days < 0) return 'text-red-600';
        if (days <= 1) return 'text-amber-600';
        if (days <= 3) return 'text-yellow-600';
        return 'text-gray-600';
    };

    const getDeadlineText = (deadline: string) => {
        const days = getDaysUntil(deadline);
        if (days < 0) return `Terlambat ${Math.abs(days)} hari`;
        if (days === 0) return 'Hari ini';
        if (days === 1) return 'Besok';
        return `${days} hari lagi`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tugas Saya</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {userTasks.length} tugas {activeFilter !== 'all' ? `(${statusFilters.find(f => f.value === activeFilter)?.label})` : ''}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Filter className="w-4 h-4" />}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    Filter
                </Button>
            </div>

            {/* Filter Pills */}
            {showFilters && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setActiveFilter(filter.value)}
                            className={cn(
                                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                                activeFilter === filter.value
                                    ? 'bg-primary-500 text-white shadow-md'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                            )}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Task Cards */}
            <div className="space-y-3">
                {userTasks.length === 0 ? (
                    <Card className="text-center py-12">
                        <div className="text-gray-400 mb-3">
                            <Clock className="w-12 h-12 mx-auto" />
                        </div>
                        <p className="text-gray-600 font-medium">Tidak ada tugas</p>
                        <p className="text-sm text-gray-400 mt-1">
                            Semua tugas sudah selesai!
                        </p>
                    </Card>
                ) : (
                    userTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            landBlock={getLandBlockForTask(task.land_block_id)}
                            getDeadlineColor={getDeadlineColor}
                            getDeadlineText={getDeadlineText}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

interface TaskCardProps {
    task: Task;
    landBlock: LandBlock | null;
    getDeadlineColor: (deadline: string) => string;
    getDeadlineText: (deadline: string) => string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, landBlock, getDeadlineColor, getDeadlineText }) => {
    return (
        <Card variant="elevated" className="card-hover cursor-pointer">
            <div className="flex items-start gap-4">
                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        <TaskTypeBadge type={task.type} />
                        <PriorityBadge priority={task.priority} />
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {task.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {task.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        {/* Location */}
                        {landBlock && (
                            <div className="flex items-center gap-1.5 text-gray-500">
                                <MapPin className="w-4 h-4" />
                                <span>{landBlock.name}</span>
                            </div>
                        )}

                        {/* Deadline */}
                        <div className={cn('flex items-center gap-1.5', getDeadlineColor(task.deadline))}>
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">{getDeadlineText(task.deadline)}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={task.status} />
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
            </div>
        </Card>
    );
};

export default TaskList;
