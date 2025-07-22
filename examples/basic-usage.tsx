import React from 'react';
import { useHistoryState } from '../src';

/**
 * Basic text input example with undo/redo functionality
 */
export function BasicTextInput(): JSX.Element {
  const {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    history,
    reset,
    clear
  } = useHistoryState('Hello World!');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Basic Text Input with History</h2>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '16px',
            width: '300px',
            marginRight: '10px'
          }}
          placeholder="Type something..."
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={undo}
          disabled={!canUndo}
          style={{
            padding: '8px 16px',
            marginRight: '8px',
            backgroundColor: canUndo ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: canUndo ? 'pointer' : 'not-allowed'
          }}
        >
          Undo (Ctrl+Z)
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          style={{
            padding: '8px 16px',
            marginRight: '8px',
            backgroundColor: canRedo ? '#28a745' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: canRedo ? 'pointer' : 'not-allowed'
          }}
        >
          Redo (Ctrl+Y)
        </button>

        <button
          onClick={reset}
          style={{
            padding: '8px 16px',
            marginRight: '8px',
            backgroundColor: '#ffc107',
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>

        <button
          onClick={clear}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear History
        </button>
      </div>

      <div style={{
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>Current state:</strong> "{state}"<br />
        <strong>History length:</strong> {history.length}<br />
        <strong>Can undo:</strong> {canUndo ? 'Yes' : 'No'}<br />
        <strong>Can redo:</strong> {canRedo ? 'Yes' : 'No'}
      </div>
    </div>
  );
}

/**
 * Form example with complex object state
 */
export function FormExample(): JSX.Element {
  interface FormData {
    name: string;
    email: string;
    age: number;
    preferences: {
      newsletter: boolean;
      notifications: boolean;
    };
  }

  const initialFormData: FormData = {
    name: '',
    email: '',
    age: 0,
    preferences: {
      newsletter: false,
      notifications: true
    }
  };

  const { state, setState, undo, redo, canUndo, canRedo } = useHistoryState(
    initialFormData,
    { maxHistory: 20, debounceMs: 300 } // Debounce rapid changes
  );

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const updatePreference = (pref: keyof FormData['preferences'], value: boolean) => {
    setState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [pref]: value }
    }));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Form with History Management</h2>

      <form style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Name:
            <input
              type="text"
              value={state.name}
              onChange={(e) => updateField('name', e.target.value)}
              style={{ marginLeft: '10px', padding: '4px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Email:
            <input
              type="email"
              value={state.email}
              onChange={(e) => updateField('email', e.target.value)}
              style={{ marginLeft: '10px', padding: '4px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Age:
            <input
              type="number"
              value={state.age}
              onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
              style={{ marginLeft: '10px', padding: '4px', width: '60px' }}
            />
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={state.preferences.newsletter}
              onChange={(e) => updatePreference('newsletter', e.target.checked)}
            />
            Subscribe to newsletter
          </label>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={state.preferences.notifications}
              onChange={(e) => updatePreference('notifications', e.target.checked)}
            />
            Enable notifications
          </label>
        </div>
      </form>

      <div>
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo} style={{ marginLeft: '8px' }}>
          Redo
        </button>
      </div>

      <pre style={{
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px',
        marginTop: '10px'
      }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
}
