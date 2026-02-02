import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MobileLayout from './layouts/MobileLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Mobile Pages (Field Workers)
import TaskList from './pages/mobile/TaskList';
import ReportForm from './pages/mobile/ReportForm';
import Profile from './pages/mobile/Profile';

// Dashboard Pages (Admin)
import Overview from './pages/dashboard/Overview';
import MapView from './pages/dashboard/MapView';
import ConceptPlanner from './pages/dashboard/ConceptPlanner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect - can be changed based on user role */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Mobile Routes (Field Worker App) */}
        <Route path="/mobile" element={<MobileLayout />}>
          <Route index element={<Navigate to="/mobile/tasks" replace />} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="report" element={<ReportForm />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Dashboard Routes (Admin) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="map" element={<MapView />} />
          <Route path="planner" element={<ConceptPlanner />} />
          {/* Placeholder routes for additional pages */}
          <Route path="farmers" element={<FarmersPlaceholder />} />
          <Route path="settings" element={<SettingsPlaceholder />} />
        </Route>

        {/* Catch all - 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Placeholder components
const FarmersPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="text-6xl mb-4">👨‍🌾</div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Petani</h2>
    <p className="text-gray-500">Halaman ini sedang dalam pengembangan</p>
  </div>
);

const SettingsPlaceholder = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="text-6xl mb-4">⚙️</div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengaturan</h2>
    <p className="text-gray-500">Halaman ini sedang dalam pengembangan</p>
  </div>
);

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
    <div className="text-8xl mb-4">🌾</div>
    <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
    <p className="text-xl text-gray-500 mb-6">Halaman tidak ditemukan</p>
    <div className="flex gap-4">
      <a
        href="/dashboard"
        className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-colors"
      >
        Ke Dashboard
      </a>
      <a
        href="/mobile/tasks"
        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
      >
        Ke Mobile App
      </a>
    </div>
  </div>
);

export default App;
