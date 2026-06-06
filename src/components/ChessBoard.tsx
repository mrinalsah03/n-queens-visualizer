/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SolverState } from '../types';

interface ChessBoardProps {
  NValue: number;
  state: SolverState;
}

export function QueenIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="queen-asset queen-pop select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="premiumGoldGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8A660D" />
          <stop offset="30%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#FFE57F" />
          <stop offset="100%" stopColor="#AA7C11" />
        </linearGradient>
        <filter id="royalGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g filter="url(#royalGlow)">
        {/* Orbs and Crown Spitzen */}
        <circle cx="50" cy="18" r="5" fill="url(#premiumGoldGrad)" />
        <circle cx="24" cy="27" r="4.5" fill="url(#premiumGoldGrad)" />
        <circle cx="76" cy="27" r="4.5" fill="url(#premiumGoldGrad)" />

        {/* Crown base structural path */}
        <path
          d="M 50 25 L 59 48 L 73 31 L 67 59 L 85 55 L 75 75 L 25 75 L 15 55 L 33 59 L 27 31 L 41 48 Z"
          fill="url(#premiumGoldGrad)"
          stroke="#554300"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Base rings */}
        <rect x="22" y="78" width="56" height="6" rx="2" fill="url(#premiumGoldGrad)" stroke="#554300" strokeWidth="1.5" />
        <rect x="28" y="87" width="44" height="5" rx="1.5" fill="url(#premiumGoldGrad)" stroke="#554300" strokeWidth="1.5" />

        {/* Decorative inner details */}
        <path d="M 43 75 L 43 54 M 50 75 L 50 51 M 57 75 L 57 54" stroke="#554300" strokeWidth="1.5" />
        <circle cx="50" cy="62" r="3" fill="#FFFFFF" opacity="0.8" />
      </g>
    </svg>
  );
}

export default function ChessBoard({ NValue, state }: ChessBoardProps) {
  const { board, currentRow, currentCol, lastAction } = state;

  // Generate grid rows and cols array
  const rows = Array.from({ length: NValue }, (_, i) => i);
  const cols = Array.from({ length: NValue }, (_, i) => i);

  return (
    <div
      className="w-full h-full board-container grid"
      style={{
        gridTemplateColumns: `repeat(${NValue}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${NValue}, minmax(0, 1fr))`,
      }}
    >
      {rows.map((r) =>
        cols.map((c) => {
          const isDark = (r + c) % 2 !== 0;
          const hasQueen = board[r] === c;

          // Check if this specific cell is in a custom highlighting state
          const isTestingThisCell = currentRow === r && currentCol === c;
          const isFailedThisCell =
            lastAction &&
            lastAction.row === r &&
            lastAction.col === c &&
            lastAction.type === 'fail';

          const isPlacedThisCell =
            lastAction &&
            lastAction.row === r &&
            lastAction.col === c &&
            lastAction.type === 'placed';

          // Compile classes helper
          let cellColorsClass = isDark ? 'square-dark' : 'square-light';
          let highlightClass = '';

          if (isFailedThisCell) {
            highlightClass = 'bg-red-900/40 border border-red-500/60 shadow-inner scale-[0.98] transition-all duration-150';
          } else if (isTestingThisCell) {
            highlightClass = 'gold-glow border border-primary/40 scale-[1.02] ring-1 ring-primary/40';
          } else if (isPlacedThisCell) {
            highlightClass = 'bg-primary/5';
          }

          return (
            <div
              key={`${r}-${c}`}
              id={`square-${r}-${c}`}
              className={`square-transition flex items-center justify-center relative ${cellColorsClass} ${highlightClass}`}
            >
              {/* If grid size is manageable, show minimal coordinates on the borders */}
              {NValue <= 12 && (
                <>
                  {c === 0 && (
                    <span className="absolute left-1 top-1 text-[8px] opacity-40 font-mono text-on-surface select-none">
                      {NValue - r}
                    </span>
                  )}
                  {r === NValue - 1 && (
                    <span className="absolute right-1 bottom-1 text-[8px] opacity-40 font-mono text-on-surface select-none">
                      {String.fromCharCode(97 + c)}
                    </span>
                  )}
                </>
              )}

              {/* Render the Golden Queen if placed */}
              {hasQueen && <QueenIcon />}

              {/* Backtrack visual trace effect */}
              {lastAction &&
                lastAction.row === r &&
                lastAction.col === c &&
                lastAction.type === 'backtrack' && (
                  <div className="absolute inset-0 bg-secondary/15 animate-ping pointer-events-none rounded-sm"></div>
                )}
            </div>
          );
        })
      )}
    </div>
  );
}
