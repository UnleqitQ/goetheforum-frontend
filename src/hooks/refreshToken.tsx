import {useCookies} from 'react-cookie';
import axios from '../axios-impl';
import {ErrorResponse} from '../types/ErrorResponse.ts';
import React from 'react';

interface RsBody {
	access_token: string;
	user_id: number;
}

const useRefreshToken = () => {
	const [cookies, setCookie] = useCookies(['refresh_token', 'access_token']);
	
	const refreshAccessToken = React.useCallback(async () => {
		const response = await axios.post<RsBody | ErrorResponse>('/account/refresh', {}, {
			headers: {
				Authorization: `Bearer ${cookies.refresh_token}`,
			}, validateStatus: () => true,
		});
		if (response.status !== 200) {
			console.error(response.data);
			return false;
		}
		const data = response.data as RsBody;
		setCookie('access_token', data.access_token, {path: '/'});
		return true;
	}, [cookies.refresh_token, setCookie]);
	
	return {refreshAccessToken};
};

export default useRefreshToken;
