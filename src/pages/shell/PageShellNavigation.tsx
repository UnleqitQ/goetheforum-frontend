import React from "react";
import styles from "./PageShellNavigation.module.css";
import {useLocation} from "react-router-dom";

interface PageShellNavigationProps {
	expanded?: boolean;
}

export const PageShellNavigation: React.FC<PageShellNavigationProps> = (props) => {
	const location = useLocation();
	return (
		<div className={`${styles.root} ${props.expanded ? styles.expanded : ""}`}>
			You are at: {location.pathname}
		</div>
	);
};
