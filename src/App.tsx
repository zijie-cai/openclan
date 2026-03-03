/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layout } from './components/layout/Layout';
import { TranscriptEditor } from './components/editor/TranscriptEditor';
import { InspectorPanel } from './components/inspector/InspectorPanel';
import { Dashboard } from './components/analytics/Dashboard';
import { useAppStore } from './store/useAppStore';
import { CommandPalette } from './components/ui/CommandPalette';
import { SettingsDialog } from './components/ui/SettingsDialog';
import { LandingPage } from './components/landing/LandingPage';
import { motion } from 'motion/react';

export default function App() {
  const { isAnalyticsMode, isLandingPage } = useAppStore();

  return (
    <div className="min-h-screen w-full bg-[#020617] overflow-hidden">
      {isLandingPage ? (
        <LandingPage />
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            mass: 1
          }}
          className="h-screen w-screen overflow-hidden bg-background shadow-[0_0_60px_rgba(6,182,212,0.15)] rounded-t-2xl sm:rounded-none"
        >
          <Layout>
            {isAnalyticsMode ? (
              <Dashboard />
            ) : (
              <div className="flex h-full w-full">
                <div className="flex-1 overflow-hidden">
                  <TranscriptEditor />
                </div>
                <InspectorPanel />
              </div>
            )}
          </Layout>
          <CommandPalette />
          <SettingsDialog />
        </motion.div>
      )}
    </div>
  );
}
