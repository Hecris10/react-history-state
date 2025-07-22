# Development Guide for react-history-state

This guide provides detailed information about the project architecture,
patterns, and development practices for Cursor IDE and developers.

## Architecture Overview

### Core Components

1. **useHistoryState Hook** (`src/hooks/useHistoryState.ts`)
   - Main API entry point
   - Handles React state management and lifecycle
   - Integrates with history manager utility
   - Provides debouncing functionality

2. **History Manager** (`src/utils/history.ts`)
   - Core state history logic
   - Pure functions with no React dependencies
   - Implements reducer pattern for state transitions
   - Manages history limits and memory optimization

3. **Type Definitions** (`src/types/index.ts`)
   - Complete TypeScript interface definitions
   - Generic type constraints for type safety
   - Readonly interfaces for immutability

### Design Patterns

#### Separation of Concerns

- **React layer**: Hooks handle React-specific concerns (effects, callbacks,
  memoization)
- **Business logic layer**: Pure utility functions handle history management
- **Type layer**: Comprehensive TypeScript definitions ensure type safety

#### Immutability

- All state updates create new objects
- History arrays are immutable
- Read-only interfaces prevent accidental mutations

#### Performance Optimization

- Memoization with `useMemo` and `useCallback`
- Debouncing for rapid state changes
- Efficient array operations for history management
- Memory limits to prevent memory leaks

## Code Organization

### File Structure

```
src/
├── hooks/           # React hooks
├── utils/           # Pure utility functions
├── types/           # TypeScript definitions
└── index.ts         # Main exports

tests/
├── __setup__/       # Test configuration
├── hooks/           # Hook tests
└── utils/           # Utility tests

examples/            # Usage examples
docs/               # Documentation
```

### Import Patterns

```typescript
// External dependencies first
import { useState, useCallback } from 'react';

// Internal types
import type { StateHistoryOptions } from '../types';

// Internal utilities
import { createHistoryManager } from '../utils';
```

### Export Patterns

```typescript
// Named exports preferred
export { useHistoryState } from './hooks';
export type { StateHistoryOptions } from './types';

// Barrel exports in index files
export { useHistoryState } from './useHistoryState';
```

## TypeScript Patterns

### Generic Constraints

```typescript
// Use proper generic constraints
export function useHistoryState<T>(
  initialState: T,
  options: StateHistoryOptions = {}
): StateHistoryResult<T> {
  // Implementation
}
```

### Interface Design

```typescript
// Use readonly for immutable properties
export interface StateHistoryResult<T> {
  readonly state: T;
  readonly canUndo: boolean;
  readonly history: readonly T[];
}

// Use optional properties with defaults
export interface StateHistoryOptions<T = unknown> {
  readonly maxHistory?: number; // Default: 50
  readonly debounceMs?: number; // Default: 0
  readonly enableRedo?: boolean; // Default: true
  readonly onValueChange?: (value: T) => void; // Called after setState, not on undo/redo/reset/clear/goToIndex
}
```

### Type Guards

```typescript
// Use type guards for runtime safety
function isValidHistoryIndex(index: number, length: number): boolean {
  return index >= 0 && index < length;
}
```

## React Patterns

### Hook Structure

```typescript
export function useHistoryState<T>(
  initialState: T,
  options: StateHistoryOptions = {}
): StateHistoryResult<T> {
  // 1. Input validation
  if (options.maxHistory !== undefined && options.maxHistory < 1) {
    throw new Error('maxHistory must be a positive number');
  }

  // 2. Configuration with defaults
  const { maxHistory = 50, debounceMs = 0 } = options;

  // 3. State initialization
  const [state, setState] = useState(initialValue);

  // 4. Memoized utilities
  const historyManager = useMemo(
    () => createHistoryManager(initialState, options),
    [initialState, maxHistory]
  );

  // 5. Callback functions
  const updateState = useCallback(
    (value: T) => {
      // Implementation
    },
    [dependencies]
  );

  // 6. Return memoized result
  return useMemo(
    () => ({
      state,
      setState: updateState,
      // ... other properties
    }),
    [state, updateState /* other dependencies */]
  );
}
```

### Performance Best Practices

```typescript
// ✅ Memoize expensive computations
const memoizedValue = useMemo(() => {
  return expensiveComputation(dependency);
}, [dependency]);

// ✅ Memoize callback functions
const memoizedCallback = useCallback(
  (value: T) => {
    // Implementation
  },
  [dependency]
);

// ✅ Memoize return objects
return useMemo(
  () => ({
    property: value,
    method: memoizedCallback,
  }),
  [value, memoizedCallback]
);
```

## Testing Patterns

### Hook Testing

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useHistoryState } from '../useHistoryState';

describe('useHistoryState', () => {
  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useHistoryState('initial'));

    expect(result.current.state).toBe('initial');
    expect(result.current.canUndo).toBe(false);
  });

  it('should handle state updates', () => {
    const { result } = renderHook(() => useHistoryState('initial'));

    act(() => {
      result.current.setState('updated');
    });

    expect(result.current.state).toBe('updated');
    expect(result.current.canUndo).toBe(true);
  });
});
```

### Utility Testing

```typescript
import { createHistoryManager } from '../history';

describe('createHistoryManager', () => {
  it('should manage state transitions', () => {
    const manager = createHistoryManager('initial', {
      maxHistory: 10,
      enableRedo: true,
    });

    let state = manager.setState('updated');
    expect(state.history).toEqual(['initial', 'updated']);

    state = manager.undo();
    expect(state.currentIndex).toBe(0);
  });
});
```

## Error Handling

### Input Validation

```typescript
// Validate configuration options
if (options.maxHistory !== undefined && options.maxHistory < 1) {
  throw new Error('maxHistory must be a positive number');
}

// Validate runtime parameters
if (index < 0 || index >= history.length) {
  console.warn(`Invalid history index: ${index}`);
  return currentState;
}
```

### Graceful Degradation

```typescript
// Handle edge cases gracefully
const undo = useCallback(() => {
  if (canUndo) {
    // Perform undo
  } else {
    console.warn('No history to undo');
  }
}, [canUndo]);
```

## Performance Considerations

### Memory Management

- Implement `maxHistory` limits to prevent memory leaks
- Use efficient array operations (slice, not splice for immutability)
- Clean up timers and references in useEffect cleanup

### Debouncing Strategy

- Use `setTimeout` for debouncing rapid state changes
- Clear previous timeouts to prevent stale updates
- Cleanup timers on component unmount

### Optimization Guidelines

- Memoize all callback functions with proper dependencies
- Use `useMemo` for expensive computations
- Avoid creating new objects in render loops
- Implement shallow comparison for state equality

## Integration Patterns

### With Forms

```typescript
const FormWithHistory = () => {
  const { state, setState, undo, redo } = useHistoryState({
    name: '',
    email: ''
  });

  const updateField = useCallback((field: string, value: string) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, [setState]);

  return (
    <form>
      <input
        value={state.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      {/* Other form fields */}
    </form>
  );
};
```

### With Keyboard Shortcuts

```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [undo, redo]);
```

## Common Issues and Solutions

### Issue: State not updating immediately with debouncing

**Solution**: Debouncing delays state updates. Use lower `debounceMs` or disable
for immediate feedback.

### Issue: Memory usage growing over time

**Solution**: Set appropriate `maxHistory` limit based on your use case.

### Issue: Redo not working after new state change

**Solution**: This is expected behavior. New state changes clear the redo stack.

### Issue: Performance issues with large state objects

**Solution**: Consider using `useMemo` for expensive state computations or
implement custom equality checks.

## Best Practices Summary

1. **Always use TypeScript** with strict mode enabled
2. **Never use `any` type** - use proper types, `unknown`, or specific
   interfaces
3. **Memoize callbacks** and expensive computations
4. **Validate inputs** and handle edge cases gracefully
5. **Write comprehensive tests** with good coverage
6. **Document APIs** with JSDoc comments
7. **Follow React hooks rules** (no conditional calls, etc.)
8. **Use meaningful variable names** and consistent patterns
9. **Optimize for performance** but measure first
10. **Handle cleanup properly** in useEffect
11. **Keep business logic separate** from React concerns
