import React from 'react';
import {Skeleton} from 'primereact/skeleton';
import axios from '../../axios-impl.ts';
import {useCookies} from 'react-cookie';
import {ErrorResponse} from '../../types/ErrorResponse.ts';
import {UserData} from '../../types/UserData.ts';
import {UserInfoData} from '../../types/UserInfoData.ts';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from 'primereact/button';
import {useToast} from '../../context/ToastProvider.tsx';
import useRefreshToken from '../../hooks/refreshToken.tsx';

export const UserInfoPage: React.FC = () => {
	const [cookies] = useCookies(['access_token']);
	const [userData, setUserData] = React.useState<UserData | null>(null);
	const [userInfoData, setUserInfoData] = React.useState<UserInfoData | null>(null);
	const [loading, setLoading] = React.useState<boolean>(true);
	const toast = useToast();
	const {refreshAccessToken} = useRefreshToken();
	
	const {user_id} = useParams();
	const navigate = useNavigate();
	
	const refreshData = React.useCallback(async () => {
		if (!cookies.access_token) {
			refreshAccessToken();
			return;
		}
		setLoading(true);
		const [userDataResponse, userInfoDataResponse] = await Promise.all([
			axios.get<UserData | ErrorResponse>(`/user/${user_id}`, {
				validateStatus: () => true,
			}),
			axios.get<UserInfoData | ErrorResponse>(`/user/${user_id}/info`, {
				headers: {
					Authorization: `Bearer ${cookies.access_token}`,
				},
				validateStatus: () => true,
			}),
		]);
		if (userInfoDataResponse.status === 401) {
			refreshAccessToken();
			return;
		}
		if (userInfoDataResponse.status === 403) {
			navigate('/forbidden');
			return;
		}
		if (userDataResponse.status === 404 || userInfoDataResponse.status === 404) {
			setUserInfoData(null);
			setUserData(null);
			setLoading(false);
			return;
		}
		if (userDataResponse.status !== 200) {
			toast?.show({
				severity: 'error',
				summary: 'Error',
				detail: (userDataResponse.data as ErrorResponse).message,
			});
			return;
		}
		if (userInfoDataResponse.status !== 200) {
			toast?.show({
				severity: 'error',
				summary: 'Error',
				detail: (userInfoDataResponse.data as ErrorResponse).message,
			});
			return;
		}
		setUserData(userDataResponse.data as UserData);
		setUserInfoData(userInfoDataResponse.data as UserInfoData);
		setLoading(false);
	}, [cookies.access_token, navigate, refreshAccessToken, toast, user_id]);
	
	React.useEffect(() => {
		refreshData().catch(() => {
			toast?.show({
				severity: 'error',
				summary: 'Error',
				detail: 'An error occurred while fetching user data',
			});
		});
	}, [refreshData, toast]);
	
	return (
		<>
			{
				loading ?
					(
						<div className="p-grid p-justify-center">
							<div className="p-col-12 p-md-6 p-lg-4">
								<Skeleton width="100%" height="50px" />
								<Skeleton width="100%" height="50px" />
								<Skeleton width="100%" height="50px" />
							</div>
						</div>
					) :
					userData == null || userInfoData == null ?
						(
							<div className="p-grid p-justify-center">
								<div className="p-col-12 p-md-6 p-lg-4">
									<h1>User not found</h1>
								</div>
							</div>
						) : (
							<div className="p-grid p-justify-center">
								<div className="p-col-12 p-md-6 p-lg-4">
									<h1>{userData.username}</h1>
									<p>{userInfoData.bio}</p>
									<Button
										label="Edit"
										onClick={() => navigate(`/user/${user_id}/edit`)}
										className="p-button-raised p-button-primary p-mt-2"
									/>
								</div>
							</div>
						)
			}
		</>
	);
};
