import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import '../css/tokens.css';
import '../css/base.css';
import '../css/components.css';
import '../css/layouts.css';
import '../css/hero.css';
import '../css/pages.css';
import '../css/responsive.css';

// PUNTO ÚNICO DE MONTAJE DE LA SPA (index.html → #root).
createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>
);
