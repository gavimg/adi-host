import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const UsersApp    = lazy(() => import('adiUsers/UsersApp'));
const ReportsApp  = lazy(() => import('adiReports/ReportsApp'));
const SettingsApp = lazy(() => import('adiSettings/SettingsApp'));

const Fallback = ({ name }: { name: string }) => (
  <div style={{ padding: '2rem', color: '#64748b' }}>Loading {name}...</div>
);

const Home: React.FC = () => (
  <div style={{ padding: '2rem' }}>
    <h1 style={{ marginBottom: '1rem' }}>Adi Host Shell</h1>
    <p style={{ color: '#64748b' }}>Select a module from the nav above.</p>
  </div>
);

const App: React.FC = () => (
  <BrowserRouter>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/users">Users</Link>
      <Link to="/reports">Reports</Link>
      <Link to="/settings">Settings</Link>
    </nav>
    <Suspense fallback={<Fallback name="module" />}>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/users/*"   element={<UsersApp />} />
        <Route path="/reports/*" element={<ReportsApp />} />
        <Route path="/settings/*" element={<SettingsApp />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
