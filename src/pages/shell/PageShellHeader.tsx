import React from "react";
import styles from "./PageShellHeader.module.css";
import {Burger} from "../../components/burger/Burger.tsx";
import {Toolbar} from "primereact/toolbar";


interface PageShellHeaderProps {
	/**
	 * If undefined, no burger will be shown.
	 */
	sidebarLeft?: boolean;
	/**
	 * If undefined, no burger will be shown.
	 */
	sidebarRight?: boolean;
	
	setSidebarLeft?: (state: boolean) => void;
	setSidebarRight?: (state: boolean) => void;
}

export const PageShellHeader: React.FC<PageShellHeaderProps> = (props) => {
	return (
		<div className={styles.root}>
			<div className={styles.left}>
				{props.sidebarLeft !== undefined && (
					<Burger
						state={props.sidebarLeft}
						onChange={props.setSidebarLeft}
						width={30}
						height={30}
					/>
				)}
			</div>
			<div className={styles.center}>
			</div>
			<div className={styles.right}>
				{props.sidebarRight !== undefined && (
					<Burger
						state={props.sidebarRight}
						onChange={props.setSidebarRight}
						width={30}
						height={30}
					/>
				)}
			</div>
		</div>
	);
};
