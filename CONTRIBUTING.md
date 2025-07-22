# Contributing to react-state-history

Thank you for your interest in contributing to react-state-history! This
document provides guidelines and patterns that all contributors should follow.

## Development Setup

### Prerequisites

- Node.js >= 16
- pnpm >= 8 (preferred package manager)
- Git

### Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/react-state-history.git
   cd react-state-history
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Project Structure and Patterns

### Directory Structure

```
react-state-history/
├── src/                    # Source code
│   ├── hooks/             # React hooks
│   │   ├── useStateHistory.ts
│   │   └── index.ts
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── history.ts
│   │   └── index.ts
│   └── index.ts           # Main entry point
├── tests/                 # Test files
│   ├── __setup__/         # Test setup and utilities
│   ├── hooks/             # Hook tests
│   └── utils/             # Utility tests
├── examples/              # Usage examples
├── docs/                  # Additional documentation
├── dist/                  # Built files (generated)
└── coverage/              # Test coverage reports (generated)
```

### Code Style and Standards

#### TypeScript Guidelines

1. **Always use TypeScript**: All source code must be written in TypeScript
2. **NO `any` types**: Absolutely forbidden - use proper types, `unknown`, or
   specific object types
3. **Strict typing**: Enable strict mode and maximum type safety
4. **Generic constraints**: Use proper generic constraints for type safety
5. **Interface over type**: Prefer interfaces for object shapes
6. **Explicit return types**: Always specify return types for public APIs

```typescript
// ✅ Good
interface StateHistoryOptions {
  readonly maxHistory?: number;
  readonly debounceMs?: number;
  readonly enableRedo?: boolean;
}

export function useStateHistory<T>(
  initialState: T,
  options: StateHistoryOptions = {}
): StateHistoryResult<T> {
  // implementation
}

// ❌ Bad - Never use any
export function useStateHistory(initialState: any, options?: any) {
  // implementation
}

// ❌ Also bad - Avoid any even with type assertions
const someValue = JSON.parse(jsonString) as any;

// ✅ Good alternatives to any
const someValue = JSON.parse(jsonString) as unknown;
// or
const someValue: Record<string, unknown> = JSON.parse(jsonString);
// or
interface ExpectedShape {
  name: string;
  age: number;
}
const someValue = JSON.parse(jsonString) as ExpectedShape;
```

#### React Patterns

1. **Custom Hooks**: Follow React hooks conventions
2. **Pure Functions**: Keep components and utilities pure when possible
3. **Memoization**: Use `useMemo` and `useCallback` appropriately
4. **Dependencies**: Always specify correct dependency arrays

```typescript
// ✅ Good - Proper hook structure
export function useStateHistory<T>(
  initialState: T,
  options: StateHistoryOptions = {}
): StateHistoryResult<T> {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setState = useCallback(
    (value: T | ((prev: T) => T)) => {
      // implementation
    },
    [currentIndex, options.maxHistory]
  );

  return useMemo(
    () => ({
      state: history[currentIndex],
      setState,
      undo: () => {
        /* implementation */
      },
      redo: () => {
        /* implementation */
      },
      canUndo: currentIndex > 0,
      canRedo: currentIndex < history.length - 1,
      history: history.slice(),
      reset: () => {
        /* implementation */
      },
      clear: () => {
        /* implementation */
      },
      goToIndex: (index: number) => {
        /* implementation */
      },
    }),
    [history, currentIndex, setState]
  );
}
```

#### Performance Guidelines

1. **Avoid unnecessary re-renders**: Use proper memoization
2. **Optimize large histories**: Implement efficient history management
3. **Debounce rapid updates**: Support debouncing for performance
4. **Memory management**: Clean up old history entries based on `maxHistory`

```typescript
// ✅ Good - Efficient history management
const addToHistory = useCallback(
  (newState: T) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newState);

      // Respect maxHistory limit
      if (newHistory.length > maxHistory) {
        return newHistory.slice(-maxHistory);
      }

      return newHistory;
    });
  },
  [currentIndex, maxHistory]
);
```

### Testing Patterns

#### Test Structure

1. **Comprehensive coverage**: Aim for 100% test coverage
2. **Unit tests**: Test individual functions and hooks
3. **Integration tests**: Test component integration scenarios
4. **Edge cases**: Always test edge cases and error conditions

```typescript
// ✅ Good test structure
describe('useStateHistory', () => {
  describe('basic functionality', () => {
    it('should initialize with initial state', () => {
      // test implementation
    });

    it('should update state correctly', () => {
      // test implementation
    });
  });

  describe('undo functionality', () => {
    it('should undo to previous state', () => {
      // test implementation
    });

    it('should not undo when no history exists', () => {
      // test implementation
    });
  });

  describe('edge cases', () => {
    it('should handle undefined initial state', () => {
      // test implementation
    });

    it('should respect maxHistory limit', () => {
      // test implementation
    });
  });
});
```

#### Testing Utilities

```typescript
// Custom testing utilities
export const renderHookWithHistory = <T>(
  initialState: T,
  options?: StateHistoryOptions
) => {
  return renderHook(() => useStateHistory(initialState, options));
};
```

### Error Handling

1. **Graceful degradation**: Handle errors gracefully
2. **Informative errors**: Provide clear error messages
3. **Type guards**: Use type guards for runtime safety
4. **Validation**: Validate inputs and configurations

```typescript
// ✅ Good error handling
export function useStateHistory<T>(
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

  // Rest of implementation
}
```

### Documentation Standards

1. **JSDoc comments**: Document all public APIs
2. **Type annotations**: Include detailed type information
3. **Usage examples**: Provide practical examples
4. **README updates**: Update README for any API changes

````typescript
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
 * const { state, setState, undo, redo } = useStateHistory('initial');
 * ```
 */
export function useStateHistory<T>(
  initialState: T,
  options: StateHistoryOptions = {}
): StateHistoryResult<T> {
  // implementation
}
````

## Development Workflow

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation updates
- `refactor/refactoring-description` - Code refactoring
- `test/test-description` - Test improvements

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

Examples:

```
feat(hooks): add debouncing support to useStateHistory
fix(utils): handle edge case in history management
docs(readme): update API documentation with new options
```

### Pull Request Process

1. **Update documentation**: Ensure all changes are documented
2. **Add tests**: Include comprehensive tests for new features
3. **Run checks**: Ensure all linting and tests pass
4. **Update changelog**: Add entry to CHANGELOG.md
5. **Fill PR template**: Provide clear description of changes

### Code Review Guidelines

#### For Reviewers

1. **Check tests**: Ensure adequate test coverage
2. **Verify documentation**: Check that docs match implementation
3. **Performance review**: Consider performance implications
4. **API consistency**: Ensure consistency with existing APIs
5. **TypeScript usage**: Verify proper type usage

#### For Authors

1. **Self-review**: Review your own changes first
2. **Address feedback**: Respond to all review comments
3. **Update based on feedback**: Make requested changes
4. **Rebase if needed**: Keep commits clean and logical

## Build and Release

### Local Development

```bash
# Install dependencies
pnpm install

# Start development mode
pnpm run dev

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Lint code
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Type check
pnpm run type-check

# Build for production
pnpm run build
```

### Quality Gates

Before submitting a PR, ensure:

- [ ] All tests pass (`pnpm test`)
- [ ] No linting errors (`pnpm run lint`)
- [ ] No TypeScript errors (`pnpm run type-check`)
- [ ] Code coverage is maintained
- [ ] Documentation is updated
- [ ] Examples work correctly

## Architecture Decisions

### State Management

The library uses a simple array-based history approach for performance and
simplicity:

1. **History Array**: Maintains chronological state snapshots
2. **Current Index**: Tracks position in history
3. **Immutable Updates**: Each state change creates new history entry
4. **Memory Management**: Respects `maxHistory` to prevent memory leaks

### Performance Optimizations

1. **Memoization**: Extensive use of `useMemo` and `useCallback`
2. **Debouncing**: Optional debouncing for rapid state changes
3. **History Trimming**: Automatic trimming based on `maxHistory`
4. **Shallow Copying**: Efficient copying strategies for large objects

### TypeScript Integration

1. **Generic Constraints**: Proper generic usage for type safety
2. **Strict Typing**: No `any` types in public APIs
3. **Utility Types**: Leverages TypeScript utility types
4. **Declaration Files**: Proper `.d.ts` generation

## Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community support
- **Documentation**: Check README and inline documentation first

## Code of Conduct

This project follows a standard code of conduct. Please be respectful and
constructive in all interactions.
