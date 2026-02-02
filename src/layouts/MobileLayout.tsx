import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { ClipboardList, FileText, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItem {
    to: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    {
        to: '/mobile/tasks',
        label: 'Tugas',
        icon: <ClipboardList className="w-6 h-6" />,
    },
    {
        to: '/mobile/report',
        label: 'Laporan',
        icon: <FileText className="w-6 h-6" />,
    },
    {
        to: '/mobile/profile',
        label: 'Profil',
        icon: <User className="w-6 h-6" />,
    },
];

const MobileLayout: React.FC = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen max-w-md mx-auto bg-gray-50 flex flex-col relative">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
                <div className="px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <span className="text-white text-xl">🌾</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Smart Farming</h1>
                            <p className="text-xs text-gray-500">Aplikasi Pekerja Lapangan</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto pb-24">
                <div className="px-4 py-5">
                    <Outlet />
                </div>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 bg-white border-t border-gray-200 shadow-lg">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    'flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-200 min-w-[80px]',
                                    isActive
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-400 hover:text-gray-600'
                                )}
                            >
                                <span className={cn(
                                    'transition-all duration-200',
                                    isActive && 'scale-110 text-primary-600'
                                )}>
                                    {item.icon}
                                </span>
                                <span className={cn(
                                    'text-xs font-medium',
                                    isActive ? 'text-primary-600' : 'text-gray-500'
                                )}>
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    })}
                </div>

                {/* Safe area for home indicator */}
                <div className="h-1" />
            </nav>
        </div>
    );
};

export default MobileLayout;
