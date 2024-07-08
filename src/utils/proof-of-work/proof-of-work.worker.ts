/**
 * This file is a worker that will be used to calculate the proof of work
 * to verify a user is not a bot.
 */

import {checkProofOfWork, convertNonce, estimateAmountOfWork} from './pow-utils';
import {WorkerMessage, MasterMessage, WorkerStatus} from './pow-message.ts';

let nonce = 0;
let status: WorkerStatus = 'uninitialized';
let startTime: number | undefined = undefined;
let endTime: number | undefined = undefined;
let difficulty: number | undefined = undefined;
let baseData: string | undefined = undefined;

const postMessage = (message: WorkerMessage) => {
	self.postMessage(message);
};

const sendStatus = () => {
	const hashes = nonce;
	const message: WorkerMessage = {
		type: 'status',
		status,
		startTime,
		endTime,
		hashes,
	};
	postMessage(message);
};

const sendResult = () => {
	const message: WorkerMessage = {
		type: 'result',
		endTime: endTime!,
		nonce,
	};
	postMessage(message);
};

const handleMessage = (event: MessageEvent<MasterMessage>) => {
	const message = event.data;
	if (message.type === 'data') {
		if (status === 'running') {
			throw new Error('Proof of work calculation already running');
		}
		startTime = Date.now();
		nonce = 0;
		difficulty = message.difficulty;
		baseData = message.data;
		status = 'running';
		sendStatus();
	}
	else if (message.type === 'cancel') {
		status = 'cancelled';
		endTime = Date.now();
		sendStatus();
	}
	else if (message.type === 'status') {
		sendStatus();
	}
};

addEventListener('message', handleMessage);

const calculateProofOfWork = (data: string, difficulty: number) => {
	while (status === 'running') {
		const dataWithNonce = data + convertNonce(nonce);
		if (checkProofOfWork(dataWithNonce, difficulty)) {
			status = 'completed';
			endTime = Date.now();
			sendResult();
			return;
		}
		nonce++;
	}
};

const waitInitialData = async () => {
	while (status === 'uninitialized') {
		await new Promise(resolve => setTimeout(resolve, 100));
	}
};

waitInitialData().then(() => {
	if (status === 'running') {
		calculateProofOfWork(baseData ?? '', difficulty ?? 0);
	}
});

export {};
