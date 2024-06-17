import React from 'react';
import {Outlet} from "react-router-dom";
import styles from './PageShell.module.css';

export const PageShell: React.FC = () => {
	const [leftSidebarCollapsed, setLeftSidebarCollapsed] = React.useState(false);
	const [rightSidebarHidden, setRightSidebarHidden] = React.useState(false);
	
	return (
		<div className={styles.root} style={{
			'--left-size': leftSidebarCollapsed ? '0.1fr' : '2fr',
			'--right-size': rightSidebarHidden ? '0' : '1fr'
		} as React.CSSProperties}>
			<div className={styles.header}>
			
			</div>
			<div className={styles.sidebarLeft}>
			</div>
			<main className={styles.content}>
				<Outlet />
			</main>
			<div className={styles.sidebarRight}>
			
			</div>
			<div className={styles.footer}>
			
			</div>
		</div>
	);
};
