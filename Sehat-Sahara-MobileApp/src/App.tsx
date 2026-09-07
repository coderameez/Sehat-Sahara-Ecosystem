import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './app/routes';
import { DesktopDeviceFrame } from './components/DesktopDeviceFrame';
import { AICopilotGlobal } from './components';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { CounterpartEngine } from './services/prototype/CounterpartEngine';

export const App: React.FC = () => {
  useEffect(() => {
    CounterpartEngine.start();
    return () => CounterpartEngine.stop();
  }, []);

  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <DesktopDeviceFrame>
          <AppRoutes />
          <AICopilotGlobal />
        </DesktopDeviceFrame>
      </BrowserRouter>
    </AppErrorBoundary>
  );
};

export default App;
