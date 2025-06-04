
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Deploy test - 2024-01-06
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
