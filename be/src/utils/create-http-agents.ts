import Agent from 'agentkeepalive';

const DEFAULTS = {
	maxSockets: 100,
	maxFreeSockets: 10,
	timeout: 60000,
	freeSocketTimeout: 30000,
};

export function createHttpAgent() {
	return new Agent(DEFAULTS);
}

export function createHttpsAgent() {
	return new Agent.HttpsAgent(DEFAULTS);
}
