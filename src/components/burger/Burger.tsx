import React, {CSSProperties} from "react";
import styles from "./Burger.module.css";

interface BurgerProps {
	state?: boolean;
	onChange?: (state: boolean) => void;
	
	forceState?: boolean;
	
	className?: string;
	
	style?: React.CSSProperties;
	
	children?: never;
	
	width?: number;
	height?: number;
	
	color?: string;
}

export const Burger: React.FC<BurgerProps> = (props) => {
	const [state, setState] = React.useState(props.state ?? false);
	const forceState = props.forceState ?? false;
	
	React.useEffect(() => {
		if (forceState) {
			setState(props.state ?? false);
		}
	}, [props.state, forceState]);
	
	const toggle = () => {
		const newState = !state;
		setState(newState);
		props.onChange?.(newState);
	};
	
	const cssVars = {
		...(props.width != null ? {'--width': `${props.width}px`} : {}),
		...(props.height != null ? {'--height': `${props.height}px`} : {}),
		...(props.color != null ? {'--color': props.color} : {})
	};
	
	return (
		<div
			className={`${styles.burger} ${props.className ?? ""}`}
			style={{...props.style, ...cssVars} as CSSProperties}
			onClick={toggle}
		>
			<span className={`${styles.bar} ${state ? styles.barActive : ""}`}
						style={cssVars as CSSProperties} />
			<span className={`${styles.bar} ${state ? styles.barActive : ""}`}
						style={cssVars as CSSProperties} />
			<span className={`${styles.bar} ${state ? styles.barActive : ""}`}
						style={cssVars as CSSProperties} />
		</div>
	);
};
