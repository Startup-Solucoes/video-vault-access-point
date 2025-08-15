
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { enforceHttps, forceHttpsOnAllLinks } from './utils/urlUtils';

// Força HTTPS em produção
enforceHttps();

// Força HTTPS em todos os links após carregamento da página
document.addEventListener('DOMContentLoaded', () => {
  forceHttpsOnAllLinks();
});

// Deploy test - 2024-01-06
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
