import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('Rendering PhotoBooth-Payment App');
const root = createRoot(document.getElementById('root'));
root.render(<App />);