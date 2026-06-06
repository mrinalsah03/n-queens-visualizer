/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SolverState, SolverStepInfo } from '../types';

/**
 * Checks if a queen can be safely placed at (row, col) given current configurations.
 */
export function isSafe(board: number[], row: number, col: number): boolean {
  for (let i = 0; i < row; i++) {
    const placedCol = board[i];
    if (placedCol === col) return false;
    if (Math.abs(placedCol - col) === Math.abs(i - row)) return false;
  }
  return true;
}

/**
 * Computes the next state in N-Queens algorithm backtracking simulation.
 */
export function executeStep(state: SolverState, N: number): SolverState {
  if (state.status === 'secured' || state.status === 'failed') {
    return state;
  }

  const board = [...state.board];
  let r = state.currentRow;
  let c = state.currentCol;
  let isBacktracking = state.isBacktracking;
  let attempts = state.attempts;
  let backtracks = state.backtracks;
  let solutionsFound = state.solutionsFound;
  let status: SolverState['status'] = state.status;
  let lastAction: SolverStepInfo | null = null;

  // Handle case where we need to backtrack from the previous row because columns were exhausted
  if (isBacktracking) {
    if (r < 0) {
      return {
        ...state,
        status: 'failed',
        lastAction: null,
      };
    }

    const prevCol = board[r];
    if (prevCol !== undefined && prevCol !== -1) {
      board[r] = -1; // remove queen
      backtracks += 1;
      lastAction = { row: r, col: prevCol, type: 'backtrack' };

      const nextCol = prevCol + 1;
      if (nextCol < N) {
        return {
          ...state,
          board,
          currentRow: r,
          currentCol: nextCol,
          isBacktracking: false,
          backtracks,
          lastAction,
        };
      } else {
        return {
          ...state,
          board,
          currentRow: r - 1,
          currentCol: N,
          isBacktracking: true,
          backtracks,
          lastAction,
        };
      }
    } else {
      // Just step up if there's no placed col
      return {
        ...state,
        currentRow: r - 1,
        currentCol: N,
        isBacktracking: true,
        lastAction: null,
      };
    }
  }

  // Did we reach the last row and successfully place all queens?
  if (r === N) {
    status = 'secured';
    return {
      ...state,
      status,
      solutionsFound: solutionsFound + 1,
      lastAction: r > 0 ? { row: r - 1, col: board[r - 1], type: 'success' } : null,
    };
  }

  // If this column is out of range, this row is completely exhausted
  if (c >= N) {
    return {
      ...state,
      isBacktracking: true,
      currentRow: r - 1,
      lastAction: null,
    };
  }

  // Try placing a queen at (r, c)
  attempts += 1;
  const safe = isSafe(board, r, c);

  if (safe) {
    board[r] = c;
    lastAction = { row: r, col: c, type: 'placed' };
    return {
      ...state,
      board,
      currentRow: r + 1,
      currentCol: 0,
      attempts,
      lastAction,
    };
  } else {
    lastAction = { row: r, col: c, type: 'fail' };
    const nextCol = c + 1;
    if (nextCol < N) {
      return {
        ...state,
        currentCol: nextCol,
        attempts,
        lastAction,
      };
    } else {
      return {
        ...state,
        currentCol: N, // This will trigger backtracking on the next step
        attempts,
        lastAction,
      };
    }
  }
}
