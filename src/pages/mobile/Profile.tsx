import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    LogOut,
    ChevronRight,
    Bell,
    Shield,
    HelpCircle,
    Leaf,
    Loader2,
} from 'lucide-react';
import { Card, CardContent, Button, Badge } from '../../components/ui';
import { getUsers } from '../../services/userService';
import { getLandBlocks } from '../../services/landBlockService';
import { getTasks } from '../../services/taskService';
import type { User as UserType, LandBlock, Task } from '../../types/database';
import { formatDate, getInitials } from '../../lib/utils';

const Profile: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserType | null>(null);
    const [assignedBlocks, setAssignedBlocks] = useState<LandBlock[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [usersData, landBlocksData, tasksData] = await Promise.all([
                    getUsers(),
                    getLandBlocks(),
                    getTasks(),
                ]);

                // Use first farmer for demo, in real app would come from auth
                const demoUser = usersData.find(u => u.role === 'farmer') || usersData[0];
                setUser(demoUser || null);

                if (demoUser) {
                    // Filter land blocks assigned to this user
                    const userBlocks = landBlocksData.filter(b =>
                        b.assigned_farmers?.includes(demoUser.id)
                    );
                    setAssignedBlocks(userBlocks);

                    // Filter tasks assigned to this user
                    const userTasks = tasksData.filter(t =>
                        t.assigned_to?.includes(demoUser.id)
                    );
                    setTasks(userTasks);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-center">
                <div>
                    <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 font-medium">Pengguna tidak ditemukan</p>
                    <p className="text-sm text-gray-400 mt-1">Silakan tambahkan pengguna terlebih dahulu</p>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: 'Total Tugas',
            value: tasks.length,
            icon: <Leaf className="w-5 h-5 text-primary-500" />,
        },
        {
            label: 'Selesai',
            value: tasks.filter((t) => t.status === 'completed').length,
            icon: <Leaf className="w-5 h-5 text-emerald-500" />,
        },
        {
            label: 'Lahan',
            value: assignedBlocks.length,
            icon: <MapPin className="w-5 h-5 text-sky-500" />,
        },
    ];

    const menuItems = [
        { icon: <Bell className="w-5 h-5" />, label: 'Notifikasi', badge: '3' },
        { icon: <Shield className="w-5 h-5" />, label: 'Keamanan' },
        { icon: <HelpCircle className="w-5 h-5" />, label: 'Bantuan' },
    ];

    return (
        <div className="space-y-4 pb-4">
            {/* Profile Header */}
            <Card className="relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 opacity-90" />
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />

                <CardContent className="relative z-10 text-white py-8">
                    <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center text-3xl font-bold shadow-xl mb-4">
                            {getInitials(user.name)}
                        </div>

                        {/* Name & Role */}
                        <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                        <Badge className="bg-white/20 text-white border-0">
                            {user.role === 'admin' ? 'Administrator' : 'Petani'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                    <Card key={stat.label} className="text-center">
                        <CardContent className="py-4">
                            <div className="flex justify-center mb-2">{stat.icon}</div>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Contact Info */}
            <Card>
                <CardContent className="divide-y divide-gray-100">
                    <div className="flex items-center gap-3 py-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                            <Mail className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-900">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 py-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Telepon</p>
                            <p className="text-sm font-medium text-gray-900">{user.phone || '-'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 py-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Bergabung</p>
                            <p className="text-sm font-medium text-gray-900">
                                {formatDate(user.created_at)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Assigned Land Blocks */}
            <Card>
                <CardContent>
                    <h3 className="font-semibold text-gray-900 mb-3">Lahan yang Ditugaskan</h3>
                    <div className="space-y-2">
                        {assignedBlocks.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Belum ada lahan yang ditugaskan</p>
                        ) : (
                            assignedBlocks.map((block) => (
                                <div
                                    key={block.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{block.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {block.crop_type} • {block.area} ha
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            block.status === 'active'
                                                ? 'success'
                                                : block.status === 'harvesting'
                                                    ? 'primary'
                                                    : 'default'
                                        }
                                        size="sm"
                                    >
                                        {block.status === 'active'
                                            ? 'Aktif'
                                            : block.status === 'harvesting'
                                                ? 'Panen'
                                                : 'Bera'}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Menu Items */}
            <Card>
                <CardContent className="divide-y divide-gray-100">
                    {menuItems.map((item) => (
                        <button
                            key={item.label}
                            className="flex items-center justify-between w-full py-3 text-left hover:bg-gray-50 -mx-4 px-4 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-gray-400">{item.icon}</div>
                                <span className="font-medium text-gray-900">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.badge && (
                                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </div>
                        </button>
                    ))}
                </CardContent>
            </Card>

            {/* Logout Button */}
            <Button
                variant="destructive"
                className="w-full"
                leftIcon={<LogOut className="w-4 h-4" />}
            >
                Keluar
            </Button>
        </div>
    );
};

export default Profile;
