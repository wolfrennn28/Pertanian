import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Map,
    CalendarClock,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    Bell,
    Search,
    LogOut,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from '../components/ui';

interface NavItem {
    to: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    {
        to: '/dashboard',
        label: 'Overview',
        icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
        to: '/dashboard/map',
        label: 'Peta Lahan',
        icon: <Map className="w-5 h-5" />,
    },
    {
        to: '/dashboard/planner',
        label: 'Perencanaan',
        icon: <CalendarClock className="w-5 h-5" />,
    },
    {
        to: '/dashboard/farmers',
        label: 'Petani',
        icon: <Users className="w-5 h-5" />,
    },
    {
        to: '/dashboard/settings',
        label: 'Pengaturan',
        icon: <Settings className="w-5 h-5" />,
    },
];

const DashboardLayout: React.FC = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 h-screen bg-white border-r border-gray-100 z-50',
                    'flex flex-col transition-all duration-300 ease-in-out',
                    sidebarCollapsed ? 'w-20' : 'w-64'
                )}
            >
                {/* Logo */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 flex-shrink-0">
                            <span className="text-white font-bold text-lg">🌾</span>
                        </div>
                        {!sidebarCollapsed && (
                            <div className="overflow-hidden">
                                <h1 className="text-lg font-bold text-gray-900 whitespace-nowrap">
                                    Smart Farming
                                </h1>
                                <p className="text-xs text-gray-500 whitespace-nowrap">
                                    Admin Dashboard
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive =
                            location.pathname === item.to ||
                            (item.to !== '/dashboard' && location.pathname.startsWith(item.to));

                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                                    isActive
                                        ? 'bg-primary-50 text-primary-700 font-medium shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                                <span
                                    className={cn(
                                        'flex-shrink-0',
                                        isActive && 'text-primary-600'
                                    )}
                                >
                                    {item.icon}
                                </span>
                                {!sidebarCollapsed && (
                                    <span className="whitespace-nowrap">{item.label}</span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Collapse Button */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        {sidebarCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <>
                                <ChevronLeft className="w-5 h-5" />
                                <span>Tutup</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={cn(
                    'flex-1 flex flex-col transition-all duration-300',
                    sidebarCollapsed ? 'ml-20' : 'ml-64'
                )}
            >
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
                    <div className="flex items-center justify-between px-6 py-4">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari tugas, lahan, petani..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </button>

                            {/* User Menu */}
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">Budi Santoso</p>
                                    <p className="text-xs text-gray-500">Administrator</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                                    BS
                                </div>
                            </div>

                            {/* Logout */}
                            <Button variant="ghost" size="icon" className="text-gray-500">
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
