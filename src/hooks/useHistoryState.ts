import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { StateHistoryOptions, StateHistoryResult } from '../types';
import { createHistoryManager } from '../utils';

/**
 * A React hook that provides state management with undo/redo capabilities.
 *
 * @template T - The type of the state value
 * @param initialState - The initial state value
 * @param options - Configuration options for the hook
 * @returns An object containing the current state and history management functions
 *
 * @example
 * ```tsx
 * const { state, setState, undo, redo } = useHistoryState('initial');
 * ```
 */
export function useHistoryState<T>(
  initialState: T,
  options: StateHistoryOptions = {}
): StateHistoryResult<T> {
  // Validate options
  if (options.maxHistory !== undefined && options.maxHistory < 1) {
    throw new Error('maxHistory must be a positive number');
  }

  if (options.debounceMs !== undefined && options.debounceMs < 0) {
    throw new Error('debounceMs must be a non-negative number');
  }

  const { maxHistory = 50, debounceMs = 0, enableRedo = true } = options;

  // Initialize history manager
  const historyManager = useMemo(
    () => createHistoryManager(initialState, { maxHistory, enableRedo }),
    [initialState, maxHistory, enableRedo]
  );

  const [historyState, setHistoryState] = useState(historyManager.getState());
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle debounced state updates
  const setState = useCallback(
    (value: T | ((prev: T) => T)) => {
      const currentValue =
        historyState.history[historyState.currentIndex] ?? historyState.initialState;
      const newValue =
        typeof value === 'function' ? (value as (prev: T) => T)(currentValue) : value;

      if (debounceMs > 0) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
          const newState = historyManager.setState(newValue);
          setHistoryState(newState);
        }, debounceMs);
      } else {
        const newState = historyManager.setState(newValue);
        setHistoryState(newState);
      }
    },
    [historyManager, historyState, debounceMs]
  );

  const undo = useCallback(() => {
    const newState = historyManager.undo();
    setHistoryState(newState);
  }, [historyManager]);

  const redo = useCallback(() => {
    const newState = historyManager.redo();
    setHistoryState(newState);
  }, [historyManager]);

  const reset = useCallback(() => {
    const newState = historyManager.reset();
    setHistoryState(newState);
  }, [historyManager]);

  const clear = useCallback(() => {
    const newState = historyManager.clear();
    setHistoryState(newState);
  }, [historyManager]);

  const goToIndex = useCallback(
    (index: number) => {
      const newState = historyManager.goToIndex(index);
      setHistoryState(newState);
    },
    [historyManager]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return useMemo(
    () => ({
      state: historyState.history[historyState.currentIndex] ?? historyState.initialState,
      setState,
      undo,
      redo,
      canUndo: historyState.currentIndex > 0,
      canRedo: enableRedo && historyState.currentIndex < historyState.history.length - 1,
      history: historyState.history.slice(),
      reset,
      clear,
      goToIndex,
    }),
    [historyState, setState, undo, redo, enableRedo, reset, clear, goToIndex]
  );
}
