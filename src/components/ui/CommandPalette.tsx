import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Terminal, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { runCommand } = useAppStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    runCommand(input);
    setInput('');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed left-[50%] top-[20%] z-50 w-full max-w-lg translate-x-[-50%] rounded-xl border border-border bg-card shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="flex items-center border-b border-border px-4 py-3">
              <Terminal className="mr-3 h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a CLAN command or search..."
                className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button type="button" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </form>
            <div className="p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Suggested Commands
              </div>
              <div className="space-y-1">
                {['MLU', 'FREQ', 'EVAL +t*CHI', 'CORELEX'].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => {
                      runCommand(cmd);
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center rounded-md px-3 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <Search className="mr-3 h-4 w-4 text-muted-foreground" />
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
