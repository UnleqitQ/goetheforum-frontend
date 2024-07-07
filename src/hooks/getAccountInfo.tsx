import React from 'react';
import {useCookies} from 'react-cookie';
import {ErrorResponse} from '../types/ErrorResponse.ts';
import axios from '../axios-impl.ts';
import useRefreshToken from './refreshToken.tsx';
import {UserData} from '../types/UserData.ts';
import {SessionData} from '../types/SessionData.ts';
import {useNavigate} from 'react-router-dom';

interface RsBody {
	user: UserData;
	session: SessionData;
}

interface Settings {
	doRedirectOnFail: boolean;
	refreshOnMount: boolean;
}

const defaultSettings: Settings = {
	doRedirectOnFail: true,
	refreshOnMount: true,
};

const useGetAccountInfo = (settings?: Partial<Settings>) => {
	const resolvedSettings: Settings = {...defaultSettings, ...settings};
	const [cookies] = useCookies<string>(['access_token', 'refresh_token']);
	const {refreshAccessToken} = useRefreshToken();
	const [userData, setUserData] = React.useState<UserData | null>(null);
	const [sessionData, setSessionData] = React.useState<SessionData | null>(null);
	const navigate = useNavigate();
	
	const refreshInfo = React.useCallback(async (doRefreshAccessToken: boolean = true) => {
		if (!cookies.access_token) {
			if (cookies.refresh_token) {
				const refreshSuccess = await refreshAccessToken();
				if (refreshSuccess) {
					if (doRefreshAccessToken) {
						await refreshInfo(false);
					}
				}
			}
			else if (resolvedSettings.doRedirectOnFail) {
				navigate('/login');
			}
			return;
		}
		const response = await axios.get<RsBody | ErrorResponse>('/account/info', {
			headers: {
				Authorization: `Bearer ${cookies.access_token}`,
			}, validateStatus: () => true,
		});
		if (response.status === 200) {
			const data = response.data as RsBody;
			setUserData(data.user);
			setSessionData(data.session);
		}
		else if (response.status === 401) {
			// Access token expired
			const refreshSuccess = await refreshAccessToken();
			if (refreshSuccess) {
				if (doRefreshAccessToken) {
					await refreshInfo(false);
				}
			}
			else if (resolvedSettings.doRedirectOnFail) {
				navigate('/login');
			}
		}
	}, [cookies.access_token, cookies.refresh_token, resolvedSettings.doRedirectOnFail, refreshAccessToken, navigate]);
	
	React.useEffect(() => {
		if (resolvedSettings.refreshOnMount) {
			refreshInfo().catch(
				(err) => console.error(err),
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resolvedSettings.refreshOnMount]);
	
	const getUserData = React.useCallback(async () => {
		if (!userData) {
			await refreshInfo();
		}
		return userData;
	}, [userData, refreshInfo]);
	
	const getSessionData = React.useCallback(async () => {
		if (!sessionData) {
			await refreshInfo();
		}
		return sessionData;
	}, [sessionData, refreshInfo]);
	
	return {getUserData, getSessionData, refreshInfo, userData, sessionData};
};

export default useGetAccountInfo;
