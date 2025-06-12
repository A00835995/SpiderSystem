import '@testing-library/jest-dom';
import { expect, jest } from '@jest/globals';
import React from 'react';

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock para UI5 Web Components
jest.mock('@ui5/webcomponents-react', () => ({
  Bar: ({ children }) => <div data-testid="ui5-bar">{children}</div>,
  Button: ({ children, onClick }) => <button data-testid="ui5-button" onClick={onClick}>{children}</button>,
  Dialog: ({ children, open, onAfterClose }) => open ? <div data-testid="ui5-dialog" onClick={onAfterClose}>{children}</div> : null,
  Form: ({ children }) => <form data-testid="ui5-form">{children}</form>,
  FormItem: ({ children, label }) => <div data-testid="ui5-form-item"><label>{label}</label>{children}</div>,
  Input: ({ value, onChange, type }) => <input data-testid="ui5-input" type={type} value={value} onChange={onChange} />,
  Label: ({ children }) => <label data-testid="ui5-label">{children}</label>,
  List: ({ children }) => <ul data-testid="ui5-list">{children}</ul>,
  MessageBox: ({ children, type, onClose }) => <div data-testid="ui5-message-box" onClick={onClose}>{children}</div>,
  MessageBoxTypes: {
    Success: 'Success',
    Warning: 'Warning',
    Error: 'Error',
    Information: 'Information',
    Confirm: 'Confirm'
  },
  Panel: ({ children, headerText }) => <div data-testid="ui5-panel"><h3>{headerText}</h3>{children}</div>,
  Select: ({ children, onChange, value }) => <select data-testid="ui5-select" value={value} onChange={onChange}>{children}</select>,
  Option: ({ children, selected }) => <option data-testid="ui5-option" selected={selected}>{children}</option>,
  Table: ({ children, columns, data }) => <table data-testid="ui5-table"><thead><tr>{columns?.map(col => <th key={col.key}>{col.header}</th>)}</tr></thead><tbody>{children}</tbody></table>,
  TableColumn: ({ children }) => <td data-testid="ui5-table-column">{children}</td>,
  TextArea: ({ value, onChange }) => <textarea data-testid="ui5-textarea" value={value} onChange={onChange} />,
  Title: ({ children }) => <h1 data-testid="ui5-title">{children}</h1>,
  Toast: ({ children }) => <div data-testid="ui5-toast">{children}</div>,
  FlexBox: ({ children }) => <div data-testid="ui5-flexbox">{children}</div>,
  FlexBoxJustifyContent: {
    Start: 'Start',
    Center: 'Center',
    End: 'End',
    SpaceBetween: 'SpaceBetween',
    SpaceAround: 'SpaceAround'
  },
  FlexBoxAlignItems: {
    Start: 'Start',
    Center: 'Center',
    End: 'End',
    Stretch: 'Stretch'
  },
  FlexBoxDirection: {
    Row: 'Row',
    Column: 'Column'
  },
  FlexBoxWrap: {
    NoWrap: 'NoWrap',
    Wrap: 'Wrap'
  }
}));

// Mock para react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  Link: ({ children, to }) => <a href={to} data-testid="router-link">{children}</a>,
  useParams: () => ({ id: '1' })
}));

// Limpiar mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
}); 