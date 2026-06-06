/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SolverStatus = 'ready' | 'processing' | 'paused' | 'secured' | 'failed';

export type SpeedOption = 'slow' | 'med' | 'fast';

export interface SolverStepInfo {
  row: number;
  col: number;
  type: 'test' | 'success' | 'fail' | 'backtrack' | 'placed';
}

export interface SolverState {
  board: number[]; // Index represents Row, value represents Column (-1 if none)
  currentRow: number;
  currentCol: number;
  isBacktracking: boolean;
  status: SolverStatus;
  attempts: number;
  backtracks: number;
  solutionsFound: number;
  lastAction: SolverStepInfo | null;
}
