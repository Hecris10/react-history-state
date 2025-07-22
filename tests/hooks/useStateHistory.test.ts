import { act, renderHook } from '@testing-library/react-hooks';
import { useStateHistory } from '../../src/hooks/useStateHistory';

describe('useStateHistory', () => {
  describe('basic functionality', () => {
    it('should initialize with correct state', () => {
      const { result } = renderHook(() => useStateHistory('initial'));

      expect(result.current.state).toBe('initial');
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
      expect(result.current.history).toEqual(['initial']);
    });

    it('should update state correctly', () => {
      const { result } = renderHook(() => useStateHistory('initial'));

      act(() => {
        result.current.setState('updated');
      });

      expect(result.current.state).toBe('updated');
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);
      expect(result.current.history).toEqual(['initial', 'updated']);
    });

    it('should handle function updates', () => {
      const { result } = renderHook(() => useStateHistory(0));

      act(() => {
        result.current.setState(prev => prev + 1);
      });

      expect(result.current.state).toBe(1);
      expect(result.current.canUndo).toBe(true);
    });

    it('should undo to previous state', () => {
      const { result } = renderHook(() => useStateHistory('initial'));

      act(() => {
        result.current.setState('updated');
      });

      act(() => {
        result.current.undo();
      });

      expect(result.current.state).toBe('initial');
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(true);
    });

    it('should redo to next state', () => {
      const { result } = renderHook(() => useStateHistory('initial'));

      act(() => {
        result.current.setState('updated');
      });

      act(() => {
        result.current.undo();
      });

      act(() => {
        result.current.redo();
      });

      expect(result.current.state).toBe('updated');
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(false);
    });

    it('should reset to initial state', () => {
      const { result } = renderHook(() => useStateHistory('initial'));

      act(() => {
        result.current.setState('updated1');
        result.current.setState('updated2');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.state).toBe('initial');
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
      expect(result.current.history).toEqual(['initial']);
    });

    it('should clear history', () => {
      const { result } = renderHook(() => useStateHistory('initial'));

      act(() => {
        result.current.setState('updated1');
        result.current.setState('updated2');
      });

      act(() => {
        result.current.clear();
      });

      expect(result.current.state).toBe('updated2');
      expect(result.current.canUndo).toBe(false);
      expect(result.current.canRedo).toBe(false);
      expect(result.current.history).toEqual(['updated2']);
    });

    it('should go to specific index', () => {
      const { result } = renderHook(() => useStateHistory('initial'));

      act(() => {
        result.current.setState('updated1');
        result.current.setState('updated2');
        result.current.setState('updated3');
      });

      act(() => {
        result.current.goToIndex(1);
      });

      expect(result.current.state).toBe('updated1');
      expect(result.current.canUndo).toBe(true);
      expect(result.current.canRedo).toBe(true);
    });
  });

  describe('options', () => {
    it('should respect maxHistory option', () => {
      const { result } = renderHook(() => useStateHistory('initial', { maxHistory: 3 }));

      act(() => {
        result.current.setState('state1');
        result.current.setState('state2');
        result.current.setState('state3');
        result.current.setState('state4');
      });

      expect(result.current.history.length).toBe(3);
      expect(result.current.history).toEqual(['state2', 'state3', 'state4']);
    });

    it('should handle debouncing', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useStateHistory('initial', { debounceMs: 100 }));

      act(() => {
        result.current.setState('rapid1');
        result.current.setState('rapid2');
        result.current.setState('rapid3');
      });

      // State should not change immediately
      expect(result.current.state).toBe('initial');

      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Should only apply the last state change
      expect(result.current.state).toBe('rapid3');
      expect(result.current.history).toEqual(['initial', 'rapid3']);

      jest.useRealTimers();
    });

    it('should disable redo when enableRedo is false', () => {
      const { result } = renderHook(() => useStateHistory('initial', { enableRedo: false }));

      act(() => {
        result.current.setState('updated');
      });

      act(() => {
        result.current.undo();
      });

      expect(result.current.canRedo).toBe(false);

      act(() => {
        result.current.redo();
      });

      // Should remain at undone state
      expect(result.current.state).toBe('initial');
    });

    it('should validate options', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      const { result: result1 } = renderHook(() => useStateHistory('initial', { maxHistory: 0 }));
      expect(result1.error).toEqual(Error('maxHistory must be a positive number'));

      const { result: result2 } = renderHook(() => useStateHistory('initial', { debounceMs: -1 }));
      expect(result2.error).toEqual(Error('debounceMs must be a non-negative number'));

      consoleError.mockRestore();
    });
  });

  describe('complex state', () => {
    interface TestState {
      name: string;
      count: number;
      items: string[];
    }

    it('should handle complex object states', () => {
      const initialState: TestState = {
        name: 'test',
        count: 0,
        items: [],
      };

      const { result } = renderHook(() => useStateHistory(initialState));

      act(() => {
        result.current.setState({
          name: 'updated',
          count: 1,
          items: ['item1'],
        });
      });

      expect(result.current.state).toEqual({
        name: 'updated',
        count: 1,
        items: ['item1'],
      });

      act(() => {
        result.current.undo();
      });

      expect(result.current.state).toEqual(initialState);
    });

    it('should handle partial updates with function', () => {
      const { result } = renderHook(() => useStateHistory({ count: 0, name: 'test' }));

      act(() => {
        result.current.setState(prev => ({ ...prev, count: prev.count + 1 }));
      });

      expect(result.current.state).toEqual({ count: 1, name: 'test' });

      act(() => {
        result.current.setState(prev => ({ ...prev, name: 'updated' }));
      });

      expect(result.current.state).toEqual({ count: 1, name: 'updated' });
    });
  });

  describe('edge cases', () => {
    it('should handle multiple rapid undo/redo operations', () => {
      const { result } = renderHook(() => useStateHistory('initial'));

      // Create some history
      act(() => {
        result.current.setState('state1');
        result.current.setState('state2');
        result.current.setState('state3');
      });

      // Rapid undo operations
      act(() => {
        result.current.undo();
        result.current.undo();
        result.current.undo();
        result.current.undo(); // Should do nothing
      });

      expect(result.current.state).toBe('initial');
      expect(result.current.canUndo).toBe(false);

      // Rapid redo operations
      act(() => {
        result.current.redo();
        result.current.redo();
        result.current.redo();
        result.current.redo(); // Should do nothing
      });

      expect(result.current.state).toBe('state3');
      expect(result.current.canRedo).toBe(false);
    });

    it('should clear redo stack on new state after undo', () => {
      const { result } = renderHook(() => useStateHistory('initial'));

      act(() => {
        result.current.setState('state1');
        result.current.setState('state2');
      });

      act(() => {
        result.current.undo();
      });

      expect(result.current.canRedo).toBe(true);

      act(() => {
        result.current.setState('newState');
      });

      expect(result.current.canRedo).toBe(false);
      expect(result.current.history).toEqual(['initial', 'state1', 'newState']);
    });

    it('should handle invalid goToIndex values', () => {
      const { result } = renderHook(() => useStateHistory('initial'));

      act(() => {
        result.current.setState('state1');
        result.current.setState('state2');
      });

      act(() => {
        result.current.goToIndex(-1);
      });

      expect(result.current.state).toBe('initial');

      act(() => {
        result.current.goToIndex(100);
      });

      expect(result.current.state).toBe('state2');
    });
  });
});
