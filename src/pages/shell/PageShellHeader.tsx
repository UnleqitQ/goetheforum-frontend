import React from 'react';
import {Burger} from '../../components/burger/Burger.tsx';
import {Button} from 'primereact/button';
import {useNavigate} from 'react-router-dom';
import useGetAccountInfo from '../../hooks/getAccountInfo.tsx';
import {Skeleton} from 'primereact/skeleton';
import {UserData} from '../../types/UserData.ts';
import {TieredMenu} from 'primereact/tieredmenu';
import {useCookies} from 'react-cookie';
import axios from '../../axios-impl.ts';
import {useToast} from '../../context/ToastProvider.tsx';
import {Toolbar} from 'primereact/toolbar';
import {Avatar} from 'primereact/avatar';

const UserDropdown: React.FC<{ userData: UserData | null }> = ({userData}) => {
	const navigate = useNavigate();
	const menuRef = React.useRef<TieredMenu>(null);
	const [cookies, , removeCookie] = useCookies<string>(['refresh_token', 'access_token']);
	const toast = useToast();
	
	const logoutLocal = () => {
		removeCookie('refresh_token');
		removeCookie('access_token');
		navigate('/login');
	};
	
	const logout = async () => {
		const response = await axios.post('/account/logout', {}, {
			headers: {
				Authorization: `Bearer ${cookies['access_token']}`,
			},
			validateStatus: () => true,
		});
		if (response.status !== 200) {
			const content: React.ReactNode = (
				<>
					<div className="flex flex-column align-items-left" style={{flex: 1}}>
						<div>Failed to send logout request</div>
						<div className="flex flex-row justify-content-end">
							<Button
								label="Retry"
								onClick={() => {
									toast?.clear();
									logout();
								}}
							/>
							<Button
								label="Logout locally anyway"
								onClick={() => {
									toast?.clear();
									logoutLocal();
								}}
							/>
						</div>
					</div>
				</>
			);
			toast?.show({
				severity: 'error',
				content,
			});
			return;
		}
		logoutLocal();
	};
	
	if (userData == null) {
		return (
			<Skeleton width="150px" height="50px" />
		);
	}
	
	return (
		<>
			<Button
				label={userData.username!}
				onClick={(e) => menuRef.current?.toggle(e)}
				text
			>
				<Avatar
					style={{marginLeft: '10px'}}
					label={userData.username?.charAt(0).toUpperCase()}
					image={
						userData.avatar !== null ? `data:image/png;base64,${userData.avatar}` : undefined
					}
					shape="circle"
					size="normal"
				/>
			</Button>
			<TieredMenu
				ref={menuRef}
				popup
				model={[
					{
						label: 'Profile',
						icon: 'pi pi-user',
						command: () => navigate(`/user/${userData.ID}`),
					},
					{
						label: 'Logout',
						icon: 'pi pi-sign-out',
						command: logout,
					},
				]}
			/>
		</>
	);
	
	
};

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
	const {userData} = useGetAccountInfo();
	
	const startContent = (
		<>
			{props.sidebarLeft !== undefined && (
				<Burger
					state={props.sidebarLeft}
					onChange={props.setSidebarLeft}
					width={30}
					height={30}
				/>
			)}
		</>
	);
	
	const endContent = (
		<>
			<UserDropdown userData={userData} />
			
			{props.sidebarRight !== undefined && (
				<Burger
					state={props.sidebarRight}
					onChange={props.setSidebarRight}
					width={30}
					height={30}
				/>
			)}
		</>
	);
	
	return (
		<Toolbar
			start={startContent}
			end={endContent}
		>
		
		</Toolbar>
	);
};
