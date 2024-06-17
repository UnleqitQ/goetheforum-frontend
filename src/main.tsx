import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {createHashRouter, RouterProvider} from "react-router-dom";

const router = createHashRouter([
	{
		path: '/',
		element: <App />
	}
], {});

const rootElement = document.getElementById('root')!;

const root = ReactDOM.createRoot(rootElement);

root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);

