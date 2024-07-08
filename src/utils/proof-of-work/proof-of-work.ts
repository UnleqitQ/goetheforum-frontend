import PowWorker from './proof-of-work.worker.ts?worker';

import {WorkerMessage, WorkerStatus, MasterMessage} from './pow-message.ts';

export class ProofOfWorkHandler {
	
	/**
	 * The worker used to perform the proof of work
	 */
	private _worker: Worker;
	
	/**
	 * The number of leading zeroes the hash of the data must have in hexadecimal form
	 */
	private _difficulty: number;
	/**
	 * The base data to hash
	 */
	private _data: string;
	/**
	 * The nonce to use for the proof of work
	 */
	private _nonce?: number;
	/**
	 * The number of hashes performed
	 */
	private _hashes?: number;
	/**
	 * The time the worker started
	 */
	private _startTime?: number;
	/**
	 * The time the worker ended
	 */
	private _endTime?: number;
	/**
	 * The worker's status
	 */
	private _status: WorkerStatus;
	/**
	 * The callback to call when the proof of work is successful
	 */
	private _onSuccess: (nonce: number) => void;
	
	/**
	 * Creates a new proof of work worker
	 * @param difficulty The number of leading zeroes the hash of the data must have in hexadecimal form
	 * @param data The base data to hash
	 * @param onSuccess The callback to call when the proof of work is successful
	 */
	constructor(difficulty: number, data: string, onSuccess: (nonce: number) => void) {
		console.log('Creating worker');
		this._worker = new PowWorker();
		this._difficulty = difficulty;
		this._data = data;
		this._nonce = 0;
		this._hashes = 0;
		this._status = 'uninitialized';
		this._onSuccess = onSuccess;
		
		this._worker.onmessage = this.onMessage.bind(this);
	}
	
	private postMessage(message: MasterMessage) {
		this._worker.postMessage(message);
	}
	
	private onMessage(event: MessageEvent<WorkerMessage>) {
		const message = event.data;
		console.log('Received message:', message);
		if (message.type === 'status') {
			this._status = message.status;
			this._startTime = message.startTime;
			this._endTime = message.endTime;
			this._hashes = message.hashes;
		}
		else if (message.type === 'result') {
			this._status = 'completed';
			this._endTime = message.endTime;
			this._nonce = message.nonce;
			this._onSuccess(message.nonce);
		}
	}
	
	/**
	 * Starts the proof of work calculation
	 */
	public start() {
		if (this._status === 'running') {
			throw new Error('Proof of work calculation already running');
		}
		this._startTime = Date.now();
		this._nonce = 0;
		this._status = 'running';
		this.postMessage({
			type: 'data',
			data: this._data,
			difficulty: this._difficulty,
		});
	}
	
	/**
	 * Cancels the proof of work calculation
	 */
	public cancel() {
		this._status = 'cancelled';
		this._endTime = Date.now();
		this.postMessage({
			type: 'cancel',
		});
	}
	
	public get status() {
		return this._status;
	}
	
	public get nonce() {
		return this._nonce;
	}
	
	public get hashes() {
		return this._hashes;
	}
	
	public get startTime() {
		return this._startTime;
	}
	
	public get endTime() {
		return this._endTime;
	}
	
	/**
	 * Cleans up the worker
	 */
	public destroy() {
		this._worker.terminate();
	}
	
	public refresh() {
		this.postMessage({
			type: 'status',
		});
	}
	
}
