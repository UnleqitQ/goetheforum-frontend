export interface ErrorResponse<D = unknown> {
	message?: string;
	type?: string;
	longMessage?: string;
	details?: D;
}
