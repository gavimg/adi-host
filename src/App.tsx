import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { LoginForm, RegisterForm } from '@gadagi/auth';
import './App.css';

const UsersApp    = lazy(() => import('adiUsers/UsersApp'));
const ReportsApp  = lazy(() => import('adiReports/ReportsApp'));
const SettingsApp = lazy(() => import('adiSettings/SettingsApp'));

const Fallback = ({ name }: { name: string }) => (
  <div className="host-app__loading">Loading {name}...</div>
);

const Home: React.FC = () => (
  <div className="host-app">
    <h1 className="host-app__title">Gadagi Host Shell</h1>
    <p className="host-app__subtitle">Select a module from the nav above.</p>
  </div>
);

const App: React.FC = () => (
  <BrowserRouter>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Sign Up</Link>
      <Link to="/users">Users</Link>
      <Link to="/reports">Reports</Link>
      <Link to="/settings">Settings</Link>
    </nav>
    <Suspense fallback={<Fallback name="module" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm onSuccess={() => console.log('Login successful')} />} />
        <Route path="/signup" element={<RegisterForm onSuccess={() => console.log('Registration successful')} />} />
        <Route path="/users/*" element={<UsersApp />} />
        <Route path="/reports/*" element={<ReportsApp />} />
        <Route path="/settings/*" element={<SettingsApp />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
