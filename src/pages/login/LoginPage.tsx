import React from 'react';
import styles from './LoginPage.module.css';
import axios from '../../axios-impl';
import {VerificationType} from '../../types/VerificationType.ts';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {InputOtp} from 'primereact/inputotp';
import {ButtonGroup} from 'primereact/buttongroup';
import {Button} from 'primereact/button';
import {InputMask} from 'primereact/inputmask';
import {UserData} from '../../types/UserData.ts';
import {ErrorResponse} from '../../types/ErrorResponse.ts';
import {useCookies} from 'react-cookie';
import {useNavigate} from 'react-router-dom';

interface RsIntermediaryBody {
	/**
	 * The status of the login
	 */
	status: 'intermediary';
	
	/**
	 * The verification types that were used to verify the user
	 */
	previous: VerificationType[];
	/**
	 * The verification types that can still be used to verify the user
	 */
	next: VerificationType[];
	
	/**
	 * The login token
	 */
	token: string;
}

interface RsFinalBody {
	/**
	 * The status of the login
	 */
	status: 'complete';
	
	/**
	 * The user data
	 */
	user: UserData;
	/**
	 * The access token of the user
	 */
	access_token: string;
	/**
	 * The refresh token of the user
	 */
	refresh_token: string;
}

type RsBody = RsIntermediaryBody | RsFinalBody;

export const LoginPage: React.FC = () => {
	const navigate = useNavigate();
	const [, setCookie] = useCookies(['access_token', 'refresh_token']);
	
	const [identifier, setIdentifier] = React.useState<string>('');
	const [loginToken, setLoginToken] = React.useState<string | null>(null);
	const [identifierType, setIdentifierType] = React.useState<'username' | 'email'>('username');
	const [verificationType, setVerificationType] = React.useState<VerificationType>('password');
	const [password, setPassword] = React.useState<string>('');
	const [backupCode, setBackupCode] = React.useState<string>('');
	const [totp, setTotp] = React.useState<string>('');
	const [possibleVerificationTypes, setPossibleVerificationTypes] = React.useState<VerificationType[]>(
		['password', 'backup_code', 'totp']);
	
	const doLogin = React.useCallback(async () => {
		const identifierBody = loginToken != null ? {token: loginToken} : (
			identifierType === 'username' ? {username: identifier} : {email: identifier});
		const verificationBody = verificationType === 'password' ? {password: password} : (
			verificationType === 'backup_code' ? {backup_code: backupCode} : (
				verificationType === 'totp' ? {totp: totp} : {}));
		const body = {...identifierBody, ...verificationBody, verification_type: verificationType};
		const response = await axios.post<RsBody | ErrorResponse>('/account/login', body,
			{validateStatus: () => true});
		if (response.status !== 200) {
			console.error(response.data);
			return;
		}
		const data = response.data as RsBody;
		if (data.status === 'intermediary') {
			setLoginToken(data.token);
			setPossibleVerificationTypes(data.next);
			return;
		}
		const finalData = data as RsFinalBody;
		console.log(finalData);
		// Access token is a session cookie
		setCookie('access_token', finalData.access_token,
			{sameSite: 'lax', path: '/'});
		// Refresh token expires in 4 weeks
		setCookie('refresh_token', finalData.refresh_token,
			{sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 * 4});
		navigate('/');
	}, [loginToken, identifierType, identifier, verificationType, password, backupCode, totp,
		setCookie, navigate]);
	
	const identifierInput = React.useMemo(() => {
		if (loginToken !== null) {
			return <></>;
		}
		const field = (<InputText
			value={identifier}
			onChange={(e) => setIdentifier(e.target.value)}
			placeholder={identifierType === 'username' ? 'Username' : 'Email'}
			type={identifierType === 'username' ? 'text' : 'email'}
		/>);
		return (
			<>
				{field}
				<Button
					label={identifierType === 'username' ? 'Use Email' : 'Use Username'}
					onClick={() => setIdentifierType(identifierType === 'username' ? 'email' : 'username')}
				/>
			</>
		);
	}, [loginToken, identifier, identifierType]);
	
	const verificationInput = React.useMemo(() => {
		if (verificationType === 'password') {
			return (
				<Password
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					feedback={false}
					toggleMask={true}
				/>
			);
		}
		if (verificationType === 'backup_code') {
			return (
				<InputMask
					value={backupCode}
					onChange={(e) => setBackupCode(e.value ?? '')}
					placeholder="Backup Code"
					mask="****-****-****-****"
				/>
			);
		}
		if (verificationType === 'totp') {
			return (
				<InputOtp
					value={totp}
					onChange={(e) => setTotp(
						e.value == null ? '' : (typeof e.value === 'string' ? e.value : e.value.toString()))}
					placeholder="OTP"
					integerOnly={true}
					length={6}
					mask={false}
				/>
			);
		}
		if (verificationType === 'email') {
			return (
				<div>
					Not implemented
				</div>
			);
		}
		return (
			<div>
				Unknown verification type
			</div>
		);
	}, [backupCode, password, totp, verificationType]);
	
	return (
		<div className={styles.root}>
			<div className={styles.content}>
				<div className={styles.Identifier}>
					{identifierInput}
				</div>
				<div className={styles.verificationTypeSelect}>
					<ButtonGroup>
						{possibleVerificationTypes.map((type) => (
							<Button
								key={type}
								label={type}
								onClick={() => setVerificationType(type)}
								className={verificationType === type ? 'p-button-primary' : ''}
							/>
						))}
					</ButtonGroup>
				</div>
				<div className={styles.verification}>
					{verificationInput}
				</div>
				<div className={styles.submit}>
					<Button
						label="Login"
						onClick={doLogin}
					/>
				</div>
			</div>
		</div>
	);
};
