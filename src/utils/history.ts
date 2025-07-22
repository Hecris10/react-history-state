import type { HistoryAction, HistoryState } from '../types';

/**
 * Options for creating a history manager
 */
interface HistoryManagerOptions {
  maxHistory: number;
  enableRedo: boolean;
}

/**
 * History manager interface
 */
export interface HistoryManager<T> {
  getState(): HistoryState<T>;
  setState(value: T): HistoryState<T>;
  undo(): HistoryState<T>;
  redo(): HistoryState<T>;
  reset(): HistoryState<T>;
  clear(): HistoryState<T>;
  goToIndex(index: number): HistoryState<T>;
}

/**
 * Reducer function for managing history state
 */
function historyReducer<T>(
  state: HistoryState<T>,
  action: HistoryAction<T>,
  options: HistoryManagerOptions
): HistoryState<T> {
  switch (action.type) {
    case 'SET_STATE': {
      const newHistory = state.history.slice(0, state.currentIndex + 1);
      newHistory.push(action.payload);
      
      // Respect maxHistory limit
      const trimmedHistory = newHistory.length > options.maxHistory
        ? newHistory.slice(-options.maxHistory)
        : newHistory;
        
      return {
        ...state,
        history: trimmedHistory,
        currentIndex: trimmedHistory.length - 1,
      };
    }
    
    case 'UNDO': {
      if (state.currentIndex > 0) {
        return {
          ...state,
          currentIndex: state.currentIndex - 1,
        };
      }
      return state;
    }
    
    case 'REDO': {
      if (options.enableRedo && state.currentIndex < state.history.length - 1) {
        return {
          ...state,
          currentIndex: state.currentIndex + 1,
        };
      }
      return state;
    }
    
    case 'RESET': {
      return {
        ...state,
        history: [state.initialState],
        currentIndex: 0,
      };
    }
    
    case 'CLEAR': {
      const currentState = state.history[state.currentIndex];
      return {
        ...state,
        history: [currentState],
        currentIndex: 0,
      };
    }
    
    case 'GO_TO_INDEX': {
      const targetIndex = Math.max(0, Math.min(action.payload, state.history.length - 1));
      return {
        ...state,
        currentIndex: targetIndex,
      };
    }
    
    default:
      return state;
  }
}

/**
 * Creates a history manager for managing state history
 * 
 * @param initialState - The initial state value
 * @param options - Configuration options
 * @returns A history manager instance
 */
export function createHistoryManager<T>(
  initialState: T,
  options: HistoryManagerOptions
): HistoryManager<T> {
  let currentState: HistoryState<T> = {
    history: [initialState],
    currentIndex: 0,
    initialState,
  };

  return {
    getState(): HistoryState<T> {
      return currentState;
    },

    setState(value: T): HistoryState<T> {
      currentState = historyReducer(currentState, { type: 'SET_STATE', payload: value }, options);
      return currentState;
    },

    undo(): HistoryState<T> {
      currentState = historyReducer(currentState, { type: 'UNDO' }, options);
      return currentState;
    },

    redo(): HistoryState<T> {
      currentState = historyReducer(currentState, { type: 'REDO' }, options);
      return currentState;
    },

    reset(): HistoryState<T> {
      currentState = historyReducer(currentState, { type: 'RESET' }, options);
      return currentState;
    },

    clear(): HistoryState<T> {
      currentState = historyReducer(currentState, { type: 'CLEAR' }, options);
      return currentState;
    },

    goToIndex(index: number): HistoryState<T> {
      currentState = historyReducer(currentState, { type: 'GO_TO_INDEX', payload: index }, options);
      return currentState;
    },
  };
} 