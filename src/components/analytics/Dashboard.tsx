import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, TrendingUp, BarChart2, PieChart } from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { patients, selectedPatientId } = useAppStore();

  const patient = patients.find(p => p.id === selectedPatientId);

  if (!patient) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a patient to view analytics.
      </div>
    );
  }

  const mluData = patient.sessions.map(s => ({
    name: s.date,
    mlu: s.metrics.mlu,
    ttr: s.metrics.ttr,
  }));

  const errorData = patient.sessions.map(s => ({
    name: s.date,
    errors: s.metrics.errorCount,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col bg-background p-6 overflow-y-auto"
    >
      <motion.div variants={itemVariants} className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{patient.name} Analytics</h1>
          <p className="text-sm text-muted-foreground">Longitudinal tracking and corpus analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            <Activity className="h-4 w-4 text-primary" />
            Export SVG
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Latest MLU</h3>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {patient.sessions[patient.sessions.length - 1]?.metrics.mlu.toFixed(2) || '-'}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">+0.7 from last session</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Type-Token Ratio</h3>
            <BarChart2 className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {patient.sessions[patient.sessions.length - 1]?.metrics.ttr.toFixed(2) || '-'}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">+0.07 from last session</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">CORELEX Coverage</h3>
            <PieChart className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {patient.sessions[patient.sessions.length - 1]?.metrics.corelexCoverage}%
          </div>
          <p className="mt-1 text-xs text-muted-foreground">+7% from last session</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Total Errors</h3>
            <Activity className="h-4 w-4 text-destructive" />
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {patient.sessions[patient.sessions.length - 1]?.metrics.errorCount || '-'}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">-4 from last session</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">MLU Progression</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mluData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fafafa' }}
                />
                <Legend />
                <Line type="monotone" dataKey="mlu" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="ttr" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Error Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fafafa' }}
                  cursor={{ fill: '#27272a' }}
                />
                <Legend />
                <Bar dataKey="errors" fill="#7f1d1d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
