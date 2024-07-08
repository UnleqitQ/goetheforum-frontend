export type MasterMessage = {
	type: 'data';
	data: string;
	difficulty: number;
} | {
	type: 'cancel';
} | {
	type: 'status';
};

export type WorkerStatus = 'uninitialized' | 'running' | 'completed' | 'cancelled';

type StatusMessage = {
	type: 'status';
	status: WorkerStatus;
	startTime?: number;
	endTime?: number;
	hashes?: number;
};

type ResultMessage = {
	type: 'result';
	endTime: number;
	nonce: number;
};

export type WorkerMessage = StatusMessage | ResultMessage;
