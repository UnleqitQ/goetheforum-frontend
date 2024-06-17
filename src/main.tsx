import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createHashRouter, RouterProvider} from "react-router-dom";
import {APIOptions, PrimeReactProvider} from "primereact/api";
import {PageShell} from "./pages/shell/PageShell.tsx";

const router = createHashRouter([
	{
		path: '/',
		element: <PageShell />,
		children: [
			{
				path: '/',
				element: <div>Home</div>
			}
		]
	}
], {});

const rootElement = document.getElementById('root')!;

const root = ReactDOM.createRoot(rootElement);

const primeReactConfig: Partial<APIOptions> = {
	unstyled: false,
	
};

root.render(
	<React.StrictMode>
		<PrimeReactProvider value={primeReactConfig}>
			
			<RouterProvider router={router} />
		</PrimeReactProvider>
	</React.StrictMode>
);

