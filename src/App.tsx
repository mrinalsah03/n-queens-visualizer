/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SolverState, SpeedOption } from './types';
import { executeStep } from './utils/solver';
import ChessBoard from './components/ChessBoard';
import Sidebar from './components/Sidebar';
import {
  Grid,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Gauge,
  Sparkles,
  Crown
} from 'lucide-react';

export default function App() {
  const [N, setN] = useState<number>(8);
  const [speed, setSpeed] = useState<SpeedOption>('med');

  // Create initial state for a given N
  const createInitialState = (size: number): SolverState => ({
    board: Array(size).fill(-1),
    currentRow: 0,
    currentCol: 0,
    isBacktracking: false,
    status: 'ready',
    attempts: 0,
    backtracks: 0,
    solutionsFound: 0,
    lastAction: null,
  });

  const [state, setState] = useState<SolverState>(() => createInitialState(8));

  // Auto-solving loop effect
  useEffect(() => {
    if (state.status !== 'processing') return;

    // Timeout map based on speed
    const delay = speed === 'slow' ? 500 : speed === 'med' ? 100 : 25;

    const intervalId = setInterval(() => {
      setState((prev) => {
        const next = executeStep(prev, N);
        return next;
      });
    }, delay);

    return () => clearInterval(intervalId);
  }, [state.status, speed, N]);

  // Handle generation/reset with new size
  const handleGenerate = (newN: number) => {
    const validatedN = Math.max(4, Math.min(20, newN));
    setN(validatedN);
    setState(createInitialState(validatedN));
  };

  // Bottom action buttons implementation
  const handleSolve = () => {
    if (state.status === 'secured' || state.status === 'failed') {
      // Re-solve from scratch
      setState({
        ...createInitialState(N),
        status: 'processing',
        solutionsFound: state.solutionsFound, // Retain existing solutions count
      });
    } else {
      setState((prev) => ({
        ...prev,
        status: 'processing',
      }));
    }
  };

  const handlePause = () => {
    setState((prev) => ({
      ...prev,
      status: 'paused',
    }));
  };

  const handleStep = () => {
    setState((prev) => {
      const next = executeStep(prev, N);
      return {
        ...next,
        status:
          next.status === 'secured' || next.status === 'failed'
            ? next.status
            : 'paused',
      };
    });
  };

  const handleReset = () => {
    setState(createInitialState(N));
  };

  // Cycles speeds from slow -> med -> fast -> slow
  const handleCyclePace = () => {
    setSpeed((prev) => {
      if (prev === 'slow') return 'med';
      if (prev === 'med') return 'fast';
      return 'slow';
    });
  };

  return (
    <div className="bg-background text-on-surface font-sans antialiased overflow-hidden min-h-screen select-none relative">
      {/* Top Header Section */}
      <header className="fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-xl border-b border-outline-variant/20 shadow-2xl flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-3">
          <Grid className="text-primary w-6 h-6" />
          <h1 className="font-sans text-lg md:text-xl font-bold tracking-widest text-primary uppercase">
            Queen's Ascent
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 px-4">
            <span className="text-primary text-xs font-bold tracking-widest cursor-default px-3 py-1.5 rounded-sm bg-white/5 border border-primary/20">
              VISUALIZER
            </span>
            <span className="text-on-surface-variant text-xs font-bold tracking-widest cursor-default px-3 py-1.5 rounded-sm hover:bg-white/5 transition-colors">
              ALGORITHM
            </span>
          </div>
          <button
            type="button"
            className="text-primary p-2 hover:bg-white/5 rounded-full transition-all active:scale-95 duration-200 cursor-pointer"
            title="Sovereign Sovereign State"
          >
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Study Arena */}
      <main className="pt-20 pb-28 h-screen flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        {/* Sidebar Left: Metrics & Controls */}
        <Sidebar
          state={state}
          NValue={N}
          onGenerate={handleGenerate}
          speed={speed}
          onSpeedChange={setSpeed}
        />

        {/* Center: The Chess Board Stage Grid */}
        <section className="flex-grow flex items-center justify-center p-2 md:p-6 overflow-hidden relative">
          <div
            id="board-shell"
            className="relative glass-panel p-3 rounded-xl shadow-[0_0_100px_rgba(212,175,55,0.05)] w-full max-w-[min(70vh,70vw)] aspect-square flex items-center justify-center"
          >
            <ChessBoard NValue={N} state={state} />

            {/* Success Overlay Modal (Royal Victory) */}
            <div
              id="success-overlay"
              className={`absolute inset-0 z-40 bg-black/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center transition-all duration-500 ${
                state.status === 'secured'
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              }`}
            >
              <div
                id="success-content"
                className={`text-center p-8 transition-transform duration-700 ${
                  state.status === 'secured' ? 'scale-100' : 'scale-90'
                }`}
              >
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/40 shadow-[0_0_30px_rgba(212,175,55,0.25)]">
                  <Crown className="text-primary w-12 h-12" />
                </div>
                <h3 className="text-primary text-3xl md:text-4xl font-bold tracking-tight mb-3">
                  Royal Victory
                </h3>
                <p className="text-on-surface-variant mb-10 max-w-sm mx-auto text-sm leading-relaxed">
                  The optimal configuration has been secured. Every queen stands
                  in absolute non-conflicting sovereignty.
                </p>
                <button
                  onClick={handleReset}
                  className="btn-gold px-12 py-4 rounded-lg font-black tracking-widest text-xs uppercase active:scale-95 transition-all cursor-pointer"
                >
                  Reset Table
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile-Friendly Control/Toolbar Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-4 pb-safe bg-surface-container/90 backdrop-blur-2xl border-t border-primary/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {/* Play / Solve button */}
        <button
          onClick={handleSolve}
          className="flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer group"
          id="solve-btn"
        >
          <div
            className={`rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 ${
              state.status === 'processing'
                ? 'bg-primary/30 text-primary shadow-[0_0_20px_rgba(212,175,55,0.6)] animate-pulse'
                : 'bg-primary-container/20 text-primary hover:bg-primary-container/45'
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
          </div>
          <span className="font-mono text-[10px] mt-1.5 uppercase font-bold text-primary tracking-wider">
            Solve
          </span>
        </button>

        {/* Pause Action */}
        <button
          onClick={handlePause}
          className="flex flex-col items-center justify-center text-tertiary hover:text-primary transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
            <Pause className="w-4 h-4 text-tertiary hover:text-primary" />
          </div>
          <span className="font-mono text-[9px] mt-1 uppercase font-bold tracking-wider">
            Pause
          </span>
        </button>

        {/* Step-by-Step Step-action */}
        <button
          onClick={handleStep}
          className="flex flex-col items-center justify-center text-tertiary hover:text-primary transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
            <SkipForward className="w-4 h-4 text-tertiary hover:text-primary" />
          </div>
          <span className="font-mono text-[9px] mt-1 uppercase font-bold tracking-wider">
            Step
          </span>
        </button>

        {/* Reset Action */}
        <button
          onClick={handleReset}
          className="flex flex-col items-center justify-center text-tertiary hover:text-primary transition-all active:scale-95 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
            <RotateCcw className="w-4 h-4 text-tertiary hover:text-primary" />
          </div>
          <span className="font-mono text-[9px] mt-1 uppercase font-bold tracking-wider">
            Reset
          </span>
        </button>

        {/* Cycle Pace Action */}
        <button
          onClick={handleCyclePace}
          className="flex flex-col items-center justify-center text-tertiary hover:text-primary transition-all active:scale-95 cursor-pointer"
          title={`Cycle Pace: currently ${speed}`}
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 relative">
            <Gauge className="w-4 h-4 text-tertiary hover:text-primary" />
            <span className="absolute -top-1 -right-1 bg-primary text-black text-[7px] px-1 rounded-full font-black uppercase tracking-tighter">
              {speed}
            </span>
          </div>
          <span className="font-mono text-[9px] mt-1 uppercase font-bold tracking-wider">
            Pace
          </span>
        </button>
      </nav>
    </div>
  );
}
