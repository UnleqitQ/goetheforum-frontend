import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import i18n from './i18n';
import {createHashRouter, RouterProvider} from 'react-router-dom';
import {APIOptions, PrimeReactProvider} from 'primereact/api';
import {PageShell} from './pages/shell/PageShell.tsx';
import {I18nextProvider} from 'react-i18next';
import {ToastProvider} from './context/ToastProvider.tsx';

const router = createHashRouter([
	{
		path: '/',
		element: <PageShell />,
		children: [
			{
				path: '/',
				element: <div>Home</div>,
			},
			{
				path: '/user/:user_id',
				lazy: () => import('./pages/user/UserInfoPage.tsx').then(
					(module) => ({Component: module.UserInfoPage})),
			},
		],
	},
	{
		path: '/login',
		lazy: () => import('./pages/login/LoginPage.tsx').then(
			(module) => ({Component: module.LoginPage})),
	},
], {});

const rootElement = document.getElementById('root')!;

const root = ReactDOM.createRoot(rootElement);

const primeReactConfig: Partial<APIOptions> = {
	unstyled: false,
	
};

root.render(
	<React.StrictMode>
		<I18nextProvider i18n={i18n}>
			<PrimeReactProvider value={primeReactConfig}>
				<ToastProvider>
					<RouterProvider router={router} />
				</ToastProvider>
			</PrimeReactProvider>
		</I18nextProvider>
	</React.StrictMode>,
);

