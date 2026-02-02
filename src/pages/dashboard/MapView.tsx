import React, { useState, useEffect } from 'react';
import { MapPin, Leaf, Droplets, ChevronDown, ChevronUp, Loader2, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, StatusBadge, Button } from '../../components/ui';
import LandBlockFormModal from '../../components/LandBlockFormModal';
import { getLandBlocks } from '../../services/landBlockService';
import { getUserById } from '../../services/userService';
import type { LandBlock, LandBlockStatus, User } from '../../types/database';
import { cn } from '../../lib/utils';

const statusColors: Record<LandBlockStatus, string> = {
    active: 'bg-emerald-500',
    harvesting: 'bg-primary-500',
    preparation: 'bg-sky-500',
    fallow: 'bg-gray-400',
};

const statusLabels: Record<LandBlockStatus, string> = {
    active: 'Aktif',
    harvesting: 'Panen',
    preparation: 'Persiapan',
    fallow: 'Bera',
};

const cropEmojis: Record<string, string> = {
    'Padi': '🌾',
    'Jagung': '🌽',
    'Cabai': '🌶️',
    'Kedelai': '🫘',
    'Tomat': '🍅',
};

const MapView: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [landBlocks, setLandBlocks] = useState<LandBlock[]>([]);
    const [farmers, setFarmers] = useState<Record<string, User>>({});
    const [activeFilter, setActiveFilter] = useState<LandBlockStatus | 'all'>('all');
    const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
    const [isLandBlockModalOpen, setIsLandBlockModalOpen] = useState(false);

    const refreshData = async () => {
        const blocks = await getLandBlocks();
        setLandBlocks(blocks);
    };

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const blocks = await getLandBlocks();
                setLandBlocks(blocks);

                // Fetch farmers for expanded details
                const farmerIds = new Set<string>();
                blocks.forEach(block => {
                    block.assigned_farmers?.forEach(id => farmerIds.add(id));
                });

                const farmerPromises = Array.from(farmerIds).map(async (id) => {
                    const user = await getUserById(id);
                    return { id, user };
                });

                const farmerResults = await Promise.all(farmerPromises);
                const farmerMap: Record<string, User> = {};
                farmerResults.forEach(({ id, user }) => {
                    if (user) farmerMap[id] = user;
                });
                setFarmers(farmerMap);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredBlocks = landBlocks.filter(
        (block) => activeFilter === 'all' || block.status === activeFilter
    );

    const statusFilters: { value: LandBlockStatus | 'all'; label: string; count: number }[] = [
        { value: 'all', label: 'Semua', count: landBlocks.length },
        { value: 'active', label: 'Aktif', count: landBlocks.filter((b) => b.status === 'active').length },
        { value: 'harvesting', label: 'Panen', count: landBlocks.filter((b) => b.status === 'harvesting').length },
        { value: 'preparation', label: 'Persiapan', count: landBlocks.filter((b) => b.status === 'preparation').length },
        { value: 'fallow', label: 'Bera', count: landBlocks.filter((b) => b.status === 'fallow').length },
    ];

    const toggleExpand = (blockId: string) => {
        setExpandedBlock(expandedBlock === blockId ? null : blockId);
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
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Peta Lahan</h1>
                    <p className="text-gray-500 mt-1">
                        Kelola dan pantau semua blok lahan pertanian.
                    </p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsLandBlockModalOpen(true)}
                    className="flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Lahan
                </Button>
            </div>

            {/* LandBlock Form Modal */}
            <LandBlockFormModal
                isOpen={isLandBlockModalOpen}
                onClose={() => setIsLandBlockModalOpen(false)}
                onSuccess={refreshData}
            />

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {statusFilters.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => setActiveFilter(filter.value)}
                        className={cn(
                            'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2',
                            activeFilter === filter.value
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                        )}
                    >
                        {filter.value !== 'all' && (
                            <span className={cn('w-2 h-2 rounded-full', statusColors[filter.value as LandBlockStatus])} />
                        )}
                        {filter.label}
                        <span className={cn(
                            'px-1.5 py-0.5 rounded-md text-xs',
                            activeFilter === filter.value ? 'bg-white/20' : 'bg-gray-100'
                        )}>
                            {filter.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                    <CardContent className="py-4">
                        <p className="text-sm text-emerald-600">Total Lahan</p>
                        <p className="text-2xl font-bold text-emerald-700">{landBlocks.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
                    <CardContent className="py-4">
                        <p className="text-sm text-sky-600">Total Luas</p>
                        <p className="text-2xl font-bold text-sky-700">
                            {landBlocks.reduce((sum, b) => sum + b.area, 0).toFixed(1)} ha
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                    <CardContent className="py-4">
                        <p className="text-sm text-amber-600">Lahan Aktif</p>
                        <p className="text-2xl font-bold text-amber-700">
                            {landBlocks.filter((b) => b.status === 'active').length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                    <CardContent className="py-4">
                        <p className="text-sm text-primary-600">Siap Panen</p>
                        <p className="text-2xl font-bold text-primary-700">
                            {landBlocks.filter((b) => b.status === 'harvesting').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Land Blocks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBlocks.map((block) => {
                    const isExpanded = expandedBlock === block.id;
                    const emoji = cropEmojis[block.crop_type] || '🌱';

                    return (
                        <Card
                            key={block.id}
                            className={cn(
                                'transition-all duration-300 cursor-pointer hover:shadow-lg',
                                isExpanded && 'ring-2 ring-primary-400'
                            )}
                            onClick={() => toggleExpand(block.id)}
                        >
                            <CardContent className="p-4">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                                            'bg-gradient-to-br from-primary-100 to-primary-200'
                                        )}>
                                            {emoji}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{block.name}</h3>
                                            <p className="text-sm text-gray-500">{block.crop_type}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={block.status} />
                                </div>

                                {/* Quick Info */}
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span>{block.area} ha</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Droplets className="w-4 h-4 text-sky-400" />
                                        <span>{block.irrigation_type || 'Tidak ada'}</span>
                                    </div>
                                </div>

                                {/* Expand Toggle */}
                                <button
                                    className="w-full flex items-center justify-center gap-1 text-sm text-primary-600 hover:text-primary-700 py-1"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(block.id);
                                    }}
                                >
                                    {isExpanded ? (
                                        <>Tutup <ChevronUp className="w-4 h-4" /></>
                                    ) : (
                                        <>Lihat Detail <ChevronDown className="w-4 h-4" /></>
                                    )}
                                </button>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-500">Jenis Tanah</p>
                                                <p className="text-sm font-medium">{block.soil_type || 'Tidak ada'}</p>
                                            </div>
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-500">Status</p>
                                                <p className="text-sm font-medium">{statusLabels[block.status]}</p>
                                            </div>
                                        </div>

                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 mb-1">Koordinat</p>
                                            <p className="text-sm font-mono">
                                                {block.lat.toFixed(4)}, {block.lng.toFixed(4)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500 mb-2">Petani Ditugaskan ({block.assigned_farmers?.length || 0})</p>
                                            <div className="flex flex-wrap gap-2">
                                                {block.assigned_farmers?.map((farmerId) => {
                                                    const farmer = farmers[farmerId];
                                                    return (
                                                        <span
                                                            key={farmerId}
                                                            className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                                                        >
                                                            {farmer?.name || farmerId}
                                                        </span>
                                                    );
                                                })}
                                                {(!block.assigned_farmers || block.assigned_farmers.length === 0) && (
                                                    <span className="text-xs text-gray-400">Tidak ada petani</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredBlocks.length === 0 && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <Leaf className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-gray-500 font-medium">Tidak ada lahan dengan status ini</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default MapView;
