# Gadagi Host - Micro-frontend Container

The main host application for the Gadagi micro-frontend architecture, serving as the container and orchestrator for all remote micro-frontends.

## Overview

Gadagi Host is the shell application that loads and manages multiple micro-frontends using Webpack Module Federation. It provides routing, authentication, and shared services for the entire platform.

## Features

- 🏗️ **Module Federation** - Dynamic loading of remote micro-frontends
- 🧭 **Central Routing** - Unified routing across all modules
- 🔐 **Authentication** - Global auth state management
- 🎨 **Theme System** - Consistent theming across modules
- 📱 **Responsive Design** - Mobile-first architecture
- 🚀 **Performance** - Lazy loading and code splitting

## Architecture

```
┌─────────────────────────────────────┐
│            Gadagi Host              │
│  ┌─────────────┬─────────────────┐  │
│  │   Header    │   Navigation   │  │
│  └─────────────┴─────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │        Main Content            │  │
│  │  ┌─────────┬─────────┬───────┐ │  │
│  │  │  Users  │ Reports │Settings│ │  │
│  │  └─────────┴─────────┴───────┘ │  │
│  └─────────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Remote Applications

- **Gadagi Users** (Port 3001) - User management module
- **Gadagi Reports** (Port 3002) - Reporting and analytics
- **Gadagi Settings** (Port 3003) - Application settings

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Development

### Prerequisites

Ensure all remote applications are running:

```bash
# Terminal 1 - Users Module
cd ../adi-users
npm start

# Terminal 2 - Reports Module  
cd ../adi-reports
npm start

# Terminal 3 - Settings Module
cd ../adi-settings
npm start

# Terminal 4 - Host Application
cd ../adi-host
npm start
```

### Access Points

- **Host Application**: http://localhost:3000
- **Users Module**: http://localhost:3001
- **Reports Module**: http://localhost:3002
- **Settings Module**: http://localhost:3003

## Module Federation Configuration

### Host Configuration

```javascript
// webpack.config.js
const ModuleFederationPlugin = require('@module-federation/enhanced');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'adiHost',
      remotes: {
        adiUsers: 'adiUsers@http://localhost:3001/remoteEntry.js',
        adiReports: 'adiReports@http://localhost:3002/remoteEntry.js',
        adiSettings: 'adiSettings@http://localhost:3003/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-router-dom': { singleton: true },
      },
    }),
  ],
};
```

### Remote Loading

```typescript
// Dynamic imports for remote modules
const UsersApp = React.lazy(() => import('adiUsers/UsersApp'));
const ReportsApp = React.lazy(() => import('adiReports/ReportsApp'));
const SettingsApp = React.lazy(() => import('adiSettings/SettingsApp'));

// Usage in routing
<Route path="/users" element={
  <Suspense fallback={<div>Loading...</div>}>
    <UsersApp />
  </Suspense>
} />
```

## Routing

### Route Structure

```typescript
const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/users', element: <UsersModule /> },
  { path: '/reports', element: <ReportsModule /> },
  { path: '/settings', element: <SettingsModule /> },
];
```

### Navigation Integration

```tsx
import { Navigation } from '@gadagi/ui-navigation';

function AppLayout() {
  const navigationItems = [
    { id: 'users', label: 'Users', path: '/users' },
    { id: 'reports', label: 'Reports', path: '/reports' },
    { id: 'settings', label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="app-layout">
      <Header title="ADI Platform" />
      <div className="main-content">
        <Navigation items={navigationItems} />
        <main>
          <Routes>
            {/* Route definitions */}
          </Routes>
        </main>
      </div>
    </div>
  );
}
```

## Shared Services

### Authentication Context

```tsx
import { AuthProvider } from '@gadagi/auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}
```

### Theme Provider

```tsx
import { ThemeProvider } from '@gadagi/design-system';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

## Error Handling

### Module Loading Errors

```tsx
const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundaryComponent
      fallback={
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>Please refresh the page and try again.</p>
        </div>
      }
    >
      {children}
    </ErrorBoundaryComponent>
  );
};

// Wrap remote modules
<ErrorBoundary>
  <Suspense fallback={<div>Loading...</div>}>
    <UsersApp />
  </Suspense>
</ErrorBoundary>
```

### Network Error Recovery

```typescript
const retryImport = async (importFn: () => Promise<any>, retries = 3) => {
  try {
    return await importFn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return retryImport(importFn, retries - 1);
    }
    throw error;
  }
};
```

## Performance Optimization

### Lazy Loading

```tsx
// Lazy load remote modules
const UsersApp = React.lazy(() => retryImport(() => import('adiUsers/UsersApp')));
const ReportsApp = React.lazy(() => retryImport(() => import('adiReports/ReportsApp')));
const SettingsApp = React.lazy(() => retryImport(() => import('adiSettings/SettingsApp')));
```

### Code Splitting

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

## Development Tools

### Hot Module Replacement

```bash
# Enable HMR for development
npm run dev
```

### Module Federation Dev Tools

```bash
# Install federation dev tools
npm install @module-federation/devtools

# Usage in webpack config
const { ModuleFederationDevToolsPlugin } = require('@module-federation/devtools');

plugins: [
  new ModuleFederationDevToolsPlugin(),
]
```

## Testing

### Unit Tests

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage
```

### Integration Tests

```typescript
// Example integration test
describe('Module Loading', () => {
  it('should load Users module', async () => {
    const UsersApp = await import('adiUsers/UsersApp');
    expect(UsersApp).toBeDefined();
  });

  it('should handle module loading errors', async () => {
    // Mock failed import
    jest.mock('adiUsers/UsersApp', () => {
      throw new Error('Module not found');
    });

    // Test error handling
  });
});
```

## Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Configuration

```typescript
// config/remoteUrls.ts
export const remoteUrls = {
  development: {
    adiUsers: 'http://localhost:3001',
    adiReports: 'http://localhost:3002',
    adiSettings: 'http://localhost:3003',
  },
  production: {
    adiUsers: 'https://users.adiprod.com',
    adiReports: 'https://reports.adiprod.com',
    adiSettings: 'https://settings.adiprod.com',
  },
};
```

## Monitoring

### Performance Metrics

```typescript
// Track module loading performance
const trackModuleLoad = (moduleName: string) => {
  const startTime = performance.now();
  
  return {
    end: () => {
      const endTime = performance.now();
      console.log(`${moduleName} loaded in ${endTime - startTime}ms`);
    }
  };
};
```

### Error Tracking

```typescript
// Log module loading errors
const logModuleError = (moduleName: string, error: Error) => {
  console.error(`Failed to load ${moduleName}:`, error);
  // Send to error tracking service
};
```

## Troubleshooting

### Common Issues

1. **Module Not Found**
   - Ensure remote applications are running
   - Check webpack configuration URLs
   - Verify network connectivity

2. **Version Mismatch**
   - Ensure shared dependencies versions match
   - Check singleton configuration in webpack

3. **CORS Issues**
   - Configure CORS headers on remote applications
   - Check development server configuration

### Debug Mode

```bash
# Enable debug logging
DEBUG=module-federation npm start
```

## Contributing

1. Follow the established code patterns
2. Test module loading thoroughly
3. Update documentation for new features
4. Ensure backward compatibility

## License

MIT © Gadagi Team
