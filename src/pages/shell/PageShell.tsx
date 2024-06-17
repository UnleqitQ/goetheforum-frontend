import React from 'react';
import {Outlet} from "react-router-dom";
import styles from './PageShell.module.css';
import {PageShellHeader} from "./PageShellHeader.tsx";
import {PageShellNavigation} from "./PageShellNavigation.tsx";

export const PageShell: React.FC = () => {
	const [leftSidebarExpanded, setLeftSidebarExpanded] = React.useState(false);
	
	return (
		<div className={styles.root} style={{
			'--left-size': leftSidebarExpanded ? '1.4fr' : '0.16fr',
			'--right-size': '0'
		} as React.CSSProperties}>
			<div className={styles.header}>
				<PageShellHeader
					sidebarLeft={leftSidebarExpanded}
					setSidebarLeft={setLeftSidebarExpanded} />
			</div>
			<div className={styles.sidebarLeft}>
				<PageShellNavigation expanded={leftSidebarExpanded} />
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
