import {SHA512} from '@noble/hashes/sha512';

/**
 * Hashes the given data using SHA-512
 * @param data The data to hash
 * @returns The hash of the data as a byte array
 */
export const hash = (data: string): Uint8Array => {
	return new SHA512().update(data).digest();
};

/**
 * Checks if the given data satisfies the proof of work condition
 * @param data The data to check
 * @param difficulty The number of leading zeroes the hash of the data must have in binary form
 * @returns True if the hash of the data has the required number of leading zeroes, false otherwise
 */
export const checkProofOfWork = (data: string, difficulty: number): boolean => {
	const hashValue = hash(data);
	for (let i = 0; i < difficulty; i++) {
		const byte = i >> 3;
		const bit = i & 0b111;
		if ((hashValue[byte] & (1 << (7 - bit))) !== 0) {
			return false;
		}
	}
	return true;
};

/**
 * Converts a nonce to a string
 * @param nonce The nonce to convert
 * @returns The nonce as a string
 */
export const convertNonce = (nonce: number): string => {
	return nonce.toString(36); // Convert to base 36
};

/**
 * Calculates the speed of hashing some data
 * @param data The data to use for checking the speed
 * @param duration The duration to check the speed over in milliseconds
 * @returns The number of hashes per second
 */
export const calculateSpeed = (data: string, duration: number): number => {
	// Save the start time
	const start = Date.now();
	// Hash the data repeatedly until the duration is reached
	let hashes = 0;
	while (Date.now() - start < duration) {
		hash(data);
		hashes++;
	}
	// Save the end time for a more accurate duration
	const end = Date.now();
	
	// Calculate the speed
	const elapsed = end - start;
	return hashes * 1000 / elapsed;
};

/**
 * Estimates the amount of hashing work needed for a given difficulty
 * @param difficulty The difficulty to estimate the amount of work for
 * @returns The amount of hashes needed to satisfy the difficulty (on average)
 */
export const estimateAmountOfWork = (difficulty: number): number => {
	// One level of difficulty adds 1 leading zero needed
	// As this check is done in binary, 1 bit is needed for each zero
	// Therefore, the amount of work is 2 times more for each level
	return 2 ** difficulty;
}

/**
 * Calculates the difficulty needed for calculating the proof of work in order to take a certain amount of time
 * @param speed The speed of hashing in hashes per second
 * @param targetDuration The target duration to take for calculating the proof of work in milliseconds
 * @returns The difficulty needed to take the target duration
 */
export const calculateDifficulty = (speed: number, targetDuration: number): number => {
	const amountOfWork = speed * targetDuration / 1000;
	const difficulty = Math.log2(amountOfWork);
	return Math.ceil(difficulty);
}
