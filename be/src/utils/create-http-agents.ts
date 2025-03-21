import { HttpAgent, HttpsAgent } from 'agentkeepalive';

const DEFAULTS = {
	maxSockets: 100,
	maxFreeSockets: 10,
	timeout: 60000,
	freeSocketTimeout: 30000,
};

export function createHttpAgent() {
	return new HttpAgent(DEFAULTS);
}

export function createHttpsAgent() {
	return new HttpsAgent(DEFAULTS);
}
