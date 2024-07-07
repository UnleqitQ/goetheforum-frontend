import React from 'react';
import {Toast} from 'primereact/toast';

const ToastContext = React.createContext<React.RefObject<Toast> | null>(null);

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
	const toastRef = React.useRef<Toast>(null);
	return (
		<>
			<div>
				<Toast ref={toastRef} position="bottom-right" />
				<ToastContext.Provider value={toastRef}>
					{children}
				</ToastContext.Provider>
			</div>
		</>
	);
};

export const useToast = () => {
	const refContext = React.useContext(ToastContext);
	if (!refContext) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return refContext.current;
}
