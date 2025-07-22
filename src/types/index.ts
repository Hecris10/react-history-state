/**
 * Configuration options for useStateHistory hook
 */
export interface StateHistoryOptions<T = unknown> {
  /**
   * Maximum number of history entries to keep
   * @default 50
   */
  readonly maxHistory?: number;

  /**
   * Debounce time in milliseconds for state changes
   * @default 0
   */
  readonly debounceMs?: number;

  /**
   * Whether to enable redo functionality
   * @default true
   */
  readonly enableRedo?: boolean;

  /**
   * Optional callback called after each state change
   * Receives the new value of type T
   */
  readonly onValueChange?: (value: T) => void;
}

/**
 * Result object returned by useStateHistory hook
 */
export interface StateHistoryResult<T> {
  /**
   * Current state value
   */
  readonly state: T;

  /**
   * Function to update the state
   */
  readonly setState: (value: T | ((prev: T) => T)) => void;

  /**
   * Function to undo the last change
   */
  readonly undo: () => void;

  /**
   * Function to redo the next change
   */
  readonly redo: () => void;

  /**
   * Whether undo is available
   */
  readonly canUndo: boolean;

  /**
   * Whether redo is available
   */
  readonly canRedo: boolean;

  /**
   * Array of all history states (read-only copy)
   */
  readonly history: readonly T[];

  /**
   * Function to reset to initial state
   */
  readonly reset: () => void;

  /**
   * Function to clear all history
   */
  readonly clear: () => void;

  /**
   * Function to jump to a specific history index
   */
  readonly goToIndex: (index: number) => void;
}

/**
 * Internal history manager state
 */
export interface HistoryState<T> {
  readonly history: T[];
  readonly currentIndex: number;
  readonly initialState: T;
}

/**
 * History manager actions
 */
export type HistoryAction<T> =
  | { type: 'SET_STATE'; payload: T }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }
  | { type: 'CLEAR' }
  | { type: 'GO_TO_INDEX'; payload: number };
