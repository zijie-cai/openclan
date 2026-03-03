import React from 'react';
import { Sidebar } from './Sidebar';
import { PowerConsole } from '../console/PowerConsole';
import { Header } from './Header';
import { useAppStore } from '../../store/useAppStore';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConsoleOpen } = useAppStore();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            {children}
          </div>
          {isConsoleOpen && <PowerConsole />}
        </main>
      </div>
    </div>
  );
};
