# react-state-history

[![npm version](https://badge.fury.io/js/react-state-history.svg)](https://www.npmjs.com/package/react-state-history)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight React library that provides state management with built-in undo and redo capabilities. Perfect for building applications that need history tracking, such as text editors, drawing applications, form builders, or any interactive UI where users might want to revert changes.

## Features

- 🚀 **Simple API** - Easy to integrate with existing React applications
- 📦 **TypeScript Support** - Fully typed with excellent IntelliSense
- 🔄 **Undo/Redo** - Built-in history management with configurable limits
- 🎯 **React Hooks** - Modern React patterns with custom hooks
- 📱 **Lightweight** - Minimal bundle size with no external dependencies
- ⚡ **Performance** - Optimized for frequent state updates
- 🧪 **Well Tested** - Comprehensive test coverage

## Installation

```bash
# Using pnpm (recommended)
pnpm add react-history-state

# Using npm
npm install react-history-state

# Using yarn
yarn add react-history-state
```

## Quick Start

```tsx
import { useHistoryState } from 'react-history-state';

function MyComponent() {
  const {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
    reset
  } = useHistoryState('initial value');

  return (
    <div>
      <input
        value={state}
        onChange={(e) => setState(e.target.value)}
      />

      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>

      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>

      <button onClick={reset}>
        Reset
      </button>

      <p>History length: {history.length}</p>
    </div>
  );
}
```

## API Reference

### `useHistoryState<T>(initialState: T, options?: Options)`

The main hook that provides state management with history capabilities.

#### Parameters

- `initialState: T` - The initial state value
- `options?: Options` - Configuration options (optional)

#### Options

```typescript
interface Options {
  maxHistory?: number; // Maximum history entries (default: 50)
  debounceMs?: number; // Debounce state changes (default: 0)
  enableRedo?: boolean; // Enable redo functionality (default: true)
  onValueChange?: (value: T) => void; // Optional callback after each setState
}
```

#### Returns

```typescript
interface StateHistory<T> {
  state: T;                    // Current state value
  setState: (value: T | ((prev: T) => T)) => void; // Update state
  undo: () => void;           // Undo last change
  redo: () => void;           // Redo next change
  canUndo: boolean;           // Whether undo is available
  canRedo: boolean;           // Whether redo is available
  history: T[];               // Array of all history states
  reset: () => void;          // Reset to initial state
  clear: () => void;          // Clear all history
  goToIndex: (index: number) => void; // Jump to specific history index
}
```

## Advanced Usage

### Complex State Objects

```tsx
interface FormData {
  name: string;
  email: string;
  age: number;
}

function FormComponent() {
  const { state, setState, undo, redo, canUndo, canRedo } = useHistoryState<FormData>({
    name: '',
    email: '',
    age: 0
  });

  const updateName = (name: string) => {
    setState(prev => ({ ...prev, name }));
  };

  const updateEmail = (email: string) => {
    setState(prev => ({ ...prev, email }));
  };

  return (
    <form>
      <input
        value={state.name}
        onChange={(e) => updateName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={state.email}
        onChange={(e) => updateEmail(e.target.value)}
        placeholder="Email"
      />

      <div>
        <button type="button" onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button type="button" onClick={redo} disabled={!canRedo}>
          Redo
        </button>
      </div>
    </form>
  );
}
```

### With Options

```tsx
function TextEditor() {
  const { state, setState, undo, redo, canUndo, canRedo } = useHistoryState('', {
    maxHistory: 100,        // Keep up to 100 history entries
    debounceMs: 300,        // Debounce rapid changes by 300ms
    enableRedo: true,       // Enable redo functionality
    onValueChange: (val) => {
      console.log('State changed to:', val);
    },
  });

  return (
    <div>
      <textarea
        value={state}
        onChange={(e) => setState(e.target.value)}
        rows={10}
        cols={50}
      />

      <div>
        <button onClick={undo} disabled={!canUndo}>
          Undo (Ctrl+Z)
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo (Ctrl+Y)
        </button>
      </div>
    </div>
  );
}
```

### Keyboard Shortcuts

```tsx
import { useEffect } from 'react';
import { useHistoryState } from 'react-history-state';

function ComponentWithKeyboardShortcuts() {
  const { state, setState, undo, redo, canUndo, canRedo } = useHistoryState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey && canUndo) {
          e.preventDefault();
          undo();
        } else if ((e.key === 'y' || (e.key === 'z' && e.shiftKey)) && canRedo) {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <textarea
      value={state}
      onChange={(e) => setState(e.target.value)}
    />
  );
}
```

## Development

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and setup instructions.

### Building

```bash
pnpm install
pnpm run build
```

### Testing

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
```

### Linting

```bash
pnpm run lint
pnpm run lint:fix
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] Branching history support
- [ ] Custom serialization/deserialization
- [ ] History compression for large states
- [ ] React DevTools integration
- [ ] Time-travel debugging features
- [ ] Persistence adapters (localStorage, IndexedDB, etc.)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.
