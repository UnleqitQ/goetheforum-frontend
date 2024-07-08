import React from 'react';
import {Button} from 'primereact/button';
import {ProgressBar} from 'primereact/progressbar';
import {ProofOfWorkHandler} from '../../utils/proof-of-work/proof-of-work.ts';
import {WorkerStatus} from '../../utils/proof-of-work/pow-message.ts';

interface ProofOfWorkProps {
	data: string;
	difficulty: number;
	onSuccess: (nonce: number) => void;
	onCancel: () => void;
}

/**
 * The ProofOfWork component for verifying a user is human.
 */
export const ProofOfWork: React.FC<ProofOfWorkProps> = (props) => {
	const handler = React.useMemo(() =>
		new ProofOfWorkHandler(props.difficulty, props.data, (nonce: number) => {
			setProgress(1);
			setEndTime(handler.endTime);
			setStatus('completed');
			props.onSuccess(nonce);
		}), [props]);
	const [progress, setProgress] = React.useState(0);
	const [status, setStatus] = React.useState<WorkerStatus>('uninitialized');
	const [hashes, setHashes] = React.useState(0);
	const [startTime, setStartTime] = React.useState<number | undefined>(undefined);
	const [endTime, setEndTime] = React.useState<number | undefined>(undefined);
	const [estimatedRequiredHashes] = React.useState<number>(Math.pow(16, props.difficulty));
	
	React.useEffect(() => {
		setProgress(Math.min(1, hashes / estimatedRequiredHashes));
	}, [hashes]);
	
	const refresh = React.useCallback(() => {
		setHashes(handler.hashes!);
		setStatus(handler.status);
		setStartTime(handler.startTime);
		setEndTime(handler.endTime);
	}, [handler]);
	
	React.useEffect(() => {
		const refreshInterval = setInterval(() => {
			refresh();
		}, 500);
		return () => clearInterval(refreshInterval);
	}, [refresh]);
	
	const start = () => {
		handler.start();
		setStartTime(handler.startTime);
		setStatus(handler.status);
	};
	
	const cancel = () => {
		handler.cancel();
		props.onCancel();
	};
	
	return (
		<div>
			<ProgressBar
				value={progress * 100}
				displayValueTemplate={() => `${Math.round(progress * 100)}%`}
			/>
			<div>
				{status === 'uninitialized' && <p>Initializing...</p>}
				{status === 'running' && <p>Running...</p>}
				{status === 'completed' && <p>Completed in {endTime! - startTime!}ms</p>}
				{status === 'cancelled' && <p>Cancelled</p>}
			</div>
			<Button label="Start" onClick={start} />
			<Button label="Cancel" onClick={cancel} />
		</div>
	);
};
