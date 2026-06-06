/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SolverState, SpeedOption, SolverStatus } from '../types';
import { Grid, Plus, Minus, Cpu, HelpCircle } from 'lucide-react';

interface SidebarProps {
  state: SolverState;
  NValue: number;
  onGenerate: (newN: number) => void;
  speed: SpeedOption;
  onSpeedChange: (option: SpeedOption) => void;
}

export default function Sidebar({
  state,
  NValue,
  onGenerate,
  speed,
  onSpeedChange,
}: SidebarProps) {
  const [draftN, setDraftN] = useState<number>(NValue);

  const handleIncrement = () => {
    if (draftN < 20) {
      setDraftN((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (draftN > 4) {
      setDraftN((prev) => prev - 1);
    }
  };

  const handleGenerateClick = () => {
    onGenerate(draftN);
  };

  // Status text coloring & status icon animation
  const getStatusDisplay = (status: SolverStatus) => {
    switch (status) {
      case 'processing':
        return (
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            PROCESSING
          </div>
        );
      case 'paused':
        return (
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            PAUSED
          </div>
        );
      case 'secured':
        return (
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#4ade80]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></span>
            SECURED
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#ef4444]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></span>
            FAILED
          </div>
        );
      case 'ready':
      default:
        return (
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary status-pulse"></span>
            READY
          </div>
        );
    }
  };

  return (
    <aside className="w-full md:w-80 flex flex-col gap-4 overflow-y-auto pr-1 shrink-0">
      {/* System Metrics Glass Card */}
      <div className="glass-panel p-5 rounded-lg flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-primary text-sm tracking-wider uppercase">
            System Metrics
          </h2>
          {getStatusDisplay(state.status)}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 p-3 rounded-md border border-white/5 transition-all duration-300 hover:bg-white/10 hover:border-primary/20">
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
              Attempts
            </p>
            <p className="font-mono text-2xl text-primary mt-1" id="stat-attempts">
              {state.attempts}
            </p>
          </div>

          <div className="bg-white/5 p-3 rounded-md border border-white/5 transition-all duration-300 hover:bg-white/10 hover:border-primary/20">
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
              Backtracks
            </p>
            <p className="font-mono text-2xl text-secondary mt-1" id="stat-backtracks">
              {state.backtracks}
            </p>
          </div>

          <div className="bg-white/5 p-3 rounded-md border border-white/5 transition-all duration-300 hover:bg-white/10 hover:border-primary/20">
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
              Active Row
            </p>
            <p className="font-mono text-2xl text-primary mt-1" id="stat-row">
              {state.status === 'secured' ? 0 : Math.min(state.currentRow + 1, NValue)}
            </p>
          </div>

          <div className="bg-white/5 p-3 rounded-md border border-white/5 transition-all duration-300 hover:bg-white/10 hover:border-primary/20">
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
              Solutions
            </p>
            <p className="font-mono text-2xl text-primary mt-1" id="stat-solutions">
              {state.solutionsFound}
            </p>
          </div>
        </div>
      </div>

      {/* Configuration Glass Card */}
      <div className="glass-panel p-5 rounded-lg flex flex-col gap-5">
        <div>
          <h2 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-3">
            Board Dimension
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex-grow flex items-center bg-black/40 border border-outline-variant/30 rounded px-2 h-10 group focus-within:border-primary/50 transition-colors">
              <button
                type="button"
                className="text-on-surface-variant hover:text-primary p-1 cursor-pointer transition-colors"
                onClick={handleDecrement}
                aria-label="Decrease board size"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-center w-full font-mono text-primary text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                id="n-input"
                type="number"
                min={4}
                max={20}
                value={draftN}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val)) {
                    setDraftN(val);
                  }
                }}
              />
              <button
                type="button"
                className="text-on-surface-variant hover:text-primary p-1 cursor-pointer transition-colors"
                onClick={handleIncrement}
                aria-label="Increase board size"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleGenerateClick}
              className="btn-gold h-10 px-4 rounded text-[10px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-all active:scale-95 duration-200"
            >
              Generate
            </button>
          </div>
          {draftN < 4 && (
            <p className="text-red-400 text-[10px] mt-1">Minimum size is 4</p>
          )}
          {draftN > 20 && (
            <p className="text-red-400 text-[10px] mt-1">Maximum size is 20</p>
          )}
        </div>

        <div>
          <h2 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-3">
            Temporal Speed
          </h2>
          <div className="flex p-1 bg-black/40 border border-outline-variant/20 rounded-md">
            <button
              type="button"
              className={`speed-btn flex-1 py-1.5 text-[9px] font-black tracking-tighter rounded transition-all cursor-pointer ${
                speed === 'slow'
                  ? 'bg-primary text-on-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
              onClick={() => onSpeedChange('slow')}
            >
              SLOW (500ms)
            </button>
            <button
              type="button"
              className={`speed-btn flex-1 py-1.5 text-[9px] font-black tracking-tighter rounded transition-all cursor-pointer ${
                speed === 'med'
                  ? 'bg-primary text-on-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
              onClick={() => onSpeedChange('med')}
            >
              MED (100ms)
            </button>
            <button
              type="button"
              className={`speed-btn flex-1 py-1.5 text-[9px] font-black tracking-tighter rounded transition-all cursor-pointer ${
                speed === 'fast'
                  ? 'bg-primary text-on-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
              onClick={() => onSpeedChange('fast')}
            >
              FAST (20ms)
            </button>
          </div>
        </div>
      </div>

      {/* Strategy Visual banner */}
      <div className="hidden md:block glass-panel rounded-lg overflow-hidden relative group mt-auto select-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-75"></div>
        <img
          alt="Chess Strategy"
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeLoIHwfGUs6joQSes_kIY1nA23LZK51K8PIIgXywO6zNfOM2ddDnBU09rKLBqTPlLtWDV3nGLPJ2B7JbjvaqG-KEIXyxGVi2m8EIRYYwTqAYvjCpde9_vSzJteGBQ2NrYo61bM_PgDMshTaOIHqsZ6uZgWilyhqkOPeZr2O3bfCn3FKTvVUm7NSjE1cohP95IPQUPVVdCnXKJ9c1bgGgseiNjFym_4Hic2YUMmKDechVl6cnUpWW0VNgDlcztKq4qLCpho4dOLmMd"
        />
        <div className="absolute bottom-3 left-3 z-20">
          <span className="bg-primary/20 text-primary text-[8px] font-black px-2 py-0.5 rounded border border-primary/30 tracking-widest uppercase">
            Engine V4.0
          </span>
          <p className="text-white text-xs font-bold mt-1">Recursive Backtracking</p>
        </div>
      </div>
    </aside>
  );
}
