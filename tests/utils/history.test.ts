import { createHistoryManager } from '../../src/utils/history';

describe('createHistoryManager', () => {
  describe('basic functionality', () => {
    it('should initialize with correct state', () => {
      const manager = createHistoryManager('initial', {
        maxHistory: 10,
        enableRedo: true,
      });

      const state = manager.getState();

      expect(state.history).toEqual(['initial']);
      expect(state.currentIndex).toBe(0);
      expect(state.initialState).toBe('initial');
    });

    it('should handle state updates', () => {
      const manager = createHistoryManager('initial', {
        maxHistory: 10,
        enableRedo: true,
      });

      let state = manager.setState('updated');

      expect(state.history).toEqual(['initial', 'updated']);
      expect(state.currentIndex).toBe(1);
    });

    it('should handle undo operations', () => {
      const manager = createHistoryManager('initial', {
        maxHistory: 10,
        enableRedo: true,
      });

      manager.setState('updated');
      const state = manager.undo();

      expect(state.currentIndex).toBe(0);
      expect(state.history[state.currentIndex]).toBe('initial');
    });

    it('should handle redo operations', () => {
      const manager = createHistoryManager('initial', {
        maxHistory: 10,
        enableRedo: true,
      });

      manager.setState('updated');
      manager.undo();
      const state = manager.redo();

      expect(state.currentIndex).toBe(1);
      expect(state.history[state.currentIndex]).toBe('updated');
    });

    it('should reset to initial state', () => {
      const manager = createHistoryManager('initial', {
        maxHistory: 10,
        enableRedo: true,
      });

      manager.setState('updated');
      manager.setState('updated2');
      const state = manager.reset();

      expect(state.history).toEqual(['initial']);
      expect(state.currentIndex).toBe(0);
    });

    it('should clear history', () => {
      const manager = createHistoryManager('initial', {
        maxHistory: 10,
        enableRedo: true,
      });

      manager.setState('updated');
      const state = manager.clear();

      expect(state.history).toEqual(['updated']);
      expect(state.currentIndex).toBe(0);
    });

    it('should respect maxHistory limit', () => {
      const manager = createHistoryManager('initial', {
        maxHistory: 3,
        enableRedo: true,
      });

      manager.setState('state1');
      manager.setState('state2');
      manager.setState('state3');
      const state = manager.setState('state4');

      expect(state.history.length).toBe(3);
      expect(state.history).toEqual(['state2', 'state3', 'state4']);
    });
  });

  describe('complex state objects', () => {
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

      const manager = createHistoryManager(initialState, {
        maxHistory: 10,
        enableRedo: true,
      });

      const updatedState: TestState = {
        name: 'updated',
        count: 1,
        items: ['item1'],
      };

      const state = manager.setState(updatedState);

      expect(state.history.length).toBe(2);
      expect(state.history[1]).toEqual(updatedState);
      expect(state.currentIndex).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('should handle undo when no previous history exists', () => {
      const manager = createHistoryManager('initial', {
        maxHistory: 10,
        enableRedo: true,
      });

      const state = manager.undo();

      expect(state.currentIndex).toBe(0);
      expect(state.history).toEqual(['initial']);
    });

    it('should handle redo when at latest state', () => {
      const manager = createHistoryManager('initial', {
        maxHistory: 10,
        enableRedo: true,
      });

      manager.setState('updated');
      const state = manager.redo();

      expect(state.currentIndex).toBe(1);
    });

    it('should handle goToIndex with valid index', () => {
      const manager = createHistoryManager('initial', {
        maxHistory: 10,
        enableRedo: true,
      });

      manager.setState('state1');
      manager.setState('state2');
      const state = manager.goToIndex(0);

      expect(state.currentIndex).toBe(0);
      expect(state.history[state.currentIndex]).toBe('initial');
    });

    it('should handle goToIndex with invalid index', () => {
      const manager = createHistoryManager('initial', {
        maxHistory: 10,
        enableRedo: true,
      });

      manager.setState('state1');
      let state = manager.goToIndex(-1);
      expect(state.currentIndex).toBe(0);

      state = manager.goToIndex(10);
      expect(state.currentIndex).toBe(1);
    });

    it('should handle disabled redo', () => {
      const manager = createHistoryManager('initial', {
        maxHistory: 10,
        enableRedo: false,
      });

      manager.setState('updated');
      manager.undo();
      const state = manager.redo();

      // Should remain at undo position when redo is disabled
      expect(state.currentIndex).toBe(0);
    });
  });
});
